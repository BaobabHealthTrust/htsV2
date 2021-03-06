#!/usr/bin/env node

const fs = require('fs');
const connection = require("../configs/database.json");
const villages = require(fs.existsSync("../configs/villages.json") ? "../configs/villages.json" : "../configs/database.json");
const es = require("../configs/elasticsearch.json");
const pepfarSynthesis = require(__dirname + "/../lib/pepfarSynthesis.js");
const htsIndicatorsMapping = require(__dirname + "/../configs/htsIndicatorsMapping.json");
const glob = require('glob');
const client = require("node-rest-client").Client;
const async = require('async');
const seed = require("./seed.json");
const os = require('os')

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

function runCommandAsync (cmd) {
    const A_TENTH_OF_SYSTEM_MEMORY = os.totalmem() / 10
    const exec = require('util').promisify(require('child_process').exec)
    return exec(cmd, { maxBuffer: A_TENTH_OF_SYSTEM_MEMORY })
}

const env = (process.env.NODE_ENV
    ? process.env.NODE_ENV
    : "development");
const host = connection[env].host;
const user = connection[env].user;
const password = connection[env].password;
const database = connection[env].database;

const villageHost = villages[env].host;
const villageUser = villages[env].user;
const villagePassword = villages[env].password;
const villageDatabase = villages[env].database;
const villagePort = villages[env].port;

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

            // files.forEach(file => {

            async.mapSeries(files, (file, cb) => {

                j++;

                process.stdout.write("Loading Pepfar data " + (100 * (j / files.length)).toFixed(1) + "% ...\r");

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

                let referrer = null;

                for (let i = 0; i < raw.length; i++) {

                    const row = raw[i];

                    if (accessType !== null && partnerHIVStatus !== null && resultGiven !== null && locationType !== null && serviceDeliveryPoint !== null && age !== null && gender !== null && today !== null && clinicId !== null)
                        break;

                    switch (row.observation) {

                        case 'HTS Access Type':

                            accessType = htsAccessTypeMappings[String(row.observationValue).trim()];

                            break;

                        case 'Partner HIV Status':

                            partnerHIVStatus = row.observationValue;

                            break;

                        case 'Result Given to Client':

                            resultGiven = row.observationValue;

                            break;

                        case 'Who referred slip':

                            referrer = row.observationValue;

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
                    accessType, partnerHIVStatus, age, referrer, gender
                );

                debug(result);

                htsSetting = result.htsSetting;
                htsModality = result.htsModality;

                let args = {
                    data: {
                        htsAccessType: accessType,
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

                new client().post(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/pepfar/" + clinicId, args, function (result) {

                    fs.writeFileSync(file.replace(/dumps/, 'logs'), JSON.stringify(result));

                    cb();

                })

            })

        })

    }

}

const loadConceptNames = async (data) => {

    let result;

    result = await runCmd("export MYSQL_PWD=" + password + " && mysql -h " + host + " -u " + user + " " + database + " -e 'SELECT concept_name_tag_id FROM concept_name_tag WHERE tag = \"preferred_hts\"'");

    debug(result);

    if (result.length <= 0) {

        result = await runCmd("export MYSQL_PWD=" + password + " && mysql -h " + host + " -u " + user + " " + database + " -e 'INSERT INTO concept_name_tag (tag, description, creator, date_created, uuid) VALUES (\"preferred_hts\", \"HTS concept names tag\", 1, NOW(), (SELECT UUID()))'").catch(e => { console.log(e) });

    }

    for (let e of data) {

        debug("export MYSQL_PWD=" + password + " && mysql -h " + host + " -u " + user + " " + database + " -e 'SELECT concept_name_id FROM concept_name WHERE name = \"" + e + "\" LIMIT 1'");

        result = await runCmd("export MYSQL_PWD=" + password + " && mysql -h " + host + " -u " + user + " " + database + " -e 'SELECT concept_name_id FROM concept_name WHERE name = \"" + e + "\" LIMIT 1'").catch(e => { console.log(e) });

        debug(result);

        if (result.length <= 0) {

            let conceptId = await runCmd("export MYSQL_PWD=" + password + " && mysql -h " + host + " -u " + user + " " + database + " -e 'INSERT INTO concept (retired, datatype_id, class_id, creator, date_created," +
                " uuid) VALUES (0, 4, 11, 1, NOW(), (SELECT UUID())); SELECT @id := LAST_INSERT_I" +
                "D(); INSERT INTO concept_name (concept_id, name, locale, creator, date_created, " +
                "voided, uuid, concept_name_type) VALUES (@id, \"" + e + "\", \"en\", (SELECT user_id FROM users LIMIT 1), NOW(), 0, (SELECT UUID()), \"FU" +
                "LLY_SPECIFIED\"); INSERT INTO concept_name_tag_map VALUES ((SELECT last_insert_id()), (SELECT concept_name_tag_id FROM concept_name_tag WHERE tag = \"preferred_hts\"))'").catch(e => { console.log(e) });

            console.log("Added concept:" + e);

        } else {

            const conceptNameId = (result && result.split("\n") ? result.split("\n")[1] : null);

            if (conceptNameId !== null) {

                const row = await runCmd("export MYSQL_PWD=" + password + " && mysql -h " + host + " -u " + user + " " + database + " -e 'SELECT * FROM concept_name_tag_map WHERE concept_name_tag_id = (SELECT concept_name_tag_id FROM concept_name_tag WHERE tag = \"preferred_hts\" LIMIT 1) AND concept_name_id = " + conceptNameId + "'");

                if (!row) {

                    await runCmd("export MYSQL_PWD=" + password + " && mysql -h " + host + " -u " + user + " " + database + " -e 'INSERT INTO concept_name_tag_map VALUES (\'" + conceptNameId + "\', (SELECT concept_name_tag_id FROM concept_name_tag WHERE tag = \"preferred_hts\" LIMIT 1))'");

                    console.log("Added mapping for " + e);

                }

            }

        }

    }

}

const cleaDuplicateObsData = async () => {

    let result;

    result = await runCmd("export MYSQL_PWD=" + password + " && mysql -sN -h " + host + " -u " + user + " " + database + " -e 'SELECT person_id, encounter_id, concept_id, COUNT(*) found FROM obs WHERE voided = 0 GROUP BY encounter_id, concept_id HAVING found > 1;'").catch(e => { console.log(e) });

    debug(result);

    if (result.trim().length > 0) {

        let rows = result.split('\n');

        debug(JSON.stringify(rows));

        async.mapSeries(rows, (row, cb) => {

            let parts = row.split('\t');

            if (parts.length > 1) {

                debug(parts);

                let personId = parseInt(parts[0], 10);
                let encounterId = parseInt(parts[1], 10);
                let conceptId = parseInt(parts[2], 10);
                let limit = parseInt(parts[3], 10) - 1;
                let i = 0;

                async.series([

                    (iCb) => {

                        runCmd("export MYSQL_PWD=" + password + " && mysql -sN -h " + host + " -u " + user + " " + database + " -e 'SELECT obs_id FROM obs WHERE voided = 0 AND encounter_id = " + encounterId + " AND concept_id = " + conceptId + " LIMIT " + limit + ";'")
                            .then(iResult => {

                                debug("SELECT obs_id FROM obs WHERE voided = 0 AND encounter_id = " + encounterId + " AND concept_id = " + conceptId + " LIMIT " + limit + "");

                                async.mapSeries(iResult.split('\n'), (obsId, oCb) => {

                                    if (obsId.trim().length <= 0)
                                        return oCb();

                                    debug(obsId);

                                    debug("UPDATE obs SET voided = 1, voided_by = 1, date_voided = NOW(), void_reason = \"Voided by script as duplicate\" WHERE obs_id = " + obsId + ";");

                                    runCmd("export MYSQL_PWD=" + password + " && mysql -sN -h " + host + " -u " + user + " " + database + " -e 'UPDATE obs SET voided = 1, voided_by = 1, date_voided = NOW(), void_reason = \"Voided by script as duplicate\" WHERE obs_id = " + obsId + ";'")
                                        .then(iResult => {

                                            oCb();

                                        })
                                        .catch(e => {

                                            console.log(e);

                                            oCb();

                                        });

                                }, (err) => {

                                    iCb();

                                })

                            })
                            .catch(e => {

                                console.log(e);

                                iCb();

                            });

                    }

                ], (err) => {

                    if (err)
                        console.log(err);

                    async.whilst(
                        () => {
                            return i < limit;
                        },
                        (iCb) => {
                            i++;
                            debug(limit + ' -> ' + encounterId);
                            iCb();
                        },
                        (err) => {
                            if (err)
                                console.log(err);
                            cb();
                        }
                    );

                })

            } else {

                cb();

            }

        }, (err) => {

            if (err)
                console.log(err);

            return;

        })

    }

    result = await runCmd("export MYSQL_PWD=" + password + " && mysql -sN -h " + host + " -u " + user + " " + database + " -e 'SELECT obs_id, value_text FROM obs WHERE COALESCE(value_text, \"\") != \"\" AND voided = 0 AND concept_id IN (SELECT concept_id FROM concept_name WHERE name IN (\"Age\", \"Time since last test\"))'").catch(e => { console.log(e) });

    debug(result);

    if (result.trim().length > 0) {

        let rows = result.split('\n');

        debug(JSON.stringify(rows));

        async.mapSeries(rows, async (row, cb) => {

            let parts = row.split('\t');

            if (parts.length > 1) {

                debug(parts);

                let period = parts[1].match(/^(\d+)([A-Z])$/);

                if (period) {

                    const cmd = "export MYSQL_PWD=" + password + " && mysql -sN -h " + host + " -u " + user + " " + database + " -e 'UPDATE obs SET value_numeric = \"" + period[1] + "\", value_modifier=\"" + period[2] + "\", value_text=NULL WHERE obs_id=\"" + parts[0] + "\"'";

                    console.log(cmd);

                    result = await runCmd(cmd).catch(e => { console.log(e) });

                    debug(result);

                    cb();

                } else {

                    cb();

                }

            } else {

                cb();

            }

        }, (err) => {

            if (err)
                console.log(err);

        });

    }

    result = await runCmd("export MYSQL_PWD=" + password + " && mysql -sN -h " + host + " -u " + user + " " + database + " -e 'SELECT obs_id, value_text FROM obs WHERE COALESCE(value_text, \"\") != \"\" AND voided = 0 AND concept_id IN (SELECT concept_id FROM concept_name WHERE name IN (\"Appointment date given\"))'").catch(e => { console.log(e) });

    debug(result);

    if (result.trim().length > 0) {

        let rows = result.split('\n');

        debug(JSON.stringify(rows));

        async.mapSeries(rows, async (row, cb) => {

            let parts = row.split('\t');

            if (parts.length > 1) {

                debug(parts);

                const cmd = "export MYSQL_PWD=" + password + " && mysql -sN -h " + host + " -u " + user + " " + database + " -e 'UPDATE obs SET value_datetime = \"" + (new Date(parts[1])).format('YYYY-mm-dd') + "\", value_text=NULL WHERE obs_id=\"" + parts[0] + "\"'";

                console.log(cmd);

                result = await runCmd(cmd).catch(e => { console.log(e) });

                debug(result);

                cb();

            } else {

                cb();

            }

        }, (err) => {

            if (err)
                console.log(err);

        });

    }

}

const recalibrate = async () => {

    await loadConceptNames(seed.concepts)

    let commands = [
        {
            message: "Modifying hts_register table ...",
            cmd: 'MYSQL_PWD=' + password + ' mysql -u ' + user + ' ' + database + ' -e "ALTER TABLE hts_register CHANGE COLUMN register_number register_number VARCHAR(45) NULL DEFAULT NULL"'
        },
        {
            message: "Resetting Elasticsearch ...",
            cmd: "curl -H \"Content-Type: application/json\" -X DELETE \"" + es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "\" -s"
        },
        {
            message: "Initializing Elasticsearch index ...",
            cmd: "curl -H \"Content-Type: application/json\" -X PUT -d @es-mapping.json \"" + es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "\" -s"
        },
        {
            message: "Modifying hts_register table ...",
            cmd: 'MYSQL_PWD=' + password + ' mysql -u ' + user + ' ' + database + ' -e "SET @preparedStatement = (SELECT IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=\'' + database + '\' AND COLUMN_NAME=\'location_id\' AND TABLE_NAME=\'hts_register\') > 0, \'SELECT 1\', \'ALTER TABLE hts_register ADD COLUMN location_id INT NOT NULL AFTER service_delivery_point_id\')); PREPARE alterIfNotExists FROM @preparedStatement; EXECUTE alterIfNotExists; DEALLOCATE PREPARE alterIfNotExists;"'
        },
        {
            message: "Modifying hts_register table ...",
            cmd: 'MYSQL_PWD=' + password + ' mysql -u ' + user + ' ' + database + ' -e "SET @preparedStatement = (SELECT IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=\'' + database + '\' AND COLUMN_NAME=\'register_type\' AND TABLE_NAME=\'hts_register\') > 0, \'SELECT 1\', \'ALTER TABLE hts_register ADD COLUMN register_type INT NOT NULL AFTER location_id\')); PREPARE alterIfNotExists FROM @preparedStatement; EXECUTE alterIfNotExists; DEALLOCATE PREPARE alterIfNotExists;"'
        },
        {
            message: "Loading registers ...",
            cmd: 'MYSQL_PWD=' + password + ' mysql -u ' + user + ' ' + database + ' -e "DROP TABLE IF EXISTS t1; CREATE TEMPORARY TABLE IF NOT EXISTS t1 (INDEX(register_id), INDEX(registerNumber)) ENGINE MyISAM AS (SELECT register_id, CASE WHEN register_number REGEXP \'^[[:digit:]]+$\' THEN CONCAT(register_number, \'-\', (SELECT name FROM hts_register_service_delivery_point WHERE hts_register_service_delivery_point.service_delivery_point_id = hts_register.service_delivery_point_id LIMIT 1)) WHEN register_number REGEXP \'[[:digit:]]-[^-]+-[^-]+\' THEN CONCAT((SELECT SUBSTRING(register_number, 1, LOCATE(\'-\', register_number))), (SELECT name FROM hts_register_service_delivery_point WHERE hts_register_service_delivery_point.service_delivery_point_id = hts_register.service_delivery_point_id LIMIT 1)) ELSE register_number END AS registerNumber FROM hts_register LEFT OUTER JOIN hts_register_service_delivery_point ON hts_register_service_delivery_point.service_delivery_point_id = hts_register.service_delivery_point_id); UPDATE hts_register SET register_number = (SELECT registerNumber FROM t1 WHERE register_id = hts_register.register_id LIMIT 1); SELECT register_number AS _id, register_number AS registerNumber, hts_register_location_type.name AS locationType, hts_register_service_delivery_point.name AS serviceDeliveryPoint, DATE_FORMAT(date_created, \'%Y-%m-%d\') AS dateCreated FROM hts_register LEFT OUTER JOIN hts_register_location_type ON hts_register_location_type.location_type_id = hts_register.location_type_id LEFT OUTER JOIN hts_register_service_delivery_point ON hts_register_service_delivery_point.service_delivery_point_id = hts_register.service_delivery_point_id WHERE closed = 0" | ./mapData.js --type register'
        },
        {
            message: "Adding missing age data to obs table ...",
            cmd: 'MYSQL_PWD=' + password + ' mysql -u ' + user + ' ' + database + ' -e "INSERT INTO obs (person_id, concept_id, encounter_id, obs_datetime, location_id, value_numeric, value_modifier, creator, date_created, uuid) SELECT DISTINCT obs.person_id, (SELECT concept.concept_id FROM concept_name LEFT OUTER JOIN concept ON concept.concept_id = concept_name.concept_id WHERE name = \'Age\' AND concept.retired = 0 LIMIT 1) AS concept, encounter_id, obs_datetime, location_id, CASE WHEN DATEDIFF(obs_datetime, birthdate) < 7 THEN DATEDIFF(obs_datetime, birthdate) WHEN DATEDIFF(obs_datetime, birthdate) < 28 THEN ROUND(DATEDIFF(obs_datetime, birthdate) / 7, 0) WHEN DATEDIFF(obs_datetime, birthdate) < 365 THEN ROUND(DATEDIFF(obs_datetime, birthdate) / 30, 0) ELSE ROUND(DATEDIFF(obs_datetime, birthdate) / 365, 0) END AS age, CASE WHEN DATEDIFF(obs_datetime, birthdate) < 7 THEN \'D\' WHEN DATEDIFF(obs_datetime, birthdate) < 28 THEN \'W\' WHEN DATEDIFF(obs_datetime, birthdate) < 365 THEN \'M\' ELSE \'Y\' END AS units, obs.creator, obs.date_created, (SELECT UUID()) AS uuid FROM obs LEFT OUTER JOIN person ON person.person_id = obs.person_id WHERE NOT obs.person_id IN (SELECT person_id FROM obs WHERE concept_id IN (SELECT concept_id FROM concept_name WHERE name = \'Age\'))"'
        },
        {
            message: "Updating retired concept names ...",
            cmd: 'MYSQL_PWD=' + password + ' mysql -u ' + user + ' ' + database + ' -e "DROP TABLE IF EXISTS t1; CREATE TABLE IF NOT EXISTS t1 (INDEX(concept_name_id)) ENGINE MyISAM AS (SELECT concept_name_id FROM concept_name WHERE concept_id IN (SELECT concept_id FROM concept WHERE retired = 1)); UPDATE concept_name SET voided = 1 WHERE concept_name_id IN (SELECT concept_name_id FROM t1);"'
        },
        {
            message: "Fixing age concept_id in obs table ...",
            cmd: 'MYSQL_PWD=' + password + ' mysql -u ' + user + ' ' + database + ' -e "DROP TABLE IF EXISTS t1; CREATE TEMPORARY TABLE IF NOT EXISTS t1 (INDEX(obs_id)) ENGINE MyISAM AS (SELECT obs_id FROM obs WHERE concept_id IN (SELECT concept.concept_id FROM concept_name LEFT OUTER JOIN concept ON concept.concept_id = concept_name.concept_id WHERE name = \'Age\' AND concept.retired = 1)); UPDATE obs SET concept_id = (SELECT concept.concept_id FROM concept_name LEFT OUTER JOIN concept ON concept.concept_id = concept_name.concept_id WHERE name = \'Age\' AND concept.retired = 0) WHERE obs_id IN (SELECT obs_id FROM t1);"'
        },
        {
            message: "Fixing service delivery point names ...",
            cmd: 'MYSQL_PWD=' + password + ' mysql -u ' + user + ' ' + database + ' -e "DROP TABLE IF EXISTS t1; CREATE TEMPORARY TABLE IF NOT EXISTS t1 (INDEX(service_delivery_point_id)) ENGINE MyISAM AS (SELECT service_delivery_point_id FROM hts_register_service_delivery_point WHERE name = \'Other\'); UPDATE hts_register_service_delivery_point SET name = \'VCT/Other\' WHERE service_delivery_point_id IN (SELECT service_delivery_point_id FROM t1);"'
        },
        {
            message: "Loading obs data ...",
            cmd: 'MYSQL_PWD=' + password + ' mysql -u ' + user + ' ' + database + ' -e "SELECT DISTINCT DATE_FORMAT(encounter_datetime, \'%Y-%m-%d\') AS visitDate, encounter_type.name AS encounterType, concept_name.name AS observation, CASE WHEN COALESCE(obs.value_coded_name_id, \'\') != \'\' THEN (SELECT name FROM concept_name WHERE concept_name_id = obs.value_coded_name_id LIMIT 1) WHEN COALESCE(obs.value_datetime, \'\') != \'\' THEN DATE_FORMAT(obs.value_datetime, \'%Y-%m-%d\') WHEN COALESCE(obs.value_numeric, \'\') != \'\' THEN CONCAT(obs.value_numeric, CASE WHEN COALESCE(obs.value_modifier, \'\') != \'\' THEN obs.value_modifier ELSE \'\' END)  ELSE obs.value_text END AS observationValue, \'HTS PROGRAM\' AS program, location.name AS location, u.username AS provider, users.username AS user, encounter.encounter_id AS encounterId, person.birthdate AS dateOfBirth, hts_register.register_number AS registerNumber, hts_register_location_type.name AS locationType, hts_register_service_delivery_point.name AS serviceDeliveryPoint, DATEDIFF(CURRENT_DATE, person.birthdate) / 365.0 AS age, obs.obs_id AS obsId, obs.obs_id AS _id FROM encounter JOIN patient_program ON patient_program.patient_program_id = encounter.patient_program_id JOIN program ON program.program_id = patient_program.program_id JOIN encounter_type ON encounter_type.encounter_type_id = encounter.encounter_type JOIN obs ON obs.encounter_id = encounter.encounter_id JOIN concept ON concept.concept_id = obs.concept_id JOIN concept_name ON concept_name.concept_id = concept.concept_id JOIN location ON location.location_id = encounter.location_id JOIN users ON users.user_id = encounter.creator JOIN users u ON u.person_id = encounter.provider_id JOIN person ON person.person_id = obs.person_id JOIN hts_register_encounter_mapping ON hts_register_encounter_mapping.encounter_id = encounter.encounter_id JOIN hts_register ON hts_register.register_id = hts_register_encounter_mapping.register_id JOIN hts_register_location_type ON hts_register_location_type.location_type_id = hts_register.location_type_id JOIN hts_register_service_delivery_point ON hts_register_service_delivery_point.service_delivery_point_id = hts_register.service_delivery_point_id WHERE program.name = \'HTS PROGRAM\' AND concept_name.concept_name_id IN (SELECT concept_name_id FROM concept_name_tag_map WHERE concept_name_tag_id = (SELECT concept_name_tag_id FROM concept_name_tag WHERE tag = \'preferred_hts\' AND encounter.encounter_id IN (SELECT encounter_id FROM hts_register_encounter_mapping) LIMIT 1)) AND obs.voided = 0 AND encounter.voided = 0;" | ./mapData.js --type visit | curl -H "Content-Type: application/x-ndjson" -X POST --data-binary @- "' + es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + '/_bulk" -s'
        },
        {
            message: "Reloading villages from remote source ...",
            cmd: `nc -w 3 -vz ${villageHost} ${villagePort}; if [ $? -eq 0 ]; then mysqldump -h ${villageHost} -u ${villageUser} -p${villagePassword} ${villageDatabase} region district traditional_authority village | mysql -u ${user} -p${password} ${database}; else echo "Failed "; fi`
        },
        {
            message: "Adding DDE Doc ID as person Identifier Type",
            cmd: 'MYSQL_PWD=' + password + ' mysql -u ' + user + ' ' + database + ' -e "INSERT INTO patient_identifier_type(name,description,date_created,uuid,creator) SELECT \'DDE person document ID\', \'DDE couchDB document ID for a person\',\'2018-11-25\',\'057be8f6-f0bf-11e8-a147-f8344162329d\',1 from  dual WHERE NOT EXISTS (SELECT 1 FROM patient_identifier_type WHERE name = \'DDE person document ID\' AND description = \'DDE couchDB document ID for a person\' AND date_created=\'2018-11-25\' AND uuid=\'057be8f6-f0bf-11e8-a147-f8344162329d\' AND creator=1);"'
        }
    ];

    for (let cmd of commands) {

        console.log(cmd.message);
        try {
            const { stdout, stderr } = await runCommandAsync(cmd.cmd)

            if (stderr) {
                console.error(stderr)
            }
        } catch (e) {
            console.error(e)
        }
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

    },


    function (cb) {

        if (!fs.existsSync(__dirname + '/logs')) {

            fs.mkdirSync(__dirname + '/logs');

            cb();

        } else {

            glob(__dirname + '/logs/*.json', (err, files) => {

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

    cleaDuplicateObsData()
        .then(() => {

            recalibrate();

        })

});
