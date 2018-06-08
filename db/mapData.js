#!/usr/bin/env node

const readline = require('readline');
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

        data.push(JSON.stringify(header));

        data.push(JSON.stringify(entry));

    }

})

rl.on('close', () => {

    process.stdout.write(data.join("\n") + "\n");

})