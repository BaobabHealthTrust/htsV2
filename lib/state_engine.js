/**
 * Created by chimwemwe on 7/22/17.
 */

/*
 *  module StateEngine
 *
 *  Engine for managing states of JSON workflow trees generated from BPMN diagrams
 */
function StateEngine(tree, startState) {

    var self = this;

    /*
     * A set of module variables used by the fetchNode method of the instance of the module.
     */
    self.history = [];
    self.trace = [];
    self.croot = [];
    self.stack = [];
    self.t = 0;

    /*
     *  module variable history
     *
     *  Keeps track of where the current state of the workflow is coming from for cases where one wants to retrace how
     *  they got to the current state
     */
    self.__history__ = [];

    /*
     *  module variable nextState
     *
     *  Keeps track of the next state of the engine based on the output from the previous state
     */
    self.nextState = null;

    /*
     *  module variable stateOutput
     *
     *  Stores the output from the current process
     */
    self.stateOutput = null;

    /*
     *  module variable stateMessage
     *
     *  Stores the message that may need to be displayed on a given state
     */
    self.stateMessage = null;

    /*
     *  module variable startState
     *
     *  Holds the first state to be called when navigating the tree
     */
    self.startState = startState;

    /*
     *  module variable currentState
     *
     *  Keeps track of the current state of the workflow
     */
    self.currentState = startState;

    /*
     *  module variable tree
     *
     *  The tree is the source workflow tree to be traversed
     */
    self.tree = tree;

    /*
     *  module variable stateObject
     *
     *  A representation of the definition of the current state object
     */
    self.stateObject = null;

    self.fetchNode(startState, "label", self.tree, function () {

        var route = JSON.parse(JSON.stringify((self.history.length > 0 ? self.history[0] : [])));

        if (route.length > 0) {

            route.pop();

        }

        self.__history__ = JSON.parse(JSON.stringify(route));

    })

}

/*
 *  fetchNextState
 *
 *  Get the next state to traverse to based on the output of the current state and current state.
 *
 *  @params {string} output         The actual output resulting from the current operation
 *  @params {string} msg            The message to display if need be in line with the current output
 *  @params {function} callback     The function to call after the task is done
 *
 *  @returns NULL
 */
StateEngine.prototype.fetchNextState = function (output, msg, callback) {

    var self = this;

    /*
     *  We first keep the results from the current process.
     */
    this.stateOutput = output;

    this.stateMessage = msg;

    /*
     *  Then calculate the base for the next level transaction based on the tracked path history.
     */
    var root = self.getPath(self.tree, self.__history__.join("."));

    var leaf = JSON.parse(JSON.stringify(self.__history__)).pop();

    /*
     * Based on the parsed result from the currentState progress evaluation, decide on the branch to work with.
     *
     * If the output is outright equal to FALSE, return the same currentState as nextState and flag stateOutput as FALSE
     */
    if (String(output).trim().toLowerCase() === "false") {

        self.nextState = self.currentState;

        self.stateOutput = false;

        /*
         * Else if the output is outright equal to TRUE, the assumption is the nextState will be the default possible state
         */
    } else if (String(output).trim().toLowerCase() === "true") {

        if (leaf && root[leaf] && root[leaf].flow && Object.keys(root[leaf].flow).length > 0) {

            var key = Object.keys(root[leaf].flow)[0];

            self.nextState = root[leaf].flow[key].label;

            self.stateOutput = true;

        } else {

            self.nextState = null;

            self.stateOutput = true;

            self.stateMessage = "Bad Workflow Format";

        }

        /*
         * Else validate by actual strings from a given selection list
         */
    } else {

        if (leaf && root[leaf] && root[leaf].flow) {

            var label = Object.keys(root[leaf].flow).map(function (e) {

                if (root[leaf].flow[e] && root[leaf].flow[e].label === output && root[leaf].flow[e].flow) {

                    return root[leaf].flow[e].flow[Object.keys(root[leaf].flow[e].flow)[0]].label;

                } else {

                    return null;

                }

            }).reduce(function (a, e, i) {

                if (e && a.indexOf(e) < 0)
                    a.push(e);

                return a;

            }, [])[0] || null;

            self.nextState = label;

            self.stateOutput = true;

        } else {

            self.nextState = null;

            self.stateOutput = true;

            self.stateMessage = "Bad Workflow Format";

        }

    }

    callback && callback();

}

/*
 *  gotoNextState
 *
 *  Traverse to the next state in the tree based on the current set nextState
 *
 *  @params {string} state          The target state to navigate to
 *  @params {function} callback     The function to run when the task is done
 *
 *  @returns NULL
 */
StateEngine.prototype.gotoNextState = function (callback) {

    var self = this;

    self.currentState = self.nextState;

    self.nextState = null;

    self.stateOutput = null;

    self.stateMessage = null;

    /*
     *  Then calculate the base for the next level transaction based on the tracked path history.
     */
    var root = self.getPath(self.tree, self.__history__.join("."));

    var leaf = JSON.parse(JSON.stringify(self.__history__)).pop();

    if (root && root[leaf] && root[leaf].flow) {

        self.clearNodeSearchHistory(function () {

            self.fetchNode(self.currentState, "label", root[leaf].flow, function (result) {

                if (!result || result.length <= 0)
                    return callback && callback();

                self.__history__.push("flow");

                for (var i = 0; i < result[0].length - 1; i++) {

                    self.__history__.push(result[0][i]);

                }

                var root = self.getPath(self.tree, self.__history__.join("."));

                var leaf = JSON.parse(JSON.stringify(self.__history__)).pop();

                self.stateObject = JSON.parse(JSON.stringify(root[leaf]));

                callback && callback();

            })

        })

    } else {

        callback && callback();

    }

}

/*
 * getPath
 *
 * Get the path from the given obj and path
 *
 * @params {object} obj     Object to process
 * @param {string}  path    String representing the path to process
 *
 * @returns {object} obj    Resultant object
 */
StateEngine.prototype.getPath = function (obj, path) {

    var parts = path.split('.');

    while (parts.length > 1 && obj) {
        (obj = obj[parts.shift()])
    };

    return obj;

}

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
StateEngine.prototype.fetchNode = function (lbl, target, obj, callback) {

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
        if (lbl === obj[p] && p === target) {

            self.trace.push(p);

            self.history.push(JSON.parse(JSON.stringify(self.trace)));

            let c = self.stack.pop();

            if (self.croot[c]) {

                self.trace = JSON.parse(JSON.stringify(self.croot[c]));

            } else {

                self.trace = [];

            }

        } else if (typeof obj[p] === typeof {} && Object.keys(obj[p]).length > 0) {

            self.trace.push(p);

            self.fetchNode(lbl, target, obj[p]);

            /*
             * No match found on this path. Forget the path.
             */
        } else {

            let c = self.stack.pop();

            if (self.croot[c]) {

                self.trace = JSON.parse(JSON.stringify(self.croot[c]));

            } else {

                self.trace = [];

            }

        }

    }

    if (callback)
        callback(self.history);

}

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
StateEngine.prototype.childrenTypes = function (obj) {

    return Object.keys(obj).reduce(function (a, e, i) {

        if (typeof obj[e] === typeof {})
            a.push(i);
        else
            a.push(null);

        return a;
    }, []);

}

/*
 *  clearNodeSearchHistory
 *
 *  Clear all object variables associated with @fetchNode only.
 *
 *  @params {function} callback     The function to execute after clearing done.
 *
 */
StateEngine.prototype.clearNodeSearchHistory = function (callback) {

    var self = this;

    self.history = [];
    self.trace = [];
    self.croot = [];
    self.stack = [];
    self.t = 0;

    if (callback)
        callback();

}

/*
 *  pruneTree
 *
 *  This function provides the ability to prune the navigation tree several levels backwards. When called, the state
 *  of the engine is reset to the specified level. If the proposed number of levels back is greater than the size of
 *  the navigation tree, nothing is done.
 *
 *  @params {integer} levelsBack        Number of level going backwards the tree is to be pruned
 *  @params {function} callback         Function called after task done
 *
 *  @returns NULL
 */
StateEngine.prototype.pruneTree = function (levelsBack, callback) {

    var self = this;

    /*
     *  Since data at each level is accessed through a "flow" attribute, the maximum possible number of levels is equal
     *  to
     *          the total number of level                       T
     *          less the root node                              1
     *          the difference of which is now divided by       2
     */
    var possibleLevelsBack = ((self.__history__.length - 1) / 2);

    if (possibleLevelsBack < levelsBack)
        return callback && callback();

    var newHistory = JSON.parse(JSON.stringify(self.__history__)).slice(0, (self.__history__.length - (levelsBack * 2)));

    self.__history__ = JSON.parse(JSON.stringify(newHistory));

    /*
     *  Reset engine states
     */
    self.stateOutput = null;

    self.stateMessage = null;

    self.currentState = null;

    self.nextState = null;

    /*
     *  Then calculate the base for the next level transaction based on the tracked path history.
     */
    var root = self.getPath(self.tree, self.__history__.join("."));

    var leaf = JSON.parse(JSON.stringify(self.__history__)).pop();

    if (root && root[leaf] && root[leaf].label) {

        self.currentState = root[leaf].label;

        self.stateObject = JSON.parse(JSON.stringify(root[leaf]));

    }

    callback && callback();

}

/*
 *  humanReadable
 *
 *  Function to convert the path history to human readable format. It automatically converts the active history path on
 *  it's own. The result is parsed back through the callback function.
 *
 *  @params {object} dictionary     Object containing the definitions of the different identifiers
 *
 *  @returns {array}                Array of results
 */
StateEngine.prototype.humanReadable = function (dictionary, history) {

    var self = this;

    if (!dictionary)
        return [];

    var result = [];

    if (history && Array.isArray(history)) {

        history.forEach(function (key) {

            if (dictionary[key])
                result.push(dictionary[key]);

        })

    } else {

        self.__history__.forEach(function (key) {

            if (dictionary[key])
                result.push(dictionary[key]);

        })

    }

    return result;

}

StateEngine.prototype.fullHistory = function () {

    const self = this;

    const result = [];

    for (var i = 0; i < self.__history__.length; i++) {

        let parent = null;

        if (i > 0) {

            parent = result[result.length - 1];

        }

        const root = self.getPath(self.tree, self.__history__.slice(0, i + 1).join("."));

        const leaf = Object.assign([], (self.__history__.slice(0, i + 1))).pop();

        if (root && root[leaf] && root[leaf].label) {

            var entry = {
                type: root[leaf].type,
                label: root[leaf].label
            }

            if (Object.keys(root[leaf].flow).length > 1) {

                const keys = Object.keys(root[leaf].flow);

                entry.options = keys.map((key) => {

                    return root[leaf].flow[key].label;

                })

            }

            if (parent && (parent.type === "option" || parent.conditional)) {

                entry.conditional = true;

            }

            result.push(entry);

        }

    }

    return result;

}

StateEngine.prototype.resetTree = function (callback) {

    var self = this;

    self.history = [];
    self.trace = [];
    self.croot = [];
    self.stack = [];
    self.t = 0;

    var newHistory = JSON.parse(JSON.stringify(self.__history__)).slice(0, 3);

    self.__history__ = JSON.parse(JSON.stringify(newHistory));

    /*
     *  Reset engine states
     */
    self.stateOutput = null;

    self.stateMessage = null;

    self.currentState = null;

    self.nextState = null;

    /*
     *  Then calculate the base for the next level transaction based on the tracked path history.
     */
    var root = self.getPath(self.tree, self.__history__.join("."));

    var leaf = JSON.parse(JSON.stringify(self.__history__)).pop();

    if (root && root[leaf] && root[leaf].label) {

        self.currentState = root[leaf].label;

        self.stateObject = JSON.parse(JSON.stringify(root[leaf]));

    }

    if (callback)
        callback();

}

if (typeof module !== "undefined")
    module.exports = StateEngine;