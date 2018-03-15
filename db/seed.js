#!/usr/bin/env node

const seed = require("./seed.json");
const uuid = require("node-uuid");
const connection = require("../configs/database.json");
const es = require("../configs/elasticsearch.json");
const locations = require("../client-src/src/config/pepfarLocations.json");
const fs = require("fs");
const glob = require("glob");

let currentError,
  currentSuccess;

String.prototype.toUnderScore = function () {
  return this.replace(/^[A-Z]/, ($1) => {
    return $1.toLowerCase()
  }).replace(/[A-Z]/g, ($1) => {
    return '_' + $1.toLowerCase()
  });
};

const debug = (msg) => {

  if (String(process.env.DEBUG_APP) === 'true') {
    console.log(msg);
  }

}

const runCmd = (cmd) => {

  return new Promise((resolve, reject) => {

    const exec = require('child_process').exec;

    try {

      exec(cmd, function (error, stdout, stderr) {

        if (stderr) {

          console.log(stdout);

          console.log(stderr);

          reject(stderr);

        } else {

          debug(stdout);

          resolve(stdout);

        }

      })

    } catch (e) {

      currentError = e;

      reject(e);

    }

  })

}

const env = (process.env.NODE_ENV
  ? process.env.NODE_ENV
  : "development");
const host = connection[env].host;
const user = connection[env].user;
const password = connection[env].password;
const database = connection[env].database;

const loadDataType = async (dataType, data) => {

  for (let e of data) {

    let result;

    debug("export MYSQL_PWD=" + password + " && mysql -h " + host + " -u " + user + " " + database + " -e 'SELECT * FROM " + dataType + " WHERE name = \"" + e[0] + "\" LIMIT 1'");

    result = await runCmd("export MYSQL_PWD=" + password + " && mysql -h " + host + " -u " + user + " " + database + " -e 'SELECT * FROM " + dataType + " WHERE name = \"" + e[0] + "\" LIMIT 1'").catch(e => { console.log(e) });

    debug(result);

    if (result.length <= 0) {

      debug("export MYSQL_PWD=" + password + " && mysql -h " + host + " -u " + user + " " + database + " -e 'INSERT INTO " + dataType + " (name, description, creator, date_created, uuid) VALUES (\"" + e[0] + "\", \"" + e[1] + "\", (SELECT user_id FROM users LIMIT 1), NOW(), (SELECT UUID()))'");

      result = await runCmd("export MYSQL_PWD=" + password + " && mysql -h " + host + " -u " + user + " " + database + " -e 'INSERT INTO " + dataType + " (name, description, creator, date_created, uuid) VALUES (\"" + e[0] + "\", \"" + e[1] + "\", (SELECT user_id FROM users LIMIT 1), NOW(), (SELECT UUID()))'").catch(e => { console.log(e) });

      console.log("Added " + dataType + ":" + e[0]);

    }

  }

}

const loadConceptNames = async (data) => {

  for (let e of data) {

    let result;
    
    debug("export MYSQL_PWD=" + password + " && mysql -h " + host + " -u " + user + " " + database + " -e 'SELECT * FROM concept_name WHERE name = \"" + e + "\" LIMIT 1'");

    result = await runCmd("export MYSQL_PWD=" + password + " && mysql -h " + host + " -u " + user + " " + database + " -e 'SELECT * FROM concept_name WHERE name = \"" + e + "\" LIMIT 1'").catch(e => { console.log(e) });

    debug(result);

    if (result.length <= 0) {

      let conceptId = await runCmd("export MYSQL_PWD=" + password + " && mysql -h " + host + " -u " + user + " " + database + " -e 'INSERT INTO concept (retired, datatype_id, class_id, creator, date_created," +
        " uuid) VALUES (0, 4, 11, 1, NOW(), (SELECT UUID())); SELECT @id := LAST_INSERT_I" +
        "D(); INSERT INTO concept_name (concept_id, name, locale, creator, date_created, " +
        "voided, uuid, concept_name_type) VALUES (@id, \"" + e + "\", \"en\", (SELECT user_id FROM users LIMIT 1), NOW(), 0, (SELECT UUID()), \"FU" +
        "LLY_SPECIFIED\")'").catch(e => { console.log(e) });

      console.log("Added concept:" + e);

    }

  }

}

const loadProgramNames = async (data) => {

  for (let e of data) {

    let result;

    debug("export MYSQL_PWD=" + password + " && mysql -h " + host + " -u " + user + " " + database + " -e 'SELECT * FROM program WHERE name = \"" + e + "\" LIMIT 1'");

    result = await runCmd("export MYSQL_PWD=" + password + " && mysql -h " + host + " -u " + user + " " + database + " -e 'SELECT * FROM program WHERE name = \"" + e + "\" LIMIT 1'").catch(e => { console.log(e) });

    debug(result);

    if (result.length <= 0) {

      result = await runCmd("export MYSQL_PWD=" + password + " && mysql -h " + host + " -u " + user + " " + database + " -e 'SELECT * FROM concept_name WHERE name = \"" + e + "\" LIMIT 1'").catch(e => { console.log(e) });

      if (result.length <= 0) {

        let conceptId = await runCmd("export MYSQL_PWD=" + password + " && mysql -h " + host + " -u " + user + " " + database + " -e 'INSERT INTO concept (retired, datatype_id, class_id, creator, date_created," +
          " uuid) VALUES (0, 4, 11, 1, NOW(), (SELECT UUID())); SELECT @concept_id := LAST_" +
          "INSERT_ID(); INSERT INTO concept_name (concept_id, name, locale, creator, date_c" +
          "reated, voided, uuid, concept_name_type) VALUES (@concept_id, \"" + e + "\", \"en\", (SELECT user_id FROM users LIMIT 1), NOW(), 0, (SELECT UUID()), \"FU" +
          "LLY_SPECIFIED\"); INSERT INTO program (concept_id, creator, date_created, retire" +
          "d, name, uuid) VALUES (@concept_id, (SELECT user_id FROM users LIMIT 1), NOW(), " +
          "0, \"" + e + "\", (SELECT UUID()))'").catch(e => { console.log(e) });

        console.log("Added program:" + e);

      }

    }

  }

}

const loadDataTypes = async () => {

  for (let dataType of ["encounter_type",
    "patient_identifier_type",
    "person_attribute_type"]) {

    await loadDataType(dataType, seed[dataType + "s"]);

  }

}

const loadSeedData = async () => {

  let commands = [
    {
      message: "Cleaning up cached data",
      cmd: "rm ../data/*"
    },
    {
      message: "Dropping '" + connection[env].database + "' database...",
      cmd: "mysql -h " + connection[env].host + " -u " + connection[env].user + " -p" + connection[env].password + " -e 'DROP SCHEMA IF EXISTS " + connection[env].database + "'"
    }, {
      message: "Creating '" + connection[env].database + "' database...",
      cmd: "mysql -h " + connection[env].host + " -u " + connection[env].user + " -p" + connection[env].password + " -e 'CREATE SCHEMA " + connection[env].database + "'"
    }, {
      message: "Loading '" + connection[env].database + "' Metadata...",
      cmd: "mysql -h " + connection[env].host + " -u " + connection[env].user + " -p" + connection[env].password + " " + connection[env].database + " < openmrs_1_7_2_concept_server_full_db.sql"
    }, {
      message: "Loading 'HTS Roles' seed data...",
      cmd: "mysql -h " + connection[env].host + " -u " + connection[env].user + " -p" + connection[env].password + " " + connection[env].database + " < htc.roles.sql"
    }, {
      message: "Loading 'HTS Locations' seed data...",
      cmd: "mysql -h " + connection[env].host + " -u " + connection[env].user + " -p" + connection[env].password + " " + connection[env].database + " < locations.sql"
    }, {
      message: "Loading 'Nationalities' seed data...",
      cmd: "mysql -h " + connection[env].host + " -u " + connection[env].user + " -p" + connection[env].password + " " + connection[env].database + " < nationalities.sql"
    }, {
      message: "Loading 'HTS Register' tables and data...",
      cmd: "mysql -h " + connection[env].host + " -u " + connection[env].user + " -p" + connection[env].password + " " + connection[env].database + " < hts_registers.sql"
    }, {
      message: "Initializing user admin...",
      cmd: "mysql -h " + connection[env].host + " -u " + connection[env].user + " -p" + connection[env].password + " " + connection[env].database + " -e 'DELETE FROM person_attribute WHERE person_id = 1; INSERT INTO person_attrib" +
        "ute (person_id, value, person_attribute_type_id, creator, date_created, uuid) VA" +
        "LUES((SELECT person_id FROM person LIMIT 1), \"HTS-0001\", (SELECT person_attrib" +
        "ute_type_id FROM person_attribute_type WHERE name = \"HTS Provider ID\" LIMIT 1)" +
        ", (SELECT user_id FROM users LIMIT 1), NOW(), \"" + uuid.v1() + "\")'"
    }, {
      message: "Resetting Elasticsearch ...",
      cmd: "curl -H \"Content-Type: application/json\" -X DELETE \"" + es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "\""
    }, {
      message: "Initializing Elasticsearch index ...",
      cmd: "curl -H \"Content-Type: application/json\" -X PUT -d @es-mapping.json \"" + es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "\""
    }, {
      message: "Cleaning data folder ...",
      cmd: "rm -rf ../data/*"
    }, {
      message: "Initializing Loopback tables ...",
      cmd: "cd ../ && node server/create-lb-tables"
    }
  ];

  if (locations) {

    [...new Set(Array.prototype.concat.apply([], Object.keys(locations).map((e) => {
      return locations[e]
    })))]
      .sort()
      .forEach((e) => {
        commands.push({
          message: "Adding location " + e,
          cmd: "mysql -h " + connection[env].host + " -u " + connection[env].user + " -p" + connection[env].password + " " + connection[env].database + " -e 'INSERT INTO hts_register_service_delivery_point (name) VALUES (\"" + e + "\")'"
        })
      });

  }

  if (!fs.existsSync("../server/datasources.json")) {

    const json = JSON.parse(fs.readFileSync("../server/datasources.json.example").toString("utf8"));

    fs.writeFileSync("../server/datasources.json", JSON.stringify(json, null, 2));

  }

  if (fs.existsSync("../server/datasources.json")) {

    let datasources = JSON.parse(fs.readFileSync("../server/datasources.json").toString("utf8"));

    if (datasources.hts) {

      datasources.hts.host = connection[env].host;
      datasources.hts.database = connection[env].database;
      datasources.hts.password = connection[env].password;
      datasources.hts.user = connection[env].user;
      datasources.hts.url = "mysql://" + connection[env].user + ":" + connection[env].password + "@" + connection[env].host + "/" + connection[env].database;

      fs.writeFileSync("../server/datasources.json", JSON.stringify(datasources, null, 2));

    }

  }

  const files = glob.sync("../common/models/*.json");

  for (let file of files) {

    let json = JSON.parse(fs.readFileSync(file).toString("utf8"));

    if (json.settings && json.settings.mysql) {

      console.log("Modifying %s", file);

      json.settings.mysql.schema = connection[env].database;

      let name = String(json.name);

      json.name = name.toUnderScore();

      let primaryId = file
        .replace(/^[^A-Z]+|\.json/g, "")
        .replace(/^[A-Z]/, ($1) => {
          return $1.toLowerCase()
        }) + "Id";

      let otherPrimaries = {
        users: "userId",
        hts_register: "registerId",
        hts_register_encounter_mapping: "registerEncounterMappingId",
        hts_register_location_type: "locationTypeId",
        hts_register_service_delivery_point: "serviceDeliveryPointId",
        person: [
          "dead", "voided"
        ],
        patient: ["voided"],
        patient_identifier: [
          "preferred", "voided"
        ],
        patient_program: ["voided"],
        encounter: ["voided"],
        obs: ["voided"],
        active_list: ["voided"],
        cohort: ["voided"],
        concept_name: ["voided"],
        concept_name_tag: ["voided"],
        orders: ["voided"],
        patient_state: ["voided"],
        person_address: [
          "voided", "preferred"
        ],
        person_attribute: ["voided"],
        person_name: [
          "voided", "preferred"
        ],
        relationship: ["voided"],
        report_object: ["voided"]
      }

      if (json.properties && json.properties[primaryId]) {

        json.properties[primaryId].required = false;

      }

      if (json.properties && otherPrimaries[json.name]) {

        if (Array.isArray(otherPrimaries[json.name])) {

          otherPrimaries[json.name].forEach(field => {

            if (json.properties[field]) {

              json.properties[field].required = false;

            }

          })

        } else {

          json.properties[otherPrimaries[json.name]].required = false;

        }

      }

      let modelConfig = JSON.parse(fs.readFileSync('../server/model-config.json').toString("utf8"));

      fs.writeFileSync(file, JSON.stringify(json, null, 2));

      if (modelConfig && modelConfig[name]) {

        let tmp = Object.assign({}, modelConfig[name]);

        delete modelConfig[name];

        modelConfig[name.toUnderScore()] = Object.assign({}, tmp);

        fs.writeFileSync('../server/model-config.json', JSON.stringify(modelConfig, null, 2));

      }

    }

  }

  for (let cmd of commands) {

    console.log(cmd.message);

    await runCmd(cmd.cmd).catch(e => { console.log(e) });

  }

  await loadDataTypes();

  await loadConceptNames(seed.concepts)

  await loadProgramNames(seed.programs)

  console.log("Done!");

}

loadSeedData();
