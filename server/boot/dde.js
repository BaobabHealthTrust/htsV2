'use strict';

module.exports = function (app) {

  var router = app
    .loopback
    .Router();

  const fs = require('fs');
  const path = require('path');
  const glob = require('glob');
  const url = require('url');
  const client = require('node-rest-client').Client;
  const ddeConfig = require('../../configs/dde.json');
  const dde = require('../../lib/dde').DDE;
  const PatientIdentifier = app.models.PatientIdentifier;
  const PatientIdentifierType = app.models.PatientIdentifierType;

  const ddePath = ddeConfig.protocol + '://' + ddeConfig.host + ':' + ddeConfig.port;

  dde.init(client, ddePath, ddeConfig);

  const fetchAge = (json) => {

    if (json.dateOfBirth) {

      try {

        let age = ((new Date()).getFullYear() - (new Date(json.dateOfBirth)).getFullYear());

        if (age < 1) {

          age = ((new Date()).getMonth() - (new Date(json.dateOfBirth)).getMonth());

          if (age > 0) {

            age += " Month" + (age > 1
              ? "s"
              : "");

          }

        }

        if (age < 1) {

          age = ((new Date()).getDate() - (new Date(json.dateOfBirth)).getDate());

          if (age > 6) {

            age = Math.floor(age / 7) + " Week" + (Math.floor(age / 7) > 1
              ? "s"
              : "");

          } else {

            age += " Day" + (age > 1
              ? "s"
              : "");

          }

        }

        json.age = age;

        return age;

      } catch (e) {

        console.log(e);

      }

    }

    return null;

  }

  router
    .get('/dde/fetch_token', function (req, res, next) {
      const ddePath = ddeConfig.protocol + '://' + ddeConfig.host + ':' + ddeConfig.port;

      dde.init(client, ddePath, ddeConfig);

      dde.checkIfDDEAuthenticated(function (data) {
        res
          .status(200)
          .json(data);
      });

    });

  router.post('/dde/authenticate', function (req, res, next) {

    const args = {
      data: req.body,
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).post(ddeConfig.protocol + "://" + ddeConfig.host + ":" + ddeConfig.port + "/v1/authenticate", args, function (data) {

      res
        .status(200)
        .json(data);

    })

  })

  router.post('/dde/add_user', function (req, res, next) {

    dde.checkIfDDEAuthenticated(function (authenticated) {

      if (authenticated) {

        const json = Object.assign({}, req.body, {token: dde.globalToken});

        const args = {
          data: json,
          headers: {
            "Content-Type": "application/json"
          }
        };

        (new client()).put(ddeConfig.protocol + "://" + ddeConfig.host + ":" + ddeConfig.port + "/v1/add_user", args, function (data) {

          res
            .status(200)
            .json(data);

        })

      } else {

        res
          .json(401)
          .json({error: true, message: "DDE authentation failed"})

      }

    })

  })

  router.get('/dde/authenticated', function (req, res, next) {

    dde.checkIfDDEAuthenticated(function (authenticated) {

      res
        .status(200)
        .json({authenticated})

    })

  })

  router.get('/dde/search_by_identifier/:identifier', async function (req, res, next) {

    dde.checkIfDDEAuthenticated(async function (authenticated) {

      if ((typeof authenticated === "boolean" && authenticated === true) || (typeof authenticated === "object" && [200, 201].indexOf(authenticated.status) >= 0)) {

        const token = (typeof authenticated === "boolean"
          ? dde.globalToken
          : authenticated.data.token);

        setTimeout(async function () {

          (new client())
            .get(ddeConfig.protocol + "://" + ddeConfig.host + ":" + ddeConfig.port + "/v1/search_by_identifier/" + req.params.identifier + "/" + token, async function (data, props) {

              if (props.statusCode === 204) {

                (new client())
                  .get(req.protocol + "://" + req.hostname + ":" + (process.env.PORT
                    ? process.env.PORT
                    : 3001) + "/programs/fetch/" + req.params.identifier, function (data, props) {

                    if (data && Object.keys(data).length > 0) {

                      return res
                        .status(200)
                        .json({
                          data: {
                            hits: [data],
                            matches: (Array.isArray(data)
                              ? data.length
                              : Object.keys(data).length > 0
                                ? 1
                                : 0)
                          }
                        });

                    } else {

                      return res
                        .status(200)
                        .json({data: {}});

                    }

                  })

              } else {

                if (data && data.data && Object.keys(data.data).indexOf("hits") < 0) {

                  let json = Object.assign({}, data.data);

                  if (Object.keys(json).indexOf("patientName") < 0) {

                    json.patientName = (json.names && json.names.given_name
                      ? json.names.given_name
                      : "") + " " + (json.names && json.names.family_name
                      ? json.names.family_name
                      : "");

                  }

                  if (Object.keys(json).indexOf("currentVillage") < 0) {

                    json.currentVillage = (json.addresses && json.addresses.current_village
                      ? json.addresses.current_village
                      : "");

                    json.currentTA = (json.addresses && json.addresses.current_ta
                      ? json.addresses.current_ta
                      : "");

                    json.currentDistrict = (json.addresses && json.addresses.current_district
                      ? json.addresses.current_district
                      : "");

                  }

                  if (Object.keys(json).indexOf("cellPhoneNumber") < 0) {

                    json.cellPhoneNumber = (json.attributes && json.attributes.cell_phone_number
                      ? json.attributes.cell_phone_number
                      : "");

                  }

                  if (Object.keys(json).indexOf("age") < 0) {

                    json.dateOfBirth = json.birthdate;

                    fetchAge(json);

                  }

                  json.otherIdType = "HTS Number";

                  let identifier = await PatientIdentifier.findOne({
                    where: {
                      identifier: json.npid
                    }
                  });

                  let patientId = (identifier
                    ? identifier.patientId
                    : null);

                  if (patientId !== null) {

                    let idType = await PatientIdentifierType.findOne({
                      where: {
                        name: "HTS Number"
                      }
                    });

                    let identifierType = (idType
                      ? idType.patientIdentifierTypeId
                      : null);

                    if (identifierType !== null) {

                      identifier = await PatientIdentifier.findOne({
                        where: {
                          and: [{
                              patientId
                            }, {
                              identifierType
                            }]
                        }
                      });

                      if (identifier && Object.keys(identifier).length > 0) {

                        json.otherId = identifier.identifier;

                      }

                    }

                  }

                  data.data = Object.assign({}, json);

                } else if (data && data.data && Object.keys(data.data).indexOf("hits") > 0 && Array.isArray(data.data.hits) && data.data.hits.length > 0) {

                  for (let json of data.data.hits) {

                    if (Object.keys(json).indexOf("patientName") < 0) {

                      json.patientName = (json.names && json.names.given_name
                        ? json.names.given_name
                        : "") + " " + (json.names && json.names.family_name
                        ? json.names.family_name
                        : "");

                    }

                    if (Object.keys(json).indexOf("currentVillage") < 0) {

                      json.currentVillage = (json.addresses && json.addresses.current_village
                        ? json.addresses.current_village
                        : "");

                      json.currentTA = (json.addresses && json.addresses.current_ta
                        ? json.addresses.current_ta
                        : "");

                      json.currentDistrict = (json.addresses && json.addresses.current_district
                        ? json.addresses.current_district
                        : "");

                    }

                    if (Object.keys(json).indexOf("cellPhoneNumber") < 0) {

                      json.cellPhoneNumber = (json.attributes && json.attributes.cell_phone_number
                        ? json.attributes.cell_phone_number
                        : "");

                    }

                    if (Object.keys(json).indexOf("age") < 0) {

                      json.dateOfBirth = json.birthdate;

                      fetchAge(json);

                    }

                    json.otherIdType = "HTS Number";

                    let identifier = await PatientIdentifier.findOne({
                      where: {
                        identifier: json.npid
                      }
                    });

                    let patientId = (identifier
                      ? identifier.patientId
                      : null);

                    if (patientId !== null) {

                      let idType = await PatientIdentifierType.findOne({
                        where: {
                          name: "HTS Number"
                        }
                      });

                      let identifierType = (idType
                        ? idType.patientIdentifierTypeId
                        : null);

                      if (identifierType !== null) {

                        identifier = await PatientIdentifier.findOne({
                          where: {
                            and: [{
                                patientId
                              }, {
                                identifierType
                              }]
                          }
                        });

                        if (identifier && Object.keys(identifier).length > 0) {

                          json.otherId = identifier.identifier;

                        }

                      }

                    }

                  };

                }

                return res
                  .status(200)
                  .json(data);

              }

            })

        }, 1000)

      } else {

        res
          .json(401)
          .json({error: true, message: "DDE authentation failed"})

      }
    })

  })

  router.post('/dde/search_by_name_and_gender', function (req, res, next) {

    dde.checkIfDDEAuthenticated(function (authenticated) {

      if ((typeof authenticated === "boolean" && authenticated === true) || (typeof authenticated === "object" && [200, 201].indexOf(authenticated.status) >= 0)) {

        const json = Object.assign({}, req.body, {
          token: (typeof authenticated === "boolean"
            ? dde.globalToken
            : authenticated.data.token)
        });

        const args = {
          data: json,
          headers: {
            "Content-Type": "application/json"
          }
        };

        setTimeout(function () {

          return (new client()).post(ddeConfig.protocol + "://" + ddeConfig.host + ":" + ddeConfig.port + "/v1/search_by_name_and_gender", args, function (data, props) {

            if (props.statusCode === 204) {

              return res
                .status(200)
                .json({
                  "status": 204,
                  "message": "No data",
                  "error": false,
                  "data": {
                    "matches": 0,
                    "hits": []
                  }
                });

            } else {

              return res
                .status(200)
                .json(data);

            }

          })

        }, 1000)

      } else {

        return res
          .json(401)
          .json({error: true, message: "DDE authentation failed"})

      }

    })

  })

  router.post('/dde/advanced_patient_search', function (req, res, next) {

    dde.checkIfDDEAuthenticated(function (authenticated) {

      if ((typeof authenticated === "boolean" && authenticated === true) || (typeof authenticated === "object" && [200, 201].indexOf(authenticated.status) >= 0)) {

        const json = Object.assign({}, req.body, {
          token: (typeof authenticated === "boolean"
            ? dde.globalToken
            : authenticated.data.token)
        });

        const args = {
          data: json,
          headers: {
            "Content-Type": "application/json"
          }
        };

        setTimeout(function () {

          (new client())
            .post(ddeConfig.protocol + "://" + ddeConfig.host + ":" + ddeConfig.port + "/v1/advanced_patient_search", args, function (data, props) {

              if (props.statusCode === 204) {

                return res
                  .status(200)
                  .json({
                    "status": 204,
                    "message": "No data",
                    "error": false,
                    "data": {
                      "matches": 0,
                      "hits": []
                    }
                  });

              } else {

                return res
                  .status(200)
                  .json(data);

              }

            })

        }, 1000)

      } else {

        res
          .json(401)
          .json({error: true, message: "DDE authentation failed"})

      }

    })

  })

  router.delete('/dde/void_patient/:npid', function (req, res, next) {

    dde.checkIfDDEAuthenticated(function (authenticated) {

      if (authenticated) {

        const token = (typeof authenticated === "boolean"
          ? dde.globalToken
          : authenticated.data.token);

        setTimeout(function () {

          (new client())
            .get(ddeConfig.protocol + "://" + ddeConfig.host + ":" + ddeConfig.port + "/v1/void_patient/" + req.params.npid + "/" + token, function (data, props) {

              if (props.statusCode === 204) {

                return res
                  .status(200)
                  .json({
                    "status": 204,
                    "message": "No data",
                    "error": false,
                    "data": {
                      "matches": 0,
                      "hits": []
                    }
                  });

              } else {

                return res
                  .status(200)
                  .json(data);

              }

            })

        }, 1000)

      } else {

        res
          .json(401)
          .json({error: true, message: "DDE authentation failed"})

      }

    })

  })

  router.post('/dde/add_patient', function (req, res, next) {

    dde.checkIfDDEAuthenticated(function (authenticated) {

      if ((typeof authenticated === "boolean" && authenticated === true) || (typeof authenticated === "object" && [200, 201].indexOf(authenticated.status) >= 0)) {

        const json = Object.assign({}, req.body, {
          token: (typeof authenticated === "boolean"
            ? dde.globalToken
            : authenticated.data.token)
        });

        const args = {
          data: json,
          headers: {
            "Content-Type": "application/json"
          }
        };

        setTimeout(function () {

          (new client())
            .put(ddeConfig.protocol + "://" + ddeConfig.host + ":" + ddeConfig.port + "/v1/add_patient", args, function (data, props) {

              if (props.statusCode === 204) {

                return res
                  .status(200)
                  .json({
                    "status": 204,
                    "message": "No data",
                    "error": false,
                    "data": {
                      "matches": 0,
                      "hits": []
                    }
                  });

              } else {

                return res
                  .status(200)
                  .json(data);

              }
            })

        }, 1000)

      } else {

        res
          .json(401)
          .json({error: true, message: "DDE authentation failed"})

      }

    })

  })

  router.post('/dde/update_patient', function (req, res, next) {

    dde.checkIfDDEAuthenticated(function (authenticated) {

      if ((typeof authenticated === "boolean" && authenticated === true) || (typeof authenticated === "object" && [200, 201].indexOf(authenticated.status) >= 0)) {

        const json = Object.assign({}, req.body, {
          token: (typeof authenticated === "boolean"
            ? dde.globalToken
            : authenticated.data.token)
        });

        const args = {
          data: json,
          headers: {
            "Content-Type": "application/json"
          }
        };

        setTimeout(function () {

          (new client())
            .post(ddeConfig.protocol + "://" + ddeConfig.host + ":" + ddeConfig.port + "/v1/update_patient", args, function (data, props) {

              if (props.statusCode === 204) {

                return res
                  .status(200)
                  .json({
                    "status": 204,
                    "message": "No data",
                    "error": false,
                    "data": {
                      "matches": 0,
                      "hits": []
                    }
                  });

              } else {

                return res
                  .status(200)
                  .json(data);

              }

            })

        }, 1000)

      } else {

        res
          .json(401)
          .json({error: true, message: "DDE authentation failed"})

      }

    })

  })

  router.post('/dde/merge_records', function (req, res, next) {

    dde.checkIfDDEAuthenticated(function (authenticated) {

      if ((typeof authenticated === "boolean" && authenticated === true) || (typeof authenticated === "object" && [200, 201].indexOf(authenticated.status) >= 0)) {

        const json = Object.assign({}, req.body, {
          token: (typeof authenticated === "boolean"
            ? dde.globalToken
            : authenticated.data.token)
        });

        const args = {
          data: json,
          headers: {
            "Content-Type": "application/json"
          }
        };

        setTimeout(function () {

          (new client())
            .post(ddeConfig.protocol + "://" + ddeConfig.host + ":" + ddeConfig.port + "/v1/merge_records", args, function (data, props) {

              if (props.statusCode === 204) {

                return res
                  .status(200)
                  .json({
                    "status": 204,
                    "message": "No data",
                    "error": false,
                    "data": {
                      "matches": 0,
                      "hits": []
                    }
                  });

              } else {

                return res
                  .status(200)
                  .json(data);

              }

            })

        }, 1000)

      } else {

        res
          .json(401)
          .json({error: true, message: "DDE authentation failed"})

      }

    })

  })

  router.get('/dde/list_first_names', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    (new client()).get(ddeConfig.protocol + "://" + ddeConfig.host + ":" + ddeConfig.port + "/list_first_names/json?name=" + (query.name
      ? query.name
      : ""), function (data) {

      res
        .status(200)
        .json(data);

    })

  })

  router.get('/dde/list_last_names', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    (new client()).get(ddeConfig.protocol + "://" + ddeConfig.host + ":" + ddeConfig.port + "/list_last_names/json?name=" + (query.name
      ? query.name
      : ""), function (data) {

      res
        .status(200)
        .json(data);

    })

  })

  router.get('/dde/search_by_region', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    (new client()).get(ddeConfig.protocol + "://" + ddeConfig.host + ":" + ddeConfig.port + "/search_by_region/json?region=" + (query.name
      ? query.name
      : ""), function (data) {

      res
        .status(200)
        .json(data);

    })

  })

  router.get('/dde/search_by_district', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    (new client()).get(ddeConfig.protocol + "://" + ddeConfig.host + ":" + ddeConfig.port + "/search_by_district/json?region=" + (query.region
      ? query.region
      : "") + "&district=" + (query.district
      ? query.district
      : ""), function (data) {

      res
        .status(200)
        .json(data);

    })

  })

  router.get('/dde/search_by_t_a', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    (new client()).get(ddeConfig.protocol + "://" + ddeConfig.host + ":" + ddeConfig.port + "/search_by_t_a/json?district=" + (query.district
      ? query.district
      : "") + "&ta=" + (query.ta
      ? query.ta
      : ""), function (data) {

      res
        .status(200)
        .json(data);

    })

  })

  router.get('/dde/search_by_village', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    (new client()).get(ddeConfig.protocol + "://" + ddeConfig.host + ":" + ddeConfig.port + "/search_by_village/json?ta=" + (query.ta
      ? query.ta
      : "") + "&village=" + (query.village
      ? query.village
      : ""), function (data) {

      res
        .status(200)
        .json(data);

    })

  })

  app.use(router);

};
