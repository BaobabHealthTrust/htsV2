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
            cmd: 'MYSQL_PWD=' + password + ' mysql -u ' + user + ' ' + database + ' -e "SELECT register_id AS _id, register_number AS registerNumber, hts_register_location_type.name AS locationType, hts_register_service_delivery_point.name AS serviceDeliveryPoint, DATE_FORMAT(date_created, \'%Y-%m-%d\') AS dateCreated FROM hts_register LEFT OUTER JOIN hts_register_location_type ON hts_register_location_type.location_type_id = hts_register.location_type_id LEFT OUTER JOIN hts_register_service_delivery_point ON hts_register_service_delivery_point.service_delivery_point_id = hts_register.service_delivery_point_id" | ./mapData.js | curl -H "Content-Type: application/x-ndjson" -X POST --data-binary @- "' + es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + '/_bulk" -s'
        }
    ];

    for (let cmd of commands) {

        console.log(cmd.message);

        await runCmd(cmd.cmd).catch(e => { console.log(e) });

    }

}

recalibrate();