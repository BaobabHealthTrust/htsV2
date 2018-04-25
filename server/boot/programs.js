"use strict";

module.exports = function (app) {
  var router = app
    .loopback
    .Router();

  const fs = require("fs");
  const path = require("path");
  const glob = require("glob");
  const url = require("url");
  const client = require("node-rest-client").Client;
  const mutex = require("node-mutex")();
  const GlobalProperty = app.models.GlobalProperty;
  const Patient = app.models.Patient;
  const Person = app.models.Person;
  const PersonAddress = app.models.PersonAddress;
  const PersonAttribute = app.models.PersonAttribute;
  const PersonName = app.models.PersonName;
  const Encounter = app.models.Encounter;
  const EncounterType = app.models.EncounterType;
  const Program = app.models.Program;
  const PatientProgram = app.models.PatientProgram;
  const Obs = app.models.Obs;
  const ConceptName = app.models.ConceptName;
  const PatientIdentifier = app.models.PatientIdentifier;
  const PatientIdentifierType = app.models.PatientIdentifierType;
  const HtsRegister = app.models.HtsRegister;
  const HtsRegisterEncounterMapping = app.models.HtsRegisterEncounterMapping;
  const HtsRegisterLocationType = app.models.HtsRegisterLocationType;
  const HtsRegisterServiceDeliveryPoint = app.models.HtsRegisterServiceDeliveryPoint;
  const Users = app.models.Users;
  const User = app.models.User;
  const Role = app.models.Role;
  const Location = app.models.Location;
  const site = require(__dirname + "/../../client-src/src/config/site.json");
  const es = require(__dirname + "/../../configs/elasticsearch.json");
  const htsIndicatorsMapping = require(__dirname + "/../../client-src/src/config/htsIndicatorsMapping.json");
  const uuid = require("uuid");
  const ReadableSearch = require("elasticsearch-streams").ReadableSearch;
  const esClient = new require("elasticsearch").Client();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const pepfarTracked = {
    "Service Delivery Point": "serviceDeliveryPoint",
    "HTS Access Type": "htsAccessType",
    "Sex/Pregnancy": "gender",
    "Result Given to Client": "resultGiven"
  };

  const padZeros = (number, positions) => {
    const zeros = parseInt(positions) - String(number).length;
    let padded = "";

    for (let i = 0; i < zeros; i++) {
      padded += "0";
    }

    padded += String(number);

    return padded;
  };

  if (Object.getOwnPropertyNames(Date.prototype).indexOf("format") < 0) {
    // eslint-disable-next-line
    Object.defineProperty(Date.prototype, "format", {
      value: function (format) {
        var date = this;

        var result = "";

        if (!format) {
          format = "";
        }

        var months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ];

        if (format.match(/YYYY-mm-dd\sHH:MM:SS/)) {
          result = date.getFullYear() + "-" + padZeros(parseInt(date.getMonth()) + 1, 2) + "-" + padZeros(date.getDate(), 2) + " " + padZeros(date.getHours(), 2) + ":" + padZeros(date.getMinutes(), 2) + ":" + padZeros(date.getSeconds(), 2);
        } else if (format.match(/YYYY-mm-dd/)) {
          result = date.getFullYear() + "-" + padZeros(parseInt(date.getMonth()) + 1, 2) + "-" + padZeros(date.getDate(), 2);
        } else if (format.match(/mmm\/d\/YYYY/)) {
          result = months[parseInt(date.getMonth())] + "/" + date.getDate() + "/" + date.getFullYear();
        } else if (format.match(/d\smmmm,\sYYYY/)) {
          result = date.getDate() + " " + monthNames[parseInt(date.getMonth())] + ", " + date.getFullYear();
        } else if (format.match(/d\smmm\sYYYY/)) {

          result = date.getDate() + " " + months[parseInt(date.getMonth(), 10)] + " " + date.getFullYear();

        } else {
          result = date.getDate() + "/" + months[parseInt(date.getMonth())] + "/" + date.getFullYear();
        }

        return result;
      }
    });
  }

  const debug = (msg) => {

    if (String(process.env.DEBUG_APP) === 'true') {
      console.log(msg);
    }

  }

  const validActiveToken = (token) => {

    return new Promise((resolve, reject) => {

      debug("'" + token + "'");

      User
        .accessToken
        .findById(token, (err, result) => {

          debug(result);

          if (result) {

            const ttl = (!isNaN(result.ttl) ? parseInt(result.ttl, 10) : 0) * 1000;
            const ttd = (new Date(result.created)).getTime() + ttl;

            const now = (new Date()).getTime();

            debug("%s - %s = %s", ttd, now, (ttd - now));

            if (ttd > now) {

              resolve(result.id);

            } else {

              reject();

            }

          } else {

            reject();

          }

        });

    });

  }

  const fetchAge = json => {

    if (json.dateOfBirth) {
      try {

        let age = new Date().getFullYear() - new Date(json.dateOfBirth).getFullYear();

        if (age <= 2) {

          age = ((new Date() - new Date(json.dateOfBirth)) / (30 * 24 * 60 * 60 * 1000)).toFixed(0);

          if (age > 0) {

            age += "M";

          }

        }

        if (age < 1) {

          age = ((new Date() - new Date(json.dateOfBirth)) / (24 * 60 * 60 * 1000)).toFixed(0);

          if (age > 6) {

            age = Math.floor(age / 7) + "W";

          } else {

            age += "D";
          }

        }

        json.age = age + (!String(age).match(/[M|W|D]/)
          ? "Y"
          : "");

        return age;

      } catch (e) {
        console.log(e);
      }
    }

    return null;
  };

  const generateId = async (patientId, username, locationName, prefix, suffix) => {

    return await mutex
      .lock("id_lock")
      .then(async unlock => {
        const months = {
          january: 0,
          february: 1,
          march: 2,
          april: 3,
          may: 4,
          june: 5,
          july: 6,
          august: 7,
          september: 8,
          october: 9,
          november: 10,
          december: 11
        };

        // Year runs from July 1 to June 30
        const yr = new Date().getMonth() < months[site["reset month"].toLowerCase()]
          ? new Date().getFullYear() - 1
          : new Date().getFullYear();

        const property = (prefix
          ? prefix
          : "DMY")
          .trim()
          .toLowerCase() + (suffix
            ? "." + suffix.trim().toLowerCase()
            : "") + ".id.counter." + yr;

        let result;

        result = await GlobalProperty.find({
          where: {
            property: property
          }
        });

        const nextId = result.length > 0
          ? parseInt(result[0].propertyValue, 10) + 1
          : 1;

        if (result.length <= 0) {
          result = await GlobalProperty.create({
            property,
            propertyValue: nextId,
            description: property,
            uuid: uuid.v4()
          });
        } else {
          const entry = Object.assign({}, result[0], { propertyValue: nextId });

          result = await GlobalProperty.upsertWithWhere({
            property: property
          }, entry);
        }

        let identifier = prefix
          .trim()
          .toUpperCase() + "-" + nextId + "-" + yr + (suffix
            ? "-" + suffix.trim().toUpperCase()
            : "");

        let location = await Location.findOne({
          where: {
            name: locationName
          }
        });

        let locationId = location
          ? location.locationId
          : 1;

        let user = await User.findOne({
          where: {
            username
          }
        });

        let creator = user
          ? user.id
          : 1;

        let idType = await PatientIdentifierType.find({
          where: {
            name: !prefix || (prefix && prefix == "DMY")
              ? "Dummy ID"
              : prefix.trim() + " Number"
          },
          limit: 1
        });

        let identifierType = idType.length > 0
          ? idType[0].patientIdentifierTypeId
          : 8;

        let voided = 0;

        let dateCreated = new Date();

        result = await PatientIdentifier.create({
          patientId,
          identifier,
          identifierType,
          locationId,
          creator,
          dateCreated,
          voided,
          uuid: uuid.v4()
        });

        unlock();

        return identifier;
      })
      .catch(e => {
        console.log(e);

        return "Locked";
      });
  };

  const checkDigit = (id, check = null) => {
    const parts = String(id).split("");

    const sum = parts.reduce((a, e, i) => {
      return a + parseInt(e);
    }, 0);

    const digit = sum % 10;

    if (check !== null) {
      return digit === parseInt(check, 10);
    } else {
      return digit;
    }
  };

  const generateEntryCode = async (patientId, username, locationName, prefix, encounterId) => {

    return await mutex
      .lock("id_lock")
      .then(async unlock => {
        const padded = "1" + padZeros(0, (site.entry_code_max_digits
          ? site.entry_code_max_digits
          : 3));

        const largestPossibleId = parseInt(padded, 10) - 1;

        const property = (prefix
          ? prefix
          : "EC")
          .trim()
          .toLowerCase() + ".id.counter";

        let result;

        result = await GlobalProperty.find({
          where: {
            property: property
          }
        });

        let nextId = result.length > 0
          ? parseInt(result[0].propertyValue, 10) + 1
          : 1;

        /*
            Reset if limit reached
          */
        if (nextId > largestPossibleId) {
          nextId = 1;
        }

        if (result.length <= 0) {

          result = await GlobalProperty.create({
            property,
            propertyValue: nextId,
            description: property,
            uuid: uuid.v4()
          });

        } else {

          const entry = Object.assign({}, result[0], { propertyValue: nextId });

          result = await GlobalProperty.upsertWithWhere({
            property: property
          }, entry);

        }

        let check = checkDigit(nextId);

        let identifier = prefix
          .trim()
          .toUpperCase() + "" + nextId + "-" + check;

        let location = await Location.findOne({
          where: {
            name: locationName
          }
        });

        let locationId = location
          ? location.locationId
          : 1;

        let user = await User.findOne({
          where: {
            username
          }
        });

        let creator = user
          ? user.id
          : 1;

        let idType = await PatientIdentifierType.find({
          where: {
            name: !prefix || (prefix && prefix == "DMY")
              ? "Dummy ID"
              : prefix.trim() === "EC"
                ? "Entry Code"
                : prefix.trim() + " Number"
          },
          limit: 1
        });

        let identifierType = idType.length > 0
          ? idType[0].patientIdentifierTypeId
          : 8;

        let voided = 0;

        let dateCreated = new Date();

        /*result = await PatientIdentifier.create({
          patientId,
          identifier,
          identifierType,
          locationId,
          creator,
          dateCreated,
          voided,
          uuid: uuid.v4()
        });*/

        let concept = await ConceptName.findOne({
          where: {
            name: "HTS Entry Code"
          }
        });

        let conceptId = concept
          ? concept.conceptId
          : null;

        result = await Obs.create({
          personId: patientId,
          conceptId,
          encounterId,
          obsDatetime: dateCreated,
          locationId,
          valueText: identifier,
          creator,
          dateCreated,
          uuid: uuid.v4()
        });

        unlock();

        return identifier;

      })
      .catch(e => {
        console.log(e);

        return "Locked";
      });

  };

  let ddeData = {};

  const searchById = (req, raw) => {
    return new Promise(resolve => {
      new client()
        .get(req.protocol + "://" + req.hostname + ":" + (process.env.PORT
          ? process.env.PORT
          : 3001) + "/dde/search_by_identifier/" + raw.npid, function (result, props) {
            ddeData = result.data && result.data.matches === 1
              ? result.data.hits[0]
              : result;

            resolve();
          });
    });
  };

  const addNewPatient = (req, raw) => {

    debug("***********************");

    debug(JSON.stringify(raw));

    debug("***********************");

    return new Promise(resolve => {
      const args = {
        data: {
          family_name: raw.names
            ? raw.names.family_name
            : raw["Last Name"],
          given_name: raw.names
            ? raw.names.given_name
            : raw["First Name"],
          middle_name: raw.names
            ? raw.names.middle_name
            : raw["Middle Name"],
          gender: raw.gender
            ? raw.gender
            : raw.Gender,
          attributes: {
            occupation: raw.attributes
              ? raw.attributes.occupation
              : raw["Occupation"],
            cell_phone_number: raw.attributes
              ? raw.attributes.cell_phone_number
              : raw["Cell Phone Number"]
          },
          birthdate: raw.birthdate
            ? raw.birthdate
            : raw["Date of Birth"],
          identifiers: {
            "Entry Code": raw.otherId
              ? raw.otherId
              : null
          },
          birthdate_estimated: Object
            .keys(raw)
            .indexOf("birthdate_estimated") >= 0
            ? raw.birthdate_estimated
            : raw["Birthdate Estimated?"] && raw["Birthdate Estimated?"] === "Yes"
              ? true
              : false,
          current_residence: raw.addresses
            ? raw.addresses.current_residence
            : raw["Current Residence"],
          current_village: raw.addresses
            ? raw.addresses.current_village
            : raw["Current Village"],
          current_ta: raw.addresses
            ? raw.addresses.current_ta
            : raw["Current T/A"],
          current_district: raw.addresses
            ? raw.addresses.current_district
            : raw["Current District"],
          home_village: raw.addresses
            ? raw.addresses.home_village
            : raw["Home Village"],
          home_ta: raw.addresses
            ? raw.addresses.home_ta
            : raw["Home T/A"],
          home_district: raw.addresses
            ? raw.addresses.home_district
            : raw["District of Origin"]
              ? raw["District of Origin"]
              : raw["Current District"]
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      new client().post(req.protocol + "://" + req.hostname + ":" + (process.env.PORT
        ? process.env.PORT
        : 3001) + "/dde/add_patient", args, function (result, props) {
          ddeData = result.data
            ? result.data
            : result;

          resolve();
        });

    });

  };

  const parseAge = (number) => {

    let age;

    if (number < (1 / 12)) {

      age = (number * 365).toFixed(0) + "D";

    } else if (number < (2 / 12)) {

      age = (number * 52).toFixed(0) + "W";

    } else if (number < 2) {

      age = (number * 12).toFixed(0) + "M";

    } else {

      age = number.toFixed(0) + "Y";

    }

    return age;

  }

  const decodeAge = (raw) => {

    if (raw["Age"]) {

      let parts = String(raw.Age)
        .trim()
        .match(/^(\d+)([D|W|M|Y])$/i);

      if (parts) {

        let number = parts[1];
        let unit = parts[2];

        switch (unit.toUpperCase()) {

          case "D":

            raw["Date of Birth"] = (new Date(new Date().setDate((new Date()).getDate() - parseInt(number, 10))));

            break;

          case "W":

            raw["Date of Birth"] = (new Date(new Date().setDate(new Date().getDate() - (parseInt(number, 10) * 7))));

            break;

          case "M":

            raw["Date of Birth"] = (new Date(new Date().setDate(new Date().getDate() - (parseInt(number, 10) * 30))));

            break;

          default:

            raw["Date of Birth"] = new Date().getFullYear() - parseInt(number, 10) + "-07-10";

            break;

        }

      } else {

        raw["Date of Birth"] = new Date().getFullYear() - parseInt(raw["Age"], 10) + "-07-10";

      }

      raw.dateOfBirth = raw["Date of Birth"];

      raw.birthdate = raw["Date of Birth"];

      raw["Birthdate Estimated?"] = "Yes";

    }

  }

  /* GET home page. */
  router
    .get("/programs", function (req, res, next) {

      const url_parts = url.parse(req.url, true);

      const query = url_parts.query;

      const role = query.role
        ? query.role
        : "regular";

      const programs = [];

      const root = path.resolve(".", "programs");

      if (fs.existsSync(root)) {
        const folders = glob.sync(root + "/*");

        folders.map(f => {
          return f.match(/([^\/]+)$/)[1];
        }).filter(f => {

          switch (role.toLowerCase()) {

            case "admin":

              // return true;

              return f
                .toLowerCase()
                .trim() !== "registration" && f
                  .toLowerCase()
                  .trim() !== "user management";

            case "hts coordinator":

              return f
                .toLowerCase()
                .trim() !== "registration" && f
                  .toLowerCase()
                  .trim() !== "user management";

            case "counselor":

              return f
                .toLowerCase()
                .trim() === "hts" && f
                  .toLowerCase()
                  .trim() !== "user management";

            default:

              return f
                .toLowerCase()
                .trim() === "registration" && f
                  .toLowerCase()
                  .trim() !== "user management";

          }

        }).forEach(folder => {
          let icon = "";

          if (fs.existsSync(path.resolve(root, folder, "icon.png"))) {
            const file = path.resolve(root, folder, "icon.png");

            const bitmap = fs.readFileSync(file);

            icon = "data:image/png;base64," + new Buffer(bitmap).toString("base64");
          }

          const taskList = glob.sync(root + "/" + folder + "/*.json");

          const tasks = taskList.map(f => {
            return {
              label: f.match(/([^\/]+)\.json$/)[1],
              url: "/" + f
                .match(/([^\/]+)\.json$/)[1]
                .trim()
                .toLowerCase()
                .replace(/\s|\-/g, "_"),
              path: f,
              done: false
            };
          });

          const userFile = path.resolve(root, folder, "userTasks.tsk");

          debug(userFile);

          let userDashTasks = fs.existsSync(userFile)
            ? JSON.parse(fs.readFileSync(userFile).toString("utf8"))[role]
            : [];

          if (!userDashTasks || (userDashTasks && userDashTasks.length <= 0)) {

            userDashTasks = JSON.parse(fs.readFileSync(userFile).toString("utf8"))['regular'];

          }

          const entry = {
            name: folder,
            icon: icon,
            tasks: tasks,
            visits: [],
            userDashTasks: userDashTasks
          };

          programs.push(entry);
        });
      }

      const json = {
        patientActivated: false,
        formActive: false,
        module: "",
        icon: "",
        tasks: [],
        selectedTask: "",
        selectedVisit: "",
        today: new Date().format("d mmm YYYY"),
        facility: site.facility,
        location: query.location,
        currentSection: "home",
        programs: programs,
        userDashTasks: []
      };

      res
        .status(200)
        .json(json);
    });

  router.post("/programs/save_demographics", async function (req, res, next) {

    let raw = req.body;

    const group = raw.group;

    delete raw.group;

    debug("####################");

    debug(raw);

    debug("####################");

    ddeData = {};

    if (raw['Find Client By Name']) {

      let tmp = Object.assign({}, raw['Find Client By Name'], raw);

      delete tmp['Find Client By Name'];

      raw = tmp;

    }

    debug("####################");

    debug(raw);

    debug("####################");

    if (!raw["Create local with given ID?"]) {

      if (raw.npid) {

        await searchById(req, raw);

        if (ddeData && !ddeData.data) {

          raw.npid = ddeData.npid;

        } else if (ddeData && ddeData.data && ddeData.data.hits && Array.isArray(ddeData.data.hits)) {

          ddeData
            .data
            .hits
            .forEach(async json => {
              if (Object.keys(json).indexOf("patientName") < 0) {
                json.patientName = (json.names && json.names.given_name
                  ? json.names.given_name
                  : "") + " " + (json.names && json.names.family_name
                    ? json.names.family_name
                    : "");
              }

              if (Object.keys(json).indexOf("currentVillage") < 0) {
                json.currentVillage = json.addresses && json.addresses.current_village
                  ? json.addresses.current_village
                  : "";

                json.currentTA = json.addresses && json.addresses.current_ta
                  ? json.addresses.current_ta
                  : "";

                json.currentDistrict = json.addresses && json.addresses.current_district
                  ? json.addresses.current_district
                  : "";
              }

              if (Object.keys(json).indexOf("cellPhoneNumber") < 0) {
                json.cellPhoneNumber = json.attributes && json.attributes.cell_phone_number
                  ? json.attributes.cell_phone_number
                  : "";
              }

              if (Object.keys(json).indexOf("age") < 0) {
                json.dateOfBirth = json.birthdate;

                fetchAge(json);
              }

              json.otherIdType = "Entry Code";

              let identifier = await PatientIdentifier.findOne({
                where: {
                  identifier: json.npid
                }
              });

              let patientId = identifier
                ? identifier.patientId
                : null;

              if (patientId !== null) {
                let idType = await PatientIdentifierType.findOne({
                  where: {
                    name: "Entry Code"
                  }
                });

                let identifierType = idType
                  ? idType.patientIdentifierTypeId
                  : null;

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

              json.group = group;
            });

          return res
            .status(200)
            .json(ddeData.data.hits);

        } else {

          return res
            .status(200)
            .json([]);

        }

      } else {

        await addNewPatient(req, raw);

        if (ddeData && !ddeData.data) {

          debug("%%%%%%%%%%%%%%%%%%%%");

          debug(ddeData);

          debug("%%%%%%%%%%%%%%%%%%%%");

          raw.npid = ddeData.npid;

        } else if (ddeData && ddeData.data && Array.isArray(ddeData.data)) {
          ddeData
            .data
            .hits
            .forEach(async json => {
              if (Object.keys(json).indexOf("patientName") < 0) {
                json.patientName = (json.names && json.names.given_name
                  ? json.names.given_name
                  : "") + " " + (json.names && json.names.family_name
                    ? json.names.family_name
                    : "");
              }

              if (Object.keys(json).indexOf("currentVillage") < 0) {
                json.currentVillage = json.addresses && json.addresses.current_village
                  ? json.addresses.current_village
                  : "";

                json.currentTA = json.addresses && json.addresses.current_ta
                  ? json.addresses.current_ta
                  : "";

                json.currentDistrict = json.addresses && json.addresses.current_district
                  ? json.addresses.current_district
                  : "";
              }

              if (Object.keys(json).indexOf("cellPhoneNumber") < 0) {
                json.cellPhoneNumber = json.attributes && json.attributes.cell_phone_number
                  ? json.attributes.cell_phone_number
                  : "";
              }

              if (Object.keys(json).indexOf("age") < 0) {
                json.dateOfBirth = json.birthdate;

                fetchAge(json);
              }

              json.otherIdType = "Entry Code";

              let identifier = await PatientIdentifier.findOne({
                where: {
                  identifier: json.npid
                }
              });

              let patientId = identifier
                ? identifier.patientId
                : null;

              if (patientId !== null) {
                let idType = await PatientIdentifierType.findOne({
                  where: {
                    name: "Entry Code"
                  }
                });

                let identifierType = idType
                  ? idType.patientIdentifierTypeId
                  : null;

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

              json.group = group;

            });

          return res
            .status(200)
            .json(ddeData.data.hits);
        }

      }

    } else if (raw["Create local with given ID?"] && raw["Create local with given ID?"] === "No") {

      return res
        .status(200)
        .json([]);

    }

    let clinicId;

    let primaryId = raw.npid
      ? raw.npid
      : raw.primaryId
        ? raw.primaryId
        : raw.otherId;

    let patient = primaryId
      ? await PatientIdentifier.findOne({
        where: {
          identifier: primaryId
        }
      })
      : null;

    const currentUser = "admin";
    const currentLocationName = "Unknown";

    const user = await User.findOne({
      where: {
        username: currentUser
      }
    });

    const userId = user
      ? user.id
      : 1;

    const json = {
      otherId: clinicId,
      otherIdType: "HTS Number",
      npid: raw.npid
        ? raw.npid
        : "",
      age: raw.birthdate
        ? fetchAge({ dateOfBirth: raw.birthdate })
        : raw.Age
          ? raw.Age
          : raw.age
            ? raw.age
            : null,
      gender: raw.gender
        ? raw.gender
        : raw.Gender,
      patientName: raw.names
        ? raw.names.given_name + " " + raw.names.family_name
        : raw.patientName
          ? raw.patientName
          : raw["First Name"] && raw["Last Name"]
            ? raw["First Name"] + " " + raw["Last Name"]
            : "- -",
      firstName: raw.names
        ? raw.names.given_name
        : raw["First Name"],
      lastName: raw.names
        ? raw.names.family_name
        : raw["Last Name"],
      dateOfBirth: raw.birthdate
        ? raw.birthdate
        : raw["Date of Birth"],
      districtOfOrigin: raw.addresses
        ? raw.addresses.home_district
        : raw["District of Origin"],
      taOfOrigin: raw.addresses
        ? raw.addresses.home_ta
        : raw["T/A of Origin"],
      villageOfOrigin: raw.addresses
        ? raw.addresses.home_village
        : raw["Village of Origin"],
      currentRegion: raw["Current Region"],
      currentDistrict: raw.addresses
        ? raw.addresses.current_district
        : raw["Current District"],
      currentTA: raw.addresses
        ? raw.addresses.current_ta
        : raw["Current T/A"],
      currentVillage: raw.addresses
        ? raw.addresses.current_village
        : raw["Current Village"],
      closestLandmark: raw.addresses
        ? raw.addresses.closest_landmark
        : raw["Closest Landmark"],
      cellPhoneNumber: raw.attributes
        ? raw.attributes.cell_phone_number
        : raw["Cell Phone Number"]
    };

    let idType,
      identifierType;

    if (!patient) {

      decodeAge(raw);

      const person = await Person.create({
        gender: json.gender
          ? String(json.gender)
            .substring(0, 1)
            .toUpperCase()
          : null,
        birthdate: raw.birthdate
          ? raw.birthdate
          : raw["Date of Birth"]
            ? raw["Date of Birth"]
            : null,
        birthdateEstimated: Object
          .keys(raw)
          .indexOf("birthdate_estimated") >= 0
          ? raw.birthdate_estimated
          : raw["Birthdate Estimated?"] && raw["Birthdate Estimated?"] === "Yes"
            ? 1
            : 0,
        creator: userId,
        dateCreated: new Date(),
        uuid: uuid.v4()
      });

      const personId = person.personId;

      patient = await Patient.create({ patientId: personId, creator: userId, dateCreated: new Date() });

      let result = await PersonName.create({
        personId,
        givenName: json.firstName,
        middleName: json.middleName
          ? json.middleName
          : null,
        familyName: json.lastName,
        creator: userId,
        dateCreated: new Date(),
        uuid: uuid.v4()
      });

      result = await PersonAddress.create({
        personId,
        address1: json.closestLandmark,
        address2: json.districtOfOrigin,
        cityVillage: json.currentVillage,
        stateProvince: json.currentDistrict,
        creator: userId,
        dateCreated: new Date(),
        countyDistrict: json.taOfOrigin,
        neigborhoodCell: json.villageOfOrigin,
        townshipDivision: json.currentTA,
        uuid: uuid.v4()
      });

      let location = await Location.findOne({
        where: {
          name: currentLocationName
        }
      });

      let locationId = location.length > 0
        ? location[0].locationId
        : 1;

      if (raw.npid) {

        idType = await PatientIdentifierType.find({
          where: {
            name: "National id"
          },
          limit: 1
        });

        identifierType = idType.length > 0
          ? idType[0].patientIdentifierTypeId
          : 3;

        result = await PatientIdentifier.create({
          patientId: personId,
          identifier: raw.npid,
          identifierType,
          locationId,
          creator: userId,
          dateCreated: new Date(),
          uuid: uuid.v4()
        });

      } else if (raw["Create local with given ID?"] === "Yes") {

        idType = await PatientIdentifierType.find({
          where: {
            name: "Unknown ID"
          },
          limit: 1
        });

        identifierType = idType.length > 0
          ? idType[0].patientIdentifierTypeId
          : 10;

        result = await PatientIdentifier.create({
          patientId: personId,
          identifier: raw.primaryId,
          identifierType,
          locationId,
          creator: userId,
          dateCreated: new Date(),
          uuid: uuid.v4()
        });

      }

      clinicId = await generateId(personId, currentUser, currentLocationName, "HTS");

      while (!clinicId || clinicId === "Locked") {
        setTimeout(async () => {
          clinicId = await generateId(personId, currentUser, currentLocationName, "HTS");
        }, 1000);
      }

    } else {

      let patientId = patient
        ? patient.patientId
        : null;

      idType = await PatientIdentifierType.find({
        where: {
          name: "HTS Number"
        },
        limit: 1
      });

      identifierType = idType.length > 0
        ? idType[0].patientIdentifierTypeId
        : 3;

      let identifier = await PatientIdentifier.findOne({
        where: {
          identifierType,
          patientId
        }
      });

      if (identifier) {
        clinicId = identifier.identifier;
      }

      if (patientId) {

        let person = await Person.findOne({
          where: {
            personId: patientId
          }
        });

        if (person) {

          raw.birthdate = person.birthdate;

        }

      }

    }

    json.otherId = clinicId;

    if (!primaryId) {
      primaryId = clinicId;
    }

    debug("^^^^^^^^^^^^^^^^^^^^^");

    debug(json);

    debug("^^^^^^^^^^^^^^^^^^^^^");

    let buffer = Object.assign({}, json);

    // fetchAge(buffer);

    let age = ((new Date()) - (new Date(raw.birthdate
      ? raw.birthdate
      : raw["Date of Birth"]
        ? raw["Date of Birth"]
        : (new Date())))) / (365.0 * 24.0 * 60.0 * 60.0 * 1000.0);

    buffer.age = age;

    debug("########################");

    debug(buffer);

    debug("########################");

    const args = {
      data: buffer,
      headers: {
        "Content-Type": "application/json"
      }
    };

    new client().post(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/patient/" + primaryId, args, function (result) {

      debug(result);

      json.age = parseAge(age);

      json.group = group;

      res
        .status(200)
        .json(json);

    });

  });

  router.post("/programs/fetch_json", function (req, res, next) {
    const result = {
      group: req.body.group,
      subGroup: req.body.subGroup,
      data: {},
      configs: {},
      ignores: [],
      order: [],
      referrals: {}
    };

    if (req.body.path && fs.existsSync(req.body.path)) {
      result.data = JSON.parse(fs.readFileSync(req.body.path).toString("utf8"));

      const configsPath = req
        .body
        .path
        .replace(/[^\/]+$/, (result.subGroup === "PatientRegistration"
          ? "config/Registration"
          : "config") + "/app.json");

      if (fs.existsSync(configsPath)) {
        result.configs = JSON.parse(fs.readFileSync(configsPath).toString("utf8"));
      }

      const ignoresPath = req
        .body
        .path
        .replace(/[^\/]+$/, (result.subGroup === "PatientRegistration"
          ? "config/Registration"
          : "config") + "/summaryIgnores.json");

      if (fs.existsSync(ignoresPath)) {
        result.ignores = JSON.parse(fs.readFileSync(ignoresPath).toString("utf8"));
      }

      const referralsPath = req
        .body
        .path
        .replace(/[^\/]+$/, (result.subGroup === "PatientRegistration"
          ? "config/Registration"
          : "config") + "/referrals.json");

      if (fs.existsSync(referralsPath)) {
        result.referrals = JSON.parse(fs.readFileSync(referralsPath).toString("utf8"));
      }

      const orderPath = req
        .body
        .path
        .replace(/[^\/]+$/, "config/order.json");

      if (fs.existsSync(orderPath)) {
        result.order = JSON.parse(fs.readFileSync(orderPath).toString("utf8"));
      } else {
        result.order = glob
          .sync(req.body.path.replace(/[^\/]+$/, "*.json"))
          .map(f => {
            return f.match(/([^\/]+)\.json$/)[1];
          });
      }
    }

    res
      .status(200)
      .json(result);
  });

  router.post("/programs/save_encounters", async function (req, res, next) {

    let json = Object.assign({}, req.body);

    let identifier = await PatientIdentifier.findOne({
      where: {
        identifier: json.primaryId
      }
    });

    let primaryId,
      patientId,
      clinicId,
      idType,
      identifierType,
      nhid,
      encType,
      encounterType,
      encounter,
      encounterId;

    if (identifier && identifier.patientId) {
      patientId = identifier.patientId;

      idType = await PatientIdentifierType.find({
        where: {
          name: "National id"
        },
        limit: 1
      });

      identifierType = idType.length > 0
        ? idType[0].patientIdentifierTypeId
        : 3;

      let primaryIdentifier = await PatientIdentifier.findOne({
        where: {
          identifierType,
          patientId
        }
      });

      if (primaryIdentifier) {

        primaryId = primaryIdentifier.identifier;
        nhid = primaryIdentifier.identifier;

      } else {

        primaryId = json.primaryId;

      }

    }

    idType = await PatientIdentifierType.find({
      where: {
        name: "HTS Number"
      },
      limit: 1
    });

    identifierType = idType.length > 0
      ? idType[0].patientIdentifierTypeId
      : 3;

    let clinicIdentifier = await PatientIdentifier.findOne({
      where: {
        identifierType,
        patientId
      }
    });

    if (clinicIdentifier) {
      clinicId = clinicIdentifier.identifier;
    }

    if (!primaryId) {
      primaryId = clinicId;
    } else {
      primaryId = json.primaryId;
    }

    const today = (json.date
      ? new Date(json.date)
      : new Date()).format("d/mmm/YYYY");

    const programName = json.program;

    const group = json.group;

    const currentUser = json.user;
    const currentLocationName = (json.location
      ? json.location
      : "Unknown");

    delete json.date;
    delete json.primaryId;
    delete json.program;
    delete json.group;
    delete json.user;
    delete json.location;

    let program = await Program.findOne({
      where: {
        name: programName.toUpperCase() + " PROGRAM"
      }
    });

    let programId = program
      ? program.programId
      : null;

    const user = await User.findOne({
      where: {
        username: currentUser
      }
    });

    const userId = user
      ? user.id
      : 1;

    let location = await Location.findOne({
      where: {
        name: currentLocationName
      }
    });

    let locationId = location
      ? location.locationId
      : 1;

    let patientProgram = await PatientProgram.findOne({
      where: {
        and: [
          {
            patientId
          },
          {
            programId
          }, {
            dateCompleted: null
          }
        ]
      }
    });

    if (!patientProgram) {

      patientProgram = await PatientProgram.create({
        patientId,
        programId,
        dateEnrolled: new Date(),
        creator: userId,
        dateCreated: new Date(),
        location: locationId,
        uuid: uuid.v4()
      });

    }

    let patientProgramId = patientProgram.patientProgramId;

    let person = await Person.findOne({
      where: {
        personId: patientId
      }
    });

    let dateOfBirth = person
      ? person.birthdate
      : null;

    let encounterName = "HTS Visit";

    encType = await EncounterType.findOne({
      where: {
        name: encounterName
      }
    });

    encounterType = encType
      ? encType.encounterTypeId
      : null;

    encounter = await Encounter.create({
      encounterType,
      patientId,
      providerId: userId,
      locationId,
      encounterDatetime: new Date(today),
      creator: userId,
      dateCreated: new Date(),
      uuid: uuid.v4(),
      patientProgramId
    });

    encounterId = encounter.encounterId;

    json[encounterName].encounterId = encounterId;

    clinicId = await generateEntryCode(patientId, currentUser, currentLocationName, "EC", encounterId);

    while (!clinicId || clinicId === "Locked") {
      setTimeout(async () => {
        clinicId = await generateEntryCode(patientId, currentUser, currentLocationName, "EC", encounterId);
      }, 1000);
    }

    Object
      .keys(json[encounterName])
      .forEach(async name => {

        let concept = await ConceptName.findOne({
          where: {
            name
          }
        });

        let conceptId = concept
          ? concept.conceptId
          : null;

        let value = json[encounterName][name];

        let valueCoded = await ConceptName.findOne({
          where: {
            name: value
          }
        });

        let valueCodedId = valueCoded
          ? valueCoded.conceptId
          : null;

        let valueCodedNameId = valueCoded
          ? valueCoded.conceptNameId
          : null;

        if (conceptId) {

          let obs;

          if (name === "Age") {

            obs = await Obs.create({
              personId: patientId,
              conceptId,
              encounterId,
              obsDatetime: new Date(today),
              locationId,
              valueNumeric: String(value)
                .trim()
                .match(/^(\d+)(.+)$/)
                ? String(value)
                  .trim()
                  .match(/^(\d+)(.+)$/)[1]
                : null,
              valueModifier: String(value)
                .trim()
                .match(/^(\d+)(.+)$/)
                ? String(value)
                  .trim()
                  .match(/^(\d+)(.+)$/)[2]
                : null,
              creator: userId,
              dateCreated: new Date(),
              uuid: uuid.v4()
            });

          } else {

            obs = await Obs.create({
              personId: patientId,
              conceptId,
              encounterId,
              obsDatetime: new Date(today),
              locationId,
              valueCoded: valueCodedId
                ? valueCodedId
                : null,
              valueCodedNameId,
              valueNumeric: !valueCodedId && String(value)
                .trim()
                .match(/^\d+$/)
                ? value
                : null,
              valueText: !valueCodedId && !String(value)
                .trim()
                .match(/^\d+$/)
                ? value
                : null,
              creator: userId,
              dateCreated: new Date(),
              uuid: uuid.v4()
            });

          }

          let age = ((new Date(today)) - (new Date(dateOfBirth))) / (365.0 * 24.0 * 60.0 * 60.0 * 1000.0);

          if (["HTS Referral Slips Recipients"].indexOf(name) < 0) {

            let row = {
              visitDate: new Date(today),
              encounterType: encType.name,
              identifier: clinicId,
              observation: name,
              observationValue: value,
              program: programName.toUpperCase() + " PROGRAM",
              location: currentLocationName,
              provider: currentUser,
              user: currentUser,
              encounterId,
              dateOfBirth,
              age,
              obsId: obs.obsId
            };

            if (String(value).trim().match(/^\d+$/)) {
              row.observationNumber = value;
            }

            let args = {
              data: row,
              headers: {
                "Content-Type": "application/json"
              }
            };

            new client().post(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit", args, function (result) { });

          }

        }

      });

    json['HTS Visit']['Entry Code'] = clinicId;

    let tmp = Object.assign({}, {
      [clinicId]: json,
      primaryId,
      date: today
    });

    debug("#####################");

    debug(tmp);

    debug("#####################");

    res
      .status(200)
      .json(tmp);

  });

  router.get("/programs/fetch/:id", async function (req, res, next) {

    let identifier = await PatientIdentifier.findOne({
      where: {
        identifier: req.params.id
      }
    });

    if (!identifier)
      return res.status(200).json([]);

    let primaryId,
      patientId,
      clinicId,
      idType,
      identifierType,
      nhid;

    if (identifier && identifier.patientId) {
      patientId = identifier.patientId;

      idType = await PatientIdentifierType.find({
        where: {
          name: "National id"
        },
        limit: 1
      });

      identifierType = idType.length > 0
        ? idType[0].patientIdentifierTypeId
        : 3;

      let primaryIdentifier = await PatientIdentifier.findOne({
        where: {
          identifierType,
          patientId
        }
      });

      if (primaryIdentifier) {

        primaryId = primaryIdentifier.identifier;
        nhid = primaryIdentifier.identifier;

      } else {

        primaryId = req.params.id;

      }

    } else {

      primaryId = req.params.id;

    }

    idType = await PatientIdentifierType.find({
      where: {
        name: "HTS Number"
      },
      limit: 1
    });

    identifierType = idType.length > 0
      ? idType[0].patientIdentifierTypeId
      : 3;

    let clinicIdentifier = await PatientIdentifier.findOne({
      where: {
        identifierType,
        patientId
      }
    });

    if (clinicIdentifier) {
      clinicId = clinicIdentifier.identifier;
    }

    if (!primaryId) {
      primaryId = clinicId;
    }

    new client()
      .get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/patient/" + primaryId, function (result) {

        debug(result);

        let json = result && result._source
          ? result._source
          : {};

        if (json.age) {

          let age = parseAge(json.age);

          json.age = age;

        }

        res
          .status(200)
          .json(json);

      });

  });

  router.post("/programs/void_encounter", async function (req, res, next) {

    let json = Object.assign({}, req.body);

    let currentUser = "admin";

    const user = await User.findOne({
      where: {
        username: currentUser
      }
    });

    const userId = user
      ? user.id
      : 1;

    let result = await Encounter.updateAll({
      encounterId: req.body.encounterId
    }, {
        voided: 1,
        voidedBy: userId,
        dateVoided: new Date(),
        voidReason: "Voided by user"
      });

    result = await Obs.updateAll({
      encounterId: req.body.encounterId
    }, {
        voided: 1,
        voidedBy: userId,
        dateVoided: new Date(),
        voidReason: "Voided by user"
      });

    const args = {
      data: {
        query: {
          query_string: {
            query: 'encounterId:"' + req.body.encounterId + '"'
          }
        },
        size: 1000
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    new client().get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      if (result && result.hits && result.hits.hits) {

        let entryCode;

        let bulk = [];

        result
          .hits
          .hits
          .forEach(row => {

            if (!entryCode) {

              entryCode = row._source.identifier;

              bulk.push(JSON.stringify({
                delete: {
                  _index: es.index,
                  _type: "pepfar",
                  _id: entryCode
                }
              }));

            }

            bulk.push(JSON.stringify({
              delete: {
                _index: es.index,
                _type: "visit",
                _id: row._id
              }
            }));
          });

        if (bulk.length > 0) {
          var bulkArgs = {
            data: bulk.join("\n") + "\n",
            headers: {
              "Content-Type": "application/x-ndjson"
            }
          };

          new client().post(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_bulk", bulkArgs, function (result) {

            setTimeout(() => {
              res
                .status(200)
                .json({});
            }, 1000);
          });

        } else {

          res
            .status(200)
            .json({});

        }

      }

    });

  });

  router.post("/programs/save_bd_data", async function (req, res, next) {

    let json = Object.assign({}, req.body);

    debug("*****************");

    debug(json);

    debug("*****************");

    let currentUser = json["Current User"]
      ? json["Current User"]
      : null;

    let currentLocationName = json["Current Location"]
      ? json["Current Location"]
      : "Unknown";

    const user = await User.findOne({
      where: {
        username: currentUser
      }
    });

    const userId = user
      ? user.id
      : 1;

    let clinicId;

    if (json["Entry Code"])
      clinicId = json["Entry Code"];

    let birthdate;

    if (!json.birthdate && json["Age"]) {

      let parts = String(json.Age)
        .trim()
        .match(/^(\d+)([D|W|M|Y])$/i);

      if (parts) {

        let number = parts[1];
        let unit = parts[2];

        switch (unit.toUpperCase()) {

          case "D":

            json.birthdate = (new Date(new Date().setDate((new Date()).getDate() - parseInt(number, 10))));

            birthdate = (new Date(new Date().setDate((new Date()).getDate() - parseInt(number, 10))));

            break;

          case "W":

            json.birthdate = (new Date(new Date().setDate(new Date().getDate() - (parseInt(number, 10) * 7))));

            birthdate = (new Date(new Date().setDate(new Date().getDate() - (parseInt(number, 10) * 7))));

            break;

          case "M":

            json.birthdate = (new Date(new Date().setDate(new Date().getDate() - (parseInt(number, 10) * 30))));

            birthdate = (new Date(new Date().setDate(new Date().getDate() - (parseInt(number, 10) * 30))));

            break;

          default:

            json.birthdate = new Date().getFullYear() - parseInt(number, 10) + "-07-10";

            birthdate = new Date().getFullYear() - parseInt(number, 10) + "-07-10";

            break;

        }

      } else {

        json.birthdate = new Date().getFullYear() - parseInt(json["Age"], 10) + "-07-10";

        birthdate = new Date().getFullYear() - parseInt(json["Age"], 10) + "-07-10";

      }

      json["Birthdate Estimated?"] = "Yes";

    }

    let provider = await Users.findOne({
      where: {
        username: json['HTS Provider ID']
      }
    });

    debug("$$$$$$$$$$$$$$$$$$$$$$$$$");

    debug(provider);

    debug(json['HTS Provider ID']);

    debug("$$$$$$$$$$$$$$$$$$$$$$$$$");

    if (!provider) {

      return res.status(400).json({ error: true, message: "HTS Provider ID \n not registered at this site" });

    }

    let providerId = (provider ? provider.personId : null);

    let name = "Register Number (from cover)";

    let parts = json[name]
      .trim()
      .match(/^(\d+)\s\(([^\-]+)\-([^\)]+)\)/);

    if (!parts)
      return res.status(400).json({ error: true, message: "Error occured when picking locations" });

    let registerNumber = parts[1].trim();
    let locationType = parts[2].trim();
    let serviceDeliveryPoint = parts[3].trim();

    let gender = json["Sex/Pregnancy"]
      ? String(json["Sex/Pregnancy"])
        .trim()
        .substring(0, 1)
        .toUpperCase()
      : null;

    let person = await Person.create({
      gender,
      birthdate,
      birthdateEstimated: 1,
      creator: userId,
      dateCreated: new Date(),
      uuid: uuid.v4()
    });

    let personId = person.personId;
    let patientId = personId;

    let patient = await Patient.create({ patientId: personId, creator: userId, dateCreated: new Date() });

    let programName = "HTS";

    let program = await Program.findOne({
      where: {
        name: programName.toUpperCase() + " PROGRAM"
      }
    });

    let location = await Location.findOne({
      where: {
        name: currentLocationName
      }
    });

    let locationId = location
      ? location.locationId
      : 1;

    let today = json["Set Date"]
      ? json["Set Date"]
      : new Date().format("YYYY-mm-dd");

    let age = ((new Date(today)) - (new Date(birthdate))) / (365.0 * 24.0 * 60.0 * 60.0 * 1000.0);

    let buffer = {
      otherId: clinicId,
      otherIdType: "Entry code",
      age,
      gender: gender,
      patientName: "- -"
    };

    const args = {
      data: buffer,
      headers: {
        "Content-Type": "application/json"
      }
    };

    new client().post(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/patient/" + clinicId, args, function (result) { });

    let programId = program
      ? program.programId
      : null;

    let patientProgram = await PatientProgram.findOne({
      where: {
        and: [
          {
            patientId: personId
          }, {
            programId
          }, {
            dateCompleted: null
          }
        ]
      }
    });

    if (!patientProgram) {
      patientProgram = await PatientProgram.create({
        patientId: personId,
        programId,
        dateEnrolled: new Date(),
        creator: userId,
        dateCreated: new Date(),
        location: locationId,
        uuid: uuid.v4()
      });
    }

    let patientProgramId = patientProgram.patientProgramId;

    let groups = {
      "HTS Visit": [
        "Age Group",
        "HTS Access Type",
        "Last HIV Test",
        "Partner Present",
        "Client Risk Category",
        "Time Since Last Test",
        "Service Delivery Point",
        "Sex/Pregnancy",
        "Age",
        "HIV Rapid Test Outcomes",
        "Outcome Summary",
        "Result Given to Client",
        "Partner HIV Status",
        "Referral for Re-Testing",
        "Appointment Date Given",
        "Number of Items Given:HTS Family Referral Slips"
      ]
    };

    let encounterName = "HTS Visit";

    let encType = await EncounterType.findOne({
      where: {
        name: encounterName
      }
    });

    let encounterType = encType
      ? encType.encounterTypeId
      : null;

    let encounter = await Encounter.create({
      encounterType,
      patientId: personId,
      providerId,
      locationId,
      encounterDatetime: new Date(today),
      creator: userId,
      dateCreated: new Date(),
      uuid: uuid.v4(),
      patientProgramId
    });

    let encounterId = encounter.encounterId;

    let registerMap = await HtsRegisterEncounterMapping.create({ encounterId, registerId: registerNumber });

    if (!clinicId)
      clinicId = await generateEntryCode(personId, currentUser, currentLocationName, "EC", encounterId);

    while (!clinicId || clinicId === "Locked") {
      setTimeout(async () => {
        clinicId = await generateEntryCode(personId, currentUser, currentLocationName, "EC", encounterId);
      }, 1000);
    }

    groups[encounterName].forEach(async name => {

      if (name === "HIV Rapid Test Outcomes") {

        Object
          .keys(json[name])
          .forEach(e => {

            Object
              .keys(json[name][e])
              .forEach(async f => {

                const conceptName = e + " " + f + " Result";
                const value = json[name][e][f];

                let concept = await ConceptName.findOne({
                  where: {
                    name: conceptName
                  }
                });

                let conceptId = concept
                  ? concept.conceptId
                  : null;

                let valueCoded = await ConceptName.findOne({
                  where: {
                    name: value
                  }
                });

                let valueCodedId = valueCoded
                  ? valueCoded.conceptId
                  : null;

                let valueCodedNameId = valueCoded
                  ? valueCoded.conceptNameId
                  : null;

                if (conceptId && value && String(value).length > 0) {

                  let obs = await Obs.create({
                    personId: patientId,
                    conceptId,
                    encounterId,
                    obsDatetime: new Date(today),
                    locationId,
                    valueCoded: valueCodedId
                      ? valueCodedId
                      : null,
                    valueCodedNameId,
                    valueNumeric: !valueCodedId && String(value)
                      .trim()
                      .match(/^\d+$/)
                      ? value
                      : null,
                    valueText: !valueCodedId && !String(value)
                      .trim()
                      .match(/^\d+$/)
                      ? value
                      : null,
                    creator: userId,
                    dateCreated: new Date(),
                    uuid: uuid.v4()
                  });

                  let row = {
                    visitDate: new Date(today),
                    encounterType: encType.name,
                    identifier: clinicId,
                    observation: conceptName,
                    observationValue: value,
                    program: programName.toUpperCase() + " PROGRAM",
                    location: currentLocationName,
                    provider: json['HTS Provider ID'],
                    user: currentUser,
                    encounterId,
                    dateOfBirth: birthdate,
                    registerNumber,
                    locationType,
                    serviceDeliveryPoint,
                    age,
                    obsId: obs.obsId
                  };

                  let args = {
                    data: row,
                    headers: {
                      "Content-Type": "application/json"
                    }
                  };

                  new client().post(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit", args, function (result) { });

                }

              });

          });

      } else {

        let conceptname = String(name);

        if (conceptname === "Number of Items Given:HTS Family Referral Slips") {

          conceptname = "HTS Family Referral Slips";

        }

        let concept = await ConceptName.findOne({
          where: {
            name: conceptname
          }
        });

        let conceptId = concept
          ? concept.conceptId
          : null;

        let value = json[name];

        let valueCoded = await ConceptName.findOne({
          where: {
            name: value
          }
        });

        let valueCodedId = valueCoded
          ? valueCoded.conceptId
          : null;

        let valueCodedNameId = valueCoded
          ? valueCoded.conceptNameId
          : null;

        if (conceptId && value && String(value).length > 0) {

          let obs;

          if (conceptname === "Age") {

            obs = await Obs.create({
              personId: patientId,
              conceptId,
              encounterId,
              obsDatetime: new Date(today),
              locationId,
              valueNumeric: String(value)
                .trim()
                .match(/^(\d+)(.+)$/)
                ? String(value)
                  .trim()
                  .match(/^(\d+)(.+)$/)[1]
                : null,
              valueModifier: String(value)
                .trim()
                .match(/^(\d+)(.+)$/)
                ? String(value)
                  .trim()
                  .match(/^(\d+)(.+)$/)[2]
                : null,
              creator: userId,
              dateCreated: new Date(),
              uuid: uuid.v4()
            });

          } else {

            obs = await Obs.create({
              personId: patientId,
              conceptId,
              encounterId,
              obsDatetime: new Date(today),
              locationId,
              valueCoded: valueCodedId
                ? valueCodedId
                : null,
              valueCodedNameId,
              valueNumeric: !valueCodedId && String(value)
                .trim()
                .match(/^\d+$/)
                ? value
                : null,
              valueText: !valueCodedId && !String(value)
                .trim()
                .match(/^\d+$/)
                ? value
                : null,
              creator: userId,
              dateCreated: new Date(),
              uuid: uuid.v4()
            });

          }

          let row = {
            visitDate: new Date(today),
            encounterType: encType.name,
            identifier: clinicId,
            observation: conceptname,
            observationValue: value,
            program: programName.toUpperCase() + " PROGRAM",
            location: currentLocationName,
            provider: json['HTS Provider ID'],
            user: currentUser,
            encounterId,
            dateOfBirth: birthdate,
            registerNumber,
            locationType,
            serviceDeliveryPoint,
            age,
            obsId: obs.obsId
          };

          let args = {
            data: row,
            headers: {
              "Content-Type": "application/json"
            }
          };

          new client().post(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit", args, function (result) { });

        }

      }

    });

    if (["New Negative", "New Positive"].indexOf(json["Result Given to Client"]) >= 0) {

      let htsSetting = "";
      let htsModality = "";
      const clientAges = {
        "0-13Y": [
          0, 13.9999
        ],
        "Any": [
          0, 120
        ],
        "0-4Y": [
          0, 4.9999
        ],
        "5Y+": [5, 120]
      };

      const htsAccessTypeMappings = {
        "Routine HTS (PITC) within Health Service": "PITC",
        "Comes with HTS Family Referral Slip": "FRS/Index",
        "Other (VCT, etc.)": "VCT/Other"
      };

      const accessType = htsAccessTypeMappings[json['HTS Access Type']];

      let partnerHIVStatus = (json["Partner HIV Status"] !== "Partner Positive"
        ? "Any"
        : "Partner Positive");

      if (htsIndicatorsMapping[locationType] && htsIndicatorsMapping[locationType][serviceDeliveryPoint] && htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType] && htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus]) {

        for (let group of Object.keys(clientAges)) {

          if (age >= clientAges[group][0] && age <= clientAges[group][1]) {

            if (htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus][group]) {

              htsSetting = htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus][group]['HTS Setting'];

              htsModality = htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus][group]['HTS Modality'];

              break;

            }

          }

        }

        if (String(htsSetting).trim().length <= 0) {

          partnerHIVStatus = "Any other";

          for (let group of Object.keys(clientAges)) {

            if (age >= clientAges[group][0] && age <= clientAges[group][1]) {

              if (htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus][group]) {

                htsSetting = htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus][group]['HTS Setting'];

                htsModality = htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus][group]['HTS Modality'];

                break;

              }

            }

          }

        }

      } else if (htsIndicatorsMapping[locationType] && htsIndicatorsMapping[locationType][serviceDeliveryPoint] && htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType] && htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType]["Any other"]) {

        partnerHIVStatus = "Any other";

        for (let group of Object.keys(clientAges)) {

          if (age >= clientAges[group][0] && age <= clientAges[group][1]) {

            if (htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus][group]) {

              htsSetting = htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus][group]['HTS Setting'];

              htsModality = htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus][group]['HTS Modality'];

              break;

            }

          }

        }

      }

      debug("$$$$$$$$$$$$$$$$$$$$$$$");

      debug(htsSetting);

      debug(htsModality);

      debug(locationType);

      debug(serviceDeliveryPoint);

      debug(accessType);

      debug(partnerHIVStatus);

      debug("$$$$$$$$$$$$$$$$$$$$$$$");

      new client().get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/pepfar/" + clinicId, function (result) {

        let args = {
          data: {
            htsAccessType: json["HTS Access Type"],
            resultGiven: String(json["Result Given to Client"])
              .replace(/new/i, "")
              .trim(),
            gender,
            serviceDeliveryPoint,
            month: monthNames[(new Date(today)).getMonth()],
            year: (new Date(today)).getFullYear(),
            age,
            visitDate: (new Date(today)),
            entryCode: clinicId,
            htsSetting,
            htsModality,
            locationType
          },
          headers: {
            "Content-Type": "application/json"
          }
        };

        new client().post(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/pepfar/" + clinicId, args, function (result) { })

      });

    }

    json.id = clinicId;

    debug("#########################");

    debug(json);

    debug("#########################");

    res
      .status(200)
      .json(json);

  });

  router.get("/programs/fetch_last_bd_record/:id", function (req, res, next) {

    const args = {
      data: {
        query: {
          query_string: {
            query: "registerNumber:" + req.params.id
          }
        },
        size: 1000,
        sort: [
          {
            "identifier.keyword": {
              order: "desc"
            }
          }
        ],
        aggs: {
          kits: {
            terms: {
              field: "identifier.keyword",
              size: 10,
              order: {
                _term: "desc"
              }
            }
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    new client().get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      let json = {};

      if (result && result.aggregations && result.aggregations.kits && result.aggregations.kits.buckets && result.aggregations.kits.buckets.length > 0 && result.hits && result.hits.hits && result.hits.hits.length > 0) {

        debug(JSON.stringify(result.aggregations));

        const entryCode = result.aggregations.kits.buckets[0].key;

        debug(entryCode);

        result
          .hits
          .hits
          .filter(e => {
            return e._source.identifier === entryCode;
          })
          .forEach(data => {

            const row = data._source;

            debug(row);
            debug(json);

            if (!json["HTS Provider ID"]) {
              json["HTS Provider ID"] = row.provider;
            } else if (!json["id"]) {
              json.id = entryCode;
            }

            json.dateOfBirth = row.dateOfBirth;

            fetchAge(json);

            if (json.age) {

              json.Age = String(json.age);

              delete json.age;
              delete json.dateOfBirth;

            }

            if (row.observation.match(/first\spass/i)) {

              if (!json["HIV Rapid Test Outcomes"]) {
                json["HIV Rapid Test Outcomes"] = {};
              }

              if (!json["HIV Rapid Test Outcomes"]["First Pass"]) {
                json["HIV Rapid Test Outcomes"]["First Pass"] = {};
              }

              if (row.observation.match(/test\s1/i)) {
                json["HIV Rapid Test Outcomes"]["First Pass"]["Test 1"] = row.observationValue;
              } else if (row.observation.match(/test\s2/i)) {
                json["HIV Rapid Test Outcomes"]["First Pass"]["Test 2"] = row.observationValue;
              }
            } else if (row.observation.match(/immediate\srepeat/i)) {
              if (!json["HIV Rapid Test Outcomes"]) {
                json["HIV Rapid Test Outcomes"] = {};
              }

              if (!json["HIV Rapid Test Outcomes"]["Immediate Repeat"]) {
                json["HIV Rapid Test Outcomes"]["Immediate Repeat"] = {};
              }

              if (row.observation.match(/test\s1/i)) {
                json["HIV Rapid Test Outcomes"]["Immediate Repeat"]["Test 1"] = row.observationValue;
              } else if (row.observation.match(/test\s2/i)) {
                json["HIV Rapid Test Outcomes"]["Immediate Repeat"]["Test 2"] = row.observationValue;
              }

            } else if (row.observation === "Last HIV Test Result") {

              json["Last HIV Test"] = row.observationValue;

            } else if (row.observation === "HTS Family Referral Slips") {

              json["Number of Items Given:HTS Family Referral Slips"] = row.observationValue;

            } else if (row.observation === "Number of female condoms given") {

              json["Number of Items Given:Condoms:Female"] = row.observationValue;

            } else if (row.observation === "Number of male condoms given") {

              json["Number of Items Given:Condoms:Male"] = row.observationValue;

            } else {

              json[row.observation] = row.observationValue;

            }

          });
      }

      res
        .status(200)
        .json(json);
    });
  });

  router.get("/programs/scan/:id", async function (req, res, next) {

    await searchById(req, { npid: req.params.id });

    let result = !Array.isArray(ddeData)
      ? [ddeData]
      : ddeData;

    res
      .status(200)
      .json(result);
  });

  router.get("/programs/fetch_visits/:id", async function (req, res, next) {

    res.set("Content-Type", "application/json");

    if (!req.params.id) {

      return res.end();

    }

    if (req.params.id === null)
      return res.status(200).json({});

    let identifier = await PatientIdentifier.findOne({
      where: {
        identifier: req.params.id
      }
    });

    let primaryId,
      patientId,
      clinicId,
      idType,
      identifierType,
      nhid;

    if (identifier && identifier.patientId) {
      patientId = identifier.patientId;

      idType = await PatientIdentifierType.find({
        where: {
          name: "National id"
        },
        limit: 1
      });

      identifierType = idType.length > 0
        ? idType[0].patientIdentifierTypeId
        : 3;

      let primaryIdentifier = await PatientIdentifier.findOne({
        where: {
          identifierType,
          patientId
        }
      });

      if (primaryIdentifier) {
        primaryId = primaryIdentifier.identifier;
      } else {
        idType = await PatientIdentifierType.find({
          where: {
            name: "HTS Number"
          },
          limit: 1
        });

        identifierType = idType.length > 0
          ? idType[0].patientIdentifierTypeId
          : 10;

        primaryIdentifier = await PatientIdentifier.findOne({
          where: {
            identifierType,
            patientId
          }
        });

        if (primaryIdentifier) {
          primaryId = primaryIdentifier.identifier;
        } else {
          primaryId = req.params.id;
        }
      }
    }

    let concept = await ConceptName.findOne({
      where: {
        name: "HTS Entry Code"
      }
    })

    let conceptId = (concept
      ? concept.conceptId
      : null);

    let obs = await Obs.find({
      where: {
        conceptId,
        personId: patientId
      }
    })

    let i = 0;

    for (let row of obs) {

      const entryCode = row.valueText;

      const searchExec = function searchExec(from = 0, callback) {
        esClient.search({
          index: es.index,
          from: from,
          size: 10000,
          body: {
            query: {
              query_string: {
                query: '_type:"visit" AND identifier:"' + entryCode + '"'
              }
            }
          }
        }, callback);
      };

      let entryCodeSent = false;
      const rs = new ReadableSearch(searchExec);
      const ws = new require("stream").Writable({ objectMode: true });
      ws._write = function (chunk, enc, next) {

        let entry = Object.assign({}, chunk);
        let entryCode = entry._source.identifier;

        entry._source.identifier = primaryId;

        entry._source.entryCode = entryCode;

        res.write(JSON.stringify([entry]));

        debug("%%%%%%%%%%%%%%%%%%%");

        debug(entryCodeSent);
        debug(entry);

        debug("%%%%%%%%%%%%%%%%%%%");

        if (!entryCodeSent) {

          entry._source.observation = "Entry Code";
          entry._source.observationValue = entryCode;

          entryCodeSent = true;

          res.write(JSON.stringify([entry]));

        }

        next();

      };

      rs
        .pipe(ws)
        .on("finish", () => {

          i++;

          if (i >= obs.length) {

            debug("************************");

            debug(obs.length);

            debug(i);

            debug(entryCode);

            debug("************************");

            res.end();
          }

        });

    }

  });

  router.post("/programs/save_register_number", async function (req, res, next) {

    const json = req.body;

    debug(JSON.stringify(json, null, 2));

    let encounter = await Encounter.findOne({
      where: {
        encounterId: json.encounterId
      }
    });

    let name = "Register Number (from cover)";

    let parts = json[name]
      .trim()
      .match(/^(\d+)\s\(([^\-]+)\-([^\)]+)\)/);

    if (!parts)
      return res.status(400).json({ error: true, message: "Error occured when picking locations" });

    let registerNumber = parts[1].trim();
    let locationType = parts[2].trim();
    let serviceDeliveryPoint = parts[3].trim();

    let concept = await ConceptName.findOne({
      where: {
        name: name
      }
    });

    let conceptId = concept
      ? concept.conceptId
      : null;

    let patientId = encounter.patientId;
    let encounterId = encounter.encounterId;
    let locationId = encounter.locationId;
    let userId = encounter.creator;
    let entryCode = (json.client
      ? Object.keys(json.client)[0]
      : null);

    if (conceptId && registerNumber && String(registerNumber).length > 0) {

      let obs = await Obs.create({
        personId: patientId,
        conceptId,
        encounterId,
        obsDatetime: new Date(),
        locationId,
        valueText: registerNumber,
        creator: userId,
        dateCreated: new Date(),
        uuid: uuid.v4()
      });

      let location = await Location.findOne({
        where: {
          locationId
        }
      });

      let person = await Person.findOne({
        where: {
          personId: patientId
        }
      });

      let user = await User.findOne({
        where: {
          userId
        }
      });

      let encType = await EncounterType.findOne({
        where: {
          encounterTypeId: encounter.encounterType
        }
      });

      let args = {
        data: {
          query: {
            query_string: {
              query: 'identifier:"' + entryCode + '"'
            }
          },
          size: 1000
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      new client().post(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

        if (result && result.hits && result.hits.hits) {

          result
            .hits
            .hits
            .forEach(async (hit) => {

              let existingMap = await HtsRegisterEncounterMapping.find({
                where: {
                  encounterId: hit._source.encounterId,
                  registerId: registerNumber
                }
              })

              if (existingMap.length <= 0)
                await HtsRegisterEncounterMapping.create({ encounterId: hit._source.encounterId, registerId: registerNumber });

              args = {
                data: Object.assign({}, hit._source, { registerNumber, locationType, serviceDeliveryPoint }),
                headers: {
                  "Content-Type": "application/json"
                }
              };

              new client().post(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/" + hit._id, args, function (result) { });

            });

        }

      });

    }

    let patientIdentifier = await PatientIdentifier.findOne({
      where: {
        identifier: json.id
      }
    });

    let personId = patientIdentifier.patientId;

    let person = await Person.findOne({
      where: {
        personId
      }
    });

    let birthdate = (person.birthdate
      ? person.birthdate
      : (new Date()));

    let age = ((new Date()) - (new Date(birthdate))) / (365.0 * 24.0 * 60.0 * 60.0 * 1000.0);

    debug("@@@@@@@@@@@@@@@@@@@@@@");

    debug(json.client[entryCode]);

    debug("@@@@@@@@@@@@@@@@@@@@@@");

    if (json.client[entryCode] && ["New Negative", "New Positive"].indexOf(json.client[entryCode]["HTS Visit"]["Result Given to Client"]) >= 0) {

      let htsSetting = "";
      let htsModality = "";
      const clientAges = {
        "0-13Y": [
          0, 13.9999
        ],
        "Any": [
          0, 120
        ],
        "0-4Y": [
          0, 4.9999
        ],
        "5Y+": [5, 120]
      };

      const htsAccessTypeMappings = {
        "Routine HTS (PITC) within Health Service": "PITC",
        "Comes with HTS Family Referral Slip": "FRS/Index",
        "Other (VCT, etc.)": "VCT/Other"
      };

      const accessType = htsAccessTypeMappings[json.client[entryCode]["HTS Visit"]['HTS Access Type']];

      let partnerHIVStatus = (json.client[entryCode]["HTS Visit"]["Partner HIV Status"] !== "Partner Positive"
        ? "Any"
        : "Partner Positive");

      if (htsIndicatorsMapping[locationType] && htsIndicatorsMapping[locationType][serviceDeliveryPoint] && htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType] && htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus]) {

        for (let group of Object.keys(clientAges)) {

          if (age >= clientAges[group][0] && age <= clientAges[group][1]) {

            if (htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus][group]) {

              htsSetting = htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus][group]['HTS Setting'];

              htsModality = htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus][group]['HTS Modality'];

              break;

            }

          }

        }

        if (String(htsSetting).trim().length <= 0) {

          partnerHIVStatus = "Any other";

          for (let group of Object.keys(clientAges)) {

            if (age >= clientAges[group][0] && age <= clientAges[group][1]) {

              if (htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus][group]) {

                htsSetting = htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus][group]['HTS Setting'];

                htsModality = htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus][group]['HTS Modality'];

                break;

              }

            }

          }

        }

      } else if (htsIndicatorsMapping[locationType] && htsIndicatorsMapping[locationType][serviceDeliveryPoint] && htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType] && htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType]["Any other"]) {

        partnerHIVStatus = "Any other";

        for (let group of Object.keys(clientAges)) {

          if (age >= clientAges[group][0] && age <= clientAges[group][1]) {

            if (htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus][group]) {

              htsSetting = htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus][group]['HTS Setting'];

              htsModality = htsIndicatorsMapping[locationType][serviceDeliveryPoint][accessType][partnerHIVStatus][group]['HTS Modality'];

              break;

            }

          }

        }

      }

      debug("$$$$$$$$$$$$$$$$$$$$$$$");

      debug(htsSetting);

      debug(htsModality);

      debug(locationType);

      debug(serviceDeliveryPoint);

      debug(accessType);

      debug(partnerHIVStatus);

      debug("$$$$$$$$$$$$$$$$$$$$$$$");

      let gender = (json.client[entryCode]["HTS Visit"]["Sex/Pregnancy"]
        ? String(json.client[entryCode]["HTS Visit"]["Sex/Pregnancy"]).substring(0, 1).toUpperCase()
        : null);

      let clinicId = (entryCode
        ? entryCode
        : null);

      new client().get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/pepfar/" + clinicId, function (result) {

        let args = {
          data: {
            htsAccessType: json.client[entryCode]["HTS Visit"]["HTS Access Type"],
            resultGiven: String(json.client[entryCode]["HTS Visit"]["Result Given to Client"])
              .replace(/new/i, "")
              .trim(),
            gender,
            serviceDeliveryPoint,
            month: monthNames[(new Date()).getMonth()],
            year: (new Date()).getFullYear(),
            age,
            visitDate: new Date(),
            entryCode: clinicId,
            htsSetting,
            htsModality,
            locationType
          },
          headers: {
            "Content-Type": "application/json"
          }
        };

        new client().post(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/pepfar/" + clinicId, args, function (result) { })

      });

    }

    res
      .status(200)
      .json({ registerNumber, entryCode });

  });

  router.post("/programs/void_multiple_encounters", async function (req, res, next) {

    let json = Object.assign({}, req.body);

    let currentUser = "admin";

    const user = await User.findOne({
      where: {
        username: currentUser
      }
    });

    const userId = user
      ? user.id
      : 1;

    let encounterIds = req.body.encounterIds;

    let patient = await PatientIdentifier.findOne({
      where: {
        identifier: req.body.id
      }
    });

    encounterIds = await Encounter
      .find({
        where: {
          encounterDatetime: req.body.visitDate,
          patientId: patient.patientId
        }
      })
      .map((e) => {
        return e.encounterId
      });

    if (req.body.partnerId) {

      patient = await PatientIdentifier.findOne({
        where: {
          identifier: req.body.partnerId
        }
      });

      encounterIds = encounterIds.concat(await Encounter.find({
        where: {
          encounterDatetime: req.body.visitDate,
          patientId: patient.patientId
        }
      }).map((e) => {
        return e.encounterId
      }));

    }

    for (let encounterId of encounterIds) {
      let result = await Encounter.updateAll({
        encounterId
      }, {
          voided: 1,
          voidedBy: userId,
          dateVoided: new Date(),
          voidReason: "Voided by user"
        });

      result = await Obs.updateAll({
        encounterId
      }, {
          voided: 1,
          voidedBy: userId,
          dateVoided: new Date(),
          voidReason: "Voided by user"
        });

      const args = {
        data: {
          query: {
            query_string: {
              query: 'encounterId:"' + encounterId + '"'
            }
          },
          size: 1000
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      new client().get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

        if (result && result.hits && result.hits.hits) {
          let bulk = [];

          result
            .hits
            .hits
            .forEach(row => {
              bulk.push(JSON.stringify({
                delete: {
                  _index: es.index,
                  _type: "visit",
                  _id: row._id
                }
              }));
            });

          if (bulk.length > 0) {
            var bulkArgs = {
              data: bulk.join("\n") + "\n",
              headers: {
                "Content-Type": "application/x-ndjson"
              }
            };

            new client().post(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_bulk", bulkArgs, function (result) { });
          }
        }
      });
    }

    res
      .status(200)
      .json({});
  });

  router.post('/programs/add_register', async function (req, res, next) {

    const json = (req.body['Add Register']
      ? req.body['Add Register']
      : {});

    let user = await User.findOne({
      where: {
        username: json.username
      }
    });

    let locationType = await HtsRegisterLocationType.findOne({
      where: {
        name: json['Location Type']
      }
    })

    let serviceDeliveryPoint = await HtsRegisterServiceDeliveryPoint.findOne({
      where: {
        name: json['Service Delivery Point']
      }
    })

    let existingRegister = await HtsRegister.findOne({
      where: {
        registerNumber: json['Register Number'],
        closed: 0
      }
    });

    debug("$$$$$$$$$$$$$$$$");

    debug(json);

    debug(user);

    debug(locationType);

    debug(serviceDeliveryPoint);

    debug(existingRegister);

    debug("$$$$$$$$$$$$$$$$");

    if (!existingRegister || (existingRegister && Object.keys(existingRegister).length <= 0)) {

      let register = await HtsRegister.create({
        registerNumber: json['Register Number'],
        locationTypeId: locationType.locationTypeId,
        serviceDeliveryPointId: serviceDeliveryPoint.serviceDeliveryPointId,
        closed: 0,
        dateCreated: (new Date()),
        createdBy: user.id,
        uuid: uuid.v4()
      })

      let args = {
        data: {
          registerNumber: parseInt(json['Register Number'], 10),
          locationType: json['Location Type'],
          serviceDeliveryPoint: json['Service Delivery Point'],
          dateCreated: register.dateCreated
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      new client().post(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/register/" + json['Register Number'], args, function (result) {

        res
          .status(200)
          .json({});

      });

    } else {

      return res
        .status(400)
        .json({ error: true, message: "Active register with same number already exists!" });

    }

  })

  router.post('/programs/close_register', async function (req, res, next) {

    const json = (req.body['Close Register']
      ? req.body['Close Register']
      : {});

    let registerNumber = (json['Register Number'].match(/^\d+\s\(/)
      ? json['Register Number'].trim().replace(/\s.+$/, "")
      : json['Register Number'].trim())

    let existingRegister = await HtsRegister.findOne({
      where: {
        registerNumber,
        closed: 0
      }
    });

    debug("$$$$$$$$$$$$$$$$");

    debug(req.body);

    debug(json);

    debug("$$$$$$$$$$$$$$$$");

    if (existingRegister && Object.keys(existingRegister).length > 0) {

      let user = await User.findOne({
        where: {
          username: req.body.user
        }
      });

      let register = await HtsRegister.upsertWithWhere({
        registerId: existingRegister.registerId
      }, {
          closed: 1,
          dateClosed: (new Date()),
          closedBy: user.id
        })

      new client().delete(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/register/" + registerNumber, function (result) {

        res
          .status(200)
          .json({});

      });

    } else {

      res
        .status(200)
        .json({});

    }

  })

  router.get('/programs/fetch_register_stats', async function (req, res, next) {

    let activeRegisters = await HtsRegister.find({
      where: {
        closed: 0
      }
    });

    let closedRegisters = await HtsRegister.find({
      where: {
        closed: 1
      }
    });

    res
      .status(200)
      .json({ active: activeRegisters.length, closed: closedRegisters.length });

  })

  router.get('/programs/fetch_active_registers', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    const args = {
      data: {
        query: {
          query_string: {
            query: (query.q
              ? "registerNumber:" + query.q
              : "") + "*"
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    new client().get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/register/_search", args, function (result) {

      let json = [];

      if (result && result.hits && result.hits.total && result.hits.total > 0 && result.hits.hits) {

        json = result
          .hits
          .hits
          .sort((a, b) => {
            return parseInt(a._id, 10) > parseInt(b._id, 10)
          })
          .map((e) => {
            return `${e._id} (${e._source.locationType} - ${e._source.serviceDeliveryPoint})`
          });

      }

      res
        .status(200)
        .json(json);

    });

  })

  router.get("/programs/fetch_edit_record/:id", function (req, res, next) {

    let args = {
      data: {
        query: {
          match_all: {}
        },
        size: 10000,
        aggs: {
          registerNumber: {
            terms: {
              field: "registerNumber.keyword",
              size: 10000
            },
            aggs: {
              entryCode: {
                terms: {
                  field: "identifier.keyword",
                  size: 1000,
                  order: {
                    _term: "desc"
                  }
                }
              }
            }
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    new client().get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      let output = [];

      let done = false;

      if (result && result.aggregations && result.aggregations.registerNumber) {

        for (let row of result.aggregations.registerNumber.buckets) {

          let i = 0;

          for (let entryCode of row.entryCode.buckets) {

            if (entryCode.key === req.params.id) {

              let searchIds = [entryCode.key];

              if (row.entryCode.buckets[i + 1]) {

                searchIds.push(row.entryCode.buckets[i + 1].key);

              }

              if (result.hits && result.hits.hits && result.hits.hits.length > 0) {

                for (let searchId of searchIds) {

                  let json = {};

                  result
                    .hits
                    .hits
                    .filter(e => {
                      return e._source.identifier === searchId;
                    })
                    .forEach(data => {

                      const row = data._source;

                      if (!json["HTS Provider ID"]) {
                        json["HTS Provider ID"] = row.user;
                      } else if (!json["id"]) {
                        json.id = searchId;
                      }

                      json.dateOfBirth = row.dateOfBirth;

                      fetchAge(json);

                      if (json.age) {

                        json.Age = String(json.age);

                        delete json.age;
                        delete json.dateOfBirth;

                      }

                      if (row.observation.match(/first\spass/i)) {

                        if (!json["HIV Rapid Test Outcomes"]) {
                          json["HIV Rapid Test Outcomes"] = {};
                        }

                        if (!json["HIV Rapid Test Outcomes"]["First Pass"]) {
                          json["HIV Rapid Test Outcomes"]["First Pass"] = {};
                        }

                        if (row.observation.match(/test\s1/i)) {
                          json["HIV Rapid Test Outcomes"]["First Pass"]["Test 1"] = row.observationValue;
                        } else if (row.observation.match(/test\s2/i)) {
                          json["HIV Rapid Test Outcomes"]["First Pass"]["Test 2"] = row.observationValue;
                        }
                      } else if (row.observation.match(/immediate\srepeat/i)) {
                        if (!json["HIV Rapid Test Outcomes"]) {
                          json["HIV Rapid Test Outcomes"] = {};
                        }

                        if (!json["HIV Rapid Test Outcomes"]["Immediate Repeat"]) {
                          json["HIV Rapid Test Outcomes"]["Immediate Repeat"] = {};
                        }

                        if (row.observation.match(/test\s1/i)) {
                          json["HIV Rapid Test Outcomes"]["Immediate Repeat"]["Test 1"] = row.observationValue;
                        } else if (row.observation.match(/test\s2/i)) {
                          json["HIV Rapid Test Outcomes"]["Immediate Repeat"]["Test 2"] = row.observationValue;
                        }

                      } else if (row.observation === "Last HIV Test Result") {

                        json["Last HIV Test"] = row.observationValue;

                      } else if (row.observation === "HTS Family Referral Slips") {

                        json["Number of Items Given:HTS Family Referral Slips"] = row.observationValue;

                      } else if (row.observation === "Number of female condoms given") {

                        json["Number of Items Given:Condoms:Female"] = row.observationValue;

                      } else if (row.observation === "Number of male condoms given") {

                        json["Number of Items Given:Condoms:Male"] = row.observationValue;

                      } else if (row.observation === "Time since last HIV Test") {

                        json["Time Since Last Test"] = row.observationValue;

                      } else {

                        json[row.observation] = row.observationValue;

                      }

                    });

                  output.push(json);

                }

              }

              done = true;

              break;

            }

            i++;

          }

          if (done)
            break;

        }

      }

      res
        .status(200)
        .json(output);

    });

  });

  router.post('/programs/save_edit_data', async function (req, res, next) {

    debug("#######################");

    debug(req.body);

    debug("#######################");

    let json = req.body.full;

    let changes = req.body.changes;

    const entryCode = json.id;

    const activeUser = req.body.activeUser;

    if (!entryCode)
      return res.status(400).json({ error: true, message: "Saving changes failed" });

    if (!activeUser)
      return res.status(400).json({ error: true, message: "Missing username" });

    let user = await User.findOne({
      where: {
        username: activeUser
      }
    });

    let userId = (user
      ? user.id
      : null);

    if (!userId)
      return res.status(400).json({ error: true, message: "Invalid user credentials parsed" });

    let serviceDeliveryPoint,
      clinicId,
      age,
      gender,
      registerNumber,
      encounterType,
      program,
      location,
      dateOfBirth,
      encounterId,
      locationType,
      today,
      patientId,
      locationId;

    if (json["Sex/Pregnancy"]) {

      gender = String(json["Sex/Pregnancy"])
        .substring(0, 1)
        .toUpperCase();

    }

    if (json.Age) {

      decodeAge(json);

      age = ((new Date()) - (new Date(json.birthdate
        ? json.birthdate
        : json["Date of Birth"]
          ? json["Date of Birth"]
          : (new Date())))) / (365.0 * 24.0 * 60.0 * 60.0 * 1000.0);

      dateOfBirth = json.dateOfBirth;

      let patientIdentifier = await Obs.findOne({
        where: {
          valueText: entryCode
        }
      });

      if (patientIdentifier) {

        let person = await Person.findOne({
          where: {
            personId: patientIdentifier.personId
          }
        });

        if (person) {

          patientId = person.personId;

          let result = await Person.upsertWithWhere({
            personId: person.personId
          }, {
              birthdate: json.dateOfBirth,
              birthdate_estimated: (json["Birthdate Estimated?"] === "Yes"
                ? 1
                : 0),
              gender
            })

        }

      }

    } else {

      let patientIdentifier = await Obs.findOne({
        where: {
          valueText: entryCode
        }
      });

      if (patientIdentifier) {

        let person = await Person.findOne({
          where: {
            personId: patientIdentifier.patientId
          }
        });

        if (person) {

          patientId = person.personId;

        }

      }

    }

    let otherMapping = {
      "Number of Items Given:HTS Family Referral Slips": "HTS Family Referral Slips",
      "Last HIV Test": "Last HIV Test Result"
    }

    let args = {
      data: {
        query: {
          query_string: {
            query: `identifier:"${entryCode}"`
          }
        },
        size: 10000
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    new client().get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, async function (result) {

      let bulk = [];

      for (let key of Object.keys(json)) {

        if (result && result.hits && result.hits.hits) {

          if (key === "HIV Rapid Test Outcomes") {

            Object
              .keys(json[key])
              .forEach(e => {

                Object
                  .keys(json[key][e])
                  .forEach(async f => {

                    const conceptName = e + " " + f + " Result";
                    const value = json[key][e][f];

                    let matches = result
                      .hits
                      .hits
                      .filter((e) => {
                        return e._source.observation === conceptName
                      });

                    for (let match of matches) {

                      if (!serviceDeliveryPoint)
                        serviceDeliveryPoint = match._source.serviceDeliveryPoint;

                      let locationName = await Location.findOne({
                        where: {
                          name: match._source.location
                        }
                      });

                      if (!locationId && locationName)
                        locationId = locationName.locationId;

                      if (!clinicId)
                        clinicId = match._source.identifier;

                      if (!age && !json.Age) {

                        age = match._source.age;

                      }

                      if (!gender && !json["Sex/Pregnancy"]) {

                        gender = match._source.gender;

                      }

                      if (!registerNumber)
                        registerNumber = match._source.registerNumber;

                      if (!encounterType)
                        encounterType = match._source.encounterType;

                      if (!program)
                        program = match._source.program;

                      if (!location)
                        location = match._source.location;

                      if (!dateOfBirth)
                        dateOfBirth = match._source.dateOfBirth;

                      if (!encounterId)
                        encounterId = match._source.encounterId;

                      if (!locationType)
                        locationType = match._source.locationType;

                      if (!today)
                        today = match._source.visitDate;

                      let oldObs = await Obs.upsertWithWhere({
                        obsId: match._source.obsId
                      }, {
                          voided: 1,
                          voidedBy: userId,
                          dateVoided: new Date(),
                          voidReason: "Voided by user through update"
                        })

                      let concept = await ConceptName.findOne({
                        where: {
                          name: conceptName
                        }
                      });

                      let conceptId = concept
                        ? concept.conceptId
                        : null;

                      let valueCoded = await ConceptName.findOne({
                        where: {
                          name: value
                        }
                      });

                      let valueCodedId = valueCoded
                        ? valueCoded.conceptId
                        : null;

                      let valueCodedNameId = valueCoded
                        ? valueCoded.conceptNameId
                        : null;

                      if (conceptId && value && String(value).length > 0) {

                        let obs;

                        obs = await Obs.create({
                          personId: patientId,
                          conceptId,
                          encounterId: match._source.encounterId,
                          obsDatetime: new Date(today
                            ? today
                            : (new Date())),
                          locationId,
                          valueCoded: valueCodedId
                            ? valueCodedId
                            : null,
                          valueCodedNameId,
                          valueNumeric: !valueCodedId && String(value)
                            .trim()
                            .match(/^\d+$/)
                            ? value
                            : null,
                          valueText: !valueCodedId && !String(value)
                            .trim()
                            .match(/^\d+$/)
                            ? value
                            : null,
                          creator: userId,
                          dateCreated: new Date(),
                          uuid: uuid.v4()
                        });

                        bulk.push(JSON.stringify({
                          index: {
                            _index: es.index,
                            _type: "visit",
                            _id: match._id
                          }
                        }));

                        bulk.push(JSON.stringify({
                          visitDate: new Date(today),
                          encounterType,
                          identifier: clinicId,
                          observation: conceptName,
                          observationValue: value,
                          program,
                          location,
                          user: activeUser,
                          provider: activeUser,
                          encounterId,
                          dateOfBirth,
                          registerNumber,
                          locationType,
                          serviceDeliveryPoint,
                          age,
                          obsId: obs.obsId
                        }));

                      }

                    }

                  });

              });

          } else {

            let matches = result
              .hits
              .hits
              .filter((e) => {
                return e._source.observation === key || e._source.observation === otherMapping[key]
              });

            if (matches.length > 0) {

              for (let match of matches) {

                if (!serviceDeliveryPoint)
                  serviceDeliveryPoint = match._source.serviceDeliveryPoint;

                if (!clinicId)
                  clinicId = match._source.identifier;

                if (!age && !json.Age) {

                  age = match._source.age;

                }

                if (!gender && !json["Sex/Pregnancy"]) {

                  gender = match._source.gender;

                }

                let locationName = await Location.findOne({
                  where: {
                    name: match._source.location
                  }
                });

                if (!locationId && locationName)
                  locationId = locationName.locationId;

                if (!registerNumber)
                  registerNumber = match._source.registerNumber;

                if (!encounterType)
                  encounterType = match._source.encounterType;

                if (!program)
                  program = match._source.program;

                if (!location)
                  location = match._source.location;

                if (!dateOfBirth)
                  dateOfBirth = match._source.dateOfBirth;

                if (!encounterId)
                  encounterId = match._source.encounterId;

                if (!locationType)
                  locationType = match._source.locationType;

                if (!today)
                  today = match._source.visitDate;

                let concept = await ConceptName.findOne({
                  where: {
                    name: (otherMapping[key]
                      ? otherMapping[key]
                      : key)
                  }
                });

                let conceptId = concept
                  ? concept.conceptId
                  : null;

                let valueCoded = await ConceptName.findOne({
                  where: {
                    name: json[key]
                  }
                });

                let valueCodedId = valueCoded
                  ? valueCoded.conceptId
                  : null;

                let valueCodedNameId = valueCoded
                  ? valueCoded.conceptNameId
                  : null;

                if (conceptId && json[key] && String(json[key]).length > 0) {

                  let obs;

                  obs = await Obs.create({
                    personId: patientId,
                    conceptId,
                    encounterId: match._source.encounterId,
                    obsDatetime: new Date(today
                      ? today
                      : (new Date())),
                    locationId,
                    valueCoded: valueCodedId
                      ? valueCodedId
                      : null,
                    valueCodedNameId,
                    valueNumeric: !valueCodedId && String(json[key])
                      .trim()
                      .match(/^\d+$/)
                      ? json[key]
                      : null,
                    valueText: !valueCodedId && !String(json[key])
                      .trim()
                      .match(/^\d+$/)
                      ? json[key]
                      : null,
                    creator: userId,
                    dateCreated: new Date(),
                    uuid: uuid.v4()
                  });

                  let oldObs = await Obs.upsertWithWhere({
                    obsId: match._source.obsId
                  }, {
                      voided: 1,
                      voidedBy: userId,
                      dateVoided: new Date(),
                      voidReason: "Voided by user through update"
                    })

                  bulk.push(JSON.stringify({
                    index: {
                      _index: es.index,
                      _type: "visit",
                      _id: match._id
                    }
                  }));

                  bulk.push(JSON.stringify({
                    visitDate: new Date(today),
                    encounterType,
                    identifier: clinicId,
                    observation: (otherMapping[key]
                      ? otherMapping[key]
                      : key),
                    observationValue: json[key],
                    program,
                    location,
                    user: activeUser,
                    provider: activeUser,
                    encounterId,
                    dateOfBirth,
                    registerNumber,
                    locationType,
                    serviceDeliveryPoint,
                    age,
                    obsId: obs.obsId
                  }));

                }

              }

            } else if (["Age"].indexOf(key) < 0) {

              try {

                let concept = await ConceptName.findOne({
                  where: {
                    name: (otherMapping[key]
                      ? otherMapping[key]
                      : key)
                  }
                });

                let conceptId = concept
                  ? concept.conceptId
                  : null;

                let valueCoded = await ConceptName.findOne({
                  where: {
                    name: json[key]
                  }
                });

                let valueCodedId = valueCoded
                  ? valueCoded.conceptId
                  : null;

                let valueCodedNameId = valueCoded
                  ? valueCoded.conceptNameId
                  : null;

                if (conceptId && json[key] && String(json[key]).length > 0) {

                  let obs;

                  obs = await Obs.create({
                    personId: patientId,
                    conceptId,
                    encounterId,
                    obsDatetime: new Date(today
                      ? today
                      : (new Date())),
                    locationId,
                    valueCoded: valueCodedId
                      ? valueCodedId
                      : null,
                    valueCodedNameId,
                    valueNumeric: !valueCodedId && String(json[key])
                      .trim()
                      .match(/^\d+$/)
                      ? json[key]
                      : null,
                    valueText: !valueCodedId && !String(json[key])
                      .trim()
                      .match(/^\d+$/)
                      ? json[key]
                      : null,
                    creator: userId,
                    dateCreated: new Date(),
                    uuid: uuid.v4()
                  });

                  bulk.push(JSON.stringify({
                    index: {
                      _index: es.index,
                      _type: "visit"
                    }
                  }));

                  bulk.push(JSON.stringify({
                    visitDate: new Date(today),
                    encounterType,
                    identifier: clinicId,
                    observation: (otherMapping[key]
                      ? otherMapping[key]
                      : key),
                    observationValue: json[key],
                    program,
                    location,
                    user: activeUser,
                    provider: activeUser,
                    encounterId,
                    dateOfBirth,
                    registerNumber,
                    locationType,
                    serviceDeliveryPoint,
                    age,
                    obsId: obs.obsId
                  }));

                }

              } catch (e) {

                console.log(e);

              }

            }

          }

        }

        bulk.push(JSON.stringify({
          delete: {
            _index: es.index,
            _type: "pepfar",
            _id: entryCode
          }
        }));

        if (["New Negative", "New Positive"].indexOf(json["Result Given to Client"]) >= 0) {

          bulk.push(JSON.stringify({
            index: {
              _index: es.index,
              _type: "pepfar",
              _id: entryCode
            }
          }));

          bulk.push(JSON.stringify({
            htsAccessType: json["HTS Access Type"],
            resultGiven: String(json["Result Given to Client"])
              .replace(/new/i, "")
              .trim(),
            gender,
            serviceDeliveryPoint,
            month: monthNames[(new Date(today)).getMonth()],
            year: (new Date(today)).getFullYear(),
            age,
            visitDate: (new Date(today)),
            entryCode: clinicId
          }));

        }

      }

      var bulkArgs = {
        data: bulk.join("\n") + "\n",
        headers: {
          "Content-Type": "application/x-ndjson"
        }
      };

      new client().post(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/_bulk", bulkArgs, async function (result) {

        res
          .status(200)
          .json(json);

      })

    });

  });

  router.get('/test_gen', function (req, res, next) {

    generateEntryCode(25, "XP6F", "Unknown", "EC");

    res
      .status(200)
      .json({});

  });

  router.get('/set_location/:location/:token', function (req, res, next) {

    debug(req.params.location);

    debug(req.params.token);

    validActiveToken(req.params.token).then((userId) => {

      debug(userId);

      Location.findOne({
        where: {
          name: decodeURIComponent(req.params.location)
        }
      }, (err, result) => {

        if (err || !result) {

          debug(err);

          res
            .status(400)
            .json({ message: "Location not found!" });

        } else {

          debug(result);

          res.cookie('location', decodeURIComponent(result.name));

          res
            .status(200)
            .json({ location: result.name });

        }

      })

    }).catch((e) => {

      console.log(e);

      res
        .status(401)
        .json({ message: "Invalid session!" });

    })

  })

  router.get('/programs/list_service_delivery_points', function (req, res, next) {

    res
      .status(200)
      .json([]);

  })

  router.post('/programs/update_partner_record', async function (req, res, next) {

    debug(req.body);

    const patient = await PatientIdentifier.findOne({
      where: {
        identifier: req.body.clientId
      }
    });

    const personId = (patient ? patient.patientId : null);

    const concept = await ConceptName.findOne({
      where: {
        name: req.body.concept
      }
    });

    const conceptId = (concept ? concept.conceptId : null);

    const user = await User.findOne({
      where: {
        username: req.body.currentUser
      }
    });

    const userId = user
      ? user.id
      : 1;

    const obs = await Obs.findOne({
      where: {
        conceptId,
        obsDatetime: {
          gt: (new Date((new Date(req.body.visitDate)).setDate((new Date(req.body.visitDate)).getDate() - 1))),
          lt: (new Date((new Date(req.body.visitDate)).setDate((new Date(req.body.visitDate)).getDate() + 1)))
        },
        personId,
        voided: 0
      }
    })

    if (obs) {

      const value = String(req.body.value).trim();

      const valueCoded = await ConceptName.findOne({
        where: {
          name: req.body.value
        }
      });
  
      const valueCodedId = (valueCoded ? valueCoded.conceptId : null);
  
      const valueCodedNameId = (valueCoded ? valueCoded.conceptNameId : null);
  
      const result = await Obs.updateAll({
        obsId: obs.obsId
      }, {
          voided: 1,
          voidedBy: userId,
          dateVoided: new Date(),
          voidReason: "Voided by user"
        });


      await Obs.create({
        personId,
        conceptId,
        encounterId: obs.encounterId,
        obsDatetime: new Date(req.body.visitDate),
        locationId: obs.locationId,
        valueCoded: valueCodedId,
        valueCodedNameId,
        valueNumeric: !valueCodedId && String(value)
          .trim()
          .match(/^\d+$/)
          ? value
          : null,
        valueText: !valueCodedId && !String(value)
          .trim()
          .match(/^\d+$/)
          ? value
          : null,
        creator: userId,
        dateCreated: new Date(),
        uuid: uuid.v4()
      });

      const encounter = await Encounter.findOne({
        where: {
          encounterId: obs.encounterId
        }
      });

      const encounterType = (encounter ? (await EncounterType.findOne({
        where: {
          encounterTypeId: encounter.encounterTypeId
        }
      })) : null);

      const entryCodeConcept = await ConceptName.findOne({
        where: {
          name: "HTS Entry Code"
        }
      });

      const entryCodeConceptId = (entryCodeConcept ? entryCodeConcept.conceptId : null);

      const clinicIdentifier = (entryCodeConceptId ? (await Obs.findOne({
        where: {
          conceptId: entryCodeConceptId,
          personId,
          obsDatetime: {
            gt: (new Date((new Date(obs.obsDatetime)).setDate((new Date(obs.obsDatetime)).getDate() - 1))),
            lt: (new Date((new Date(obs.obsDatetime)).setDate((new Date(obs.obsDatetime)).getDate() + 1)))
          }
        }
      })) : null);

      const clinicId = (clinicIdentifier ? clinicIdentifier.valueText : null);

      debug(clinicId);

      const registerConcept = await ConceptName.findOne({
        where: {
          name: "Register Number (from cover)"
        }
      });

      const registerConceptId = (registerConcept ? registerConcept.conceptId : null);

      const registerObs = (registerConceptId ? (await Obs.findOne({
        where: {
          conceptId: registerConceptId,
          personId,
          obsDatetime: {
            gt: (new Date((new Date(obs.obsDatetime)).setDate((new Date(obs.obsDatetime)).getDate() - 1))),
            lt: (new Date((new Date(obs.obsDatetime)).setDate((new Date(obs.obsDatetime)).getDate() + 1)))
          }
        }
      })) : null);

      const registerNumber = (registerObs ? registerObs.valueText : null);

      debug(registerNumber);

      new client().get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", {
        query: {
          query_string: {
            query: "encounterId:" + obs.encounterId + " AND obsId:" + obs.obsId
          }
        }
      }, async function (result) {

        if (result && result.hits && result.hits.total && result.hits.total > 0) {

          new client().delete(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/" + result.hits.hits[0]._id, function (result) {

            debug(result);

          });

        }

        const providerId = await Users.findOne({
          where: {
            userId: encounter.providerId
          }
        });

        const provider = (providerId ? providerId.username : null);

        debug(provider);

        const locationName = await Location.findOne({
          where: {
            locationId: obs.locationId
          }
        });

        const location = (locationName ? locationName.name : null);

        const locationType = "";

        const serviceDeliveryPoint = "";

        const person = await Person.findOne({
          where: {
            personId
          }
        });

        debug(person);

        const age = (person ? ((new Date(person.birthdate)) / (365.0 * 24.0 * 60.0 * 60.0 * 1000.0)) : null);

        const patientProgram = await PatientProgram.findOne({
          where: {
            patientProgramId: encounter.patientProgramId
          }
        });

        const program = (patientProgram ? (await Program.findOne({
          where: {
            programId: patientProgram.programId
          }
        })) : null);

        const programName = (program ? program.name : "");

        let row = {
          visitDate: new Date(req.body.visitDate),
          encounterType: (encounterType ? encounterType.name : null),
          identifier: clinicId,
          observation: req.body.concept,
          observationValue: req.body.value,
          program: programName.toUpperCase() + " PROGRAM",
          location,
          provider,
          user: req.body.currentUser,
          encounterId: obs.encounterId,
          dateOfBirth: person.birthdate,
          registerNumber,
          locationType,
          serviceDeliveryPoint,
          age,
          obsId: obs.obsId
        };

        let args = {
          data: row,
          headers: {
            "Content-Type": "application/json"
          }
        };

        new client().post(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit", args, function (result) {

          res.status(200).json({});

        });

      });

    } else {

      res.status(200).json({});

    }

  })

  app.use(router);

};
