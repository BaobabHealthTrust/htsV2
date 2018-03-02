#!/usr/bin/env node

const appendNode = (json, parent = {}, node) => {

    if (!node) {

        const startNode = json.filter((e) => {
            return e.label === "Start" ? true : false
        })[0];

        const id = startNode.id;

        parent[id] = Object.assign({}, startNode, {
            flow: {}
        });

        const kids = json.slice(1).filter((e) => {
            return e.source && e.source.indexOf(id) >= 0 ? true : false
        }).forEach((e) => {

            appendNode(json.slice(1), parent[id].flow, e);

        });

    } else if (node) {

        const id = node.id;

        if (node.type != "exit") {

            parent[id] = Object.assign({}, node, {
                flow: {}
            });

        } else {

            parent[id] = Object.assign({}, node);

        }

        const kids = json.filter((e) => {
            return e.source && e.source.indexOf(id) >= 0 ? true : false
        }).forEach((e) => {

            appendNode(json, parent[id].flow, e);

        });

    }

}

if (process.argv.indexOf("-f") >= 0) {

    const filename = process.argv[process.argv.indexOf("-f") + 1];

    const fs = require("fs");

    if (!fs.existsSync(filename))
        process.exit();

    const json = JSON.parse(fs.readFileSync(filename).toString("utf8"));

    let tree = {};

    appendNode(json.payload, tree);

    console.log(JSON.stringify(tree, null, 2));

}