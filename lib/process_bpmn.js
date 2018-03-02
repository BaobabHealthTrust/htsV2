/**
 * Created by chimwemwe on 7/6/17.
 */

"use strict";

var async = require("async");
var X2JS = require('x2js');
var fs = require("fs");
var path = require("path");

exports.ProcessBPMN = {

    json: null,
    raw: null,
    tree: null,

    history: [],
    trace: [],
    croot: [],
    stack: [],
    t: 0,
    result: {},

    definitions: {
        startEvent: "entry",
        endEvent: "exit",
        exclusiveGateway: "decision",
        task: "input",
        serviceTask: "process",
        userTask: "alert"
    },

    /*
     *  clearAll
     *
     *  Clear all object variables.
     *
     *  @params {function} callback     The function to execute after clearing done.
     *
     */
    clearAll: function (callback) {

        var self = this;

        self.json = null;
        self.raw = null;
        self.history = [];
        self.trace = [];
        self.croot = [];
        self.stack = [];
        self.t = 0;
        self.result = {};

        if (callback)
            callback();

    },

    /*
     *  clearNodeSearchHistory
     *
     *  Clear all object variables associated with @fetchNode only.
     *
     *  @params {function} callback     The function to execute after clearing done.
     *
     */
    clearNodeSearchHistory: function (callback) {

        var self = this;

        self.history = [];
        self.trace = [];
        self.croot = [];
        self.stack = [];
        self.t = 0;

        if (callback)
            callback();

    },

    /*
     * fetchNode
     *
     * Fetch a node of interest given the label to search for
     *
     * @param {string} lbl        The name of the label to search for
     * @param {string} target     The name of the target key to compare with
     * @param {object} obj        The seed node to work with
     *
     * @return NULL               Results are in global variables of class
     */
    fetchNode: function (lbl, target, obj, callback) {

        var self = this;

        var k = self.childrenTypes(obj);

        if (k.length > 1) {

            self.croot.push(JSON.parse(JSON.stringify(self.trace)));

            // Store the stack position for as many members as are matched
            for (var i = 1; i < k.length; i++)
                self.stack.push(self.t);

            self.t++;

        }

        for (var p in obj) {

            /*
             *  If the label now matches the current item, push the trace log to history
             */
            if (lbl == obj[p] && p == target) {

                self.trace.push(p);

                self.history.push(JSON.parse(JSON.stringify(self.trace)));

                var c = self.stack.pop();

                if (self.croot[c]) {

                    self.trace = JSON.parse(JSON.stringify(self.croot[c]));

                } else {

                    self.trace = [];

                }

            } else if (typeof obj[p] == typeof {} && Object.keys(obj[p]).length > 0) {

                self.trace.push(p);

                self.fetchNode(lbl, target, obj[p]);

                /*
                 * No match found on this path. Forget the path.
                 */
            } else {

                var c = self.stack.pop();

                if (self.croot[c]) {

                    self.trace = JSON.parse(JSON.stringify(self.croot[c]));

                } else {

                    self.trace = [];

                }

            }

        }

        if (callback)
            callback(self.history);

    },

    /*
     *  childrenTypes
     *
     *  Fetch all cases of child nodes irrespective of type with INTEGERS representing objects and NULL representing
     *  all other types
     *
     *  @params {object} obj    A JSON object representing the subject to work with
     *
     *  @returns {array}        An Array of all matching objects
     */
    childrenTypes: function (obj) {

        return Object.keys(obj).reduce(function (a, e, i) {

            if (typeof obj[e] == typeof {})
                a.push(i);
            else
                a.push(null);

            return a;
        }, []);

    },

    /*
     *  loadDataTypes
     *
     *  Load the different model components into the JSON object
     *
     *  @params {function} callback     The function that is called after the task is done
     *
     *  @returns NULL
     */
    loadDataTypes: function (callback) {

        var self = this;

        if (self.raw == null) {

            self.json = null;

            self.raw = null;

            return (callback ? callback() : null);

        }

        /*
         *  Initialize the main output JSON object
         */
        self.json = {
            "definitions": {
                "label": {
                    "description": "Display name",
                    "dataType": "string"
                },
                "type": {
                    "description": "Type of node",
                    "type": "enum",
                    "options": [
                        "entry",
                        "exit",
                        "decision",
                        "input",
                        "process",
                        "notification",
                        "option"
                    ]
                },
                "source": {
                    "description": "The source node identifier",
                    "type": "string"
                },
                "id": {
                    "description": "Unique identifier handle for the element",
                    "type": "string"
                }
            },
            "payload": []
        };

        /*
         *  Load all components into a n associative array so they can be recognized by id for faster lookups later
         */
        var jsonMap = {};

        Object.keys(self.definitions).forEach(function (definition) {

            if (self.raw.definitions && self.raw.definitions.process && self.raw.definitions.process[definition]) {

                if (Array.isArray(self.raw.definitions.process[definition])) {

                    self.raw.definitions.process[definition].forEach(function (row) {

                        var entry = {};

                        entry.label = row._name;

                        entry.id = row._id;

                        entry.type = self.definitions[definition];

                        entry.source = [];

                        jsonMap[row._id] = entry;

                    })

                } else {

                    var row = self.raw.definitions.process[definition];

                    var entry = {};

                    entry.label = row._name;

                    entry.id = row._id;

                    entry.type = self.definitions[definition];

                    entry.source = [];

                    jsonMap[row._id] = entry;

                }

            }

        });

        if (self.raw.definitions && self.raw.definitions.process && self.raw.definitions.process.sequenceFlow &&
            Array.isArray(self.raw.definitions.process.sequenceFlow)) {

            self.raw.definitions.process.sequenceFlow.forEach(function (row) {

                if (row._name && row._name.trim().length > 0) {

                    var entry = {};

                    entry.label = row._name;

                    entry.id = row._id;

                    entry.type = "option";

                    entry.source = [];

                    if (jsonMap[row._sourceRef])
                        entry.source.push(row._sourceRef);

                    jsonMap[row._id] = entry;

                    if (jsonMap[row._targetRef]) {

                        jsonMap[row._targetRef].source.push(row._id);

                    }

                } else {

                    if (jsonMap[row._sourceRef] && jsonMap[row._targetRef]) {

                        jsonMap[row._targetRef].source.push(row._sourceRef);

                    }

                }

            })

        } else {

            self.json = null;

            self.raw = null;

            return (callback ? callback() : null);

        }

        /*
         *  Load all components into the global variable for further processing
         */
        Object.keys(jsonMap).forEach(function (id) {

            /*
             *  Check if the source attribute of the current entry is empty and delete it if empty so that the root
             *  element will not have this attribute to accommodate the tree creation algorithm.
             */
            if (jsonMap[id].source && jsonMap[id].source.length <= 0)
                delete jsonMap[id].source;

            self.json.payload.push(JSON.parse(JSON.stringify(jsonMap[id])));

        });

        if (process.env.DUMP == "true") {

            if (!fs.existsSync(path.resolve("diagrams")))
                fs.mkdirSync(path.resolve("diagrams"));

            fs.writeFileSync(path.resolve("diagrams", "jsonMap.json"), JSON.stringify(jsonMap, undefined, 2));

            fs.writeFileSync(path.resolve("diagrams", "target.json"), JSON.stringify(self.json, undefined, 2));

        }

        /*
         *  Cleanup jsonMap variable, we're done
         */
        jsonMap = null;

        if (callback)
            callback();
        else
            return null;

    },

    /*
     getPath

     Get the path from the given obj and path

     @param obj     Object to process
     @param path    String representing the path to process

     @return obj    Resultant object

     */
    getPath: function (obj, path) {

        var parts = path.split('.');

        while (parts.length > 1 && (obj = obj[parts.shift()]));

        return obj;

    },

    appendNode: function (json, parent = {}, node) {

        var self = this;

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

                self.appendNode(json.slice(1), parent[id].flow, e);

            });

        } else if (node) {

            const id = node.id;

            parent[id] = Object.assign({}, node, {
                flow: {}
            });

            const kids = json.filter((e) => {
                return e.source && e.source.indexOf(id) >= 0 ? true : false
            }).forEach((e) => {

                self.appendNode(json, parent[id].flow, e);

            });

        }

    },

    /*
     *  createTree
     *
     *  Function to create a workflow tree based on input JSON object
     *
     *  @params {function} callback     Function to execute once task done
     *
     *  @returns NULL
     */
    createTree: function (callback) {

        var self = this;

        if (self.json == null || (self.json && Object.keys(self.json).indexOf("payload") <= 0))
            return (callback ? callback() : null);

        self.tree = {};

        self.appendNode(self.json.payload, self.tree);

        callback && callback();

    },

    /*
     *  init
     *
     *  Function to initialize the data to work with in the module. This method has to be called before using the module.
     *
     *  @params {string} filename       Name of BPMN file to work with
     *
     *  @returns {boolean}              Return value
     *                                      TRUE    if loaded successfully
     *                                      FALSE   if loading failed
     */
    init: function (filename) {

        var self = this;

        if (fs.existsSync(filename)) {

            var xml = fs.readFileSync(filename).toString();

            var x2js = new X2JS();

            self.raw = x2js.xml2js(xml);

            return true;

        } else {

            return false;

        }

    }

}