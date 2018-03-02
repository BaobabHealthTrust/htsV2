#!/usr/bin/env node

/**
 * Created by chimwemwe on 7/6/17.
 */

"use strict";

var fs = require("fs");
var path = require("path");
var bfj = require("bfj");

function help() {

  console.log("");

  console.log("\tExpecting:\n\n\t\t./chew.js BPMN_FILENAME\n");

  console.log("");

}

if (process.argv.length < 3) {

  help();

  process.exit();

}

var bpmn = require(path.resolve("client", "src", "lib", "process_bpmn.js")).ProcessBPMN;

var filename = process.argv[2];

var raw,
  json;

if (!fs.existsSync(filename)) {

  console.log("File '%s' not found! Aborting!", filename);

  process.exit();

}

if (!fs.existsSync(path.resolve("diagrams"))) 
  fs.mkdirSync(path.resolve("diagrams"));

var r = bpmn.init(filename);

raw = bpmn.raw;

var root = "";

var parts = filename.match(/([^\/]+)\.bpmn$/i);

if (parts) 
  root = String(parts[1]).trim();
else 
  root = "unknown";

bpmn
  .loadDataTypes(function () {

    bpmn
      .createTree(function () {

        fs.writeFileSync(path.resolve("diagrams", root + "-raw.json"), JSON.stringify(bpmn.raw, undefined, 2));

        fs.writeFileSync(path.resolve("diagrams", root + "-intermediate.json"), JSON.stringify(bpmn.json, undefined, 2));

        bfj
          .stringify(bpmn.tree)
          .then(json => {

            fs.writeFileSync(path.resolve("diagrams", root + "-tree.json"), json);

          })

        var dictionary = {};

        bpmn
          .json
          .payload
          .forEach(function (row) {

            dictionary[row.id] = row.label;

          })

        fs.writeFileSync(path.resolve("diagrams", root + "-dictionary.json"), JSON.stringify(dictionary, undefined, 2));

        console.log("Done!");

      });

  });
