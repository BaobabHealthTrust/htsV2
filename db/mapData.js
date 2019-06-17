#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const glob = require('glob');
const async = require('async');
const axios = require('axios')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
const es = require("../configs/elasticsearch.json");
const env = (process.env.NODE_ENV
    ? process.env.NODE_ENV
    : "development");

let fields = [];
let data = [];
const type = (process.argv.indexOf("--type") >= 0 ? process.argv[process.argv.indexOf("--type") + 1] : "register");

let encMap = {};
let pending = {};
let dumps = [];
let encounters = {};

rl.on('line', async (line) => {

    const row = line.split("\t");

    if (fields.length <= 0) {

        fields = Object.assign([], row);

    } else {

        let entry = {};
        let header = {
            index: {
                _index: es.index,
                _type: type,
                _id: null
            }
        };

        for (let i = 0; i < fields.length; i++) {

            if (fields[i] === "_id") {

                header.index._id = String(row[i]).trim();

            } else {

                entry[fields[i]] = String(row[i]).trim();

            }

        }

        if (type === "visit") {

            if (String(entry.observation).trim() === "HTS Entry Code") {

                encMap[entry.encounterId] = entry.observationValue;

                if (Object.keys(pending).indexOf(entry.encounterId) >= 0) {

                    for (let k = 0; k < pending[entry.encounterId].length; k++) {

                        pending[entry.encounterId][k].identifier = entry.observationValue;

                        data.push(JSON.stringify(header));

                        data.push(JSON.stringify(pending[entry.encounterId][k]));

                        if (Object.keys(encounters).indexOf(entry.encounterId) < 0)
                            encounters[entry.encounterId] = [];

                        encounters[entry.encounterId].push(pending[entry.encounterId][k]);

                    }

                }

            } else {

                if (Object.keys(encMap).indexOf(entry.encounterId) >= 0) {

                    entry.identifier = encMap[entry.encounterId]

                    data.push(JSON.stringify(header));

                    data.push(JSON.stringify(entry));

                    if (Object.keys(encounters).indexOf(entry.encounterId) < 0)
                        encounters[entry.encounterId] = [];

                    encounters[entry.encounterId].push(entry);

                } else {

                    if (Object.keys(pending).indexOf(entry.encounterId) < 0)
                        pending[entry.encounterId] = [];

                    pending[entry.encounterId].push(entry);

                }

            }

            if (String(entry.observation).trim() === "Result Given to Client" && ["New Negative", "New Positive"].indexOf(entry.observationValue.trim()) >= 0) {

                dumps.push(entry.encounterId);

            }

        }

        if (type !== 'visit') {
            await axios.post(
                `${es.protocol}://${es.host}:${es.port}/${es.index}/${type}`,
                entry,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
        }
    }
})

rl.on('close', async () => {
    let payload = []
    let entry = null

    //while there is still data to send
    while (entry = data.shift()) {
        payload.push(entry)

        //if the payload contains two thousand visits
        //send the visits, reset payload and entry to buffer again
        if (payload.length === 4000) {
            await axios.post(
                `${es.protocol}://${es.host}:${es.port}/${es.index}/_bulk`,
                payload.join('\n') + '\n',
                {
                    headers: {
                        'Content-Type': 'application/x-ndjson'
                    }
                }
            )
            payload = []
            entry = null
        }
    }

    //if there are no more entries but the payload did not reach 2000 visits
    if (payload.length > 0) {
        await axios.post(
            `${es.protocol}://${es.host}:${es.port}/${es.index}/_bulk`,
            payload.join('\n') + '\n',
            {
                headers: {
                    'Content-Type': 'application/x-ndjson'
                }
            }
        )
    }

    for (let i = 0; i < dumps.length; i++) {

        const id = dumps[i];

        fs.writeFileSync(__dirname + '/dumps/' + id + '.json', JSON.stringify(encounters[id], null, 2));

    }

})