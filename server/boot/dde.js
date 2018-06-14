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
  const PersonName = app.models.PersonName;
  const Region = app.models.Region;
  const District = app.models.District;
  const TA = app.models.TraditionalAuthority;
  const Village = app.models.Village;

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

  const debug = (msg) => {

    if (String(process.env.DEBUG_APP) === 'true') {
      console.log(msg);
    }

  }

  const padZeros = (number, positions) => {
    const zeros = parseInt(positions) - String(number).length;
    let padded = "";

    for (let i = 0; i < zeros; i++) {
      padded += "0";
    }

    padded += String(number);

    return padded;
  };

  router.get('/dde/fetch_token', function (req, res, next) {
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

  });

  router.post('/dde/add_user', function (req, res, next) {

    dde.checkIfDDEAuthenticated(function (authenticated) {

      if (authenticated) {

        const json = Object.assign({}, req.body, { token: dde.globalToken });

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
          .json({ error: true, message: "DDE authentation failed" })

      }

    })

  })

  router.get('/dde/authenticated', function (req, res, next) {

    dde.checkIfDDEAuthenticated(function (authenticated) {

      res
        .status(200)
        .json({ authenticated })

    })

  })

  router.get('/dde/search_by_identifier/:identifier', async function (req, res, next) {

    if (ddeConfig.use_art) {

      (new client())
        .get(ddeConfig.art_settings.protocol + "://" + ddeConfig.art_settings.host + ":" + ddeConfig.art_settings.port + "/" + ddeConfig.art_settings.search_by_id + req.params.identifier, async function (data, props) {

          if (String(data).trim().length <= 0) {

            return res
              .status(200)
              .json({
                data: {
                  hits: [],
                  matches: 0
                }
              });

          }

          console.log("******************");

          console.log(data.toString("utf8"));

          const row = JSON.parse(data) || {};

          console.log(JSON.stringify(row, null, 2));

          console.log("******************");

          let json = {
            "names": {
              "family_name": (row.person && row.person.names && row.person.names.family_name ? row.person.names.family_name : null),
              "given_name": (row.person && row.person.names && row.person.names.given_name ? row.person.names.given_name : null),
              "middle_name": (row.person && row.person.names && row.person.names.middle_name ? row.person.names.middle_name : null)
            },
            "gender": (row.person && row.person.gender ? row.person.gender : null),
            "attributes": (row.person && row.person.attributes ? row.person.attributes : {}),
            "birthdate": (row.person && row.person.birthdate ? row.person.birthdate : (row.person.birth_year && row.person.birth_month && row.person.birth_day ? (padZeros(row.person.birth_year, 4) + "-" + padZeros(row.person.birth_month, 2) + "-" + padZeros(row.person.birth_day, 2)) : "0000-00-00")),
            "birthdate_estimated": (row.person && row.person.age_estimate === 1 ? true : false),
            "addresses": {
              "current_residence": (row.person && row.person.addresses ? row.person.addresses.address1 : null),
              "current_village": (row.person && row.person.addresses ? row.person.addresses.city_village : null),
              "current_ta": (row.person && row.person.addresses ? row.person.addresses.township_division : null),
              "current_district": (row.person && row.person.addresses ? row.person.addresses.state_province : null),
              "home_village": (row.person && row.person.addresses ? row.person.addresses.neighborhood_cell : null),
              "home_ta": (row.person && row.person.addresses ? row.person.addresses.county_district : null),
              "home_district": (row.person && row.person.addresses ? row.person.addresses.address2 : null),
            },
            "npid": (row.person && row.person.patient && row.person.patient.identifiers ? row.person.patient.identifiers["National id"] : null),
            "_id": (row.person && row.person.patient && row.person.patient.identifiers ? row.person.patient.identifiers["National id"] : null)
          };

          console.log(JSON.stringify(json, null, 2));

          return res
            .status(200)
            .json({
              data: {
                hits: [json],
                matches: (Array.isArray(json)
                  ? json.length
                  : Object.keys(json).length > 0
                    ? 1
                    : 0)
              }
            });

        })

    } else {

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
                            .json({ data: {} });

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
            .json({ error: true, message: "DDE authentation failed" })

        }
      })

    }

  })

  router.post('/dde/search_by_name_and_gender', function (req, res, next) {

    if (ddeConfig.use_art) {

      debug(JSON.stringify(req.body));

      debug(ddeConfig.art_settings.protocol + "://" + ddeConfig.art_settings.host + ":" + ddeConfig.art_settings.port + ddeConfig.art_settings.searchPath + "?person[names][given_name]=" + req.body.given_name + "&person[names][family_name]=" + req.body.family_name + "&person[gender]=" + (req.body.gender ? String(req.body.gender).substring(0, 1) : ""));

      (new client())
        .get(ddeConfig.art_settings.protocol + "://" + ddeConfig.art_settings.host + ":" + ddeConfig.art_settings.port + ddeConfig.art_settings.searchPath + "?person[names][given_name]=" + req.body.given_name + "&person[names][family_name]=" + req.body.family_name + "&person[gender]=" + (req.body.gender ? String(req.body.gender).substring(0, 1) : ""), async function (data, props) {

          debug("^^^^^^^^^^^^^^^^^^^^^");

          debug(data.toString("utf8"));

          debug("^^^^^^^^^^^^^^^^^^^^^");

          const rows = JSON.parse(data) || [];

          debug(JSON.stringify(rows));

          debug("^^^^^^^^^^^^^^^^^^^^^");

          let json = [];

          for (let row of rows) {

            debug(JSON.stringify(row, null, 2));

            json.push({
              "names": {
                "family_name": (row.person && row.person.names && row.person.names.family_name ? row.person.names.family_name : null),
                "given_name": (row.person && row.person.names && row.person.names.given_name ? row.person.names.given_name : null),
                "middle_name": (row.person && row.person.names && row.person.names.middle_name ? row.person.names.middle_name : null)
              },
              "gender": (row.person && row.person.gender ? row.person.gender : null),
              "attributes": (row.person && row.person.attributes ? row.person.attributes : {}),
              "birthdate": (row.person && row.person.birthdate ? row.person.birthdate : (row.person.birth_year && row.person.birth_month && row.person.birth_day ? (padZeros(row.person.birth_year, 4) + "-" + padZeros(row.person.birth_month, 2) + "-" + padZeros(row.person.birth_day, 2)) : "0000-00-00")),
              "birthdate_estimated": (row.person && row.person.age_estimate === 1 ? true : false),
              "addresses": {
                "current_residence": (row.person && row.person.addresses ? row.person.addresses.address1 : null),
                "current_village": (row.person && row.person.addresses ? row.person.addresses.city_village : null),
                "current_ta": (row.person && row.person.addresses ? row.person.addresses.township_division : null),
                "current_district": (row.person && row.person.addresses ? row.person.addresses.state_province : null),
                "home_village": (row.person && row.person.addresses ? row.person.addresses.neighborhood_cell : null),
                "home_ta": (row.person && row.person.addresses ? row.person.addresses.county_district : null),
                "home_district": (row.person && row.person.addresses ? row.person.addresses.address2 : null),
              },
              "npid": (row.person && row.person.patient && row.person.patient.identifiers ? row.person.patient.identifiers["National id"] : null),
              "_id": (row.person && row.person.patient && row.person.patient.identifiers ? row.person.patient.identifiers["National id"] : null),
              "age": (row.person && row.person.birth_year ? (new Date()).getFullYear() - parseInt(row.person.birth_year, 10) : 0)
            });

          }

          debug(JSON.stringify(json));

          debug("^^^^^^^^^^^^^^^^^^^^^");

          return res
            .status(200)
            .json({
              data: {
                hits: json,
                matches: (Array.isArray(json)
                  ? json.length
                  : Object.keys(json).length > 0
                    ? 1
                    : 0)
              }
            });

        })

    } else {

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
            .json({ error: true, message: "DDE authentation failed" })

        }

      })

    }

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
          .json({ error: true, message: "DDE authentation failed" })

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
          .json({ error: true, message: "DDE authentation failed" })

      }

    })

  })

  router.post('/dde/add_patient', function (req, res, next) {

    if (ddeConfig.use_art) {

      console.log(JSON.stringify(req.body));

      console.log(ddeConfig.art_settings.protocol + "://" + ddeConfig.art_settings.host + ":" + ddeConfig.art_settings.port + ddeConfig.art_settings.createPath);

      const json = req.body;

      const dob = String(json.birthdate).match(/^(\d{4})-(\d{2})-(\d{2})$/);

      let data = {
        data: {
          addresses: {
            state_province: (Object.keys(json).indexOf('current_district') >= 0 ? json.current_district : null),
            city_village: (Object.keys(json).indexOf('current_village') >= 0 ? json.current_village : null),
            neighborhood_cell: (Object.keys(json).indexOf('home_village') >= 0 ? json.home_village : null),
            county_district: (Object.keys(json).indexOf('home_ta') >= 0 ? json.home_ta : null),
            address2: (Object.keys(json).indexOf('home_district') >= 0 ? json.home_district : null),
            address1: (Object.keys(json).indexOf('current_residence') >= 0 ? json.current_residence : null)
          },
          patient_age: {
            age_estimate: (Object.keys(json).indexOf("age") >= 0 ? json.age : null)
          },
          cell_phone: {
            identifier: (Object.keys(json).indexOf("attributes") >= 0 && Object.keys(json.attributes).indexOf("cell_phone_number") >= 0 ? json.attributes.cell_phone_number : null)
          },
          home_phone: {
            identifier: (Object.keys(json).indexOf("attributes") >= 0 && Object.keys(json.attributes).indexOf("home_phone_number") >= 0 ? json.attributes.home_phone_number : null)
          },
          office_phone: {
            identifier: (Object.keys(json).indexOf("attributes") >= 0 && Object.keys(json.attributes).indexOf("office_phone_number") >= 0 ? json.attributes.office_phone_number : null)
          },
          patient_month: (json.birthdate && dob ? parseInt(dob[2], 10) : null),
          patient_year: (json.birthdate && dob ? parseInt(dob[1], 10) : null),
          patient_day: (json.birthdate && dob ? parseInt(dob[3], 10) : null),
          patient_name: {
            family_name: (Object.keys(json).indexOf('family_name') >= 0 ? json.family_name : null),
            given_name: (Object.keys(json).indexOf('given_name') >= 0 ? json.given_name : null),
            middle_name: (Object.keys(json).indexOf('middle_name') >= 0 ? json.middle_name : null)
          },
          patient: {
            gender: (Object.keys(json).indexOf('gender') >= 0 ? json.gender : null)
          }
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      console.log(JSON.stringify(data));

      console.log(JSON.stringify({ username: ddeConfig.art_settings.username, password: ddeConfig.art_settings.password }));

      (new client({ user: ddeConfig.art_settings.username, password: ddeConfig.art_settings.password }))
        .post(ddeConfig.art_settings.protocol + "://" + ddeConfig.art_settings.host + ":" + ddeConfig.art_settings.port + ddeConfig.art_settings.createPath, data, async function (result, props) {

          console.log(result.toString("utf8"));

          const json = JSON.parse(result) || {};

          let npid = {
            npid: (Object.keys(json).indexOf("person") >= 0 && json.person && Object.keys(json.person).indexOf("patient") >= 0 && json.person.patient && Object.keys(json.person.patient).indexOf("identifiers") >= 0 && json.person.patient.identifiers && Object.keys(json.person.patient.identifiers).indexOf("National id") >= 0 ? json.person.patient.identifiers["National id"] : null)
          };

          return res
            .status(200)
            .json(npid);

        })

    } else {

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

          return res
            .json(401)
            .json({ error: true, message: "DDE authentation failed" })

        }

      })

    }

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
          .json({ error: true, message: "DDE authentation failed" })

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
          .json({ error: true, message: "DDE authentation failed" })

      }

    })

  })

  router.get('/dde/list_first_names', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    let data = [];

    PersonName.find(
      {
        where: {
          name: {
            like: (query.name ? query.name : '') + '%'
          }
        }
      }, (err, results) => {

        debug(JSON.stringify(results));

        if (!err && results) {

          results.forEach(row => {

            if (data.indexOf(row.givenName) < 0)
              data.push(row.givenName);

            if (row.middleName && data.indexOf(row.middleName) < 0)
              data.push(row.middleName);

          });

        }

        res
          .status(200)
          .json(data);

      }
    )

  })

  router.get('/dde/list_last_names', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    let data = [];

    PersonName.find(
      {
        where: {
          name: {
            like: (query.name ? query.name : '') + '%'
          }
        }
      }, (err, results) => {

        debug(JSON.stringify(results));

        if (!err && results) {

          results.forEach(row => {

            if (data.indexOf(row.familyName) < 0)
              data.push(row.familyName);

          });

        }

        res
          .status(200)
          .json(data);

      }
    )

  })

  router.get('/dde/search_by_region', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    let data = [];

    debug(query);

    Region.find(
      {
        where: {
          name: {
            like: (query.name ? query.name : '') + '%'
          }
        }
      }, (err, results) => {

        debug(JSON.stringify(results));

        if (!err && results) {

          results.forEach(row => {

            if (data.indexOf(row.name) < 0)
              data.push(row.name);

          });

        }

        res
          .status(200)
          .json(data);

      }
    )

  })

  router.get('/dde/search_by_district', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    let data = [];

    debug(query);

    Region.find(
      {
        where: {
          name: {
            like: (query.region ? query.region : '') + '%'
          }
        }
      }, (err, results) => {

        debug(JSON.stringify(results));

        if (!err && results) {

          const regionId = (results && Array.isArray(results) && results.length > 0 ? results[0].regionId : null);

          if (regionId !== null) {

            District.find({
              where: {
                and: [
                  {
                    regionId
                  },
                  {
                    name: (query.name ? query.name : '') + '%'
                  }
                ]
              }
            }, (err, results) => {

              debug(JSON.stringify(results));

              if (!err && results) {

                results.forEach(row => {

                  if (data.indexOf(row.name) < 0)
                    data.push(row.name);

                });

              }

              res
                .status(200)
                .json(data);

            })

          } else {

            res
              .status(200)
              .json(data);

          }

        } else {

          res
            .status(200)
            .json(data);

        }

      }
    )

  })

  router.get('/dde/search_by_t_a', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    let data = [];

    debug(query);

    District.find(
      {
        where: {
          name: (query.district ? query.district : '')
        }
      }, (err, results) => {

        debug(JSON.stringify(results));

        if (!err && results) {

          const districtId = (results && Array.isArray(results) && results.length > 0 ? results[0].districtId : null);

          debug(districtId);

          if (districtId !== null) {

            TA.find({
              where: {
                and: [
                  {
                    districtId
                  },
                  {
                    name: { like: (query.name ? query.name : '') + '%' }
                  }
                ]
              }
            }, (err, results) => {

              debug(JSON.stringify(results));

              if (!err && results) {

                results.forEach(row => {

                  if (data.indexOf(row.name) < 0)
                    data.push(row.name);

                });

              }

              res
                .status(200)
                .json(data);

            })

          } else {

            res
              .status(200)
              .json(data);

          }

        } else {

          res
            .status(200)
            .json(data);

        }

      }
    )

  })

  router.get('/dde/search_by_village', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    let data = [];

    debug(query);

    TA.find(
      {
        where: {
          name: (query.ta ? query.ta : '')
        }
      }, (err, results) => {

        debug(JSON.stringify(results));

        if (!err && results) {

          const traditionalAuthorityId = (results && Array.isArray(results) && results.length > 0 ? results[0].traditionalAuthorityId : null);

          debug(traditionalAuthorityId);

          if (traditionalAuthorityId !== null) {

            Village.find({
              where: {
                and: [
                  {
                    traditionalAuthorityId
                  },
                  {
                    name: { like: (query.name ? query.name : '') + '%' }
                  }
                ]
              }
            }, (err, results) => {

              debug(JSON.stringify(results));

              if (!err && results) {

                results.forEach(row => {

                  if (data.indexOf(row.name) < 0)
                    data.push(row.name);

                });

              }

              res
                .status(200)
                .json(data);

            })

          } else {

            res
              .status(200)
              .json(data);

          }

        } else {

          res
            .status(200)
            .json(data);

        }

      }
    )

  })

  app.use(router);

};
