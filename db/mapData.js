#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const glob = require('glob');
const async = require('async');
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

rl.on('line', (line) => {

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

            if (String(entry.observation).trim() === "Result Given to Client" && ["New Negative", "New Positive"].indexOf(entry.observationValue) >= 0) {

                dumps.push(entry.encounterId);

            }

        } else {

            data.push(JSON.stringify(header));

            data.push(JSON.stringify(entry));

        }

    }

})

rl.on('close', () => {

    process.stdout.write(data.join("\n") + "\n");

    for (let i = 0; i < dumps.length; i++) {

        const id = dumps[i];

        fs.writeFileSync(__dirname + '/dumps/' + id + '.json', JSON.stringify(encounters[id], null, 2));

    }

})
