#!/usr/bin/env node

const connection = require("../configs/database.json");
const es = require("../configs/elasticsearch.json");
const pepfarSynthesis = require(__dirname + "/../lib/pepfarSynthesis.js");
const htsIndicatorsMapping = require(__dirname + "/../configs/htsIndicatorsMapping.json");
const fs = require('fs');
const glob = require('glob');
const client = require("node-rest-client").Client;
const async = require('async');

String.prototype.toUnderScore = function () {
    return this.replace(/^[A-Z]/, ($1) => {
        return $1.toLowerCase()
    }).replace(/[A-Z]/g, ($1) => {
        return '_' + $1.toLowerCase()
    });
};

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

const loadPepfarData = async () => {

    console.log("Loading Pepfar data ...");

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

    if (fs.existsSync(__dirname + '/dumps')) {

        glob(__dirname + '/dumps/*.json', (err, files) => {

            let j = 0;

            files.forEach(file => {

                j++;

                process.stdout.write("Loading Pepfar data " + (j / files.length) + "% ...\r");

                let htsSetting = "";
                let htsModality = "";

                const raw = JSON.parse(fs.readFileSync(file, 'utf-8'))

                let accessType = null;

                let partnerHIVStatus = null;

                let resultGiven = null;

                let locationType = null;

                let serviceDeliveryPoint = null;

                let age = null;

                let gender = null;

                let today = null;

                let clinicId = null;

                for (let i = 0; i < raw.length; i++) {

                    const row = raw[i];

                    if (accessType !== null && partnerHIVStatus !== null && resultGiven !== null && locationType !== null && serviceDeliveryPoint !== null && age !== null && gender !== null && today !== null && clinicId !== null)
                        break;

                    switch (row.observation) {

                        case 'HTS Access Type':

                            accessType = row.observationValue;

                            break;

                        case 'Partner HIV Status':

                            partnerHIVStatus = row.observationValue;

                            break;

                        case 'Result Given to Client':

                            resultGiven = row.observationValue;

                            break;

                        case 'Sex/Pregnancy':

                            gender = row.observationValue
                                ? String(row.observationValue)
                                    .trim()
                                    .substring(0, 1)
                                    .toUpperCase()
                                : null;

                            break;

                        default:

                            locationType = row.locationType;

                            serviceDeliveryPoint = row.serviceDeliveryPoint;

                            age = row.age;

                            today = row.visitDate;

                            clinicId = row.identifier;

                            break;

                    }

                }

                const result = pepfarSynthesis.ps.classifyLocation(
                    htsIndicatorsMapping, locationType, serviceDeliveryPoint,
                    accessType, partnerHIVStatus, age
                );

                htsSetting = result.htsSetting;
                htsModality = result.htsModality;

                let args = {
                    data: {
                        htsAccessType: htsAccessTypeMappings[accessType],
                        resultGiven: String(resultGiven)
                            .replace(/new/i, "")
                            .trim(),
                        gender,
                        serviceDeliveryPoint,
                        month: monthNames[(new Date(today)).getMonth()],
                        year: (new Date(today)).getFullYear(),
                        age,
                        visitDate: (new Date(today)).format("YYYY-mm-dd"),
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

            })

        })

    }

}

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
            cmd: 'MYSQL_PWD=' + password + ' mysql -u ' + user + ' ' + database + ' -e "SELECT DATE_FORMAT(encounter_datetime, \'%Y-%m-%d\') AS visitDate, encounter_type.name AS encounterType, concept_name.name AS observation, CASE WHEN COALESCE(obs.value_coded_name_id, \'\') != \'\' THEN (SELECT name FROM concept_name WHERE concept_name_id = obs.value_coded_name_id LIMIT 1) WHEN COALESCE(obs.value_datetime, \'\') != \'\' THEN DATE_FORMAT(obs.value_datetime, \'%Y-%m-%d\') WHEN COALESCE(obs.value_numeric, \'\') != \'\' THEN CONCAT(obs.value_numeric, CASE WHEN COALESCE(obs.value_modifier, \'\') != \'\' THEN obs.value_modifier ELSE \'\' END)  ELSE obs.value_text END AS observationValue, \'HTS PROGRAM\' AS program, location.name AS location, u.username AS provider, users.username AS user, encounter.encounter_id AS encounterId, person.birthdate AS dateOfBirth, hts_register.register_number AS registerNumber, hts_register_location_type.name AS locationType, hts_register_service_delivery_point.name AS serviceDeliveryPoint, DATEDIFF(CURRENT_DATE, person.birthdate) / 365.0 AS age, obs.obs_id AS obsId, obs.obs_id AS _id FROM encounter LEFT OUTER JOIN patient_program ON patient_program.patient_program_id = encounter.patient_program_id LEFT OUTER JOIN program ON program.program_id = patient_program.program_id LEFT OUTER JOIN encounter_type ON encounter_type.encounter_type_id = encounter.encounter_type LEFT OUTER JOIN obs ON obs.encounter_id = encounter.encounter_id LEFT OUTER JOIN concept ON concept.concept_id = obs.concept_id LEFT OUTER JOIN concept_name ON concept_name.concept_id = concept.concept_id LEFT OUTER JOIN location ON location.location_id = encounter.location_id LEFT OUTER JOIN users ON users.user_id = encounter.creator LEFT OUTER JOIN users u ON u.person_id = encounter.provider_id LEFT OUTER JOIN person ON person.person_id = obs.person_id LEFT OUTER JOIN hts_register_encounter_mapping ON hts_register_encounter_mapping.encounter_id = encounter.encounter_id LEFT OUTER JOIN hts_register ON hts_register.register_id = hts_register_encounter_mapping.register_id LEFT OUTER JOIN hts_register_location_type ON hts_register_location_type.location_type_id = hts_register.location_type_id LEFT OUTER JOIN hts_register_service_delivery_point ON hts_register_service_delivery_point.service_delivery_point_id = hts_register.service_delivery_point_id WHERE program.name = \'HTS PROGRAM\';" | ./mapData.js --type visit | curl -H "Content-Type: application/x-ndjson" -X POST --data-binary @- "' + es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + '/_bulk" -s'
        }
    ];

    for (let cmd of commands) {

        console.log(cmd.message);

        await runCmd(cmd.cmd).catch(e => { console.log(e) });

    }

    loadPepfarData();

}

async.series([

    function (cb) {

        if (!fs.existsSync(__dirname + '/dumps')) {

            fs.mkdirSync(__dirname + '/dumps');

            cb();

        } else {

            glob(__dirname + '/dumps/*.json', (err, files) => {

                async.mapSeries(files, (file, iCb) => {

                    console.log('Deleting file %s ...', file);

                    fs.unlink(file, err => {
                        if (err) throw err;

                        iCb();

                    });

                }, (err) => {

                    if (err)
                        throw err;

                    cb();

                })

            })

        }

    }

], (err) => {

    if (err)
        throw err;

    recalibrate();

});
