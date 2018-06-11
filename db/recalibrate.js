#!/usr/bin/env node

const connection = require("../configs/database.json");
const es = require("../configs/elasticsearch.json");

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

const recalibrate = async () => {

    let commands = [
        {
            message: "Resetting Elasticsearch ...",
            cmd: "curl -H \"Content-Type: application/json\" -X DELETE \"" + es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "\" -s"
        },
        {
            message: "Initializing Elasticsearch index ...",
            cmd: "curl -H \"Content-Type: application/json\" -X PUT -d @es-mapping.json \"" + es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "\" -s"
        },
        {
            message: "Loading registers ...",
            cmd: 'MYSQL_PWD=' + password + ' mysql -u ' + user + ' ' + database + ' -e "SELECT register_id AS _id, register_number AS registerNumber, hts_register_location_type.name AS locationType, hts_register_service_delivery_point.name AS serviceDeliveryPoint, DATE_FORMAT(date_created, \'%Y-%m-%d\') AS dateCreated FROM hts_register LEFT OUTER JOIN hts_register_location_type ON hts_register_location_type.location_type_id = hts_register.location_type_id LEFT OUTER JOIN hts_register_service_delivery_point ON hts_register_service_delivery_point.service_delivery_point_id = hts_register.service_delivery_point_id" | ./mapData.js --type register | curl -H "Content-Type: application/x-ndjson" -X POST --data-binary @- "' + es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + '/_bulk" -s'
        },
        {
            message: "Loading obs data ...",
            cmd: 'MYSQL_PWD=' + password + ' mysql -u ' + user + ' ' + database + ' -e "SELECT DATE_FORMAT(encounter_datetime, \'%Y-%m-%d\') AS visitDate, encounter_type.name AS encounterType, concept_name.name AS observation, CASE WHEN COALESCE(obs.value_coded_name_id, \'\') != \'\' THEN (SELECT name FROM concept_name WHERE concept_name_id = obs.value_coded_name_id LIMIT 1) WHEN COALESCE(obs.value_datetime, \'\') != \'\' THEN DATE_FORMAT(obs.value_datetime, \'%Y-%m-%d\') WHEN COALESCE(obs.value_numeric, \'\') != \'\' THEN CONCAT(obs.value_numeric, CASE WHEN COALESCE(obs.value_modifier, \'\') != \'\' THEN obs.value_modifier ELSE \'\' END)  ELSE obs.value_text END AS observationValue, \'HTS PROGRAM\' AS program, location.name AS location, u.username AS provider, users.username AS user, encounter.encounter_id AS encounterId, person.birthdate AS dateOfBirth, hts_register.register_number AS registerNumber, hts_register_location_type.name AS locationType, hts_register_service_delivery_point.name AS serviceDeliveryPoint, DATEDIFF(CURRENT_DATE, person.birthdate) / 365.0 AS age, obs.obs_id AS obsId, obs.obs_id AS _id FROM encounter LEFT OUTER JOIN patient_program ON patient_program.patient_program_id = encounter.patient_program_id LEFT OUTER JOIN program ON program.program_id = patient_program.program_id LEFT OUTER JOIN encounter_type ON encounter_type.encounter_type_id = encounter.encounter_type LEFT OUTER JOIN obs ON obs.encounter_id = encounter.encounter_id LEFT OUTER JOIN concept ON concept.concept_id = obs.concept_id LEFT OUTER JOIN concept_name ON concept_name.concept_id = concept.concept_id LEFT OUTER JOIN location ON location.location_id = encounter.location_id LEFT OUTER JOIN users ON users.user_id = encounter.creator LEFT OUTER JOIN users u ON u.person_id = encounter.provider_id LEFT OUTER JOIN person ON person.person_id = obs.person_id LEFT OUTER JOIN hts_register_encounter_mapping ON hts_register_encounter_mapping.encounter_id = encounter.encounter_id LEFT OUTER JOIN hts_register ON hts_register.register_id = hts_register_encounter_mapping.register_id LEFT OUTER JOIN hts_register_location_type ON hts_register_location_type.location_type_id = hts_register.location_type_id LEFT OUTER JOIN hts_register_service_delivery_point ON hts_register_service_delivery_point.service_delivery_point_id = hts_register.service_delivery_point_id WHERE program.name = \'HTS PROGRAM\';" | ./mapData.js --type patient | curl -H "Content-Type: application/x-ndjson" -X POST --data-binary @- "' + es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + '/_bulk" -s'
        }
    ];

    for (let cmd of commands) {

        console.log(cmd.message);

        await runCmd(cmd.cmd).catch(e => { console.log(e) });

    }

}

recalibrate();