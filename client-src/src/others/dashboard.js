"use strict"

if (Object.getOwnPropertyNames(Date.prototype).indexOf("format") < 0) {

    Object.defineProperty(Date.prototype, "format", {
        value: function (format) {
            var date = this;

            var result = "";

            if (!format) {

                format = ""

            }

            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                "October", "November", "December"];

            if (format.match(/YYYY\-mm\-dd\sHH\:\MM\:SS/)) {

                result = date.getFullYear() + "-" + dashboard.padZeros((parseInt(date.getMonth()) + 1), 2) + "-" +
                    dashboard.padZeros(date.getDate(), 2) + " " + dashboard.padZeros(date.getHours(), 2) + ":" +
                    dashboard.padZeros(date.getMinutes(), 2) + ":" + dashboard.padZeros(date.getSeconds(), 2);

            } else if (format.match(/YYYY\-mm\-dd/)) {

                result = date.getFullYear() + "-" + dashboard.padZeros((parseInt(date.getMonth()) + 1), 2) + "-" +
                    dashboard.padZeros(date.getDate(), 2);

            } else if (format.match(/mmm\/d\/YYYY/)) {

                result = months[parseInt(date.getMonth())] + "/" + date.getDate() + "/" + date.getFullYear();

            } else if (format.match(/d\smmmm,\sYYYY/)) {

                result = date.getDate() + " " + monthNames[parseInt(date.getMonth())] + ", " + date.getFullYear();

            } else {

                result = date.getDate() + "/" + months[parseInt(date.getMonth())] + "/" + date.getFullYear();

            }

            return result;
        }
    });

}

Object.defineProperty(Array.prototype, "shuffle", {
    value: function () {
        var array = this;

        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * i); // no +1 here!
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
});

var dashboard = ({

    version: "0.1.1.5",

    gender: null,

    workflow: [],

    standardWorkflow: [],

    autoContinue: false,

    patients: [],

    page: 1,

    subscription: null,

    activeTask: "",

    weightsArray: [],

    allergies: [],

    height: null,

    age: null,

    socket: null,

    stoppedTimers: {},

    __$: function (id) {
        return document.getElementById(id);
    },

    $: function (id) {

        return document.getElementById(id);

    },

    $$: function (id) {

        if (this.$("ifrChild")) {

            return this.$("ifrChild").contentWindow.document.getElementById(id);

        } else {

            if (this.$("ifrMain")) {

                return this.$("ifrMain").contentWindow.document.getElementById(id);

            }

        }

    },

    __: function (id) {

        if (this.$("ifrChild")) {

            return this.$("ifrChild").contentWindow;

        } else {

            if (this.$("ifrMain")) {

                return this.$("ifrMain").contentWindow;

            }

        }

    },

    /*
     *   Method to get the value assigned to a specific concept for a given encounter on a given visit for a
     *   specific program
     *
     * */
    queryActiveObs: function (program, visit, encounter, concept) {

        if (this.data && this.data.data && this.data.data.programs && this.data.data.programs[program] &&
            Object.keys(this.data.data.programs).length > 0) {

            var patientPrograms = this.data.data.programs[program].patient_programs;

            var result = null;

            var pKeys = Object.keys(patientPrograms);

            for (var i = 0; i < pKeys.length; i++) {

                var key = pKeys[i];

                if (!patientPrograms[key].date_completed) {

                    if (patientPrograms[key].visits && patientPrograms[key].visits[visit]) {

                        if (patientPrograms[key].visits[visit][encounter]) {

                            for (var j = 0; j < patientPrograms[key].visits[visit][encounter].length; j++) {

                                if (patientPrograms[key].visits[visit][encounter][j][concept]) {

                                    result = patientPrograms[key].visits[visit][encounter][j][concept].response.value;

                                    return result;

                                }

                            }

                        }

                    }

                }

            }

        } else {

            return null;

        }

    },

    queryExistingEncounters: function (program, visit, encounter) {

        var result = false;

        if (this.data && this.data.data && this.data.data.programs && this.data.data.programs[program] &&
            Object.keys(this.data.data.programs).length > 0) {

            var patientPrograms = this.data.data.programs[program].patient_programs;

            var pKeys = Object.keys(patientPrograms);

            for (var i = 0; i < pKeys.length; i++) {

                var key = pKeys[i];

                if (!patientPrograms[key].date_completed) {

                    if (patientPrograms[key].visits && patientPrograms[key].visits[visit]) {

                        if (patientPrograms[key].visits[visit][encounter]) {

                            result = true;

                            break;

                        }

                    }

                }

            }

        }

        return result;

    },

    queryAnyExistingEncounters: function (program, encounter) {

        if (this.data && this.data.data && this.data.data.programs && this.data.data.programs[program] &&
            Object.keys(this.data.data.programs).length > 0) {

            var patientPrograms = this.data.data.programs[program].patient_programs;

            var result = false;

            var pKeys = Object.keys(patientPrograms);

            for (var i = 0; i < pKeys.length; i++) {

                var key = pKeys[i];

                if (!patientPrograms[key].date_completed) {

                    var vKeys = Object.keys(patientPrograms[key].visits);

                    for (var j = 0; j < vKeys.length; j++) {

                        var visit = vKeys[j];

                        if (patientPrograms[key].visits[visit][encounter]) {

                            result = true;

                            return result;

                            break;

                        }

                    }

                }

            }

        }

        return result;

    },

    queryAnyExistingProgramObs: function (program, concept) {

        if (this.data && this.data.data && this.data.data.programs && this.data.data.programs[program] &&
            Object.keys(this.data.data.programs).length > 0) {

            var patientPrograms = this.data.data.programs[program].patient_programs;

            var result = false;

            var pKeys = Object.keys(patientPrograms);

            for (var i = 0; i < pKeys.length; i++) {

                var key = pKeys[i];

                if (!patientPrograms[key].date_completed) {

                    var vKeys = Object.keys(patientPrograms[key].visits);

                    for (var j = 0; j < vKeys.length; j++) {

                        var visit = vKeys[j];

                        var eKeys = Object.keys(patientPrograms[key].visits[visit]);

                        for (var k = 0; k < eKeys.length; k++) {

                            var encounter = eKeys[k];

                            if (patientPrograms[key].visits[visit][encounter][concept]) {

                                result = true;

                                return result;

                                break;

                            }

                        }

                    }

                }

            }

        }

        return result;

    },

    queryAnyExistingObs: function (concept) {

        var result = false;

        var programs = Object.keys(dashboard.data.data.programs);

        for (var p = 0; p < programs.length; p++) {

            var program = programs[p];

            if (this.data && this.data.data && this.data.data.programs && this.data.data.programs[program] &&
                Object.keys(this.data.data.programs).length > 0) {

                var patientPrograms = this.data.data.programs[program].patient_programs;

                var pKeys = Object.keys(patientPrograms);

                for (var i = 0; i < pKeys.length; i++) {

                    var key = pKeys[i];

                    if (!patientPrograms[key].date_completed) {

                        var vKeys = Object.keys(patientPrograms[key].visits);

                        for (var j = 0; j < vKeys.length; j++) {

                            var visit = vKeys[j];

                            var eKeys = Object.keys(patientPrograms[key].visits[visit]);

                            for (var k = 0; k < eKeys.length; k++) {

                                var encounter = eKeys[k];

                                var oKeys = Object.keys(patientPrograms[key].visits[visit][encounter]);

                                for (var l = 0; l < oKeys.length; l++) {

                                    if (patientPrograms[key].visits[visit][encounter][l][concept]) {

                                        result = true;

                                        break;

                                    }

                                }

                            }

                            if (result)
                                break;

                        }

                    }

                    if (result)
                        break;

                }

            }

            if (result)
                break;

        }

        return result;

    },

    getAnyExistingEncounters: function (program, encounter) {

        if (this.data && this.data.data && this.data.data.programs && this.data.data.programs[program] &&
            Object.keys(this.data.data.programs).length > 0) {

            var patientPrograms = this.data.data.programs[program].patient_programs;

            var result = [];

            var pKeys = Object.keys(patientPrograms);

            for (var i = 0; i < pKeys.length; i++) {

                var key = pKeys[i];

                if (!patientPrograms[key].date_completed) {

                    var vKeys = Object.keys(patientPrograms[key].visits);

                    for (var j = 0; j < vKeys.length; j++) {

                        var visit = vKeys[j];

                        if (patientPrograms[key].visits[visit][encounter]) {

                            result = patientPrograms[key].visits[visit][encounter];

                            return result;

                            break;

                        }

                    }

                }

            }

        }

        return result;

    },

    queryExistingObsArray: function (concept, callback) {

        var result = {};

        var programs = (dashboard.data && dashboard.data.data && dashboard.data.data.programs ?
            Object.keys(dashboard.data.data.programs) : []);

        for (var p = 0; p < programs.length; p++) {

            var program = programs[p];

            if (this.data && this.data.data && this.data.data.programs && this.data.data.programs[program] &&
                Object.keys(this.data.data.programs).length > 0) {

                var patientPrograms = this.data.data.programs[program].patient_programs;

                var pKeys = Object.keys(patientPrograms);

                for (var i = 0; i < pKeys.length; i++) {

                    var key = pKeys[i];

                    if (!patientPrograms[key].date_completed) {

                        var vKeys = Object.keys(patientPrograms[key].visits);

                        for (var j = 0; j < vKeys.length; j++) {

                            var visit = vKeys[j];

                            var eKeys = Object.keys(patientPrograms[key].visits[visit]);

                            for (var k = 0; k < eKeys.length; k++) {

                                var encounter = eKeys[k];

                                var oKeys = Object.keys(patientPrograms[key].visits[visit][encounter]);

                                for (var l = 0; l < oKeys.length; l++) {

                                    if (patientPrograms[key].visits[visit][encounter][l][concept]) {

                                        result[visit] = patientPrograms[key].visits[visit][encounter][l][concept].response.value;

                                    }

                                }

                            }

                        }

                    }

                }

            }

        }

        if (callback) {

            callback(result);

        } else {

            return result;

        }

    },

    queryExistingObsComplexArray: function (concept, callback, specificConcept) {

        var result = {};

        var programs = Object.keys(dashboard.data.data.programs);

        for (var p = 0; p < programs.length; p++) {

            var program = programs[p];

            if (this.data && this.data.data && this.data.data.programs && this.data.data.programs[program] &&
                Object.keys(this.data.data.programs).length > 0) {

                var patientPrograms = this.data.data.programs[program].patient_programs;

                var pKeys = Object.keys(patientPrograms);

                for (var i = 0; i < pKeys.length; i++) {

                    var key = pKeys[i];

                    if (!patientPrograms[key].date_completed) {

                        var vKeys = Object.keys(patientPrograms[key].visits);

                        for (var j = 0; j < vKeys.length; j++) {

                            var visit = vKeys[j];

                            var eKeys = Object.keys(patientPrograms[key].visits[visit]);

                            for (var k = 0; k < eKeys.length; k++) {

                                var encounter = eKeys[k];

                                var oKeys = Object.keys(patientPrograms[key].visits[visit][encounter]);

                                for (var l = 0; l < oKeys.length; l++) {

                                    if (patientPrograms[key].visits[visit][encounter][l][concept] &&
                                        (specificConcept ? (specificConcept == patientPrograms[key].visits[visit][
                                            encounter][l][concept].response.value ? true : false) : true)) {

                                        if (!result[visit])
                                            result[visit] = [];

                                        var entry = {};

                                        entry[patientPrograms[key].visits[visit][encounter][l][concept].response.value] =
                                        {
                                            UUID: patientPrograms[key].visits[visit][encounter][l][concept].UUID,
                                            data: dashboard.queryObsGroupChildren(
                                                patientPrograms[key].visits[visit][encounter][l][concept].obs_id,
                                                visit, encounter, key, program
                                            )
                                        };

                                        result[visit].push(entry);

                                    }

                                }

                            }

                        }

                    }

                }

            }

        }

        if (callback) {

            callback(result);

        } else {

            return result;

        }

    },

    queryObsGroupChildren: function (obs_id, visitDate, encounter, patientProgramUUID, program) {

        if (!obs_id || !visitDate || !encounter || !patientProgramUUID || !program)
            return [];

        var obs = [];

        var root = dashboard.data.data.programs[program].patient_programs[patientProgramUUID].visits[visitDate][encounter];

        for (var i = 0; i < root.length; i++) {

            var concept = Object.keys(root[i])[0];

            var node = root[i];

            if (node[concept] && node[concept].obs_group_id != null && node[concept].obs_group_id == obs_id) {

                obs.push(node);

            }

        }

        return obs;

    },

    queryCurrentVisit: function (callback) {

        var result;

        var currentProgram = dashboard.getCookie("currentProgram");

        currentProgram = (!currentProgram.match(/program/i) ? currentProgram + " PROGRAM" : currentProgram);

        var programs = dashboard.data.data.programs[currentProgram];

        if (!programs)
            if (callback)
                return callback(result);
            else
                return result;

        if (Object.keys(programs).length <= 0)
            if (callback)
                return callback(result);
            else
                return result;

        var today = (dashboard.getCookie("today").trim().length > 0 ? (new Date(dashboard.getCookie("today").trim())) :
            (new Date())).format("YYYY-mm-dd");

        result = Object.keys(programs.patient_programs).map(function (e) {
            return e;
        }).map(function (e) {
            return (programs.patient_programs[e].visits && Object.keys(programs.patient_programs[e].visits).indexOf(today) >= 0 ?
                programs.patient_programs[e].visits[today] : null)
        }).reduce(function (a, e, i) {

            if (e)
                a.push(e);

            return a;

        }, [])

        if (Array.isArray(result) && result.length == 1)
            result = result[0];

        if (callback)
            return callback(result);
        else
            return result;

    },

    setCookie: function (cname, cvalue, exdays, base) {

        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + "; path=" + (base ? base : "/");

    },

    getCookie: function (cname) {

        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";

    },

    setData: function (key, data) {
        this[key] = data;
    },

    getData: function (key) {
        return this[key];
    },

    sheet: function (target) {
        // Create the <style> tag
        var style = document.createElement("style");

        style.appendChild(document.createTextNode(""));

        if (target) {

            target.appendChild(style);

        } else {
            // Add the <style> element to the page
            document.head.appendChild(style);

        }

        return style.sheet;
    },

    addCSSRule: function (sheet, selector, rules, index) {

        if ("insertRule" in sheet) {
            sheet.insertRule(selector + "{" + rules + "}", (index || 0));
        }
        else if ("addRule" in sheet) {
            sheet.addRule(selector, rules, index);
        }

    },

    padZeros: function (number, positions) {
        var zeros = parseInt(positions) - String(number).length;
        var padded = "";

        for (var i = 0; i < zeros; i++) {
            padded += "0";
        }

        padded += String(number);

        return padded;
    },

    getAge: function (birthdate, estimated) {

        var age;

        if ((new Date(birthdate)) === "Invalid Date") {

            return ["???", undefined, undefined];

        }

        if ((((new Date()) - (new Date(birthdate))) / (365 * 24 * 60 * 60 * 1000)) > 1) {

            var num = Math.round((((new Date()) - (new Date(birthdate))) / (365 * 24 * 60 * 60 * 1000)), 0);

            age = [num, num + "Y", "Y"];

        } else if ((((new Date()) - (new Date(birthdate))) / (30 * 24 * 60 * 60 * 1000)) > 1) {

            var num = Math.round((((new Date()) - (new Date(birthdate))) / (30 * 24 * 60 * 60 * 1000)), 0);

            age = [num, num + "M", "M"];

        } else if ((((new Date()) - (new Date(birthdate))) / (7 * 24 * 60 * 60 * 1000)) > 1) {

            var num = Math.round((((new Date()) - (new Date(birthdate))) / (7 * 24 * 60 * 60 * 1000)), 0);

            age = [num, num + "W", "W"];

        } else if ((((new Date()) - (new Date(birthdate))) / (24 * 60 * 60 * 1000)) > 1) {

            var num = Math.round((((new Date()) - (new Date(birthdate))) / (24 * 60 * 60 * 1000)), 0);

            age = [num, num + "D", "D"];

        } else if ((((new Date()) - (new Date(birthdate))) / (60 * 60 * 1000)) > 1) {

            var num = Math.round((((new Date()) - (new Date(birthdate))) / (60 * 60 * 1000)), 0);

            age = [num, num + "H", "H"];

        } else {

            var num = "< 1H";

            age = [num, num, num];

        }

        age[0] = (estimated != undefined && parseInt(estimated) == 1 ? "~" + age[0] : age[0]);

        return age;

    },

    buildPage: function () {

        var style = this.sheet();
        this.addCSSRule(style, "body", "padding: 0px !important");
        this.addCSSRule(style, "body", "overflow: hidden");
        this.addCSSRule(style, "body", "margin: 0px");
        this.addCSSRule(style, ".headTab", "width: 100%");
        this.addCSSRule(style, ".headTab", "box-shadow: 5px 2px 5px 0px rgba(0,0,0,0.75)");
        this.addCSSRule(style, ".headTab", "overflow: hidden");
        this.addCSSRule(style, ".headTab", "height: 120px");
        this.addCSSRule(style, ".headTab", "border: 1px solid #004586");
        this.addCSSRule(style, ".blueText", "color: #3c60b1");

        this.addCSSRule(style, "button", "font-size: 22px !important");
        this.addCSSRule(style, "button", "padding: 15px;");
        this.addCSSRule(style, "button", "min-width: 120px");
        this.addCSSRule(style, "button", "cursor: pointer");
        this.addCSSRule(style, "button", "min-height: 55px");
        this.addCSSRule(style, "button", "border-radius: 5px !important");
        this.addCSSRule(style, "button", "margin: 3px");

        this.addCSSRule(style, "button:active", "background-color: #ffc579 !important");
        this.addCSSRule(style, "button:active", "background-image: -webkit-gradient(linear, left top, left bottom, from(#ffc579), to(#fb9d23)) !important");
        this.addCSSRule(style, "button:active", "background-image: -webkit-linear-gradient(top, #ffc579, #fb9d23) !important");
        this.addCSSRule(style, "button:active", "background-image: -moz-linear-gradient(top, #ffc579, #fb9d23) !important");
        this.addCSSRule(style, "button:active", "background-image: -ms-linear-gradient(top, #ffc579, #fb9d23) !important");
        this.addCSSRule(style, "button:active", "background-image: -o-linear-gradient(top, #ffc579, #fb9d23) !important");
        this.addCSSRule(style, "button:active", "background-image: linear-gradient(to bottom, #ffc579, #fb9d23)");
        this.addCSSRule(style, "button:active", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#ffc579, endColorstr=#fb9d23) !important");

        this.addCSSRule(style, ".blue", "border: 1px solid #7eb9d0");
        this.addCSSRule(style, ".blue", "-webkit-border-radius: 3px");
        this.addCSSRule(style, ".blue", "-moz-border-radius: 3px");
        this.addCSSRule(style, ".blue", "border-radius: 3px");
        this.addCSSRule(style, ".blue", "font-size: 28px");
        this.addCSSRule(style, ".blue", "font-family: arial, helvetica, sans-serif");
        this.addCSSRule(style, ".blue", "padding: 10px 10px 10px 10px");
        this.addCSSRule(style, ".blue", "text-decoration: none");
        this.addCSSRule(style, ".blue", "display: inline-block");
        this.addCSSRule(style, ".blue", "text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3)");
        this.addCSSRule(style, ".blue", "font-weight: bold");
        this.addCSSRule(style, ".blue", "color: #FFFFFF");
        this.addCSSRule(style, ".blue", "background-color: #a7cfdf");
        this.addCSSRule(style, ".blue", "background-image: -webkit-gradient(linear, left top, left bottom, from(#a7cfdf), to(#23538a))");
        this.addCSSRule(style, ".blue", "background-image: -webkit-linear-gradient(top, #a7cfdf, #23538a)");
        this.addCSSRule(style, ".blue", "background-image: -moz-linear-gradient(top, #a7cfdf, #23538a)");
        this.addCSSRule(style, ".blue", "background-image: -ms-linear-gradient(top, #a7cfdf, #23538a)");
        this.addCSSRule(style, ".blue", "background-image: -o-linear-gradient(top, #a7cfdf, #23538a)");
        this.addCSSRule(style, ".blue", "background-image: linear-gradient(to bottom, #a7cfdf, #23538a)");
        this.addCSSRule(style, ".blue", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#a7cfdf, endColorstr=#23538a)");

        this.addCSSRule(style, ".blue:hover", "border: 1px solid #5ca6c4");
        this.addCSSRule(style, ".blue:hover", "background-color: #82bbd1");
        this.addCSSRule(style, ".blue:hover", "background-image: -webkit-gradient(linear, left top, left bottom, from(#82bbd1), to(#193b61))");
        this.addCSSRule(style, ".blue:hover", "background-image: -webkit-linear-gradient(top, #82bbd1, #193b61)");
        this.addCSSRule(style, ".blue:hover", "background-image: -moz-linear-gradient(top, #82bbd1, #193b61)");
        this.addCSSRule(style, ".blue:hover", "background-image: -ms-linear-gradient(top, #82bbd1, #193b61)");
        this.addCSSRule(style, ".blue:hover", "background-image: -o-linear-gradient(top, #82bbd1, #193b61)");
        this.addCSSRule(style, ".blue:hover", "background-image: linear-gradient(to bottom, #82bbd1, #193b61)");
        this.addCSSRule(style, ".blue:hover", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#82bbd1, endColorstr=#193b61)");

        this.addCSSRule(style, ".green", "border: 1px solid #34740e");
        this.addCSSRule(style, ".green", "-webkit-border-radius: 3px");
        this.addCSSRule(style, ".green", "-moz-border-radius: 3px");
        this.addCSSRule(style, ".green", "border-radius: 3px");
        this.addCSSRule(style, ".green", "font-size: 28px");
        this.addCSSRule(style, ".green", "font-family: arial, helvetica, sans-serif");
        this.addCSSRule(style, ".green", "padding: 10px 10px 10px 10px");
        this.addCSSRule(style, ".green", "text-decoration: none");
        this.addCSSRule(style, ".green", "display: inline-block");
        this.addCSSRule(style, ".green", "text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3)");
        this.addCSSRule(style, ".green", "font-weight: bold");
        this.addCSSRule(style, ".green", "color: #FFFFFF");
        this.addCSSRule(style, ".green", "background-color: #4ba614");
        this.addCSSRule(style, ".green", "background-image: -webkit-gradient(linear, left top, left bottom, from(#4ba614), to(#008c00))");
        this.addCSSRule(style, ".green", "background-image: -webkit-linear-gradient(top, #4ba614, #008c00)");
        this.addCSSRule(style, ".green", "background-image: -moz-linear-gradient(top, #4ba614, #008c00)");
        this.addCSSRule(style, ".green", "background-image: -ms-linear-gradient(top, #4ba614, #008c00)");
        this.addCSSRule(style, ".green", "background-image: -o-linear-gradient(top, #4ba614, #008c00)");
        this.addCSSRule(style, ".green", "background-image: linear-gradient(to bottom, #4ba614, #008c00)");
        this.addCSSRule(style, ".green", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#4ba614, endColorstr=#008c00)");

        this.addCSSRule(style, ".green:hover", "border: 1px solid #224b09");
        this.addCSSRule(style, ".green:hover", "background-color: #36780f");
        this.addCSSRule(style, ".green:hover", "background-image: -webkit-gradient(linear, left top, left bottom, from(#36780f), to(#005900))");
        this.addCSSRule(style, ".green:hover", "background-image: -webkit-linear-gradient(top, #36780f, #005900)");
        this.addCSSRule(style, ".green:hover", "background-image: -moz-linear-gradient(top, #36780f, #005900)");
        this.addCSSRule(style, ".green:hover", "background-image: -ms-linear-gradient(top, #36780f, #005900)");
        this.addCSSRule(style, ".green:hover", "background-image: -o-linear-gradient(top, #36780f, #005900)");
        this.addCSSRule(style, ".green:hover", "background-image: linear-gradient(to bottom, #36780f, #005900)");
        this.addCSSRule(style, ".green:hover", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#36780f, endColorstr=#005900)");

        this.addCSSRule(style, ".red", "border: 1px solid #72021c");
        this.addCSSRule(style, ".red", "-webkit-border-radius: 3px");
        this.addCSSRule(style, ".red", "-moz-border-radius: 3px");
        this.addCSSRule(style, ".red", "border-radius: 3px");
        this.addCSSRule(style, ".red", "font-size: 28px");
        this.addCSSRule(style, ".red", "font-family: arial, helvetica, sans-serif");
        this.addCSSRule(style, ".red", "padding: 10px 10px 10px 10px");
        this.addCSSRule(style, ".red", "text-decoration: none");
        this.addCSSRule(style, ".red", "display: inline-block");
        this.addCSSRule(style, ".red", "text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3)");
        this.addCSSRule(style, ".red", "font-weight: bold");
        this.addCSSRule(style, ".red", "color: #FFFFFF");
        this.addCSSRule(style, ".red", "background-color: #a90329");
        this.addCSSRule(style, ".red", "background-image: -webkit-gradient(linear, left top, left bottom, from(#a90329), to(#6d0019))");
        this.addCSSRule(style, ".red", "background-image: -webkit-linear-gradient(top, #a90329, #6d0019)");
        this.addCSSRule(style, ".red", "background-image: -moz-linear-gradient(top, #a90329, #6d0019)");
        this.addCSSRule(style, ".red", "background-image: -ms-linear-gradient(top, #a90329, #6d0019)");
        this.addCSSRule(style, ".red", "background-image: -o-linear-gradient(top, #a90329, #6d0019)");
        this.addCSSRule(style, ".red", "background-image: linear-gradient(to bottom, #a90329, #6d0019)");
        this.addCSSRule(style, ".red", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#a90329, endColorstr=#6d0019)");

        this.addCSSRule(style, ".red:hover", "border: 1px solid #450111");
        this.addCSSRule(style, ".red:hover", "background-color: #77021d");
        this.addCSSRule(style, ".red:hover", "background-image: -webkit-gradient(linear, left top, left bottom, from(#77021d), to(#3a000d))");
        this.addCSSRule(style, ".red:hover", "background-image: -webkit-linear-gradient(top, #77021d, #3a000d)");
        this.addCSSRule(style, ".red:hover", "background-image: -moz-linear-gradient(top, #77021d, #3a000d)");
        this.addCSSRule(style, ".red:hover", "background-image: -ms-linear-gradient(top, #77021d, #3a000d)");
        this.addCSSRule(style, ".red:hover", "background-image: -o-linear-gradient(top, #77021d, #3a000d)");
        this.addCSSRule(style, ".red:hover", "background-image: linear-gradient(to bottom, #77021d, #3a000d)");
        this.addCSSRule(style, ".red:hover", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#77021d, endColorstr=#3a000d)");

        this.addCSSRule(style, ".gray", "border: 1px solid #ccc");
        this.addCSSRule(style, ".gray", "-webkit-border-radius: 3px");
        this.addCSSRule(style, ".gray", "-moz-border-radius: 3px");
        this.addCSSRule(style, ".gray", "border-radius: 3px");
        this.addCSSRule(style, ".gray", "font-size: 28px");
        this.addCSSRule(style, ".gray", "font-family: arial, helvetica, sans-serif");
        this.addCSSRule(style, ".gray", "padding: 10px 10px 10px 10px");
        this.addCSSRule(style, ".gray", "text-decoration: none");
        this.addCSSRule(style, ".gray", "display: inline-block");
        this.addCSSRule(style, ".gray", "text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3)");
        this.addCSSRule(style, ".gray", "font-weight: bold");
        this.addCSSRule(style, ".gray", "color: #FFFFFF");
        this.addCSSRule(style, ".gray", "background-color: #ccc");
        this.addCSSRule(style, ".gray", "background-image: -webkit-gradient(linear, left top, left bottom, from(#ccc), to(#999))");
        this.addCSSRule(style, ".gray", "background-image: -webkit-linear-gradient(top, #ccc, #999)");
        this.addCSSRule(style, ".gray", "background-image: -moz-linear-gradient(top, #ccc, #999)");
        this.addCSSRule(style, ".gray", "background-image: -ms-linear-gradient(top, #ccc, #999)");
        this.addCSSRule(style, ".gray", "background-image: -o-linear-gradient(top, #ccc, #999)");
        this.addCSSRule(style, ".gray", "background-image: linear-gradient(to bottom, #ccc, #999)");
        this.addCSSRule(style, ".gray", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#ccc, endColorstr=#999)");

        this.addCSSRule(style, ".gray:hover", "border: 1px solid #ccc");
        this.addCSSRule(style, ".gray:hover", "background-color: #ddd");
        this.addCSSRule(style, ".gray:hover", "background-image: -webkit-gradient(linear, left top, left bottom, from(#333), to(#ccc))");
        this.addCSSRule(style, ".gray:hover", "background-image: -webkit-linear-gradient(top, #333, #ccc)");
        this.addCSSRule(style, ".gray:hover", "background-image: -moz-linear-gradient(top, #333, #ccc)");
        this.addCSSRule(style, ".gray:hover", "background-image: -ms-linear-gradient(top, #333, #ccc)");
        this.addCSSRule(style, ".gray:hover", "background-image: -o-linear-gradient(top, #333, #ccc)");
        this.addCSSRule(style, ".gray:hover", "background-image: linear-gradient(to bottom, #333, #ccc)");
        this.addCSSRule(style, ".gray:hover", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#333, endColorstr=#ccc)");

        this.addCSSRule(style, ".disabled", "background-color: #ccc");
        this.addCSSRule(style, ".disabled", "color: #999");

        var img = document.createElement("img");
        img.style.position = "absolute";
        img.style.top = "10px"
        img.id = "network";
        img.height = 30;
        img.style.right = "20px";
        img.style.zIndex = 999;

        document.body.appendChild(img);

        var table = document.createElement("table");
        table.width = "100%";
        table.border = 0;
        table.style.font = "14px \"Lucida Grande\", Helvetica, Arial, sans-serif";
        table.style.MozUserSelect = "none";
        table.style.borderCollapse = "collapse";

        document.body.appendChild(table);

        var tr1 = document.createElement("tr");

        table.appendChild(tr1);

        var td1_1 = document.createElement("td");
        td1_1.style.width = "25%";
        td1_1.style.padding = "5px";
        td1_1.style.paddingLeft = "15px";

        tr1.appendChild(td1_1);

        var div1 = document.createElement("div");
        div1.className = "headTab";
        div1.id = "tableDiv1";

        td1_1.appendChild(div1);

        var tableDiv1 = document.createElement("table");
        tableDiv1.cellPadding = 1;
        tableDiv1.width = "100%";

        div1.appendChild(tableDiv1);

        var trDiv1_1 = document.createElement("tr");

        tableDiv1.appendChild(trDiv1_1);

        var thDiv1_1_1 = document.createElement("th");
        thDiv1_1_1.style.fontSize = "24px";
        thDiv1_1_1.style.textAlign = "left";
        thDiv1_1_1.style.width = "100%";
        thDiv1_1_1.style.overflow = "hidden";
        thDiv1_1_1.style.fontWeight = "normal";
        thDiv1_1_1.style.padding = "5px";
        thDiv1_1_1.id = "patient_name";
        thDiv1_1_1.className = "blueText";
        thDiv1_1_1.innerHTML = "Patient Name";

        trDiv1_1.appendChild(thDiv1_1_1);

        var trDiv1_2 = document.createElement("tr");

        tableDiv1.appendChild(trDiv1_2);

        var thDiv1_2_1 = document.createElement("th");
        thDiv1_2_1.style.textAlign = "left";
        thDiv1_2_1.style.fontSize = "14px";
        thDiv1_2_1.style.paddingLeft = "5px";
        thDiv1_2_1.style.borderBottom = "1px solid #004586";
        thDiv1_2_1.className = "blueText";
        thDiv1_2_1.innerHTML = "Identifiers";

        trDiv1_2.appendChild(thDiv1_2_1);

        var trDiv1_3 = document.createElement("tr");

        tableDiv1.appendChild(trDiv1_3);

        var tdDiv1_3_1 = document.createElement("td");

        tableDiv1.appendChild(tdDiv1_3_1);

        var tableDiv1_3_1 = document.createElement("table");
        tableDiv1_3_1.width = "100%";
        tableDiv1_3_1.style.fontSize = "12px";

        tdDiv1_3_1.appendChild(tableDiv1_3_1);

        var trDiv1_3_1_1 = document.createElement("tr");

        tableDiv1_3_1.appendChild(trDiv1_3_1_1);

        var tdDiv1_3_1_1_1 = document.createElement("td");
        tdDiv1_3_1_1_1.style.textAlign = "right";
        tdDiv1_3_1_1_1.style.fontWeight = "bold";
        tdDiv1_3_1_1_1.className = "blueText";
        tdDiv1_3_1_1_1.id = "primary_id_label";
        tdDiv1_3_1_1_1.innerHTML = "National ID";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_1);

        var tdDiv1_3_1_1_2 = document.createElement("td");
        tdDiv1_3_1_1_2.style.textAlign = "center";
        tdDiv1_3_1_1_2.style.width = "3px";
        tdDiv1_3_1_1_2.innerHTML = ":";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_2);

        var tdDiv1_3_1_1_3 = document.createElement("td");
        tdDiv1_3_1_1_3.id = "primary_id";
        tdDiv1_3_1_1_3.innerHTML = "&nbsp;";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_3);

        var trDiv1_3_1_2 = document.createElement("tr");

        tableDiv1_3_1.appendChild(trDiv1_3_1_2);

        var tdDiv1_3_1_2_1 = document.createElement("td");
        tdDiv1_3_1_2_1.style.textAlign = "right";
        tdDiv1_3_1_2_1.style.fontWeight = "bold";
        tdDiv1_3_1_2_1.className = "blueText";
        tdDiv1_3_1_2_1.id = "other_id_label";
        tdDiv1_3_1_2_1.innerHTML = "&nbsp;";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_1);

        var tdDiv1_3_1_2_2 = document.createElement("td");
        tdDiv1_3_1_2_2.style.textAlign = "center";
        tdDiv1_3_1_2_2.style.width = "3px";
        tdDiv1_3_1_2_2.innerHTML = ":";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_2);

        var tdDiv1_3_1_2_3 = document.createElement("td");
        tdDiv1_3_1_2_3.id = "other_id";
        tdDiv1_3_1_2_3.innerHTML = "&nbsp;";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_3);

        var td1_2 = document.createElement("td");
        td1_2.style.width = "25%";
        td1_2.style.padding = "5px";

        tr1.appendChild(td1_2);

        var div2 = document.createElement("div");
        div2.className = "headTab";

        td1_2.appendChild(div2);

        var tableDiv2 = document.createElement("table");
        tableDiv2.cellpadding = 1;
        tableDiv2.width = "100%";
        tableDiv2.style.fontSize = "14px";

        div2.appendChild(tableDiv2);

        var trDiv2_1 = document.createElement("tr");

        tableDiv2.appendChild(trDiv2_1);

        var tdDiv2_1_1 = document.createElement("td");
        tdDiv2_1_1.style.textAlign = "right";
        tdDiv2_1_1.style.fontWeight = "bold";
        tdDiv2_1_1.style.width = "100px";
        tdDiv2_1_1.className = "blueText";
        tdDiv2_1_1.innerHTML = "Gender";

        trDiv2_1.appendChild(tdDiv2_1_1);

        var tdDiv2_1_2 = document.createElement("td");
        tdDiv2_1_2.style.textAlign = "center";
        tdDiv2_1_2.style.width = "3px";
        tdDiv2_1_2.innerHTML = ":";

        trDiv2_1.appendChild(tdDiv2_1_2);

        var tdDiv2_1_3 = document.createElement("td");
        tdDiv2_1_3.id = "gender";
        tdDiv2_1_3.innerHTML = "&nbsp;";

        trDiv2_1.appendChild(tdDiv2_1_3);

        var trDiv2_2 = document.createElement("tr");

        tableDiv2.appendChild(trDiv2_2);

        var tdDiv2_2_1 = document.createElement("td");
        tdDiv2_2_1.style.textAlign = "right";
        tdDiv2_2_1.style.fontWeight = "bold";
        tdDiv2_2_1.className = "blueText";
        tdDiv2_2_1.innerHTML = "Age";

        trDiv2_2.appendChild(tdDiv2_2_1);

        var tdDiv2_2_2 = document.createElement("td");
        tdDiv2_2_2.style.textAlign = "center";
        tdDiv2_2_2.style.width = "3px";
        tdDiv2_2_2.innerHTML = ":";

        trDiv2_2.appendChild(tdDiv2_2_2);

        var tdDiv2_2_3 = document.createElement("td");
        tdDiv2_2_3.id = "age";
        tdDiv2_2_3.innerHTML = "&nbsp;";

        trDiv2_2.appendChild(tdDiv2_2_3);

        var trDiv2_3 = document.createElement("tr");

        tableDiv2.appendChild(trDiv2_3);

        var tdDiv2_3_1 = document.createElement("td");
        tdDiv2_3_1.style.textAlign = "right";
        tdDiv2_3_1.style.fontWeight = "bold";
        tdDiv2_3_1.style.verticalAlign = "top";
        tdDiv2_3_1.className = "blueText";
        tdDiv2_3_1.innerHTML = "Address";

        trDiv2_3.appendChild(tdDiv2_3_1);

        var tdDiv2_3_2 = document.createElement("td");
        tdDiv2_3_2.style.textAlign = "center";
        tdDiv2_3_2.style.width = "3px";
        tdDiv2_3_2.style.verticalAlign = "top";
        tdDiv2_3_2.innerHTML = ":";

        trDiv2_3.appendChild(tdDiv2_3_2);

        var tdDiv2_3_3 = document.createElement("td");
        tdDiv2_3_3.id = "addressl1";
        tdDiv2_3_3.innerHTML = "Village,";

        trDiv2_3.appendChild(tdDiv2_3_3);

        var trDiv2_4 = document.createElement("tr");

        tableDiv2.appendChild(trDiv2_4);

        var tdDiv2_4_1 = document.createElement("td");
        tdDiv2_4_1.style.textAlign = "right";
        tdDiv2_4_1.style.fontWeight = "bold";
        tdDiv2_4_1.className = "blueText";
        tdDiv2_4_1.innerHTML = "&nbsp;";

        trDiv2_4.appendChild(tdDiv2_4_1);

        var tdDiv2_4_2 = document.createElement("td");
        tdDiv2_4_2.style.textAlign = "center";
        tdDiv2_4_2.style.width = "3px";
        tdDiv2_4_2.innerHTML = "&nbsp;";

        trDiv2_4.appendChild(tdDiv2_4_2);

        var tdDiv2_4_3 = document.createElement("td");
        tdDiv2_4_3.id = "addressl2";
        tdDiv2_4_3.innerHTML = "T/A,";

        trDiv2_4.appendChild(tdDiv2_4_3);

        var trDiv2_5 = document.createElement("tr");

        tableDiv2.appendChild(trDiv2_5);

        var tdDiv2_5_1 = document.createElement("td");
        tdDiv2_5_1.style.textAlign = "right";
        tdDiv2_5_1.style.fontWeight = "bold";
        tdDiv2_5_1.className = "blueText";
        tdDiv2_5_1.innerHTML = "Phone";

        trDiv2_5.appendChild(tdDiv2_5_1);

        var tdDiv2_5_2 = document.createElement("td");
        tdDiv2_5_2.style.textAlign = "center";
        tdDiv2_5_2.style.width = "3px";
        tdDiv2_5_2.innerHTML = ":";

        trDiv2_5.appendChild(tdDiv2_5_2);

        var tdDiv2_5_3 = document.createElement("td");
        tdDiv2_5_3.id = "phone_number";
        tdDiv2_5_3.innerHTML = "&nbsp;";

        trDiv2_5.appendChild(tdDiv2_5_3);

        var td1_3 = document.createElement("td");
        td1_3.style.width = "25%";
        td1_3.style.padding = "5px";

        tr1.appendChild(td1_3);

        var div3 = document.createElement("div");
        div3.className = "headTab";

        td1_3.appendChild(div3);

        var tableDiv3 = document.createElement("table");
        tableDiv3.cellpadding = 1;
        tableDiv3.width = "100%";
        tableDiv3.style.fontSize = "14px";

        div3.appendChild(tableDiv3);

        var trDiv3_1 = document.createElement("tr");

        tableDiv3.appendChild(trDiv3_1);

        var tdDiv3_1_1 = document.createElement("td");
        tdDiv3_1_1.style.textAlign = "right";
        tdDiv3_1_1.style.fontWeight = "bold";
        tdDiv3_1_1.style.width = "100px";
        tdDiv3_1_1.className = "blueText";
        tdDiv3_1_1.innerHTML = "BP";

        trDiv3_1.appendChild(tdDiv3_1_1);

        var tdDiv3_1_2 = document.createElement("td");
        tdDiv3_1_2.style.textAlign = "center";
        tdDiv3_1_2.style.width = "3px";
        tdDiv3_1_2.innerHTML = ":";

        trDiv3_1.appendChild(tdDiv3_1_2);

        var tdDiv3_1_3 = document.createElement("td");
        tdDiv3_1_3.id = "bp";
        tdDiv3_1_3.innerHTML = "120/80";

        trDiv3_1.appendChild(tdDiv3_1_3);

        var trDiv3_2 = document.createElement("tr");

        tableDiv3.appendChild(trDiv3_2);

        var tdDiv3_2_1 = document.createElement("td");
        tdDiv3_2_1.style.textAlign = "right";
        tdDiv3_2_1.style.fontWeight = "bold";
        tdDiv3_2_1.className = "blueText";
        tdDiv3_2_1.innerHTML = "Temperature";

        trDiv3_2.appendChild(tdDiv3_2_1);

        var tdDiv3_2_2 = document.createElement("td");
        tdDiv3_2_2.style.textAlign = "center";
        tdDiv3_2_2.style.width = "3px";
        tdDiv3_2_2.innerHTML = ":";

        trDiv3_2.appendChild(tdDiv3_2_2);

        var tdDiv3_2_3 = document.createElement("td");
        tdDiv3_2_3.id = "temperature";
        tdDiv3_2_3.innerHTML = "36<sup>o</sup>C";

        trDiv3_2.appendChild(tdDiv3_2_3);

        var trDiv3_3 = document.createElement("tr");

        tableDiv3.appendChild(trDiv3_3);

        var tdDiv3_3_1 = document.createElement("td");
        tdDiv3_3_1.style.textAlign = "right";
        tdDiv3_3_1.style.fontWeight = "bold";
        tdDiv3_3_1.className = "blueText";
        tdDiv3_3_1.innerHTML = "BMI";

        trDiv3_3.appendChild(tdDiv3_3_1);

        var tdDiv3_3_2 = document.createElement("td");
        tdDiv3_3_2.style.textAlign = "center";
        tdDiv3_3_2.style.width = "3px";
        tdDiv3_3_2.innerHTML = ":";

        trDiv3_3.appendChild(tdDiv3_3_2);

        var tdDiv3_3_3 = document.createElement("td");
        tdDiv3_3_3.id = "bmi";
        tdDiv3_3_3.innerHTML = "&nbsp;";

        trDiv3_3.appendChild(tdDiv3_3_3);

        var trDiv3_4 = document.createElement("tr");

        tableDiv3.appendChild(trDiv3_4);

        var tdDiv3_4_1 = document.createElement("td");
        tdDiv3_4_1.style.textAlign = "right";
        tdDiv3_4_1.style.fontWeight = "bold";
        tdDiv3_4_1.className = "blueText";
        tdDiv3_4_1.innerHTML = "Weight (kg)";

        trDiv3_4.appendChild(tdDiv3_4_1);

        var tdDiv3_4_2 = document.createElement("td");
        tdDiv3_4_2.style.textAlign = "center";
        tdDiv3_4_2.style.width = "3px";
        tdDiv3_4_2.innerHTML = ":";

        trDiv3_4.appendChild(tdDiv3_4_2);

        var tdDiv3_4_3 = document.createElement("td");
        tdDiv3_4_3.id = "weight";
        tdDiv3_4_3.innerHTML = "&nbsp;";

        trDiv3_4.appendChild(tdDiv3_4_3);

        var trDiv3_5 = document.createElement("tr");

        tableDiv3.appendChild(trDiv3_5);

        var tdDiv3_5_1 = document.createElement("td");
        tdDiv3_5_1.style.textAlign = "right";
        tdDiv3_5_1.style.fontWeight = "bold";
        tdDiv3_5_1.style.verticalAlign = "top";
        tdDiv3_5_1.className = "blueText";
        tdDiv3_5_1.innerHTML = "Allergies";

        trDiv3_5.appendChild(tdDiv3_5_1);

        var tdDiv3_5_2 = document.createElement("td");
        tdDiv3_5_2.style.textAlign = "center";
        tdDiv3_5_2.style.width = "3px";
        tdDiv3_5_2.innerHTML = ":";

        trDiv3_5.appendChild(tdDiv3_5_2);

        var tdDiv3_5_3 = document.createElement("td");
        tdDiv3_5_3.id = "allergies";
        tdDiv3_5_3.innerHTML = "&nbsp;";

        trDiv3_5.appendChild(tdDiv3_5_3);


        var td1_4 = document.createElement("td");
        td1_4.style.width = "25%";
        td1_4.style.padding = "5px";
        td1_4.style.paddingRight = "15px";

        tr1.appendChild(td1_4);

        var div4 = document.createElement("div");
        div4.className = "headTab";
        div4.id = "modApp";
        div4.style.textAlign = "center";
        div4.style.cursor = "pointer";

        div4.onclick = function () {

            if (dashboard.$("dashboard.navPanel")) {

                document.body.removeChild(dashboard.$("dashboard.navPanel"));

            }

            if (dashboard.$("dashboard.navChildPanel")) {

                document.body.removeChild(dashboard.$("dashboard.navChildPanel"));

            }

        }

        td1_4.appendChild(div4);

        var tr2 = document.createElement("tr");

        table.appendChild(tr2);

        var td2_1 = document.createElement("td");
        td2_1.style.width = "100%";
        td2_1.style.padding = "5px";
        td2_1.style.paddingRight = "15px";
        td2_1.style.paddingLeft = "15px";
        td2_1.colSpan = 4;

        tr2.appendChild(td2_1);

        var div2_1 = document.createElement("div");
        div2_1.id = "main";
        div2_1.style.width = "100%";
        div2_1.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";
        div2_1.style.overflow = "hidden";
        div2_1.style.height = "300px";
        div2_1.style.border = "1px solid #345db5";

        td2_1.appendChild(div2_1);

        var tableDiv2_1 = document.createElement("table");
        tableDiv2_1.width = "100%";
        tableDiv2_1.border = 1;
        tableDiv2_1.style.borderCollapse = "collapse";
        tableDiv2_1.style.border = "1px solid #345db5";
        tableDiv2_1.cellPadding = 5;
        tableDiv2_1.cellSpacing = 0;

        div2_1.appendChild(tableDiv2_1);

        var trDiv2_1 = document.createElement("tr");
        trDiv2_1.style.backgroundColor = "#345db5";

        tableDiv2_1.appendChild(trDiv2_1);

        var tdDiv2_1_1 = document.createElement("td");
        tdDiv2_1_1.style.width = "200px";
        tdDiv2_1_1.style.borderRight = "1px solid #fff";
        tdDiv2_1_1.style.color = "#fff";
        tdDiv2_1_1.style.textAlign = "left";
        tdDiv2_1_1.style.fontWeight = "bold";
        tdDiv2_1_1.style.paddingLeft = "10px";
        tdDiv2_1_1.innerHTML = "Programs";

        trDiv2_1.appendChild(tdDiv2_1_1);

        var tdDiv2_1_2 = document.createElement("td");
        tdDiv2_1_2.style.width = "200px";
        tdDiv2_1_2.style.borderRight = "1px solid #fff";
        tdDiv2_1_2.style.color = "#fff";
        tdDiv2_1_2.style.backgroundColor = "#072055";
        tdDiv2_1_2.style.textAlign = "center";
        tdDiv2_1_2.style.fontWeight = "bold";
        tdDiv2_1_2.innerHTML = "Visit History";

        trDiv2_1.appendChild(tdDiv2_1_2);

        var tdDiv2_1_3 = document.createElement("td");
        tdDiv2_1_3.style.borderRight = "1px solid #fff";
        tdDiv2_1_3.style.color = "#fff";
        tdDiv2_1_3.style.textAlign = "center";
        tdDiv2_1_3.style.fontWeight = "bold";
        tdDiv2_1_3.innerHTML = "&nbsp;";
        tdDiv2_1_3.id = "header";

        trDiv2_1.appendChild(tdDiv2_1_3);

        var tdDiv2_1_4 = document.createElement("td");
        tdDiv2_1_4.style.width = "200px";
        tdDiv2_1_4.style.borderRight = "1px solid #fff";
        tdDiv2_1_4.style.color = "#fff";
        tdDiv2_1_4.style.textAlign = "left";
        tdDiv2_1_4.style.fontWeight = "bold";
        tdDiv2_1_4.style.backgroundColor = "#072055";
        tdDiv2_1_4.style.paddingLeft = "10px";
        tdDiv2_1_4.innerHTML = "Tasks";

        trDiv2_1.appendChild(tdDiv2_1_4);

        var trDiv2_2 = document.createElement("tr");

        tableDiv2_1.appendChild(trDiv2_2);

        var tdDiv2_2_1 = document.createElement("td");
        tdDiv2_2_1.style.verticalAlign = "top";

        trDiv2_2.appendChild(tdDiv2_2_1);

        var div2_2_1 = document.createElement("div");
        div2_2_1.id = "programs";
        div2_2_1.style.width = "100%";
        div2_2_1.style.overflow = "auto";
        div2_2_1.style.height = "50%";
        div2_2_1.style.border = "1px solid #fff";

        tdDiv2_2_1.appendChild(div2_2_1);

        var tdDiv2_2_2 = document.createElement("td");
        tdDiv2_2_2.rowSpan = 3;

        trDiv2_2.appendChild(tdDiv2_2_2);

        var div2_2_2 = document.createElement("div");
        div2_2_2.id = "visits";
        div2_2_2.style.width = "100%";
        div2_2_2.style.overflow = "auto";
        div2_2_2.style.height = "100%";
        div2_2_2.style.border = "1px solid #fff";

        tdDiv2_2_2.appendChild(div2_2_2);

        var tdDiv2_2_3 = document.createElement("td");
        tdDiv2_2_3.rowSpan = 3;

        trDiv2_2.appendChild(tdDiv2_2_3);

        var div2_2_3 = document.createElement("div");
        div2_2_3.id = "details";
        div2_2_3.style.width = "100%";
        div2_2_3.style.overflow = "auto";
        div2_2_3.style.height = "100%";
        div2_2_3.style.border = "1px solid #fff";
        div2_2_3.style.textAlign = "center";

        tdDiv2_2_3.appendChild(div2_2_3);

        var tdDiv2_2_4 = document.createElement("td");
        tdDiv2_2_4.rowSpan = 3;

        trDiv2_2.appendChild(tdDiv2_2_4);

        var div2_2_4 = document.createElement("div");
        div2_2_4.id = "tasks";
        div2_2_4.style.width = "100%";
        div2_2_4.style.overflow = "auto";
        div2_2_4.style.height = "100%";
        div2_2_4.style.border = "1px solid #fff";

        tdDiv2_2_4.appendChild(div2_2_4);

        var trDiv2_3 = document.createElement("tr");

        tableDiv2_1.appendChild(trDiv2_3);

        var tdDiv2_3_1 = document.createElement("td");
        tdDiv2_3_1.style.backgroundColor = "#345db5";
        tdDiv2_3_1.style.color = "#fff";
        tdDiv2_3_1.style.fontWeight = "bold";
        tdDiv2_3_1.innerHTML = "Relationships";
        tdDiv2_3_1.style.borderRight = "1px solid #345db5";
        tdDiv2_3_1.style.padding = "5px";
        tdDiv2_3_1.style.height = "20px";

        trDiv2_3.appendChild(tdDiv2_3_1);

        var img = document.createElement("img");
        img.setAttribute("src", this.icoAdd);
        img.height = "30";
        img.style.cssFloat = "right";
        img.style.margin = "-5px";
        img.style.cursor = "pointer";
        img.id = "addRelationship";

        img.onclick = function () {

            dashboard.addRelationship();

        }

        tdDiv2_3_1.appendChild(img);

        var trDiv2_4 = document.createElement("tr");

        tableDiv2_1.appendChild(trDiv2_4);

        var tdDiv2_4_1 = document.createElement("td");

        trDiv2_4.appendChild(tdDiv2_4_1);

        var div2_4_1 = document.createElement("div");
        div2_4_1.id = "relationships";
        div2_4_1.style.width = "100%";
        div2_4_1.style.overflow = "auto";
        div2_4_1.style.height = "100%";

        tdDiv2_4_1.appendChild(div2_4_1);

        var tr3 = document.createElement("tr");
        tr3.style.backgroundColor = "#333";

        table.appendChild(tr3);

        var td3_1 = document.createElement("td");
        td3_1.style.padding = "10px";

        tr3.appendChild(td3_1);

        var btnCancel = document.createElement("button");
        btnCancel.className = "red";
        btnCancel.innerHTML = "Cancel";
        btnCancel.onmousedown = function () {

            if (dashboard.settings.verifySessionCancel && dashboard.settings.verifySessionCancel.check) {

                // (msg, topic, nextURL, callback, deletePrompt, deleteLabel, deleteURL)
                dashboard.showConfirmMsg(dashboard.settings.verifySessionCancel.targetPromptMessage,
                    dashboard.settings.verifySessionCancel.targetPromptTopic, undefined, function () {
                        dashboard.voidCurrentSession(dashboard.settings.verifySessionCancel.sessionVoidPath);
                    })

            } else {

                dashboard.wipeCleanAllCurrentClientTimers(function () {

                    window.location = (patient.settings.defaultPath ? patient.settings.defaultPath : "/");

                });

            }

        }

        td3_1.appendChild(btnCancel);

        var td3_2 = document.createElement("td");
        td3_2.style.padding = "10px";
        td3_2.colSpan = 3;
        td3_2.style.textAlign = "right";
        td3_2.id = "navBtns";

        tr3.appendChild(td3_2);

        var btnEditDemographics = document.createElement("button");
        btnEditDemographics.className =
            (typeof(patient) !== typeof(undefined) && dashboard.data.data.names[0]["Family Name"].trim().length > 1 ? "blue" : "gray");
        btnEditDemographics.innerHTML = "Edit Demographics";
        btnEditDemographics.id = "btnEditDemographics";

        btnEditDemographics.onmousedown = function () {

            if (this.className.match(/gray/))
                return;

            if (typeof(patient) !== typeof(undefined)) {

                patient.buildEditPage(dashboard.getCookie("patient_id"));

            }

        }

        td3_2.appendChild(btnEditDemographics);

        var btnContinue = document.createElement("button");
        btnContinue.className = "gray";
        btnContinue.innerHTML = "Continue";
        btnContinue.id = "btnContinue";

        btnContinue.onmousedown = function () {

            if (this.className.match(/gray/))
                return;

            if (dashboard.workflow.length > 0) {

                dashboard.autoContinue = true;

                dashboard.$(dashboard.workflow[0]).click();

            }

        }

        if (patient.settings.allowAutoContinue)
            td3_2.appendChild(btnContinue);

        var btnFinish = document.createElement("button");
        btnFinish.className = "green";
        btnFinish.innerHTML = "Finish";
        btnFinish.onmousedown = function () {

            var program = (dashboard.getCookie("currentProgram").trim().match(/program/i) ?
                dashboard.getCookie("currentProgram").trim().toUpperCase() :
            dashboard.getCookie("currentProgram").trim().toUpperCase() + " PROGRAM");

            var today = (dashboard.getCookie("today").trim().length > 0 ? (new Date(dashboard.getCookie("today"))) :
                (new Date())).format("YYYY-mm-dd");

            if (dashboard.settings.checkIfCurrentSessionComplete && dashboard.settings.checkIfCurrentSessionComplete.check) {

                dashboard.checkCurrentVisit(function (encounters) {

                    if (encounters && encounters.length < dashboard.settings.checkIfCurrentSessionComplete.totalEncounters) {

                        dashboard.showAlertMsg(dashboard.settings.checkIfCurrentSessionComplete.targetPromptMessage,
                            dashboard.settings.checkIfCurrentSessionComplete.targetPromptTopic)

                    } else if (dashboard.settings.checkIfPartnerSessionFinished && dashboard.settings.checkIfPartnerSessionFinished.check &&
                        dashboard.settings.checkIfPartnerSessionFinished && dashboard.settings.checkIfPartnerSessionFinished.targetEncounter &&
                        dashboard.settings.checkIfPartnerSessionFinished.targetConcept && dashboard.settings.checkIfPartnerSessionFinished.targetResponse &&
                        dashboard.queryActiveObs(program, today, dashboard.settings.checkIfPartnerSessionFinished.targetEncounter.trim().toUpperCase(),
                            dashboard.settings.checkIfPartnerSessionFinished.targetConcept.trim()) ==
                        dashboard.settings.checkIfPartnerSessionFinished.targetResponse && dashboard.settings.checkIfPartnerSessionFinished.totalEncounters &&
                        dashboard.settings.checkIfPartnerSessionFinished.targetPromptMessage) {

                        dashboard.checkPartnersVisit(function (encounters) {

                            if (encounters && encounters.length < dashboard.settings.checkIfPartnerSessionFinished.totalEncounters) {

                                dashboard.showAlertMsg(dashboard.settings.checkIfPartnerSessionFinished.targetPromptMessage,
                                    dashboard.settings.checkIfPartnerSessionFinished.targetPromptTopic)

                            } else {

                                dashboard.wipeCleanAllCurrentClientTimers(function () {

                                    dashboard.wipeAllTemporaryData();

                                    window.location = (patient.settings.defaultPath ? patient.settings.defaultPath : "/");

                                });

                            }

                        })

                    } else {

                        dashboard.wipeCleanAllCurrentClientTimers(function () {

                            dashboard.wipeAllTemporaryData();

                            window.location = (patient.settings.defaultPath ? patient.settings.defaultPath : "/");

                        });

                    }

                })

            } else if (dashboard.settings.checkIfPartnerSessionFinished && dashboard.settings.checkIfPartnerSessionFinished.check &&
                dashboard.settings.checkIfPartnerSessionFinished && dashboard.settings.checkIfPartnerSessionFinished.targetEncounter &&
                dashboard.settings.checkIfPartnerSessionFinished.targetConcept && dashboard.settings.checkIfPartnerSessionFinished.targetResponse &&
                dashboard.queryActiveObs(program, today, dashboard.settings.checkIfPartnerSessionFinished.targetEncounter.trim().toUpperCase(),
                    dashboard.settings.checkIfPartnerSessionFinished.targetConcept.trim()) ==
                dashboard.settings.checkIfPartnerSessionFinished.targetResponse && dashboard.settings.checkIfPartnerSessionFinished.totalEncounters &&
                dashboard.settings.checkIfPartnerSessionFinished.targetPromptMessage) {

                dashboard.checkPartnersVisit(function (encounters) {

                    if (encounters && encounters.length < dashboard.settings.checkIfPartnerSessionFinished.totalEncounters) {

                        dashboard.showAlertMsg(dashboard.settings.checkIfPartnerSessionFinished.targetPromptMessage,
                            dashboard.settings.checkIfPartnerSessionFinished.targetPromptTopic)

                    } else {

                        dashboard.wipeCleanAllCurrentClientTimers(function () {

                            dashboard.wipeAllTemporaryData();

                            window.location = (patient.settings.defaultPath ? patient.settings.defaultPath : "/");

                        });

                    }

                })

            } else {

                dashboard.wipeCleanAllCurrentClientTimers(function () {

                    dashboard.wipeAllTemporaryData();

                    window.location = (patient.settings.defaultPath ? patient.settings.defaultPath : "/");

                });

            }

        }

        td3_2.appendChild(btnFinish);

        dashboard.loadPrograms(dashboard.modules, dashboard.__$("programs"));

        dashboard.createWebSocket();

    },

    voidCurrentSession: function (voidPath) {

        var program = (dashboard.getCookie("currentProgram").trim().match(/program/i) ?
            dashboard.getCookie("currentProgram").trim().toUpperCase() :
        dashboard.getCookie("currentProgram").trim().toUpperCase() + " PROGRAM");

        var today = (dashboard.getCookie("today").trim().length > 0 ? (new Date(dashboard.getCookie("today"))) :
            (new Date())).format("YYYY-mm-dd");

        dashboard.queryCurrentVisit(function (encounters) {

            if (typeof encounters != typeof undefined && voidPath != undefined && Object.keys(encounters).length > 0) {

                voidPath = (!voidPath.trim().match(/\/$/) ? voidPath + "/" + dashboard.getCookie("patient_id") :
                    voidPath + dashboard.getCookie("patient_id")) + "/" + dashboard.getCookie("token");

                dashboard.ajaxPostRequest(voidPath, encounters, function () {

                    dashboard.wipeCleanAllCurrentClientTimers(function () {

                        var json = {
                            id: dashboard.getCookie("patient_id")
                        };

                        dashboard.socket.emit("refresh", json);

                        if (dashboard.settings.checkIfPartnerSessionFinished && dashboard.settings.checkIfPartnerSessionFinished.check &&
                            dashboard.settings.checkIfPartnerSessionFinished && dashboard.settings.checkIfPartnerSessionFinished.targetEncounter &&
                            dashboard.settings.checkIfPartnerSessionFinished.targetConcept && dashboard.settings.checkIfPartnerSessionFinished.targetResponse &&
                            dashboard.queryActiveObs(program, today, dashboard.settings.checkIfPartnerSessionFinished.targetEncounter.trim().toUpperCase(),
                                dashboard.settings.checkIfPartnerSessionFinished.targetConcept.trim()) ==
                            dashboard.settings.checkIfPartnerSessionFinished.targetResponse && dashboard.settings.checkIfPartnerSessionFinished.totalEncounters &&
                            dashboard.settings.checkIfPartnerSessionFinished.targetPromptMessage) {

                            dashboard.checkPartnersVisit(function (encounters) {

                                if (encounters && encounters.length > 0 && encounters.length < dashboard.settings.checkIfPartnerSessionFinished.totalEncounters) {

                                    dashboard.showAlertMsg(dashboard.settings.checkIfPartnerSessionFinished.targetPromptMessage,
                                        dashboard.settings.checkIfPartnerSessionFinished.targetPromptTopic)

                                } else {

                                    window.location = (patient.settings.defaultPath ? patient.settings.defaultPath : "/");

                                }

                            })

                        } else {

                            window.location = (patient.settings.defaultPath ? patient.settings.defaultPath : "/");

                        }

                    });

                });

            } else {

                dashboard.wipeCleanAllCurrentClientTimers(function () {

                    if (dashboard.settings.checkIfPartnerSessionFinished && dashboard.settings.checkIfPartnerSessionFinished.check) {

                        dashboard.checkPartnersVisit(function (encounters) {

                            if (typeof encounters != typeof undefined && encounters.length > 0 && encounters.length < dashboard.settings.checkIfPartnerSessionFinished.totalEncounters) {

                                dashboard.showAlertMsg(dashboard.settings.checkIfPartnerSessionFinished.targetPromptMessage,
                                    dashboard.settings.checkIfPartnerSessionFinished.targetPromptTopic)

                            } else {

                                window.location = (patient.settings.defaultPath ? patient.settings.defaultPath : "/");

                            }

                        })

                    } else {

                        window.location = (patient.settings.defaultPath ? patient.settings.defaultPath : "/");

                    }

                });

            }

        });

    },

    clearCookies: function () {

        dashboard.setCookie("AgeGroup", "", 0.001, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

        dashboard.setCookie("LastHIVTest", "", 0.001, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

        dashboard.setCookie("attrs", "", 0.001, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

        dashboard.setCookie("client_identifier", "", 0.001, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

        dashboard.setCookie("family_name", "", 0.001, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

        dashboard.setCookie("gender", "", 0.001, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

        dashboard.setCookie("given_name", "", 0.001, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

        dashboard.setCookie("patient_id", "", 0.001, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

    },

    wipeAllTemporaryData: function () {

        if (!dashboard.data.data.temporaryData)
            return;

        var keys = Object.keys(dashboard.data.data.temporaryData);

        for (var i = 0; i < keys.length; i++) {

            var key = keys[i];

            dashboard.deleteTemporaryData(key);

        }

    },

    wipeCleanAllCurrentClientTimers: function (callback) {

        dashboard.clearMyTimers(function () {

            if (dashboard.getCookie("patient_id").trim().length == 0) {

                var id = dashboard.getCookie("client_identifier").trim()

                dashboard.setCookie("patient_id", id, 0.3333, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

            }

            if (dashboard.subscription.timers &&
                dashboard.subscription.timers[dashboard.getCookie("patient_id")]) {

                var keys = Object.keys(dashboard.subscription.timers[dashboard.getCookie("patient_id")]);

                for (var i = 0; i < keys.length; i++) {

                    var key = keys[i];

                    dashboard.clearTimer(key);

                }

            }

            if (typeof dashboard.data.data.temporaryData != typeof undefined) {

                var categories = Object.keys(dashboard.data.data.temporaryData);

                for (var i = 0; i < categories.length; i++) {

                    var category = categories[i];

                    if (typeof category == typeof String()) {

                        if (typeof dashboard.data.data.temporaryData != typeof undefined &&
                            typeof dashboard.data.data.temporaryData[category] != typeof undefined) {

                            delete dashboard.data.data.temporaryData[category];

                            dashboard.deleteTemporaryData(category);

                        }

                    }

                }

            }


            if (!dashboard.timerSubscribers || !dashboard.timerSubscribers[dashboard.getCookie("patient_id")])
                return (callback ? callback() : null);

            for (var j = 0; j < dashboard.timerSubscribers[dashboard.getCookie("patient_id")].length; j++) {

                var handle = dashboard.timerSubscribers[dashboard.getCookie("patient_id")][j].handle;

                dashboard.clearTimer(handle);

            }

            if (callback)
                callback();

        })

    },

    addRelationship: function (secondary, ignorePhoneNumber, defaultToSpouse, prefix) {

        var form = document.createElement("form");
        form.id = "data";

        form.action = "javascript:submitData()";

        form.style.display = "none";

        var table = document.createElement("table");

        form.appendChild(table);

        var fields = {
            "Datatype": {
                field_type: "hidden",
                id: "data.datatype",
                value: "relationship"
            },
            "First Name": {
                field_type: "text",
                allowFreeText: true,
                id: "data.first_name",
                ajaxURL: (patient ? patient.settings.ddePath + patient.settings.firstNamesPath + "?name=" : dashboard.settings.firstNamesPath)
            },
            "Last Name": {
                field_type: "text",
                allowFreeText: true,
                id: "data.last_name",
                ajaxURL: (patient ? patient.settings.ddePath + patient.settings.lastNamesPath + "?name=" : dashboard.settings.lastNamesPath)
            },
            "Gender": {
                field_type: "select",
                id: "data.gender",
                options: ["Male", "Female"]
            },
            "Select or Create New Person": {
                id: "selected_patient",
                name: "data.relation_id",
                optional: true,
                tt_onLoad: "window.parent.dashboard.loadNames(); if(__$('backButton')) __$('backButton').onmousedown = function(){window.parent.dashboard.reloadRelationship()}",
                tt_pageStyleClass: "NoControls NoKeyboard",
                tt_onUnLoad: "if(__$('btnNew') && __$('extras')) __$('extras').removeChild(__$('btnNew'))",
                ignore: true
            },
            "Relationship Type": {
                field_type: "text",
                id: "data.relationship_type",
                ajaxURL: dashboard.settings.relationshipTypePath,
                tt_pageStyleClass: "LongSelectList NoKeyboard"
            },
            "Phone Number": {
                tt_pageStyleClass: "NumbersWithUnknown nota",
                validationRule: "^0\\d{7}$|Unknown|Not Available|^0\\d{9}$|^N\\/A$",
                validationMessage: "Not a valid phone number",
                field_type: "number",
                optional: true,
                name: "data.phone_number",
                id: "data.phone_number",
                tt_onUnload: "if(window.parent.dashboard.selectedPatient) window.parent.dashboard.saveCellPhoneNumber(window.parent.dashboard.selectedPatient.national_id)"
            },
            "Person": {
                field_type: "hidden",
                id: "data.person_id",
                value: dashboard.getCookie("patient_id")
            },
            "Summary": {
                id: "summary",
                disabled: true,
                optional: true,
                tt_onLoad: "showSummary()"
            }
        }

        if (prefix) {

            fields["Prefix"] = {
                field_type: "hidden",
                id: "data.prefix",
                value: prefix
            }

        }

        if (ignorePhoneNumber)
            delete fields["Phone Number"];

        if (defaultToSpouse) {

            fields["Relationship Type"].field_type = "hidden";
            fields["Relationship Type"].value = "Spouse/Partner - Spouse/Partner";

        }

        dashboard.buildFields(fields, table);

        if (secondary) {

            dashboard.loadCustomIFrame(form.outerHTML);

        } else {

            dashboard.navContentPanel(form.outerHTML);

        }

    },

    reloadRelationship: function () {

        dashboard.exitNavPanel();

        dashboard.$("addRelationship").click();

    },

    saveCellPhoneNumber: function (patient_id) {

        var json = {
            "data": {
                "datatype": "edit_demographics",
                "target_field": "cell_phone_number",
                "target_field_id": "person_attribute_id",
                "target_field_id_value": null,
                "cell_phone_number": (dashboard.$$("touchscreenInput" + dashboard.__().tstCurrentPage).value.trim() ?
                    dashboard.$$("touchscreenInput" + dashboard.__().tstCurrentPage).value.trim() :
                    (dashboard.$$("data.phone_number") ? __$("data.phone_number").value.trim() : null)),
                "userId": window.parent.dashboard.getCookie("username"),
                "token": window.parent.dashboard.getCookie("token"),
                "patient_id": patient_id
            }
        };

        if (json.data.cell_phone_number != null) {

            if (window.parent.patient) {

                window.parent.patient.submitRawData(json, "javascript:(function(){}())", true);

            }

        }

    },

    loadNames: function () {

        window.parent.dashboard.$$("inputFrame" + window.parent.dashboard.__().tstCurrentPage).style.display = "none";

        var panel = document.createElement("div");
        panel.style.borderRadius = "10px";
        panel.style.width = "99%";
        panel.style.height = "100%";
        panel.style.padding = "10px";
        panel.style.backgroundColor = "white";
        // panel.style.margin = "-10px";

        window.parent.dashboard.$$("page" + window.parent.dashboard.__().tstCurrentPage).appendChild(panel);

        var tbl = document.createElement("div");
        tbl.style.display = "table";
        tbl.style.width = "100%";
        tbl.style.height = "100%";

        panel.appendChild(tbl);

        var row = document.createElement("div");
        row.style.display = "table-row";

        tbl.appendChild(row);

        var cell0 = document.createElement("div");
        cell0.style.display = "table-cell";
        cell0.style.height = "100%";
        cell0.style.verticalAlign = "top";

        row.appendChild(cell0);

        var cell1 = document.createElement("div");
        cell1.style.display = "table-cell";
        cell1.style.height = "100%";
        cell1.style.width = "70px";
        cell1.style.verticalAlign = "top";

        row.appendChild(cell1);

        var navpanel0 = document.createElement("div");
        navpanel0.style.width = "70px";
        navpanel0.style.height = "calc(100% - 100px)";
        navpanel0.id = "navpanel0";
        navpanel0.style.cssFloat = "right";
        navpanel0.style.backgroundColor = "#e7efeb";
        navpanel0.style.overflow = "hidden";
        navpanel0.style.verticalAlign = "top";
        navpanel0.style.textAlign = "center";

        cell1.appendChild(navpanel0);

        var navUp = document.createElement("div");
        navUp.id = "navUp";
        navUp.className = "arrow-up";
        navUp.style.margin = "auto";

        navUp.onmousedown = function () {
            if (dashboard.page - 1 > 0) {
                dashboard.page -= 1;
            }

            window.parent.dashboard.ajaxSearch(dashboard.page);
        }

        navpanel0.appendChild(navUp);

        var navpanel1 = document.createElement("div");
        navpanel1.style.width = "70px";
        navpanel1.style.height = "30px";
        navpanel1.id = "navpanel1";
        navpanel1.style.cssFloat = "right";
        navpanel1.style.backgroundColor = "#e7efeb";
        navpanel1.style.overflow = "hidden";
        navpanel1.style.verticalAlign = "bottom";

        cell1.appendChild(navpanel1);

        var navDown = document.createElement("div");
        navDown.id = "navDown";
        navDown.className = "arrow-down";
        navDown.style.margin = "auto";

        navDown.onmousedown = function () {
            dashboard.page += 1;

            window.parent.dashboard.ajaxSearch(dashboard.page);
        }

        navpanel1.appendChild(navDown);

        var leftpanel = document.createElement("div");
        leftpanel.style.border = "2px solid #B2C4B4";
        leftpanel.style.width = "49.3%";
        leftpanel.style.height = "calc(100% - 75px)";
        leftpanel.id = "leftpanel";
        leftpanel.style.cssFloat = "left";
        leftpanel.style.borderRadius = "8px";
        leftpanel.style.backgroundColor = "#e7efeb";
        leftpanel.style.overflow = "auto";

        cell0.appendChild(leftpanel);

        var rightpanel = document.createElement("div");
        rightpanel.style.border = "2px solid #B2C4B4";
        rightpanel.style.width = "49.3%";
        rightpanel.style.height = "calc(100% - 75px)";
        rightpanel.id = "rightpanel";
        rightpanel.style.cssFloat = "right";
        rightpanel.style.borderRadius = "10px";
        rightpanel.style.backgroundColor = "#e7efeb";
        rightpanel.style.overflow = "auto";

        cell0.appendChild(rightpanel);

        var footer = document.createElement("div");
        footer.id = "extras";
        footer.style.cssFloat = "right";

        window.parent.dashboard.$$("buttons").appendChild(footer);

        var btnNew = document.createElement("button");
        btnNew.innerHTML = "<span>New Person</span>";
        btnNew.id = "btnNew";
        btnNew.style.cssFloat = "right";

        btnNew.onmousedown = function () {

            window.parent.dashboard.__().gotoNextPage();

        }

        footer.appendChild(btnNew);

        window.parent.dashboard.ajaxSearch(window.parent.dashboard.page);

    },

    ajaxSearch: function (page) {

        if (patient) {

            var url = window.parent.patient.settings.ddePath + window.parent.patient.settings.searchPath + "/" +
                window.parent.getCookie("dde-token") + "?first_name=" + window.parent.dashboard.$$("data.first_name").value.trim() +
                "&last_name=" + window.parent.dashboard.$$("data.last_name").value.trim() + "&gender=" +
                window.parent.dashboard.$$("data.gender").value.trim().substring(0, 1) + "&page=" + page;

        } else {

            var url = window.parent.dashboard.settings.searchPath + "/" + window.parent.dashboard.getCookie("dde-token") +
                "?first_name=" + window.parent.dashboard.$$("data.first_name").value.trim() +
                "&last_name=" + window.parent.dashboard.$$("data.last_name").value.trim() + "&gender=" +
                window.parent.dashboard.$$("data.gender").value.trim().substring(0, 1) + "&page=" + page;

        }

        if (window.parent.dashboard.$$("nextButton")) {
            window.parent.dashboard.$$("nextButton").className = "button gray navButton";
            window.parent.dashboard.$$("nextButton").onclick = function () {
            };
        }

        if (window.parent.dashboard.$$("editPatient")) {

            window.parent.dashboard.$$("editPatient").className = "gray";

        }

        if (patient) {

            var auth = window.parent.patient.makeBaseAuth(window.parent.patient.settings.ddeUser, window.parent.patient.settings.ddePassword);
            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function () {
                window.parent.dashboard.handleAjaxRequest(httpRequest);
            };
            try {
                httpRequest.open('GET', url, true);
                httpRequest.setRequestHeader('Authorization', auth);
                httpRequest.send(null);
            } catch (e) {
            }

        } else {

            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function () {
                window.parent.dashboard.handleAjaxRequest(httpRequest);
            };
            try {
                httpRequest.open('GET', url, true);
                httpRequest.send(null);
            } catch (e) {
            }

        }

    },

    handleAjaxRequest: function (aXMLHttpRequest) {

        if (!aXMLHttpRequest) return;

        window.parent.dashboard.$$("leftpanel").innerHTML = "";
        window.parent.dashboard.$$("rightpanel").innerHTML = "";

        if (window.parent.dashboard.$$("nextButton")) {
            window.parent.dashboard.$$("nextButton").className = "button gray navButton";
            window.parent.dashboard.$$("nextButton").onclick = function () {
            };
        }

        if (window.parent.dashboard.$$("editPatient")) {

            window.parent.dashboard.$$("editPatient").className = "gray";

        }

        if (aXMLHttpRequest.readyState == 4 && aXMLHttpRequest.status == 200) {

            var result = aXMLHttpRequest.responseText;

            window.parent.dashboard.patients = JSON.parse(result);

            if (Object.keys(window.parent.dashboard.patients).length == 0) {
                window.parent.dashboard.$$("rightpanel").innerHTML = "<div style='margin: auto; padding: 20px; font-size: 24px; font-style: italic;'>No matching people found!</div>";
            }

            var relationsIds = [];

            if (window.parent.dashboard.data.data.relationships) {

                relationsIds = window.parent.dashboard.data.data.relationships.map(function (relation) {
                    return relation.relative_id
                });

            }

            for (var i = 0; i < window.parent.dashboard.patients.length; i++) {

                if (window.parent.dashboard.patients[i]["national_id"] ==
                    window.parent.dashboard.getCookie("client_identifier") || relationsIds.indexOf(window.parent.dashboard.patients[i]["national_id"]) >= 0) {

                    continue;

                }

                var div = document.createElement("div");
                div.id = i;
                div.className = "element " + (i % 2 > 0 ? "odd" : "");
                div.setAttribute("tag", (i % 2 > 0 ? "odd" : "even"));
                div.setAttribute("npid", window.parent.dashboard.patients[i]["national_id"]);

                div.onclick = function () {

                    window.parent.dashboard.deselectAllAndSelect(this.id);

                    window.parent.dashboard.showPatient(this.id);

                    window.parent.dashboard.$$("selected_patient").value = this.getAttribute("npid");

                    if (window.parent.dashboard.$$('nextButton')) {
                        window.parent.dashboard.$$("nextButton").innerHTML = "<span>Select</span>"
                        window.parent.dashboard.$$("nextButton").className = "green navButton";
                        window.parent.dashboard.$$("nextButton").setAttribute("pos", this.id);

                        window.parent.dashboard.$$('nextButton').onmousedown = function () {

                            if (this.className && this.className.match(/gray/))
                                return;

                            if (this.getAttribute("pos"))
                                window.parent.dashboard.selectedPatient = window.parent.dashboard.patients[parseInt(this.getAttribute("pos"))];

                            if (window.parent.dashboard.$$("data.phone_number") && dashboard.selectedPatient &&
                                dashboard.selectedPatient.attributes && dashboard.selectedPatient.attributes.cell_phone_number) {

                                window.parent.dashboard.$$("data.phone_number").value = dashboard.selectedPatient.attributes.cell_phone_number;

                                window.parent.dashboard.$$("data.phone_number").setAttribute("condition", "false");

                            } else {

                                if (window.parent.dashboard.$$("data.phone_number"))
                                    window.parent.dashboard.$$("data.phone_number").removeAttribute("condition");

                            }

                            window.parent.dashboard.$$("selected_patient").value = window.parent.dashboard.selectedPatient.national_id;

                            window.parent.dashboard.saveRelation(window.parent.dashboard.selectedPatient, function () {

                                window.parent.dashboard.__().gotoNextPage();

                            })

                        }

                    }

                }

                div.innerHTML = "<table width='100%' style='font-size: 28px !important;'><tr><td style='width: 50%'>" +
                    window.parent.dashboard.patients[i]["names"]["given_name"] + " " + window.parent.dashboard.patients[i]["names"]["family_name"] +
                    " (" + window.parent.dashboard.patients[i]["age"] + ")" + "</td><td>" + window.parent.dashboard.patients[i]["national_id"] +
                    "</td><td style='width: 30px; background-color: white; border-radius: 60px; padding: 5px; border: 1px solid #666;'>" +
                    (window.parent.dashboard.patients[i]["gender"] == "M" ? "<img src='" + window.parent.dashboard.icoMale + "' width='47px' alt='Male' />" :
                        (window.parent.dashboard.patients[i]["gender"] == "F" ? "<img src='" + window.parent.dashboard.icoFemale + "' width='47px' alt='Female' />" : "")) + "</td></tr></table>";

                window.parent.dashboard.$$("rightpanel").appendChild(div);

            }

            if (Object.keys(window.parent.dashboard.$$("rightpanel").innerHTML.trim()).length == 0) {
                window.parent.dashboard.$$("rightpanel").innerHTML = "<div style='margin: auto; padding: 20px; font-size: 24px; font-style: italic;'>No matching people found!</div>";
            }

        }

    },

    showPatient: function (pos) {

        window.parent.dashboard.$$("leftpanel").innerHTML = "";

        if (window.parent.dashboard.$$("json")) {
            window.parent.dashboard.$$("json").innerHTML = JSON.stringify(window.parent.dashboard.patients[pos]);
        }

        var table = document.createElement("table");
        table.style.margin = "auto";
        table.style.paddingTop = "10px";
        table.setAttribute("cellpadding", 10);
        table.setAttribute("cellspacing", 0);
        table.style.fontSize = "28px";
        table.style.color = "#000";
        table.style.width = "100%";

        window.parent.dashboard.$$("leftpanel").appendChild(table);

        var tbody = document.createElement("tbody");

        table.appendChild(tbody);

        var tr1 = document.createElement("tr");

        tbody.appendChild(tr1);

        var cell1_1 = document.createElement("th");
        cell1_1.style.textAlign = "right";
        cell1_1.style.color = "#000";
        cell1_1.innerHTML = "Patient Name:";
        cell1_1.style.borderRight = "1px dotted #000";

        tr1.appendChild(cell1_1);

        var cell1_2 = document.createElement("td");
        cell1_2.style.fontStyle = "italic";
        cell1_2.innerHTML = window.parent.dashboard.patients[pos]["names"]["given_name"] + " " + window.parent.dashboard.patients[pos]["names"]["family_name"];

        tr1.appendChild(cell1_2);

        var tr2 = document.createElement("tr");

        tbody.appendChild(tr2);

        var cell2_1 = document.createElement("th");
        cell2_1.style.textAlign = "right";
        cell2_1.style.color = "#000";
        cell2_1.innerHTML = "Age:";
        cell2_1.style.borderRight = "1px dotted #000";

        tr2.appendChild(cell2_1);

        var cell2_2 = document.createElement("td");
        cell2_2.style.fontStyle = "italic";
        cell2_2.innerHTML = window.parent.dashboard.patients[pos]["age"];

        tr2.appendChild(cell2_2);

        var tr3 = document.createElement("tr");

        tbody.appendChild(tr3);

        var cell3_1 = document.createElement("th");
        cell3_1.style.textAlign = "right";
        cell3_1.style.color = "#000";
        cell3_1.innerHTML = "Primary ID:";
        cell3_1.style.borderRight = "1px dotted #000";

        tr3.appendChild(cell3_1);

        var cell3_2 = document.createElement("td");
        cell3_2.style.fontStyle = "italic";
        cell3_2.innerHTML = window.parent.dashboard.patients[pos]["national_id"];

        tr3.appendChild(cell3_2);

        for (var k = 0; k < window.parent.dashboard.patients[pos]["patient"]["identifiers"].length; k++) {

            if (String(window.parent.dashboard.patients[pos]["patient"]["identifiers"][k][Object.keys(window.parent.dashboard.patients[pos]["patient"]
                    ["identifiers"][k])[0]]).trim().length <= 0)
                continue;

            var tr3 = document.createElement("tr");

            tbody.appendChild(tr3);

            var cell3_1 = document.createElement("th");
            cell3_1.style.textAlign = "right";
            cell3_1.style.color = "#000";
            cell3_1.innerHTML = Object.keys(window.parent.dashboard.patients[pos]["patient"]["identifiers"][k])[0] + ":";
            cell3_1.style.borderRight = "1px dotted #000";

            tr3.appendChild(cell3_1);

            var cell3_2 = document.createElement("td");
            cell3_2.style.fontStyle = "italic";
            cell3_2.innerHTML = window.parent.dashboard.patients[pos]["patient"]["identifiers"][k][Object.keys(window.parent.dashboard.patients[pos]
                ["patient"]["identifiers"][k])[0]];

            tr3.appendChild(cell3_2);

        }

        var tr4 = document.createElement("tr");

        tbody.appendChild(tr4);

        var cell4_1 = document.createElement("th");
        cell4_1.style.textAlign = "right";
        cell4_1.style.color = "#000";
        cell4_1.innerHTML = "Gender:";
        cell4_1.style.borderRight = "1px dotted #000";

        tr4.appendChild(cell4_1);

        var cell4_2 = document.createElement("td");
        cell4_2.style.fontStyle = "italic";

        cell4_2.innerHTML = (window.parent.dashboard.patients[pos]["gender"] == "M" ? "Male" : (window.parent.dashboard.patients[pos]["gender"] == "F" ? "Female" : ""));

        tr4.appendChild(cell4_2);

        var tr5 = document.createElement("tr");

        tbody.appendChild(tr5);

        var cell5_1 = document.createElement("th");
        cell5_1.style.textAlign = "right";
        cell5_1.style.color = "#000";
        cell5_1.innerHTML = "Residence:";
        cell5_1.style.borderRight = "1px dotted #000";

        tr5.appendChild(cell5_1);

        var cell5_2 = document.createElement("td");
        cell5_2.style.fontStyle = "italic";
        cell5_2.innerHTML = window.parent.dashboard.patients[pos]["addresses"]["current_village"];

        tr5.appendChild(cell5_2);

    },

    buildFields: function (fields, table) {

        var keys = Object.keys(fields);

        for (var i = 0; i < keys.length; i++) {

            var tr = document.createElement("tr");

            table.appendChild(tr);

            var key = keys[i];

            var td1 = document.createElement("td");
            td1.innerHTML = key;

            tr.appendChild(td1);

            var td2 = document.createElement("td");

            tr.appendChild(td2);

            var fieldType = fields[key].field_type;

            switch (fieldType) {

                case "select":

                    var select = document.createElement("select");
                    select.id = fields[key].id;
                    select.name = fields[key].id;
                    select.setAttribute("helpText", key);

                    td2.appendChild(select);

                    if (fields[key].options) {

                        for (var o = 0; o < fields[key].options.length; o++) {

                            var opt = document.createElement("option");
                            opt.innerHTML = fields[key].options[o];

                            select.appendChild(opt);

                        }

                    }

                    var exceptions = ["options", "helpText"]

                    var attrs = Object.keys(fields[key]);

                    for (var a = 0; a < exceptions.length; a++) {

                        if (attrs.indexOf(exceptions[a]) >= 0) {

                            attrs.splice(attrs.indexOf(exceptions[a]));

                        }

                    }

                    if (attrs.length > 0) {

                        for (var a = 0; a < attrs.length; a++) {

                            var attr = attrs[a];

                            select.setAttribute(attr, fields[key][attr]);

                        }

                    }

                    break;

                default:

                    var input = document.createElement("input");
                    input.id = fields[key].id;
                    input.name = (fields[key].name ? fields[key].name : fields[key].id);
                    input.setAttribute("helpText", key);

                    if (fields[key].field_type == "hidden") {

                        input.type = "hidden";

                    } else if (fields[key].field_type == "password") {

                        input.type = "password";

                        fields[key].field_type = "text";

                    } else {

                        input.type = "text";

                    }

                    td2.appendChild(input);

                    var elements = Object.keys(fields[key]);

                    elements.splice(elements.indexOf("id"), 1);

                    for (var j = 0; j < elements.length; j++) {

                        input.setAttribute(elements[j], fields[key][elements[j]]);

                    }

            }

        }

    },

    deselectAllAndSelect: function (me) {

        for (var i = 0; i < window.parent.dashboard.$$("rightpanel").children.length; i++) {
            if (window.parent.dashboard.$$("rightpanel").children[i].id == me) {

                window.parent.dashboard.$$("rightpanel").children[i].className = "element highlighted";

                window.parent.dashboard.$$("rightpanel").children[i].style.backgroundColor = "lightblue";

            } else {

                window.parent.dashboard.$$("rightpanel").children[i].className = "element " +
                    (window.parent.dashboard.$$("rightpanel").children[i].getAttribute("tag") == "odd" ? "odd" : "");

                window.parent.dashboard.$$("rightpanel").children[i].style.backgroundColor =
                    (window.parent.dashboard.$$("rightpanel").children[i].getAttribute("tag") == "odd" ? "#B2C4B4" : "");

            }
        }

    },

    loadPrograms: function (sourceData, targetControl) {

        if (!sourceData || !targetControl) {

            return;

        }

        targetControl.innerHTML = "";

        var ul = document.createElement("ul");
        ul.style.listStyle = "none";
        ul.style.width = "100%";
        ul.style.padding = "0px";
        ul.style.margin = "0px";

        targetControl.appendChild(ul);

        var keys = Object.keys(sourceData);

        if (keys.length <= 0)
            return;

        for (var i = 0; i < keys.length; i++) {

            var li = document.createElement("li");
            li.style.cursor = "pointer";
            li.style.marginBottom = "5px";
            li.style.borderBottom = "1px solid #ccc";
            li.id = keys[i];
            li.setAttribute("icon", sourceData[keys[i]]['icon']);
            li.setAttribute("label", keys[i]);

            li.onmouseover = function () {

                if (this.getAttribute('selected') == null) {

                    this.style.backgroundColor = "lightblue";

                }

            }

            li.onmouseout = function () {

                if (this.getAttribute('selected') == null) {

                    this.style.backgroundColor = "";

                }

            }

            li.onclick = function () {

                if (dashboard.selectedProgram) {

                    if (dashboard.__$(dashboard.selectedProgram)) {

                        dashboard.__$(dashboard.selectedProgram).removeAttribute("selected");

                        dashboard.__$(dashboard.selectedProgram).style.backgroundColor = "";

                        dashboard.__$(dashboard.selectedProgram).getElementsByTagName("table")[0].style.color = "#000";

                    }

                }

                this.setAttribute("selected", true);

                this.style.backgroundColor = "#345db5";

                this.getElementsByTagName("table")[0].style.color = "#fff";

                dashboard.selectedProgram = this.id;

                dashboard.setCookie("currentProgram", this.id, 0.33333, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

                dashboard.standardWorkflow = dashboard.modules[dashboard.selectedProgram].workflow;

                dashboard.loadModule(this.getAttribute("label"), this.getAttribute("icon"), sourceData[this.getAttribute("label")]);

            }

            ul.appendChild(li);

            var table = document.createElement("table");
            table.cellPadding = 5;
            table.width = "100%";
            table.border = 0;
            table.style.borderCollapse = "collapse";

            li.appendChild(table);

            var tr = document.createElement("tr");

            table.appendChild(tr);

            var td1 = document.createElement("td");
            td1.style.width = "20px";
            td1.style.textAlign = "right";

            tr.appendChild(td1);

            var img = document.createElement("img");
            img.setAttribute("src", sourceData[keys[i]]['icon']);
            img.height = "45";

            td1.appendChild(img);

            var td2 = document.createElement("td");
            td2.innerHTML = keys[i];

            tr.appendChild(td2);

            if (keys[i] == dashboard.getCookie("currentProgram")) {

                li.click();

            }

        }

        if (dashboard.__$("patient_name")) {

            var name = "";

            var first_name = dashboard.data["data"]["names"][0]["First Name"];

            var middle_name = dashboard.data["data"]["names"][0]["Middle Name"];

            var last_name = dashboard.data["data"]["names"][0]["Family Name"];

            name = first_name.trim() + " " + (middle_name && middle_name != "N/A" ? middle_name.trim().substr(0, 1) +
                ". " : "") + last_name.trim();

            dashboard.__$("patient_name").innerHTML = name;

        }

        if (dashboard.__$("gender")) {

            var gender = {
                M: "Male",
                F: "Female"
            }

            dashboard.__$("gender").innerHTML = (dashboard.data["data"]["gender"] ? gender[dashboard.data["data"]["gender"]] : "&nbsp;");

        }

        if (dashboard.__$("age")) {

            var age = (dashboard.data["data"]["birthdate"].trim().length > 0 ? Math.round((((new Date()) -
            (new Date(dashboard.data["data"]["birthdate"]))) / (365 * 24 * 60 * 60 * 1000)), 0) : "");

            dashboard.age = age;

            dashboard.__$("age").innerHTML = (dashboard.data["data"]["birthdate_estimated"] == 1 ? "~ " : "") + age;

        }

        if (dashboard.__$("addressl1")) {

            dashboard.__$("addressl1").innerHTML = (dashboard.data["data"]["addresses"] && dashboard.data["data"]["addresses"]["Current Village"] ?
                dashboard.data["data"]["addresses"]["Current Village"] : "&nbsp;");

        }

        if (dashboard.__$("addressl2")) {

            dashboard.__$("addressl2").innerHTML = (dashboard.data["data"]["addresses"] && dashboard.data["data"]["addresses"]["Current T/A"] ?
                dashboard.data["data"]["addresses"]["Current T/A"] : "&nbsp;");

        }

        if (dashboard.__$("phone_number")) {

            if (dashboard.data.data.attributes && dashboard.data.data.attributes["Cell Phone Number"]) {

                dashboard.__$("phone_number").innerHTML = (dashboard.data.data.attributes &&
                dashboard.data.data.attributes["Cell Phone Number"] ? dashboard.data.data.attributes["Cell Phone Number"].trim().replace(/(\d+)(\d{3})(\d{3})$/, "$1-$2-$3") : "&nbsp;");

            }

        }

        if (dashboard.__$("bp")) {

            dashboard.__$("bp").innerHTML = (dashboard.data["data"]["vitals"] ? dashboard.data["data"]["vitals"]["BP"] : "&nbsp;");

        }

        if (dashboard.__$("temperature")) {

            dashboard.__$("temperature").innerHTML = (dashboard.data["data"]["vitals"] ? dashboard.data["data"]["vitals"]["Temperature"] : "&nbsp;");

        }

        if (dashboard.__$("bmi")) {

            // dashboard.__$("bmi").innerHTML = (dashboard.data["data"]["vitals"] ? dashboard.data["data"]["vitals"]["BMI"] : "&nbsp;");

        }

        if (dashboard.getCookie("print").trim() != "") {

            dashboard.printBarcode(dashboard.getCookie("print"), function () {

                dashboard.setCookie("print", "", -1, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

            })

        }

    },

    loadRelationships: function (sourceData, targetControl) {

        if (!sourceData || !targetControl) {

            return;

        }

        targetControl.innerHTML = "";

        var ul = document.createElement("ul");
        ul.style.listStyle = "none";
        ul.style.width = "100%";
        ul.style.padding = "0px";
        ul.style.margin = "0px";

        targetControl.appendChild(ul);

        if (sourceData.length <= 0)
            return;

        for (var i = 0; i < sourceData.length; i++) {

            var li = document.createElement("li");
            li.style.cursor = "pointer";
            li.style.marginBottom = "5px";
            li.style.borderBottom = "1px solid #ccc";
            li.setAttribute("relation_id", sourceData[i].relative_id);

            li.setAttribute("details", "<table cellpadding='5'><tr><td style='text-align: right'><b>Name:</b></td><td>" +
                sourceData[i].relative_name + "</td></tr><tr><td style='text-align: right'><b>Phone Number:</b></td><td>" +
                (sourceData[i].phone_number || "") + "</td></tr><tr><td style='text-align: right'><b>ID:</b></td><td>" +
                sourceData[i].relative_id + "</td></tr></table>");

            li.onmouseover = function () {

                if (this.getAttribute('selected') == null) {

                    this.style.backgroundColor = "lightblue";

                }

            }

            li.onmouseout = function () {

                if (this.getAttribute('selected') == null) {

                    this.style.backgroundColor = "";

                }

            }

            li.onclick = function () {

                var root = this;

                dashboard.clearMyTimers(function () {

                    var details = (root.getAttribute("details") || "");

                    var deletePrompt = "Do you really want to delete this relationship?";

                    var deleteLabel = "Delete";

                    var deleteURL = "javascript:dashboard.voidRelationship('" + root.getAttribute("relation_id") + "')";

                    if (!dashboard.settings.noParallelClientsSupported) {

                        dashboard.showConfirmMsg(details, "Switch Session To This Person", // + root.getAttribute("relation_id"),
                            "/patient/" + root.getAttribute("relation_id"), undefined, deletePrompt, deleteLabel, deleteURL);

                    } else {

                        dashboard.showMsg(details, "Guardian Details (" + root.getAttribute("relation_id") + ")", deletePrompt, deleteLabel, deleteURL);

                    }

                });

            }

            ul.appendChild(li);

            var table = document.createElement("table");
            table.cellPadding = 5;
            table.width = "100%";
            table.border = 0;
            table.style.borderCollapse = "collapse";

            li.appendChild(table);

            var tr = document.createElement("tr");

            table.appendChild(tr);

            var td1 = document.createElement("td");
            td1.style.width = "20px";
            td1.style.textAlign = "right";

            tr.appendChild(td1);

            var img = document.createElement("img");
            img.setAttribute("src", (sourceData[i].gender == "M" ? this.icoMale : this.icoFemale));
            img.height = "45";

            td1.appendChild(img);

            var td2 = document.createElement("td");
            td2.innerHTML = sourceData[i].relative_name + "<br/><i style='font-size: 11px;'>" + sourceData[i].relative_type + "</i><br/><b style='font-size: 11px'>" +
                sourceData[i].relative_id + "</b>";

            tr.appendChild(td2);

            if (sourceData[i].relative_id && sourceData[i].timers) {

                if (!dashboard.timerSubscribers)
                    dashboard.timerSubscribers = {};

                dashboard.timerSubscribers[sourceData[i].relative_id] = []

                if (dashboard.subscription.timers[sourceData[i].relative_id])
                    dashboard.subscription.timers[sourceData[i].relative_id] = {};

                for (var t = 0; t < sourceData[i].timers.length && t < 2; t++) {

                    var json = sourceData[i].timers[t];

                    var handle = json.handle;

                    dashboard.subscribeToExternalTimers(sourceData[i].relative_id);

                    var subscriber = {
                        id: sourceData[i].relative_id,
                        target: null,
                        pos: t,
                        handle: handle
                    }

                    subscriber.target = new dashboard.uiTimer(td2, t, undefined, undefined, undefined, undefined, true);

                    dashboard.timerSubscribers[sourceData[i].relative_id].push(subscriber);

                    if (!dashboard.subscription.timers[sourceData[i].relative_id])
                        dashboard.subscription.timers[sourceData[i].relative_id] = {};

                    if (!dashboard.subscription.timers[sourceData[i].relative_id][json.handle])
                        dashboard.subscription.timers[sourceData[i].relative_id][json.handle] = {};

                    dashboard.subscription.timers[sourceData[i].relative_id][json.handle].count = json.count;

                    dashboard.subscription.timers[sourceData[i].relative_id][json.handle].timeStamp = json.timeStamp;

                    dashboard.subscription.timers[sourceData[i].relative_id][json.handle].startTime = json.startTime;

                    dashboard.subscription.timers[sourceData[i].relative_id][json.handle].running = json.running;


                }

                dashboard.subscription.addEventlistener("timer update", dashboard.refreshTimer, false);

            }

        }

    },

    refreshTimer: function (e) {

        var keys = Object.keys(dashboard.timerSubscribers);

        for (var k = 0; k < keys.length; k++) {

            var key = keys[k];

            for (var i = 0; i < dashboard.timerSubscribers[key].length; i++) {

                var subscriber = dashboard.timerSubscribers[key][i];

                if (dashboard.subscription.timers[subscriber.id] &&
                    dashboard.subscription.timers[subscriber.id][subscriber.handle] &&
                    dashboard.subscription.timers[subscriber.id][subscriber.handle].running) {

                    dashboard.subscription.timers[subscriber.id][subscriber.handle].count = Math.ceil(((new Date()) -
                        (new Date(dashboard.subscription.timers[subscriber.id][subscriber.handle].startTime))) / 1000);

                    subscriber.target.renderTime(dashboard.subscription.timers[subscriber.id][subscriber.handle].count);

                } else {

                    subscriber.target.destroy();

                }

            }

        }

    },

    voidRelationship: function (id) {

        if (dashboard.socket && id) {
            var patient_id = dashboard.getCookie("patient_id");

            var data = {
                username: dashboard.getCookie("username"),
                patient_id: patient_id.trim(),
                relation_id: id,
                token: dashboard.getCookie("token")
            }

            dashboard.socket.emit('voidRelationship', data);

        }

    },

    activeTimers: [],

    refreshDemographics: function (done) {

        if (dashboard.__$("patient_name")) {

            var name = "";

            var first_name = dashboard.data["data"]["names"][0]["First Name"];

            var middle_name = dashboard.data["data"]["names"][0]["Middle Name"];

            var last_name = dashboard.data["data"]["names"][0]["Family Name"];

            name = first_name.trim() + " " + (middle_name && middle_name != "N/A" ? middle_name.trim().substr(0, 1) +
                ". " : "") + last_name.trim();

            dashboard.__$("patient_name").innerHTML = name;

        }

        if (dashboard.__$("primary_id") && dashboard.__$("primary_id_label") && Object.keys(dashboard.data["data"]["identifiers"]).length > 0) {

            dashboard.__$("primary_id_label").innerHTML = 'National id';

            dashboard.__$("primary_id").innerHTML = (dashboard.data["data"]["identifiers"]['National id'] ?
                dashboard.data["data"]["identifiers"]['National id']["identifier"].replace(/\B(?=([A-Za-z0-9]{3})+(?![A-Za-z0-9]))/g, "-") : "&nbsp;");

            if (dashboard.data["data"]["identifiers"]['National id']) {

                dashboard.data.data.patient_id = dashboard.data["data"]["identifiers"]['National id'].identifier;

                dashboard.setCookie("client_identifier", dashboard.data["data"]["identifiers"]['National id'].identifier, 0.3333, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

            }

        }

        if (dashboard.__$("gender")) {

            var gender = {
                M: "Male",
                F: "Female"
            }

            dashboard.gender = dashboard.data["data"]["gender"];

            dashboard.setCookie("gender", dashboard.gender, 1, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

            dashboard.__$("gender").innerHTML = (dashboard.data["data"]["gender"] ? gender[dashboard.data["data"]["gender"]] : "&nbsp;");

        }

        if (dashboard.__$("age")) {

            var age = (dashboard.data["data"]["birthdate"].trim().length > 0 ? Math.round((((new Date()) -
            (new Date(dashboard.data["data"]["birthdate"]))) / (365 * 24 * 60 * 60 * 1000)), 0) : "");

            dashboard.age = age;

            dashboard.__$("age").innerHTML = (dashboard.data["data"]["birthdate_estimated"] == 1 ? "~ " : "") + age;

        }

        if (dashboard.__$("addressl1")) {

            dashboard.__$("addressl1").innerHTML = (dashboard.data["data"]["addresses"] && dashboard.data["data"]["addresses"]["Current Village"] ?
                dashboard.data["data"]["addresses"]["Current Village"] : "&nbsp;");

        }

        if (dashboard.__$("addressl2")) {

            dashboard.__$("addressl2").innerHTML = (dashboard.data["data"]["addresses"] && dashboard.data["data"]["addresses"]["Current T/A"] ?
                dashboard.data["data"]["addresses"]["Current T/A"] : "&nbsp;");

        }

        if (dashboard.__$("phone_number")) {

            if (dashboard.data.data.attributes && dashboard.data.data.attributes["Cell Phone Number"] ||
                (dashboard.data && dashboard.data.data && dashboard.data.data.attributes && dashboard.data.data.attributes.cell_phone_number)) {

                dashboard.__$("phone_number").innerHTML = (dashboard.data.data.attributes &&
                dashboard.data.data.attributes["Cell Phone Number"] ?
                    dashboard.data.data.attributes["Cell Phone Number"].trim().replace(/(\d+)(\d{3})(\d{3})$/, "$1-$2-$3") :
                    (dashboard.data.data.attributes.cell_phone_number ?
                        dashboard.data.data.attributes.cell_phone_number.trim().replace(/(\d+)(\d{3})(\d{3})$/, "$1-$2-$3") : "&nbsp;"));

            }

        }

        if (dashboard.__$("bp")) {

            dashboard.__$("bp").innerHTML = (dashboard.data["data"]["vitals"] ? dashboard.data["data"]["vitals"]["BP"] : "&nbsp;");

        }

        if (dashboard.__$("temperature")) {

            dashboard.__$("temperature").innerHTML = (dashboard.data["data"]["vitals"] ? dashboard.data["data"]["vitals"]["Temperature"] : "&nbsp;");

        }

        if (dashboard.__$("bmi")) {

            // dashboard.__$("bmi").innerHTML = (dashboard.data["data"]["vitals"] ? dashboard.data["data"]["vitals"]["BMI"] : "&nbsp;");

        }

        if (dashboard.selectedVisit && dashboard.$(dashboard.selectedVisit)) {

            dashboard.loadVisit(dashboard.$(dashboard.selectedVisit), dashboard.data);

        }

        if (dashboard.activeTab) {

            dashboard.activeTab.click();

        }

        dashboard.checkActiveTabs(done);

        dashboard.subscription.sendUpdateEvent();

        if (dashboard.__$("network")) {

            dashboard.__$("network").setAttribute("src", dashboard.icoUp);

        }

        if (dashboard.$("btnEditDemographics")) {

            if (dashboard.data.data.names && dashboard.data.data.names.length > 0 && dashboard.data.data.names[0]["Family Name"] &&
                dashboard.data.data.names[0]["Family Name"].trim().length > 1) {

                var klass = dashboard.$("btnEditDemographics").className;

                dashboard.$("btnEditDemographics").className = klass.replace(/gray/i, "blue");

            }

        }

        if (done) {

            if (dashboard.data.data.timers && dashboard.data.data.timers.length > 0) {

                var count = 0;

                var existingTimers = dashboard.$("tableDiv1").getElementsByTagName("canvas");

                if (existingTimers.length > 0) {

                    for (var i = 0; i < existingTimers.length; i++) {

                        dashboard.$("tableDiv1").removeChild(existingTimers[i].offsetParent);

                    }

                }

                if (!dashboard.timerSubscribers)
                    dashboard.timerSubscribers = {};

                dashboard.timerSubscribers[dashboard.getCookie("patient_id")] = []

                if (!dashboard.subscription.timers)
                    dashboard.subscription.timers = {};

                if (dashboard.subscription.timers[dashboard.getCookie("patient_id")])
                    dashboard.subscription.timers[dashboard.getCookie("patient_id")] = {};

                if (dashboard.stoppedTimers[dashboard.getCookie("patient_id")] &&
                    dashboard.stoppedTimers[dashboard.getCookie("patient_id")].length <= 0)
                    delete dashboard.stoppedTimers[dashboard.getCookie("patient_id")];

                for (var t = 0; t < dashboard.data.data.timers.length && count < 2; t++) {

                    var json = dashboard.data.data.timers[t];

                    var handle = json.handle;

                    if (dashboard.stoppedTimers[dashboard.getCookie("patient_id")] &&
                        dashboard.stoppedTimers[dashboard.getCookie("patient_id")].indexOf(handle) >= 0)
                        continue;

                    if (dashboard.timerSubscribers[dashboard.getCookie("patient_id")].map(function (a) {
                            return a.handle
                        }).indexOf(handle) >= 0)
                        continue;

                    var subscriber = {
                        id: dashboard.getCookie("patient_id"),
                        target: null,
                        pos: t,
                        handle: handle
                    }

                    if (dashboard.$("tableDiv1")) {

                        subscriber.target = new dashboard.uiTimer(dashboard.$("tableDiv1"), t, undefined, undefined,
                            undefined, undefined, true);

                    }

                    dashboard.timerSubscribers[dashboard.getCookie("patient_id")].push(subscriber);

                    if (!dashboard.subscription.timers[dashboard.getCookie("patient_id")])
                        dashboard.subscription.timers[dashboard.getCookie("patient_id")] = {};

                    if (!dashboard.subscription.timers[dashboard.getCookie("patient_id")][json.handle])
                        dashboard.subscription.timers[dashboard.getCookie("patient_id")][json.handle] = {};

                    dashboard.subscription.timers[dashboard.getCookie("patient_id")][json.handle].count = json.count;

                    dashboard.subscription.timers[dashboard.getCookie("patient_id")][json.handle].timeStamp = json.timeStamp;

                    dashboard.subscription.timers[dashboard.getCookie("patient_id")][json.handle].startTime = json.startTime;

                    dashboard.subscription.timers[dashboard.getCookie("patient_id")][json.handle].running = json.running;

                    count++;

                }

                dashboard.subscription.addEventlistener("timer update", dashboard.refreshTimer, false);

            }

        }

    },

    checkActiveTabs: function (done) {

        if (dashboard.selectedProgram != null) {

            dashboard.workflow = [];

            for (var i = 0; i < dashboard.standardWorkflow.length; i++) {

                dashboard.workflow.push(dashboard.standardWorkflow[i]);

            }

            var tabs = dashboard.modules[dashboard.selectedProgram].tabs;

            if (tabs) {

                var keys = Object.keys(tabs);

                for (var i = 0; i < keys.length; i++) {

                    var key = keys[i];

                    if (tabs[key].concept) {

                        // program, visit, encounter, concept
                        var exists = dashboard.queryActiveObs(
                            dashboard.modules[dashboard.selectedProgram].program,
                            (dashboard.getCookie("today").trim().length > 0 ?
                                (new Date(dashboard.getCookie("today").trim())).format("YYYY-mm-dd") : (new Date()).format("YYYY-mm-dd")),
                            tabs[key].encounter,
                            tabs[key].concept
                        )

                        if (exists != null) {

                            if (dashboard.$(key)) {

                                dashboard.$(key).className = "disabled";

                                dashboard.workflow.splice(dashboard.workflow.indexOf(key), 1);

                            }

                        } else {

                            if (dashboard.$(key)) {

                                dashboard.$(key).removeAttribute("class");

                            }

                        }

                    } else if (tabs[key].encounter) {

                        // program, visit, encounter
                        var exists = dashboard.queryExistingEncounters(
                            dashboard.modules[dashboard.selectedProgram].program,
                            (dashboard.getCookie("today").trim().length > 0 ?
                                (new Date(dashboard.getCookie("today").trim())).format("YYYY-mm-dd") : (new Date()).format("YYYY-mm-dd")),
                            tabs[key].encounter
                        )

                        if (exists) {

                            if (dashboard.$(key)) {

                                dashboard.$(key).className = "disabled";

                                dashboard.workflow.splice(dashboard.workflow.indexOf(key), 1);

                            }

                        } else {

                            if (dashboard.$(key)) {

                                dashboard.$(key).removeAttribute("class");

                            }

                        }

                    }

                    if (Object.keys(tabs[key]).indexOf("condition") >= 0) {

                        if (!eval(tabs[key].condition)) {

                            if (dashboard.$(key)) {

                                dashboard.$(key).className = "disabled";

                                dashboard.workflow.splice(dashboard.workflow.indexOf(key), 1);

                            }

                        } else {

                            if (dashboard.$(key)) {

                                dashboard.$(key).removeAttribute("class");

                            }

                        }

                    }

                }

            }

            if (dashboard.workflow.length > 0) {

                if (dashboard.$("btnContinue")) {

                    dashboard.$("btnContinue").className = "blue";

                }

                if (dashboard.autoContinue && done) {

                    setTimeout(function () {

                        dashboard.$(dashboard.workflow[0]).click();

                    }, 200);

                }

            } else {

                dashboard.autoContinue = false;

                if (dashboard.$("btnContinue"))
                    dashboard.$("btnContinue").className = "gray";

            }

        }

        if (dashboard.__$("weight")) {

            dashboard.queryExistingObsArray("Weight (kg)", function (data) {

                dashboard.weightsArray = data;

                var arr = Object.keys(dashboard.weightsArray).sort();

                var latestWeight = (arr.length > 0 ? dashboard.weightsArray[arr[arr.length - 1]] : "?");

                dashboard.__$("weight").innerHTML = latestWeight;

            });

        }

        if (dashboard.__$("bp")) {

            dashboard.queryExistingObsArray("Systolic blood pressure", function (data) {

                var systolic = data;

                dashboard.queryExistingObsArray("Diastolic blood pressure", function (data) {

                    var diastolic = data;

                    var today = (new Date()).format("YYYY-mm-dd");

                    // let's try the conditions for color coding changes HERE (jun27, 17)
                    var sbp = systolic[today]
                    var dbp = diastolic[today]

                    if (sbp <= 80 || sbp >= 220) {
                        // set sbp color to red
                        sbp = '<font color="red">' + sbp + '</font>';
                    } else if (sbp < 90 || sbp >= 180) {
                        // set sbp color to yellow
                        sbp = '<font color="yellow">' + sbp + '</font>';
                    } else if (sbp >= 90 && sbp <= 179) {
                        // set sdp color to green
                        sbp = '<font color="green">' + sbp + '</font>';
                    }

                    if (dbp > 130) {
                        // set dbp color to red
                        dbp = '<font color="red">' + dbp + '</font>';
                    } else if (dbp >= 110 && dbp <= 130) {
                        // set dpb color to yellow
                        dbp = '<font color="yellow">' + dbp + '</font>';
                    } else if (dbp <= 100) {
                        // set dbp color to green
                        dbp = '<font color="green">' + dbp + '</font>';
                    }
                    // ---

                    var bp = (sbp ? sbp : "?") + "/" + (dbp ? dbp : "?");

                    setTimeout(function () {

                        dashboard.__$("bp").innerHTML = bp;

                    }, 100);

                })

            });

        }

        if (dashboard.__$("bmi")) {

            dashboard.queryExistingObsArray("Height (cm)", function (data) {

                var heightArray = data;

                var keys = Object.keys(heightArray).sort();

                var height = (keys.length > 0 ? heightArray[keys[keys.length - 1]] : 0);

                dashboard.queryExistingObsArray("Weight (kg)", function (data) {

                    var weightArray = data;

                    var keys = Object.keys(weightArray).sort();

                    var weight = (keys.length > 0 ? weightArray[keys[keys.length - 1]] : 0);

                    var bmi = (weight > 0 && height > 0 ? (weight / ((height / 100) * (height / 100))).toFixed(1) : "?");

                    setTimeout(function () {

                        dashboard.__$("bmi").innerHTML = bmi;

                    }, 100);

                })

            });

        }

        if (dashboard.__$("temperature")) {

            dashboard.queryExistingObsArray("Temperature (c)", function (data) {

                var temperature = data;

                var today = (new Date()).format("YYYY-mm-dd");

                var reading = (temperature[today] ? temperature[today] : "?") + " <sup>o</sup>C";

                // --- let's change colors for temperature
                temperature = temperature[today]

                if (temperature >= 40 || temperature <= 34) {

                    // set temperature reading color to red
                    reading = '<font color="red">' + reading + '</font>';

                } else if (temperature >= 38 || temperature < 35.5) {

                    // set temperature reading color to yellow
                    reading = '<font color="yellow">' + reading + '</font>';

                } else if (temperature >= 35.5 || temperature <= 37.4) {

                    // set temperature reading color to green
                    reading = '<font color="green">' + reading + '</font>';

                }

                setTimeout(function () {

                    dashboard.__$("temperature").innerHTML = reading;

                }, 100);

            })

        }

        if (dashboard.__$("allergies")) {

            dashboard.allergies = [];

            var set = [dashboard.queryExistingObsArray("Allergic"), dashboard.queryExistingObsArray("Drug Allergy"),
                dashboard.queryExistingObsArray("Other Drug Allergies")];

            var keys = [Object.keys(set[0]), Object.keys(set[1]), Object.keys(set[2])];

            for (var i = 0; i < keys.length; i++) {

                for (var j = 0; j < keys[i].length; j++) {

                    dashboard.allergies.push(set[i][keys[j]]);

                }

            }

            if (dashboard.allergies.length > 0) {

                var allergiesString = dashboard.allergies.join(";");

                dashboard.__$("allergies").innerHTML = allergiesString.substring(0, (dashboard.allergies[0].length + 1)) +
                    " <i style='font-size: 12px; color: #3c60b1;'><a href='javascript:dashboard.showMsg(\"" + allergiesString +
                    "\",\"Allergies\")'>" + "..more..." + "</a></i>";

            } else {

                dashboard.__$("allergies").innerHTML = "";

            }

        }

        dashboard.loadRelationships(dashboard.data.data.relationships, dashboard.$("relationships"))

    },

    loadModule: function (module, icon, sourceData) {

        if (dashboard.__$("modApp")) {

            dashboard.__$("modApp").innerHTML = "";

            var table = document.createElement("table");
            table.cellPadding = 5;
            table.style.margin = "auto";
            table.border = 0;
            table.style.borderCollapse = "collapse";

            dashboard.__$("modApp").appendChild(table);

            var tr = document.createElement("tr");

            table.appendChild(tr);

            var td1 = document.createElement("td");
            td1.style.width = "40px";
            td1.style.textAlign = "right";

            tr.appendChild(td1);

            var img = document.createElement("img");
            img.setAttribute("src", icon);
            img.height = "110";

            td1.appendChild(img);

            var td2 = document.createElement("td");
            td2.innerHTML = module;
            td2.style.fontSize = "30px";
            td2.style.color = "#345db5";

            tr.appendChild(td2);

        }

        if (dashboard.__$("tasks")) {

            dashboard.__$("tasks").innerHTML = "";


            var ul = document.createElement("ul");
            ul.style.listStyle = "none";
            ul.style.width = "100%";
            ul.style.padding = "0px";
            ul.style.margin = "0px";

            dashboard.__$("tasks").appendChild(ul);

            var keys = Object.keys(sourceData["tasks"]);

            for (var i = 0; i < keys.length; i++) {

                var li = document.createElement("li");
                li.innerHTML = keys[i];
                li.id = keys[i];
                li.style.padding = "10px";
                li.style.paddingTop = "15px";
                li.style.paddingBottom = "15px";
                li.style.cursor = "pointer";
                li.style.marginBottom = "5px";
                li.style.borderBottom = "1px solid #ccc";
                li.setAttribute("path", sourceData["tasks"][keys[i]]);

                li.onmouseover = function () {

                    if (this.getAttribute('selected') == null) {

                        this.style.backgroundColor = "lightblue";

                    }

                }

                li.onmouseout = function () {

                    if (this.getAttribute('selected') == null) {

                        this.style.backgroundColor = "";

                    }

                }

                li.onclick = function () {

                    if (this.className && this.className.match(/disabled/))
                        return;

                    dashboard.activeTask = this.innerHTML;

                    window.location = this.getAttribute("path");

                }

                ul.appendChild(li);

            }

        }

        if (sourceData && sourceData["identifiers"] && dashboard.__$("primary_id") && dashboard.__$("primary_id_label") &&
            sourceData["identifiers"].length > 0) {

            dashboard.__$("primary_id_label").innerHTML = sourceData["identifiers"][0];

            dashboard.__$("primary_id").innerHTML = (dashboard.data["data"]["identifiers"][sourceData["identifiers"][0]] ?
                (!dashboard.data["data"]["identifiers"][sourceData["identifiers"][0]]["identifier"].match(/\-/) ?
                    dashboard.data["data"]["identifiers"][sourceData["identifiers"][0]]["identifier"].replace(/\B(?=([A-Za-z0-9]{3})+(?![A-Za-z0-9]))/g, "-") :
                    dashboard.data["data"]["identifiers"][sourceData["identifiers"][0]]["identifier"]) : "&nbsp;");

            if (dashboard.data["data"]["identifiers"]['National id']) {

                dashboard.data.data.patient_id = dashboard.data["data"]["identifiers"]['National id'].identifier;

                dashboard.setCookie("client_identifier", dashboard.data["data"]["identifiers"]['National id'].identifier, 0.3333, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

            }
        }

        if (sourceData && sourceData["identifiers"] && dashboard.__$("other_id") && dashboard.__$("other_id_label") &&
            sourceData["identifiers"].length > 1) {

            dashboard.__$("other_id_label").innerHTML = sourceData["identifiers"][1];

            dashboard.__$("other_id").innerHTML = (dashboard.data["data"]["identifiers"][sourceData["identifiers"][1]] ?
                (!dashboard.data["data"]["identifiers"][sourceData["identifiers"][1]]["identifier"].match(/\-/) ?
                    dashboard.data["data"]["identifiers"][sourceData["identifiers"][1]]["identifier"].replace(/\B(?=([A-Za-z0-9]{3})+(?![A-Za-z0-9]))/g, "-") :
                    dashboard.data["data"]["identifiers"][sourceData["identifiers"][1]]["identifier"]) : "&nbsp;");

            if (!dashboard.data["data"]["identifiers"]['National id'] &&
                dashboard.data["data"]["identifiers"][sourceData["identifiers"][1]]) {

                dashboard.data.data.patient_id = dashboard.data["data"]["identifiers"][sourceData["identifiers"][1]]["identifier"];

                dashboard.setCookie("client_identifier",
                    dashboard.data["data"]["identifiers"][sourceData["identifiers"][1]]["identifier"], 0.3333, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

            }

        }

        if (dashboard.__$("header")) {

            dashboard.__$("header").innerHTML = "&nbsp;";

        }

        if (dashboard.__$("details")) {

            dashboard.__$("details").innerHTML = "";

            if (dashboard.modules[dashboard.selectedProgram].landing_page) {

                var ifrm = document.createElement("iframe");
                ifrm.style.width = "100%";
                ifrm.style.height = "100%";
                ifrm.style.border = "none";
                ifrm.style.overflow = "auto";
                ifrm.setAttribute("src", dashboard.modules[dashboard.selectedProgram].landing_page);

                dashboard.__$("details").appendChild(ifrm);

            }

        }

        if (dashboard.__$("visits") && dashboard.data) {

            dashboard.__$("visits").innerHTML = "";

            var program = sourceData["program"];

            if (dashboard.data["data"]["programs"][program]) {

                var patientPrograms = Object.keys(dashboard.data["data"]["programs"][program]["patient_programs"])

                for (var i = 0; i < patientPrograms.length; i++) {

                    var visits = Object.keys(dashboard.data["data"]["programs"][program]["patient_programs"][patientPrograms[i]]["visits"]).sort(function (a, b) {
                        return (new Date(b)) - (new Date(a))
                    });

                    var ul = document.createElement("ul");
                    ul.id = "ulVisits";
                    ul.style.listStyle = "none";
                    ul.style.width = "100%";
                    ul.style.padding = "0px";
                    ul.style.margin = "0px";

                    dashboard.__$("visits").appendChild(ul);

                    var j = 0;

                    for (j = 0; j < visits.length; j++) {

                        var li = document.createElement("li");
                        li.id = "visit" + j;
                        li.innerHTML = (new Date(visits[j])).format();
                        li.style.padding = "10px";
                        li.style.paddingTop = "15px";
                        li.style.paddingBottom = "15px";
                        li.style.cursor = "pointer";
                        li.style.marginBottom = "5px";
                        li.style.borderBottom = "1px solid #ccc";
                        li.style.textAlign = "center";
                        li.setAttribute("program", program);
                        li.setAttribute("patientProgram", patientPrograms[i]);
                        li.setAttribute("visit", visits[j]);

                        if (j >= dashboard.step) {

                            li.className = "hidden";

                            li.style.display = "none";

                        } else {

                            li.className = "visible";

                        }

                        li.onmouseover = function () {

                            if (this.getAttribute('selected') == null) {

                                this.style.backgroundColor = "lightblue";

                            }

                        }

                        li.onmouseout = function () {

                            if (this.getAttribute('selected') == null) {

                                this.style.backgroundColor = "";

                            }

                        }

                        li.onclick = function () {

                            if (dashboard.selectedVisit) {

                                if (dashboard.__$(dashboard.selectedVisit)) {

                                    dashboard.__$(dashboard.selectedVisit).removeAttribute("selected");

                                    dashboard.__$(dashboard.selectedVisit).style.backgroundColor = "";

                                    dashboard.__$(dashboard.selectedVisit).style.color = "#000";

                                }

                            }

                            dashboard.activeTask = this.innerHTML;

                            this.setAttribute("selected", true);

                            this.style.backgroundColor = "#345db5";

                            this.style.color = "#fff";

                            dashboard.selectedVisit = this.id;

                            dashboard.loadVisit(this, dashboard.data);

                        }

                        ul.appendChild(li);

                    }

                    if (j >= dashboard.step) {

                        var btnMore = document.createElement("li");
                        btnMore.id = "btnMore";
                        btnMore.innerHTML = ".. more visits ...";
                        btnMore.style.padding = "10px";
                        btnMore.style.paddingTop = "15px";
                        btnMore.style.paddingBottom = "15px";
                        btnMore.style.cursor = "pointer";
                        btnMore.style.color = "#345db5";
                        btnMore.style.fontStyle = "italic";
                        btnMore.style.marginBottom = "5px";
                        btnMore.style.borderBottom = "1px solid #ccc";
                        btnMore.style.textAlign = "center";
                        btnMore.setAttribute("currentLimit", dashboard.step);

                        btnMore.onmouseover = function () {

                            if (this.getAttribute('selected') == null) {

                                this.style.backgroundColor = "lightblue";

                            }

                        }

                        btnMore.onmouseout = function () {

                            if (this.getAttribute('selected') == null) {

                                this.style.backgroundColor = "";

                            }

                        }

                        btnMore.onclick = function () {

                            dashboard.showMore(this);

                        }

                        ul.appendChild(btnMore);

                    }

                }

            }

        }

        dashboard.checkActiveTabs();

    },

    showMore: function (btn) {

        var limit = parseInt(btn.getAttribute("currentLimit"));

        var active = dashboard.__$("ulVisits").getElementsByClassName("visible").length;

        var total = (dashboard.__$("ulVisits").children.length) - 1;

        if (active < total) {

            for (var i = limit; i < limit + dashboard.step; i++) {

                if (dashboard.__$("visit" + i)) {

                    dashboard.__$("visit" + i).style.display = "block";

                    dashboard.__$("visit" + i).className = "visible";

                }

            }

            limit += dashboard.step;

            if (limit >= total) {

                btn.style.display = "none";

            }

            btn.setAttribute("currentLimit", limit);

        }

    },

    loadVisit: function (control, sourceData) {

        if (!control || !sourceData) {

            return;

        }

        var program = control.getAttribute("program");
        var patientProgram = control.getAttribute("patientProgram");
        var visit = control.getAttribute("visit");

        if (dashboard.__$("header")) {

            var date = (new Date(control.getAttribute("visit"))).format("d mmmm, YYYY");

            var label = "Details for " + date + " Visit";

            dashboard.__$("header").innerHTML = label;

        }

        var colors = [
            ["#9966cc", "rgba(153,102,204,0.05)", "#ffffff"],
            ["#669900", "rgba(102,153,0,0.05)", "#ffffff"],
            ["#ff420e", "rgba(255,66,14,0.05)", "#ffffff"],
            ["#6a8ac9", "rgba(106,138,201,0.05)", "#ffffff"],
            ["#c99414", "rgba(201,148,20,0.05)", "#ffffff"],
            ["#3870f1", "rgba(56,112,241,0.05)", "#ffffff"],
            ["#004586", "rgba(0,69,134,0.05)", "#ffffff"],
            ["#ff950e", "rgba(255,149,14,0.05)", "#ffffff"],
            ["#579d1c", "rgba(87,157,28,0.05)", "#ffffff"],
            ["#993366", "rgba(153,51,102,0.05)", "#ffffff"],
            ["#9fc397", "rgba(159,195,151,0.05)", "#ffffff"],
            ["#000000", "rgba(0,0,0,0.05)", "#ffffff"],
            ["#c2c34f", "rgba(194,195,79,0.05)", "#ffffff"],
            ["#9a612a", "rgba(154,97,42,0.05)", "#ffffff"],
            ["#7f8fb0", "rgba(127,143,176,0.05)", "#ffffff"],
            ["#bf8d5c", "rgba(191,141,92,0.05)", "#ffffff"],
            ["#5ca2bf", "rgba(92,162,191,0.05)", "#ffffff"],
            ["#f1389c", "rgba(241,56,156,0.05)", "#ffffff"],
            ["#ab065f", "rgba(171,6,95,0.05)", "#ffffff"],
            ["#068aab", "rgba(6,138,171,0.05)", "#ffffff"]
        ];

        colors = colors.shuffle();

        var keys = Object.keys((sourceData["data"]["programs"][program] && sourceData["data"]["programs"][program]["patient_programs"] &&
        sourceData["data"]["programs"][program]["patient_programs"][patientProgram] &&
        sourceData["data"]["programs"][program]["patient_programs"][patientProgram]["visits"] &&
        sourceData["data"]["programs"][program]["patient_programs"][patientProgram]["visits"][visit] ?
            sourceData["data"]["programs"][program]["patient_programs"][patientProgram]["visits"][visit] : {}));

        if (dashboard.__$("details")) {

            dashboard.__$("details").innerHTML = "";

            for (var i = 0; i < keys.length; i++) {

                dashboard.loadVisitSummary(keys[i], dashboard.__$("details"), colors[i], sourceData["data"]["programs"][program]["patient_programs"][patientProgram]["visits"][visit][keys[i]]);

            }

        }

    },

    loadVisitSummary: function (encounter, parent, color, sourceData) {

        var div = document.createElement("div");
        div.style.width = "46%";
        div.style.display = "inline-block";
        div.style.height = "200px";
        div.style.overflow = "hidden";
        div.style.margin = "5px";
        div.style.border = "1px solid " + color[1];
        div.style.backgroundColor = color[1];
        div.id = "enc." + encounter;

        parent.appendChild(div);

        var table = document.createElement("table");
        table.style.width = "100%";
        table.cellPadding = 5;
        table.style.borderCollapse = "collapse";

        div.appendChild(table);

        var tr1 = document.createElement("tr");
        tr1.style.backgroundColor = color[0];
        tr1.setAttribute("target", "enc." + encounter);
        tr1.setAttribute("iTarget", "container." + encounter);

        table.appendChild(tr1);

        var td = document.createElement("td");
        td.style.width = "20px";
        td.style.padding = "2px";
        td.style.cursor = "pointer";

        tr1.appendChild(td);

        var img = document.createElement("img");
        img.setAttribute("src", dashboard.icoMax);

        td.appendChild(img);

        var th = document.createElement("th");
        th.innerHTML = encounter;
        th.style.textAlign = "center";
        th.style.color = color[2];
        th.style.cursor = "pointer";
        th.setAttribute("target", "enc." + encounter);
        th.setAttribute("iTarget", "container." + encounter);
        th.style.width = "calc(100% - 20px)";

        tr1.onclick = function () {

            dashboard.activeTab = this;

            dashboard.showMeOnly(dashboard.$(this.getAttribute("target")), dashboard.$(this.getAttribute("iTarget")));

        }

        tr1.appendChild(th);

        var tr2 = document.createElement("tr");

        table.appendChild(tr2);

        var td = document.createElement("td");
        td.colSpan = 2;

        tr2.appendChild(td);

        var container = document.createElement("div");
        container.id = "container." + encounter;
        container.style.height = "170px";
        container.style.overflow = "hidden";

        td.appendChild(container);

        dashboard.loadDetails(container, sourceData);

    },

    loadDetails: function (parent, sourceData) {

        var table = document.createElement("table");
        table.style.width = "100%";
        table.cellPadding = 2;
        table.style.borderCollapse = "collapse";

        parent.appendChild(table);

        for (var i = 0; i < sourceData.length; i++) {

            var keys = Object.keys(sourceData[i]);

            var tr = document.createElement("tr");

            table.appendChild(tr);

            for (var j = 0; j < 4; j++) {

                var td = document.createElement("td");

                td.style.verticalAlign = "top";

                if (j == 0) {

                    td.style.fontWeight = "bold";

                    td.style.fontSize = "14px";

                    td.style.textAlign = "right";

                    td.innerHTML = keys[0];

                } else if (j == 1) {

                    td.innerHTML = ":";

                    td.style.width = "10px";

                    td.style.textAlign = "center";

                } else if (j == 3) {

                    var img = document.createElement("img");
                    img.setAttribute("src", dashboard.icoClose);
                    img.height = "40";
                    img.style.float = "right";

                    td.appendChild(img);

                    td.setAttribute("uuid", sourceData[i][keys[0]]["UUID"]);

                    td.style.cursor = "pointer";

                    td.className = "closeButton";

                    td.style.visibility = "hidden";

                    td.style.padding = "5px";

                    td.style.paddingRight = "10px";

                    td.onclick = function () {

                        dashboard.showConfirmMsg("Do you really want to delete this entry?", "Confirm",
                            "javascript:dashboard.voidConcept('" + this.getAttribute("uuid") + "')");

                    }

                } else {

                    td.style.minWidth = "50%";

                    if (keys[0] == "Drug Orders") {

                        var drugs = "<ol>";

                        for (var k = 0; k < sourceData[i][keys[0]].length; k++) {

                            drugs += "<li style='margin-bottom: 5px; margin-top: 5px;'>" + sourceData[i][keys[0]][k]["instructions"] + "</li>";

                        }

                        drugs += "</ol>";

                        td.innerHTML = drugs;

                    } else {

                        td.innerHTML = (sourceData[i][keys[0]]["response"]["category"] == "DATE AND TIME" ?
                            (new Date(sourceData[i][keys[0]]["response"]["value"])).format() : sourceData[i][keys[0]]["response"]["value"]);

                    }

                }

                tr.appendChild(td);

            }

        }

    },

    showConfirmMsg: function (msg, topic, nextURL, callback, deletePrompt, deleteLabel, deleteURL) {

        if (!topic) {

            topic = "Confirm";

        }

        var shield = document.createElement("div");
        shield.style.position = "absolute";
        shield.style.top = "0px";
        shield.style.left = "0px";
        shield.style.width = "100%";
        shield.style.height = "100%";
        shield.id = "msg.shield";
        shield.style.backgroundColor = "rgba(128,128,128,0.75)";
        shield.style.zIndex = 1050;

        document.body.appendChild(shield);

        var width = 420;
        var height = 280;

        var div = document.createElement("div");
        div.id = "msg.popup";
        div.style.position = "absolute";
        div.style.width = width + "px";
        div.style.height = height + "px";
        div.style.backgroundColor = "#eee";
        div.style.borderRadius = "5px";
        div.style.left = "calc(50% - " + (width / 2) + "px)";
        div.style.top = "calc(50% - " + (height * 0.7) + "px)";
        div.style.border = "1px outset #fff";
        div.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";
        div.style.fontFamily = "arial, helvetica, sans-serif";
        div.style.MozUserSelect = "none";

        shield.appendChild(div);

        var table = document.createElement("table");
        table.width = "100%";
        table.cellSpacing = 0;

        div.appendChild(table);

        var trh = document.createElement("tr");

        table.appendChild(trh);

        var th = document.createElement("th");
        th.style.padding = "5px";
        th.style.borderTopRightRadius = "5px";
        th.style.borderTopLeftRadius = "5px";
        th.style.fontSize = "20px";
        th.style.backgroundColor = "red";
        th.style.color = "#fff";
        th.innerHTML = topic;
        th.style.border = "2px outset red";

        trh.appendChild(th);

        var tr2 = document.createElement("tr");

        table.appendChild(tr2);

        var td2 = document.createElement("td");

        tr2.appendChild(td2);

        var content = document.createElement("div");
        content.id = "msg.content";
        content.style.width = "calc(100% - 30px)";
        content.style.height = (height - 105 - 30 - (topic.length > 27 ? 30 : 0)) + "px";
        content.style.border = "1px inset #eee";
        content.style.overflow = "auto";
        content.style.textAlign = "center";
        content.style.verticalAlign = "middle";
        content.style.padding = "15px";
        content.style.fontSize = "22px";

        content.innerHTML = msg;

        td2.appendChild(content);

        var trf = document.createElement("tr");

        table.appendChild(trf);

        var tdf = document.createElement("td");
        tdf.align = "center";

        trf.appendChild(tdf);

        var btnCancel = document.createElement("button");
        btnCancel.className = "red";
        btnCancel.innerHTML = "Cancel";
        btnCancel.style.minWidth = "100px";

        btnCancel.onclick = function () {

            if (dashboard.$("msg.shield")) {

                document.body.removeChild(dashboard.$("msg.shield"));

            }

        }

        tdf.appendChild(btnCancel);

        if (deletePrompt) {

            var btn = document.createElement("button");
            btn.className = "red";
            btn.innerHTML = deleteLabel;
            btn.setAttribute("url", deleteURL);
            btn.setAttribute("msg", deletePrompt);

            btn.onclick = function () {

                if (dashboard.$("msg.shield")) {

                    document.body.removeChild(dashboard.$("msg.shield"));

                }

                dashboard.showConfirmMsg(this.getAttribute("msg"), this.innerHTML, this.getAttribute("url"));

            }

            tdf.appendChild(btn);

        }

        var btnOK = document.createElement("button");
        btnOK.className = "blue";
        btnOK.innerHTML = "OK";
        btnOK.style.minWidth = "100px";

        if (nextURL)
            btnOK.setAttribute("nextURL", nextURL);

        btnOK.onclick = function () {

            if (dashboard.$("msg.shield")) {

                document.body.removeChild(dashboard.$("msg.shield"));

                if (this.getAttribute("nextURL"))
                    window.location = this.getAttribute("nextURL");

            }

            if (callback) {

                callback();

            }

        }

        tdf.appendChild(btnOK);

    },

    showMeOnly: function (target, iTarget) {

        if (!target)
            return;

        if (target.style.height == "200px") {

            target.style.width = "95%";

            target.style.height = "95%";

            dashboard.$("details").scrollTop = target.offsetTop;

            iTarget.style.height = (target.offsetHeight - 40) + "px";

            iTarget.style.overflow = "auto";

            var images = iTarget.getElementsByClassName("closeButton");

            for (var i = 0; i < images.length; i++) {

                images[i].style.visibility = "visible";

            }

        } else {

            target.style.width = "46%";

            target.style.height = "200px";

            target.style.overflow = "hidden";

            iTarget.style.height = "170px";

            iTarget.style.overflow = "hidden";

            var images = iTarget.getElementsByClassName("closeButton");

            for (var i = 0; i < images.length; i++) {

                images[i].style.visibility = "hidden";

            }

        }

    },

    ajaxRequest: function (url, callback) {

        var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function () {

            if (httpRequest.readyState == 4 && (httpRequest.status == 200 ||
                httpRequest.status == 304)) {

                if (httpRequest.responseText.trim().length > 0) {
                    var result = JSON.parse(httpRequest.responseText);

                    callback(result);

                } else {

                    callback(undefined);

                }

            }

        };
        try {
            httpRequest.open("GET", url, true);
            httpRequest.send(null);
        } catch (e) {
        }

    },

    ajaxPostRequest: function (url, data, callback) {

        var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function () {

            if (httpRequest.readyState == 4 && (httpRequest.status == 200 ||
                httpRequest.status == 304)) {

                if (httpRequest.responseText.trim().length > 0) {
                    var result = httpRequest.responseText;

                    if (callback)
                        callback(result);

                } else {

                    if (callback)
                        callback(undefined);

                }

            }

        };
        try {
            httpRequest.open("POST", url, true);
            httpRequest.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            httpRequest.send(JSON.stringify(data));
        } catch (e) {
        }

    },

    exitNavPanel: function (nextPath) {

        if (dashboard.$("dashboard.navChildPanel")) {

            dashboard.autoContinue = false;

            document.body.removeChild(dashboard.$('dashboard.navChildPanel'));

            if (nextPath) {

                dashboard.navPanel(nextPath);

            } else {

                window.location = window.location.href;

            }

        } else {

            dashboard.autoContinue = false;

            document.body.removeChild(dashboard.$('dashboard.navPanel'));

            if (nextPath) {

                dashboard.navPanel(nextPath);

            } else {

                window.location = window.location.href;

            }

        }

    },

    navPanel: function (path) {

        if (dashboard.__$("dashboard.navPanel")) {

            return;

        } else {

            var divPanel = document.createElement("div");
            divPanel.style.position = "absolute";
            divPanel.style.left = "0px";
            divPanel.style.top = "130px";
            divPanel.style.width = "100%";
            divPanel.style.height = (window.innerHeight - 130) + "px";
            divPanel.style.backgroundColor = "#fff";
            divPanel.style.borderTop = "1px solid #000";
            divPanel.id = "dashboard.navPanel";
            divPanel.style.zIndex = 1001;

            document.body.appendChild(divPanel);

            var iframe = document.createElement("iframe");
            iframe.id = "ifrMain";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "1px solid #000";

            var url = window.location.href.match(/(.+)\/[^\/]+$/);

            var base = (url ? url[1] : "");

            dashboard.setCookie("gender", dashboard.gender, 1, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

            var html = "<html><head><title></title><base href='" + base + "' /> <script type='text/javascript' language='javascript' " +
                "src='" + "/modules/protocol_analyzer.js' defer></script><meta http\-equiv='content-type' " +
                "content='text/html;charset=UTF-8'/><script language='javascript'>tstUsername = '';" +
                "tstCurrentDate = '" + (new Date()).format("YYYY-mm-dd") + "';tt_cancel_destination = " +
                "\"javascript:window.parent.dashboard.exitNavPanel()\";tt_cancel_show = " +
                "\"javascript:window.parent.dashboard.exitNavPanel()\";function submitData(){" +
                "var data = form2js(document.getElementById('data'), undefined, true);" +
                "if(window.parent) window.parent.dashboard.submitData(data);" +
                "}</script></head><body>";

            html += "<div></div></body>";

            var page = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

            iframe.setAttribute("src", page);

            divPanel.appendChild(iframe);

            iframe.onload = function () {

                if (dashboard.__$("ifrMain") && dashboard.__$("ifrMain").contentWindow.protocol) {

                    dashboard.__$("ifrMain").contentWindow.protocol.init(path, undefined, undefined, undefined, undefined);

                }

            }

        }

    },

    navContentPanel: function (content) {

        if (dashboard.$("dashboard.navPanel")) {

            return;

        } else {

            var divPanel = document.createElement("div");
            divPanel.style.position = "absolute";
            divPanel.style.left = "0px";
            divPanel.style.top = "130px";
            divPanel.style.width = "100%";
            divPanel.style.height = (window.innerHeight - 130) + "px";
            divPanel.style.backgroundColor = "#fff";
            divPanel.style.borderTop = "1px solid #000";
            divPanel.id = "dashboard.navPanel";
            divPanel.style.zIndex = 1001;
            divPanel.style.overflow = "hidden";

            document.body.appendChild(divPanel);

            var iframe = document.createElement("iframe");
            iframe.id = "ifrMain";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "1px solid #000";

            var url = window.location.href.match(/(.+)\/[^\/]+$/);

            var base = dashboard.settings.basePath;

            var html = "<html><head><title></title><base href='" + base + "' /><link rel='stylesheet' type='text/css' " +
                "href='/stylesheets/style.css' /> <script type='text/javascript' language='javascript' " +
                "src='" + "/touchscreentoolkit/lib/javascripts/touchScreenToolkit.js' defer></script><script " +
                "src='/modules/bht-form2js.js'></script><script language='javascript'>tstUsername = '';" +
                "tstCurrentDate = '" + (new Date()).format("YYYY-mm-dd") + "';tt_cancel_destination = " +
                "\"javascript:window.parent.document.body.removeChild(window.parent.document.getElementById('dashboard.navPanel'))\";tt_cancel_show = " +
                "\"javascript:window.parent.document.body.removeChild(window.parent.document.getElementById('dashboard.navPanel'))\";" +
                "function submitData(){ var data = form2js(document.getElementById('data'), undefined, true); " +
                "if(window.parent) window.parent.dashboard.submitData(data); }</script></head><body>";

            html += "<div id='content'>" + content + "</div></body>";

            var page = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

            iframe.setAttribute("src", page);

            divPanel.appendChild(iframe);

            iframe.onload = function () {

            }

        }

    },

    loadCustomIFrame: function (content) {

        if (dashboard.$("dashboard.navChildPanel")) {

            return;

        } else {

            var divPanel = document.createElement("div");
            divPanel.style.position = "absolute";
            divPanel.style.left = "0px";
            divPanel.style.top = "130px";
            divPanel.style.width = "100%";
            divPanel.style.height = (window.innerHeight - 130) + "px";
            divPanel.style.backgroundColor = "#fff";
            divPanel.style.borderTop = "1px solid #000";
            divPanel.id = "dashboard.navChildPanel";
            divPanel.style.zIndex = 1002;
            divPanel.style.overflow = "hidden";

            document.body.appendChild(divPanel);

            var iframe = document.createElement("iframe");
            iframe.id = "ifrChild";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "1px solid #000";

            var url = window.location.href.match(/(.+)\/[^\/]+$/);

            var base = dashboard.settings.basePath;

            var html = "<html><head><title></title><base href='" + base + "' /><link rel='stylesheet' type='text/css' " +
                "href='/stylesheets/style.css' /> <script type='text/javascript' language='javascript' " +
                "src='" + "/touchscreentoolkit/lib/javascripts/touchScreenToolkit.js' defer></script><script " +
                "src='/modules/bht-form2js.js'></script><script language='javascript'>tstUsername = '';" +
                "tstCurrentDate = '" + (new Date()).format("YYYY-mm-dd") + "';tt_cancel_destination = " +
                "\"javascript:(function(){window.parent.dashboard.$('ifrMain').contentWindow.gotoPage(" +
                "window.parent.dashboard.$('ifrMain').contentWindow.tstCurrentPage - 1, true); " +
                "window.parent.document.body.removeChild(window.parent.document.getElementById('dashboard.navChildPanel'));" +
                "}())\";tt_cancel_show = \"javascript:(function(){window.parent.dashboard.$('ifrMain').contentWindow.gotoPage(" +
                "window.parent.dashboard.$('ifrMain').contentWindow.tstCurrentPage - 1, true); " +
                "window.parent.document.body.removeChild(window.parent.document.getElementById('dashboard.navChildPanel')); }())\";" +
                "function submitData(){ var data = form2js(document.getElementById('data'), undefined, true); " +
                "if(window.parent) window.parent.dashboard.submitData(data); }</script></head><body>";

            html += "<div id='content'>" + content + "</div></body>";

            var page = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

            iframe.setAttribute("src", page);

            divPanel.appendChild(iframe);

            iframe.onload = function () {

            }

        }

    },

    navURLPanel: function (url) {

        if (dashboard.$("dashboard.navPanel")) {

            return;

        } else {

            var divPanel = document.createElement("div");
            divPanel.style.position = "absolute";
            divPanel.style.left = "0px";
            divPanel.style.top = "130px";
            divPanel.style.width = "100%";
            divPanel.style.height = (window.innerHeight - 130) + "px";
            divPanel.style.backgroundColor = "#fff";
            divPanel.style.borderTop = "1px solid #000";
            divPanel.id = "dashboard.navPanel";
            divPanel.style.zIndex = 1001;
            divPanel.style.overflow = "hidden";

            document.body.appendChild(divPanel);

            var iframe = document.createElement("iframe");
            iframe.id = "ifrMain";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "1px solid #000";

            iframe.setAttribute("src", url);

            divPanel.appendChild(iframe);

            iframe.onload = function () {

            }

        }

    },

    submitData: function (data) {

        if (dashboard.getCookie("print").trim() != "") {

            dashboard.printBarcode(dashboard.getCookie("print").trim(), function () {

                dashboard.setCookie("print", "", -1, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

            })

        }

        if (dashboard.__$("network")) {

            dashboard.__$("network").setAttribute("src", dashboard.icoSaving);

        }

        if (dashboard.__$("dashboard.navChildPanel")) {

            document.body.removeChild(dashboard.__$("dashboard.navChildPanel"));

            if (typeof dashboard.__().gotoNextPage != typeof undefined) {

                dashboard.__().gotoNextPage();

            }

        } else {

            if (dashboard.__$("dashboard.navPanel")) {

                document.body.removeChild(dashboard.__$("dashboard.navPanel"));

            }

        }

        if (dashboard.socket && data) {

            var patient_id = dashboard.getCookie("patient_id");

            data.data.patient_id = patient_id.trim();

            data.data.userId = dashboard.getCookie("username");

            data.data.location = dashboard.getCookie("location");

            data.data.today = (dashboard.getCookie("today").trim().length > 0 ?
                (new Date(dashboard.getCookie("today").trim())).format("YYYY-mm-dd") : (new Date()).format("YYYY-mm-dd"));

            data.data.token = dashboard.getCookie("token");

            if (data.data && data.data.datatype == "relationship") {

                dashboard.socket.emit('relationship', data);

                // Notify 'relation' subscribers you have an update
                dashboard.subscription.sendRelationEvent();

            } else if (data.data && data.data.obs && data.data.obs.text && data.data.obs.text.datatype &&
                data.data.obs.text.datatype[0] == "prescriptions") {

                dashboard.socket.emit('prescriptions', data);

            } else {

                dashboard.socket.emit('updateMe', data);

            }

        }

        // If the 2 are different, the assumption is that the primary identifier has changed hence we need to reload
        // page to align sessions
        if (dashboard.getCookie("client_identifier").trim().length > 0 && dashboard.getCookie("client_identifier").trim() !=
            dashboard.getCookie("patient_id").trim()) {

            window.location = window.location.href;

        }

    },

    voidConcept: function (uuid) {

        if (dashboard.__$("network")) {

            dashboard.__$("network").setAttribute("src", dashboard.icoSaving);

        }

        if (dashboard.socket && uuid) {
            var patient_id = dashboard.getCookie("patient_id");

            var data = {
                uuid: uuid,
                username: dashboard.getCookie("username"),
                patient_id: patient_id.trim(),
                token: dashboard.getCookie("token")
            }

            dashboard.socket.emit('void', data);

        }

    },

    showMsg: function (msg, topic, deletePrompt, deleteLabel, deleteURL) {

        if (!topic) {

            topic = "Message";

        }

        var shield = document.createElement("div");
        shield.style.position = "absolute";
        shield.style.top = "0px";
        shield.style.left = "0px";
        shield.style.width = "100%";
        shield.style.height = "100%";
        shield.id = "msg.shield";
        shield.style.backgroundColor = "rgba(128,128,128,0.75)";
        shield.style.zIndex = 1050;

        document.body.appendChild(shield);

        var width = 420;
        var height = 280;

        var div = document.createElement("div");
        div.id = "msg.popup";
        div.style.position = "absolute";
        div.style.width = width + "px";
        div.style.height = height + "px";
        div.style.backgroundColor = "#eee";
        div.style.borderRadius = "5px";
        div.style.left = "calc(50% - " + (width / 2) + "px)";
        div.style.top = "calc(50% - " + (height * 0.7) + "px)";
        div.style.border = "1px outset #fff";
        div.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";
        div.style.fontFamily = "arial, helvetica, sans-serif";
        div.style.MozUserSelect = "none";

        shield.appendChild(div);

        var table = document.createElement("table");
        table.width = "100%";
        table.cellSpacing = 0;

        div.appendChild(table);

        var trh = document.createElement("tr");

        table.appendChild(trh);

        var th = document.createElement("th");
        th.style.padding = "5px";
        th.style.borderTopRightRadius = "5px";
        th.style.borderTopLeftRadius = "5px";
        th.style.fontSize = "20px";
        th.style.backgroundColor = "#345db5";
        th.style.color = "#fff";
        th.innerHTML = topic;
        th.style.border = "2px outset #345db5";

        trh.appendChild(th);

        var tr2 = document.createElement("tr");

        table.appendChild(tr2);

        var td2 = document.createElement("td");

        tr2.appendChild(td2);

        var content = document.createElement("div");
        content.id = "msg.content";
        content.style.width = "calc(100% - 30px)";
        content.style.height = (height - 105 - 30) + "px";
        content.style.border = "1px inset #eee";
        content.style.overflow = "auto";
        content.style.textAlign = "center";
        content.style.verticalAlign = "middle";
        content.style.padding = "15px";
        content.style.fontSize = "22px";

        content.innerHTML = msg;

        td2.appendChild(content);

        var trf = document.createElement("tr");

        table.appendChild(trf);

        var tdf = document.createElement("td");
        tdf.align = "center";

        trf.appendChild(tdf);

        var btn = document.createElement("button");
        btn.className = "blue";
        btn.innerHTML = "OK";

        btn.onclick = function () {

            if (dashboard.$("msg.shield")) {

                document.body.removeChild(dashboard.$("msg.shield"));

            }

        }

        tdf.appendChild(btn);

        if (deletePrompt) {

            var btn = document.createElement("button");
            btn.className = "red";
            btn.innerHTML = deleteLabel;
            btn.setAttribute("url", deleteURL);
            btn.setAttribute("msg", deletePrompt);

            btn.onclick = function () {

                if (dashboard.$("msg.shield")) {

                    document.body.removeChild(dashboard.$("msg.shield"));

                }

                dashboard.showConfirmMsg(this.getAttribute("msg"), this.innerHTML, this.getAttribute("url"));

            }

            tdf.appendChild(btn);

        }

    },

    showAlertMsg: function (msg, topic) {

        if (!topic) {

            topic = "Alert";

        }

        var shield = document.createElement("div");
        shield.style.position = "absolute";
        shield.style.top = "0px";
        shield.style.left = "0px";
        shield.style.width = "100%";
        shield.style.height = "100%";
        shield.id = "msg.shield";
        shield.style.backgroundColor = "rgba(128,128,128,0.75)";
        shield.style.zIndex = 1050;

        document.body.appendChild(shield);

        var width = 420;
        var height = 280;

        var div = document.createElement("div");
        div.id = "msg.popup";
        div.style.position = "absolute";
        div.style.width = width + "px";
        div.style.height = height + "px";
        div.style.backgroundColor = "#eee";
        div.style.borderRadius = "5px";
        div.style.left = "calc(50% - " + (width / 2) + "px)";
        div.style.top = "calc(50% - " + (height * 0.7) + "px)";
        div.style.border = "1px outset #fff";
        div.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";
        div.style.fontFamily = "arial, helvetica, sans-serif";
        div.style.MozUserSelect = "none";

        shield.appendChild(div);

        var table = document.createElement("table");
        table.width = "100%";
        table.cellSpacing = 0;

        div.appendChild(table);

        var trh = document.createElement("tr");

        table.appendChild(trh);

        var th = document.createElement("th");
        th.style.padding = "5px";
        th.style.borderTopRightRadius = "5px";
        th.style.borderTopLeftRadius = "5px";
        th.style.fontSize = "20px";
        th.style.backgroundColor = "red";
        th.style.color = "#fff";
        th.innerHTML = topic;
        th.style.border = "2px outset red";

        trh.appendChild(th);

        var tr2 = document.createElement("tr");

        table.appendChild(tr2);

        var td2 = document.createElement("td");

        tr2.appendChild(td2);

        var content = document.createElement("div");
        content.id = "msg.content";
        content.style.width = "calc(100% - 30px)";
        content.style.height = (height - 105 - 30) + "px";
        content.style.border = "1px inset #eee";
        content.style.overflow = "auto";
        content.style.textAlign = "center";
        content.style.verticalAlign = "middle";
        content.style.padding = "15px";
        content.style.fontSize = "22px";

        content.innerHTML = msg;

        td2.appendChild(content);

        var trf = document.createElement("tr");

        table.appendChild(trf);

        var tdf = document.createElement("td");
        tdf.align = "center";

        trf.appendChild(tdf);

        var btn = document.createElement("button");
        btn.className = "blue";
        btn.innerHTML = "OK";

        btn.onclick = function () {

            if (dashboard.$("msg.shield")) {

                document.body.removeChild(dashboard.$("msg.shield"));

            }

        }

        tdf.appendChild(btn);

    },

    saveAs: function (data, callback) {

        var uri = 'data:application/label; charset=utf-8; filename=test.lbl; disposition=inline,' + encodeURIComponent(data);

        var ifrm = document.createElement("iframe");

        ifrm.setAttribute("src", uri);

        document.body.appendChild(ifrm);

        setTimeout(function () {

            document.body.removeChild(ifrm);

        }, 100);

        callback();

    },

    printBarcode: function (npid, callback) {

        dashboard.ajaxRequest(dashboard.settings.patientBarcodeDataPath + dashboard.getCookie("token") + "&npid=" + npid,
            function (data) {

                if (!data.npid)
                    return (callback ? callback() : null);

                var text = "\nN\nq801\nQ329,026\nZT\nB50,180,0,1,5,15,120,N,\"" + data.npid + "\"\nA40,50,0,2,2,2,N,\"" +
                    data.first_name + " " + data.family_name + "\"\nA40,96,0,2,2,2,N,\"" +
                    data.npid.replace(/\B(?=([A-Za-z0-9]{3})+(?![A-Za-z0-9]))/g, "-") + " " +
                    (parseInt(data.date_of_birth_estimated) == 1 ? "~" : "") + (new Date(data.date_of_birth)).format("dd/mmm/YYYY") +
                    "(" + data.gender + ")\"\nA40,142,0,2,2,2,N,\"" + data.residence + "\"\nP1\n";

                dashboard.saveAs(text, callback);

            });

    },

    loadCustomScript: function (path, target) {

        if (!dashboard.$(target))
            return;

        var script = document.createElement("script");
        script.src = path;

        dashboard.$(target).appendChild(script);

    },

    Dispatcher: function () {
        this.events = [];
        this.timers = {};
    },

    Subscriber: function () {
        dashboard.Dispatcher(this);
    },

    startTimer: function (handle) {

        dashboard.socket.emit("startTimer", {id: dashboard.getCookie("patient_id"), handle: handle});

        if (!dashboard.timerSubscribers)
            dashboard.timerSubscribers = {};

        if (!dashboard.timerSubscribers[dashboard.getCookie("patient_id")])
            dashboard.timerSubscribers[dashboard.getCookie("patient_id")] = []

        if (dashboard.timerSubscribers[dashboard.getCookie("patient_id")].length > 1)
            return;

        if (dashboard.timerSubscribers[dashboard.getCookie("patient_id")].map(function (a) {
                return a.handle
            }).indexOf(handle) >= 0)
            return;

        var subscriber = {
            id: dashboard.getCookie("patient_id"),
            target: null,
            pos: dashboard.timerSubscribers[dashboard.getCookie("patient_id")].length,
            handle: handle
        }

        if (dashboard.$("tableDiv1")) {

            subscriber.target = new dashboard.uiTimer(dashboard.$("tableDiv1"),
                dashboard.timerSubscribers[dashboard.getCookie("patient_id")].length, undefined, undefined, undefined,
                undefined, true);

            dashboard.timerSubscribers[dashboard.getCookie("patient_id")].push(subscriber);

        }

        dashboard.subscription.addEventlistener("timer update", dashboard.refreshTimer, false);

    },

    stopTimer: function (handle) {

        dashboard.socket.emit("stopTimer", {id: dashboard.getCookie("patient_id"), handle: handle});

        if (!dashboard.stoppedTimers)
            dashboard.stoppedTimers = {};

        if (!dashboard.stoppedTimers[dashboard.getCookie("patient_id")])
            dashboard.stoppedTimers[dashboard.getCookie("patient_id")] = [];

        dashboard.stoppedTimers[dashboard.getCookie("patient_id")].push(handle);

    },

    clearTimer: function (handle, patientId) {

        dashboard.socket.emit("clearTimer", {
            id: (patientId ? patientId : dashboard.getCookie("patient_id")),
            handle: handle
        });

    },

    clearMyTimers: function (callback) {

        if (dashboard.getCookie("patient_id").trim().length == 0) {

            var id = dashboard.getCookie("client_identifier").trim()

            dashboard.setCookie("patient_id", id, 0.3333, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

        }

        if (dashboard.stoppedTimers && dashboard.stoppedTimers[dashboard.getCookie("patient_id")]) {

            while (dashboard.stoppedTimers[dashboard.getCookie("patient_id")].length > 0) {

                var handle = dashboard.stoppedTimers[dashboard.getCookie("patient_id")].pop();

                dashboard.clearTimer(handle);

            }

        }

        if (callback)
            callback();

    },

    subscribeToExternalTimers: function (patientId) {

        var nsp = io('/' + patientId);

        nsp.on('timer', function (data) {

            var json = (typeof data == typeof String() ? JSON.parse(data) : data);

            if (!dashboard.subscription.timers[patientId])
                dashboard.subscription.timers[patientId] = {};

            if (!dashboard.subscription.timers[patientId][json.handle])
                dashboard.subscription.timers[patientId][json.handle] = {};

            dashboard.subscription.timers[patientId][json.handle].count = json.count;

            dashboard.subscription.timers[patientId][json.handle].startTime = json.startTime;

            dashboard.subscription.timers[patientId][json.handle].running = json.running;

            dashboard.subscription.timers[patientId][json.handle].timeStamp = json.timeStamp;

        })

    },

    savePatient: function (data, callback) {

        var json = data;

        data.id = dashboard.getCookie("patient_id");

        data.patient_id = String(dashboard.data.data.patientId || "").trim();

        data.userId = dashboard.getCookie("username");

        data.location = dashboard.getCookie("location");

        data.today = (new Date()).format("YYYY-mm-dd");

        data.token = dashboard.getCookie("token");

        data.currentProgram = dashboard.getCookie("currentProgram");

        dashboard.socket.emit("savePatient", json);

        if (json.canPrintBarcode) {

            dashboard.setCookie("print", json.npid, 0.3333, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

            if (callback)
                callback();

        } else {

            if (callback)
                callback();

        }

    },

    saveRelation: function (data, callback) {

        var json = data;

        var url = "/does_patient_exist_locally/" + (json && json.national_id ?
                json.national_id : "dummy");

        dashboard.ajaxRequest(url, function (result) {

            if ((result && !result.exists) || !result) {

                data.userId = dashboard.getCookie("username");

                data.location = dashboard.getCookie("location");

                data.today = (new Date()).format("YYYY-mm-dd");

                data.token = dashboard.getCookie("token");

                data.currentProgram = dashboard.getCookie("currentProgram");

                dashboard.socket.emit("savePatient", json);

            }

            if (callback)
                callback();

        })

    },

    createWebSocket: function () {

        var scripts = document.head.getElementsByClassName("script.io");

        for (var i = 0; i < scripts.length; i++) {

            document.head.removeChild(scripts[i]);

        }

        var script = document.createElement("script");
        script.src = "/socket.io/socket.io.js";
        script.className = "script.io";

        document.head.appendChild(script);

        setTimeout(function () {

            var id = dashboard.getCookie("patient_id"); // window.location.href.match(/\/([^\/]+)$/)[1];

            if (typeof(io) == typeof(undefined)) {

                if (dashboard.__$("network")) {

                    dashboard.__$("network").setAttribute("src", dashboard.icoDown);

                }

                return window.location = window.location.href;

            }

            if (dashboard.__$("network")) {

                dashboard.__$("network").setAttribute("src", dashboard.icoSaving);

            }

            dashboard.socket = io.connect('/');
            dashboard.socket.on('stats', function (data) {
                // console.log('Connected clients on ' + data.id + ':', data.numClients);
            });

            dashboard.socket.emit("init", {id: id});

            dashboard.socket.on('reject', function (json) {

                alert(json.message);

                user.showMsg(json.message, "Oops!", (patient.settings.defaultPath ? patient.settings.defaultPath : "/"));

            });

            dashboard.socket.on('disconnect', function () {

                if (dashboard.__$("network")) {

                    dashboard.__$("network").setAttribute("src", dashboard.icoDown);

                }

            });

            dashboard.socket.on('reconnect', function () {
                setTimeout(function () {

                    dashboard.createWebSocket();

                }, 1000);
            });

            dashboard.socket.on('newConnection', function (data) {

                var nsp = io('/' + id);

                nsp.on('hi ' + id, function (data) {
                    // console.log(data);
                });

                nsp.on('kickout ' + id, function (data) {

                    user.logout();

                });

                dashboard.socket.emit('demographics', {id: id});

                nsp.on('timer', function (data) {

                    var json = (typeof data == typeof String() ? JSON.parse(data) : data);

                    if (!dashboard.subscription.timers[dashboard.getCookie("patient_id")])
                        dashboard.subscription.timers[dashboard.getCookie("patient_id")] = {};

                    if (!dashboard.subscription.timers[dashboard.getCookie("patient_id")][json.handle])
                        dashboard.subscription.timers[dashboard.getCookie("patient_id")][json.handle] = {};

                    dashboard.subscription.timers[dashboard.getCookie("patient_id")][json.handle].count = json.count;

                    dashboard.subscription.timers[dashboard.getCookie("patient_id")][json.handle].startTime = json.startTime;

                    dashboard.subscription.timers[dashboard.getCookie("patient_id")][json.handle].running = json.running;

                    dashboard.subscription.timers[dashboard.getCookie("patient_id")][json.handle].timeStamp = json.timeStamp;

                })

                nsp.on('clear timer', function (data) {

                    var json = (typeof data == typeof String() ? JSON.parse(data) : data);

                    if (!dashboard.subscription.timers[dashboard.getCookie("patient_id")])
                        return;

                    if (dashboard.subscription.timers[dashboard.getCookie("patient_id")][json.handle])
                        delete dashboard.subscription.timers[dashboard.getCookie("patient_id")][json.handle];

                })

                nsp.on('demographics', function (data) {

                    if (dashboard.__$("network")) {

                        dashboard.__$("network").setAttribute("src", dashboard.icoSaving);

                    }

                    if (!dashboard.data) {

                        setTimeout(function () {

                            window.location = window.location.href;

                        }, 120);

                        return;

                    }

                    var json = JSON.parse(data);

                    var done = false;

                    if (json.names) {

                        dashboard.data.data.names = json.names;

                    } else if (json.addresses) {

                        dashboard.data.data.addresses = json.addresses;

                    } else if (json.timers) {

                        dashboard.data.data.timers = json.timers;

                    } else if (json.attributes) {

                        dashboard.data.data.attributes = json.attributes;

                    } else if (json.temporaryData) {

                        dashboard.data.data.temporaryData = json.temporaryData;

                    } else if (json.gender) {

                        dashboard.data.data.gender = json.gender;

                    } else if (json.patient_id) {

                        dashboard.data.data.patientId = json.patient_id;

                        if (typeof patient != typeof undefined) {

                            patient.patientId = json.patient_id;

                        }

                    } else if (json.birthdate) {

                        dashboard.data.data.birthdate = json.birthdate;

                    } else if (json.birthdate_estimated) {

                        dashboard.data.data.birthdate_estimated = json.birthdate_estimated;

                    } else if (json.identifiers) {

                        dashboard.data.data.identifiers = json.identifiers;

                    } else if (json.programs) {

                        var programs = json.programs;

                        var keys = Object.keys(programs);

                        if (keys.indexOf("CROSS-CUTTING PROGRAM") >= 0) {

                            keys.splice(keys.indexOf("CROSS-CUTTING PROGRAM"), 1);

                            var roots = Object.keys(programs["CROSS-CUTTING PROGRAM"].patient_programs);

                            for (var i = 0; i < roots.length; i++) {

                                var root = roots[i];

                                var visits = Object.keys(programs["CROSS-CUTTING PROGRAM"].patient_programs[root].visits);

                                for (var j = 0; j < visits.length; j++) {

                                    var visit = visits[j];

                                    for (var k = 0; k < keys.length; k++) {

                                        var program = keys[k];

                                        var eRoots = Object.keys(programs[program].patient_programs);

                                        for (var l = 0; l < eRoots.length; l++) {

                                            var eRoot = eRoots[l];

                                            if (!programs[program].patient_programs[eRoot].visits[visit]) {

                                                programs[program].patient_programs[eRoot].visits[visit] =
                                                    programs["CROSS-CUTTING PROGRAM"].patient_programs[root].visits[visit];

                                            } else {

                                                var encounters = Object.keys(programs["CROSS-CUTTING PROGRAM"].patient_programs[root].visits[visit]);

                                                for (var m = 0; m < encounters.length; m++) {

                                                    var encounter = encounters[m];

                                                    programs[program].patient_programs[eRoot].visits[visit][encounter] =
                                                        programs["CROSS-CUTTING PROGRAM"].patient_programs[root].visits[visit][encounter];

                                                }

                                            }

                                        }

                                    }

                                }

                            }

                        }

                        dashboard.data.data.programs = programs;

                    } else if (json.relationships) {

                        dashboard.data.data.relationships = json.relationships;

                    } else if (json.done) {

                        done = true;

                    }

                    var lastHIVTest = encodeURIComponent(dashboard.queryActiveObs("HTS PROGRAM",
                        (new Date()).format("YYYY-mm-dd"), "HTS VISIT", "Last HIV test"));

                    if (lastHIVTest) {

                        dashboard.setCookie("LastHIVTest", lastHIVTest, 0.3333, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

                    }

                    var ageGroup = encodeURIComponent(dashboard.queryActiveObs("HTS PROGRAM", (new Date()).format("YYYY-mm-dd"),
                        "HTS CLIENT REGISTRATION", "Age Group"));

                    if (ageGroup) {

                        dashboard.setCookie("AgeGroup", ageGroup, 0.3333, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

                    }

                    dashboard.refreshDemographics(done);

                })

            });

        }, 900);

    },

    checkCtrl: function (obj) {

        var o = obj;
        var t = o.offsetTop;
        var l = o.offsetLeft + 1;
        var w = o.offsetWidth;
        var h = o.offsetHeight;

        while ((o ? (o.offsetParent != document.body) : false)) {
            o = o.offsetParent;
            t += (o ? o.offsetTop : 0);
            l += (o ? o.offsetLeft : 0);
        }
        return [w, h, t, l];

    },

    uiTimer: function (control, target, scale, x, y, opacity, includeSeconds) {

        if (!control)
            return;

        if (scale && !isNaN(scale)) {

            this.scale = scale;

        } else {

            this.scale = 0.1;

        }

        this.ctx = null;

        this.includeSeconds = includeSeconds;

        if (!opacity)
            this.opacity = 0.95;

        if (!target)
            this.target = 0;
        else
            this.target = target;

        var pos = dashboard.checkCtrl(control);

        if (x)
            this.x = x;
        else
            this.x = ((pos[3] + pos[0] + 5) - (1000 * this.scale));

        if (y)
            this.y = y;
        else
            this.y = (pos[2] - 10);

        this.div = document.createElement("div");
        this.div.style.width = (1000 * this.scale) + "px";
        this.div.style.height = (450 * this.scale) + "px";
        this.div.style.position = "absolute";
        this.div.style.top = (this.y + (this.target * (320 * this.scale))) + "px";
        this.div.style.left = this.x + "px";
        this.div.style.zIndex = 998;
        this.div.style.overflow = "hidden";
        this.div.style.opacity = this.opacity;

        control.appendChild(this.div);

        this.parent = control;

        this.canvas = document.createElement('canvas');

        this.div.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.ctx.strokeStyle = '#1B4449';
        this.ctx.lineWidth = 8 * this.scale * 3;
        this.ctx.lineCap = 'square';

    },

    saveTemporaryData: function (category, data) {

        dashboard.socket.emit("saveTemporaryData", {
            id: dashboard.getCookie("patient_id"),
            category: category,
            data: data
        });

    },

    deleteTemporaryData: function (category) {

        dashboard.socket.emit("deleteTemporaryData", {id: dashboard.getCookie("patient_id"), category: category});

    },

    saveArbitraryObsData: function (url, patient_id, encounter, concept, value, callback) {

        var root = (window.parent && window.parent.dashboard ? window.parent.dashboard : dashboard);

        var json = {
            "data": {
                "program": root.getCookie("currentProgram"),
                "encounter": encounter,
                "concept": concept,
                "value": value,
                "token": root.getCookie("token"),
                "patient_id": patient_id
            }
        };

        root.ajaxPostRequest(url, json, callback);

    },

    checkPartnersVisit: function (callback) {

        var relations = dashboard.data.data.relationships.map(function (e) {
            return (e.relative_type.toLowerCase().match(/spouse/) ? e.relative_id : undefined)
        }).reduce(function (a, e, i) {
            if (e != undefined) a.push(e);
            return a;
        }, []);

        var spouseId = (relations.length > 0 ? relations[0] : undefined);

        if (spouseId) {

            var today = (dashboard.getCookie("today").trim().length > 0 ?
                (new Date(dashboard.getCookie("today").trim())).format("YYYY-mm-dd") : (new Date()).format("YYYY-mm-dd"));

            dashboard.ajaxRequest("/check_partner_visit/" + spouseId + "/" + today + "/" +
                dashboard.getCookie("currentProgram"), function (data) {

                if (callback)
                    callback(data);

            });

        } else {

            if (callback)
                callback();

        }

    },

    checkCurrentVisit: function (callback) {

        var today = (dashboard.getCookie("today").trim().length > 0 ?
            (new Date(dashboard.getCookie("today").trim())).format("YYYY-mm-dd") : (new Date()).format("YYYY-mm-dd"));

        dashboard.ajaxRequest("/check_partner_visit/" + dashboard.getCookie("patient_id").trim() + "/" + today + "/" +
            dashboard.getCookie("currentProgram"), function (data) {

            if (callback)
                callback(data);

        });

    },

    init: function (dataPath, modulesPath, settingsPath) {

        this.Dispatcher.prototype.addEventlistener = function (event, callback) {
            this.events[event] = this.events[event] || [];
            if (this.events[event]) {
                this.events[event].push(callback);
            }
        }

        this.Dispatcher.prototype.removeEventlistener = function (event, callback) {
            if (this.events[event]) {
                var listeners = this.events[event];
                for (var i = listeners.length - 1; i >= 0; --i) {
                    if (listeners[i] === callback) {
                        listeners.splice(i, 1);
                        return true;
                    }
                }
            }
            return false;
        }

        this.Dispatcher.prototype.dispatch = function (event) {
            if (this.events[event]) {
                var listeners = this.events[event], len = listeners.length;
                while (len--) {
                    listeners[len](this);	//callback with self
                }
            }
        }

        this.Subscriber.prototype = new this.Dispatcher();

        this.Subscriber.prototype.sendUpdateEvent = function () {

            this.dispatch("done");

        }

        this.Subscriber.prototype.sendTimerUpdateEvent = function () {

            this.dispatch("timer update");

        }

        this.Subscriber.prototype.sendRelationEvent = function () {

            this.dispatch("relation");

        }

        this.subscription = new this.Subscriber();

        this['selectedProgram'] = null;

        this['selectedVisit'] = null;

        this['step'] = 5;

        this.icoClose = "data:image/png;base64,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";

        this.icoFemale = "data:image/png;base64,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";

        this.icoMale = "data:image/png;base64,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";

        this.icoAdd = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAO2ElEQVRoge2We1CTd7rH39ldgWl3i8mulaBWq4AgF8MlFyABAoQQAqxgAwrIxUvtgtUC3kDQgJSryv0iCBRQ0PGyVVt7uj3jaXWqrrXOVEgCCblwx85R1511Zlddv+eP3xsSUNzq2u35o7+ZZxLe9w3z/Tzf7/MkFPXz+fn8/ziZu/b+PmHTlqqI+NTTfpLYKz4hUTeduCKjE1dk9AmJuuknib0SEZ96OmHTlqrMXXt//1PrpSiKorLzCznylM3t7ACp0jNm6wR3Y8M9/8xTfxPkfvWPwH3XHolKNRCVahC479ojQe6lf/hnnvobd1PDPc+YrRPsAKlSnrK5PTu/kPMfF75boViyKnHjMSeeyMBP77gvKvz2cXCpBpYVWqZ9qizviwpvPuand9x34okMqxI3HtutUCz50YUrFIrXEjZtqXLxDdVw3226F1SseWIpWFyuhbiCVNgBLcIODFqU+Z643AwkKtE84b57+J6Lb6hmzaYttQqF4rUfRfz2XIWbQCa/zF1fdTeo4MZUx0PLTYIHEXZwEJJDdFUOIrxSN1WSSvO9sIMESlyhRWi5dsoR7vqquwKZ/PL2XIXbqxWfpwhiB8p6+e+13hc9Q/iU4CodpNU6SGt0kNboIa3VI6KWvEpr9OR6tQ7hVWagmSD89Lb77EBZ7/Y8RdArE+8ukPTzM47+1TIqJuHhlTqEVxPBEbV6yOr0kNXrIas3ILLegMgG8iqrN5DrdTRUjR7h1bQ7JhA6Wn7vH/uru0DS/29DZOconNmBst5p4iu0JCqVg9OF1xsQ2WhAVJMB0U1GUoctir4W1USek9UbpoFIKkm0xBVmCHagrDc7R+H8UuIVCsVrQpn8K/7mlr/MFB9eSWJChOsR1WiYEryq2YiYFiNijhgR0zqE2NYhxLQOkb9byH0TUFQjcYWAEDcsIfibW/4ilMm/eqnBjktLb+Kur7oreo74yAYDomjhMS1GxLYOIbZ9CKs/GsI7HcNP1eqPyP3Y1iHEtJDPRTUZEdlgmBWCu6HqblxaetMLic/OL+Q48YJ1osLv/hlcqiGZnyme7vqqZtLp1e1EtLxjGHFdI4g7OoL4Y+aKOzqCuK4RyE0w7cSZVc3EjcjGZ0CUayEquvVPJ16w7oW+8MJWrzvPT++4b9o2YQdI5p8S32JEbBstvHOYiO4ewZruEaztGcHa46Pm6iHX47sJjLyTgMS2DWFVy9MQkkoy2KHlWvhmdN4PW73u/A8SvyO/UOjEExlMX1LiCi3ZNtXm2MwUH9dFhK3tGUHCiVEknhxF4qkxJJ4aQ9Lpsan3iSdHkXCCwMR3E0eegqDjFF5NtpO4QgtRqeaJE09k2JFfKPyXAPKUze0zu0+iQw8sHZsp8Ufpjh8nwpNOj0He9h3cYzPwdlAs3g6KhXtsBuLav8O6M+ME6CRxZQ3txhREM5kJWT29nSp101yQp2xuf654hULxK3aAVGn6bTOz+1GNBjKwrebOr+mmu35qDOtOjyP543G809ELfsI28GVx4Mvi4Ju4DfKOPqScm0Dyx+NYd3ociafGkHCChqCdiGkdIoPd+AwX9t98zA6QKhUKxa9mBfggd6/MIypjwrQ2zdknez66iWyb1e1DkHcOk9gcp8WfGUfK2QmknptEXFcf/JIywY+MAz8yDn5JmYg/pkTaJ5NIPTeJlLMTWHeGQKw9Por4bjITq9vp7dRkhKzeAGmN3jwLZVp4RmdMfJC7VzYrQNK7Ww9xN9bdm7Z5qiwG9zBZlaborO0ZQeLJUaw7TcSnnZ9E2oXbSOhRQpicBb+oOPhFxSEgOQuJx1XY8F+3kXbhNtLO0xCnx0mceiyiRLtgGujwKvNG4m2qu5u0eUvFrADh8uSzfh/88YFlfKTVOsjq9IhqMpDstw9B3kG6n3CCZD7543GkniPiN3x+G4knVAhIzYJ/dDz8o+MRmJqFpFNqbPwTuZ924TZSz00i+WMyEwknaBc6hhHbbpoFA2R1ekgtYuSf9ccH4fLks7MCeAdKL/N3/M/fhUUDCCrRILhMi9CDWoRVD0JaR1yIOmLEqvYhxHYNQ94zgviTY1h7ZhyJZ8eR/MkEUj6bRPwJJfyStoIfEQO+LBb+Sduw5qQSaX+6jZTPJpH8yQQSz45j7ZlxrDk5BnnPCFZ3DWNV+xCijhghazRAWqdHWPUgQg9qEVymRVCJBn67vvy7d6D08qwAS9y5V7x3XH3E26uGb4EafkX9EJZoEFihRfChQYTW6CBp1EPabEBkmxHRXcPwfq8Ky8I3wCE8FQ4RaVgetQEOsjS4hsbAMyQCXiERcBXHwDFyPZZHb8Ry2QY4RKTBIWIjfDKqEdMzguiuYUS2GSFtNkDSqEdojQ7BhwYRWKGFsEQDv6J++Baowdl97dESd+6VWQEYCx2vuGVef8zerYTXHhV89qrBKegHv6gffmUaCA5qEVg9iOAGHUKbDQhrM8IlUYG3fELwFicIi7lBWMITYSlPBGe/YLgKSLn4B8OBL8LbPFKLuUF4ixsCt+RCSDuHENZmRGizAcENOgRWD0JwUAu/Mg34RQPgFPTDZ68aXrkqeGR985ix0HF2ABsG60unLdceu2b3wn1nH1bmKOGZr4J3gRqcD/vBL9PA76AWwppBBDboEdxigFN8Ht72DsRSHwGWcQRw4AjhyBXCiUdqOc/83pErhANHiGUcAZb6BMIlYS9C240IbjEgsEEPYc0g/A5qwS/TgPNhP7wL1PDMV2FljhLuO/vg/P6fH9swWF/OCmDNYF1weu/SQ0sAdr4K3goCwJsBIGo2YEVqKVzDEuAuWQMPaQLYkYlYKV0LF4F4CsBFIAZblgDv6HVgRyTCQ5oAN2kS3DeUI7TdCFHzdACeCUChBtsSIP3yQ2sG68LzHOhelvbJAwLQC4+cPrDzVPBSqMEp6gevdAB+B7UQVA8isF4HUbMBYZ0jWP/Z9/jDxTvYeukOMr++h/fOqcCOSoYT7YRnVAoyPu3H9mv3kHXlHrZeuoN3//t/EdEzjtA2GqBeB0E1DVA6AE5RP7wUarDzVPDI6YP7zl44bvz0gQ2D1f08gOK33mm+uyLrFtx29MJjdx/YeUp4KVQEoGQAvgc0EFQNIqBOB9FhPUJajRB3DEFydBgRx0cgOzmKkJZv4RyeCEcuiY1LeBLErTcRdWYMspOjiDg+AsnRYYg7hhDSaoTosB4BdToIqgbhe0ADXokJQAV2nhIeu/vgtqMXi+Na7towWMWzA8y1S2UF545OA9ijhNc+FXz2q8EtHgC/QgP/Q1oIa3UIaiRzENpuRFjnMMK7RxBxYhSiphtYLkmEI0cIR44QzpJEhDR/S8SfGEV49wjCOoen8h/UqIewVgf/Q1rwKzTgFg/AZ78aXvtUYO8xA9iH5I7azLVLnRXAivGmB8NVpl6ReQtu23vhvqsPK3OV8Nyrgnfh9EGeitFhPUKOGCH+aAiSLgIRVP8NnMRr4cAhQ7tcnABR4w1EHB9BePcIJF3DEH80hJAjpPuW8Zka4EI1PPeqsDJXCfddfXDb3gvGConaimnnOisARVG/sGbaf+Gc8fUj0yA/NQclA/Ct0MC/krhgGuaQVgIR1jkMYfV1OISswTIfAZb5COAYsgYBdd9AcnQYYZ20+FaL4a3Vwb9SC98Ky/hY5r8PzhlfP7Rmsj6nKOoXzwOgrJl22QsiK25bxmjlHuKCT+H0bWSahaBGGuKIEaHtRvgf+jOWieKx1FuApd4CLAuOh6DyOsQdQwhtN5LON5PomLJvuX18TN23iM+iyLJJ67mszOeKpyiKsrGdv9SGybrusu27J67bLdZpngpeChV89veTWSg3RymgjnbiMJmJoCNDWP/pbRRcvYuCq3ex/sJtiFpJ14NbDCQ2DbR4U3TKTdk3Da95fa7IuvXEhsm6bmM7f+m/BKAoirJm2JUtkJVNPssF7wISJW6JBUTVIIlTPe3GYeKIqNlABNPvRYf1CGokmRfWmjvPL9eAS0fHu2CW7jPsyn6QeIqiKIrJXGTDtL/qvOXqI5MLZBYsBnoGhH8lcUNYqyOO1BNXpqqeXBfWkq77V2qfFk9Hh52nnMq+y7Zrj2yY9lcpJnPRDwcgLqTbBWYPr8iy2Eg5yqchigfAK9PAt4IGOUQcEVQPQlhjLkH1IARVg/A/RIT7VmjAKyOxmSl+ZY5587CCsoetGXbpLySePnOsmPZtCyT7x12ze+G24xkQBWr47O8ng10yAH6ZBvwKDXwPEJiZ5XuA3OeX0dvmw3747DfHZpr4Hb1YKC0at2Lat1EUNedlACjq1/PftGawLiyKrvp+NggvBb2diggIt3gAvJIB8EqJM/wy0mleKbnOLSbCOUVk23gpVM8Uv2hV1ffWDNYF6tfz33w58fSxfmOegzXD/uJMCI8cMtjsPBUNooZ3oRo++2kYGmiq6Gs++8lzXgpT1+mBzembId7+ovUb8xz+LfHTIJiszxdGFE+4ZveSmdjZR7ZTjnI6yD7iipdCDW+FGt4F5NVLQbrttU81TfjKHLJt3HeSzC+MKJ6wZrI+f2Xip87r8+ysmPZtdkHZw8v/cOmh63baDRrEI4f87GDvIfFi56nAzlfBM5+8svNITNh7lFiZSzo+JXxHL5y3fP2QFZQ9bMW0b6Nen2f3asWbzxybufPX2zBYlxaI9425fEC+7Ewg7rtoGBNQjnKqTII9dpPnTMJXZN16siBs35gNg3XJhsnaRL30wL7IsbVlWDHsd9swWdcXRZZNOm8hv53caBgCRENNlfme2/ZeuLx/5dGiyLJJGybruhXDfjdla8v48YXPPEzmIuu5rExrpv0XDFeZ2j40f2yxvPnOsvXnHjinX37omt0L1+xeOKdffuiw4fyDxfLmO/bi/DGGq0xtzbT/wnouK/OFv6BewbGhKOq3FEUtoijKiaIoD4qiOL+0eT3Z6jeMijlv/O7YHNt5F61s59+wnjtfaz13vtbKdv6NObbzLs5543fHrH7DqPilzevJFEVx6M860f/rt/T//mkAKIrypyhKRFGUmKIoKUVRMoqiouiS0dfE9DP+PyXAz+dVnv8DOdyQGltEExUAAAAASUVORK5CYII=";

        this.icoUp = "data:image/png;base64,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";

        this.icoDown = "data:image/png;base64,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";

        this.icoSaving = "data:image/png;base64,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";

        this.icoMax = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEOklEQVRYhe2V3U8cVRiH31JFNFHTxJiYiBKjMRpNqH+HJC0XRqnVSkIIxYqkQG2LWq3RSFJTkBQlYiHZkAaCKRLZpcsutE3AJtjUK2HLfrMs+zWzO987szM/L9zZ7EJXZ4VL3uS5md978j5nzkkO0X7tV5madky/OL8wNzl/80bQ6barTrddqwDVveDwO912m9M581zFw+cX7O8v3nYJDJsyNE2FYRgVo6oqEsm44b7pFFwu+1HLw2dnr796e8klGoYOAP9ruAkA6LqOhVtOYWp26llLAguLc79yXMbQdR2apu0aXdeRYpL6/KJjxJKAa9ERz+k5qKqKbDa7a1RVhaqqcN9yrloSuOGahWEYkCQJkiRBlmUMDPbjvQ/eLUGW5UK+PRsY7C/JdV2H02UXLQvoug6e58HzPCRJQktrM3T9nzsBAC2tzZAkqSQ3S9f1klwQBORyOTjdDrkigUwmg0wmA0mS0H6qDQDQfqqtgCRJJbmJ2WfmHMchl9OsC/zmmEYulwPLMmBZBrIsobOrAwDQ2dUBWZYKmLnJ9j6WZZBOs9A0Ffa5GWsCv0xPQtM0pFIJpFIJKIqMT851F1AUuZAVU66PYZJQ1Syuz0xaE7g2YYOqqojFoojFolAUZQdmVky5vnh8C4oi49qEzZrAmO1nKFkFkc2NPWEzGoEkSRizXbUmMDwyBFmWEAwF9oRQOAhB4PHT1R+tCQxeuQxRFOD1rcPrW4c/4EP/998V8Ad8hayYcn0+vw8cl8GVHwasCVy63AeO57DmWcWaZxXBUABDw4MAgKHhwZLdmbnJ9r41zyrur3vApllcGuizJvD1txfB8xzWvR6sez3YikUxMjoMABgZHS6wFYuW5CZmn5l7fffBpll80/eVNYELX34KnufgD3jhD3jBsgxs46OF1w0AbOOjYFmmJDfLMIySPBD0gU2z+OLi59YEzp7vAS/wCIWDCIWD4LgMVu7ewcTUeAmiKCAUDkIUhR3Zyt074LgMQuEgwhshsGkGvZ+ds/YWnDnbnUwmE9iKRbEZjSCRjEMUBSiKvIPNaOSB30VRQCIZx2Y0glh8C5HIBs73nvFYEjjd0zF77897RjrNIh6P7Zp0Oo3l35f0j7s6xv5t7oE8VSdaTtR393SKKSYFjuPAsAxSTKpiGJYBx3OIJ+LoPN3BNTU3vUBEVUWzSoZXEdHDRPQYER1qbDzS++FH7dmVP1aQTCYhy3LFJBIJLC8vGW3trUpjY8NJInqCiGqI6GCRSEHgYD48RES1RFRfV1d34Uhjg/fY8Xfkt5veQqUcO94kNhx986/a2tqTRPQKET1DRI8TUfWDBKqI6CEiepSIniSip4noeSJ6mYheJ6J6IjpMRG/8B4fz1BPRa0T0Un5DT+WHP5Lf7I5jKLkHeZnq/IKavFgl1OTXVuePtvi37xhcrg7sIftVtv4GgW76OVkufv0AAAAASUVORK5CYII=";

        document.body.oncontextmenu = function () {
            return false;
        }

        var patientId = window.location.href.match(/\/([^\/]+)$/)[1];

        dashboard.ajaxRequest(settingsPath, function (settings) {

            dashboard.settings = settings;

            dashboard.ajaxRequest((dashboard.settings.defaultPath ? dashboard.settings.defaultPath : "") + "/get_primary_id/" +
                patientId + "/" + dashboard.getCookie("token"), function (data) {

                dashboard.setCookie("client_identifier", data.id, 0.3333, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

                dashboard.setCookie("patient_id", data.id, 0.33333, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

                dashboard.uiTimer.prototype = {

                    degToRad: function (degree) {
                        var factor = Math.PI / 180;
                        return degree * factor;
                    },

                    destroy: function () {

                        if (this.div)
                            this.parent.removeChild(this.div);

                        delete this.div;

                    },

                    renderTime: function (time) {

                        this.colors = {
                            "0-15": "blue",
                            "15-30": "#2db730",
                            "30-45": "orange",
                            "45-60": "red"
                        };

                        if (!time)
                            time = 0;

                        var remainder = 0;
                        var hours = Math.floor(time / 3600);

                        remainder = (time - (hours * 3600));

                        var minutes = Math.floor(remainder / 60);

                        remainder = (remainder - (minutes * 60));

                        var seconds = remainder;

                        this.ctx.clearRect(0, 0, 1000 * this.scale, 470 * this.scale);
                        this.ctx.fillStyle = 'rgba(255,255,255,0)';
                        this.ctx.fillRect(0, 0, 1000 * this.scale, 470 * this.scale);

                        this.fontScale = 2.55;

                        var color = "";

                        if (minutes > 45) {

                            color = this.colors["45-60"];

                        } else if (minutes > 30) {

                            color = this.colors["30-45"];

                        } else if (minutes > 15) {

                            color = this.colors["15-30"];

                        } else {

                            color = this.colors["0-15"];

                        }

                        this.ctx.strokeStyle = color;

                        //Hours
                        if (hours > 0) {

                            if (this.includeSeconds) {

                                this.ctx.beginPath();
                                this.ctx.arc(160 * this.scale, 250 * this.scale,
                                    150 * this.scale, this.degToRad(270), this.degToRad((hours * 15) - 90));
                                this.ctx.stroke();

                                this.ctx.font = (40 * this.scale * this.fontScale) + "px Arial";
                                this.ctx.fillStyle = '#1B4449';
                                this.ctx.fillText(hours, 115 * this.scale, 225 * this.scale);
                                this.ctx.fillText("Hrs", 105 * this.scale, 315 * this.scale);

                            } else {

                                this.ctx.beginPath();
                                this.ctx.arc(480 * this.scale, 250 * this.scale, 150 * this.scale,
                                    this.degToRad(270), this.degToRad((hours * 6) - 90));
                                this.ctx.stroke();

                                this.ctx.font = (40 * this.scale * this.fontScale) + "px Arial";
                                this.ctx.fillStyle = '#1B4449';
                                this.ctx.fillText(hours, 420 * this.scale, 225 * this.scale);
                                this.ctx.fillText("Hrs", 410 * this.scale, 315 * this.scale);

                            }

                        }

                        //Minutes
                        if (minutes > 0 || hours > 0) {

                            if (this.includeSeconds) {

                                this.ctx.beginPath();
                                this.ctx.arc(480 * this.scale, 250 * this.scale, 150 * this.scale,
                                    this.degToRad(270), this.degToRad((minutes * 6) - 90));
                                this.ctx.stroke();

                                this.ctx.font = (40 * this.scale * this.fontScale) + "px Arial";
                                this.ctx.fillStyle = '#1B4449';
                                this.ctx.fillText(minutes, 430 * this.scale, 225 * this.scale);
                                this.ctx.fillText("Mins", 390 * this.scale, 315 * this.scale);

                            } else {

                                this.ctx.beginPath();
                                this.ctx.arc(800 * this.scale, 250 * this.scale, 150 * this.scale,
                                    this.degToRad(270), this.degToRad((minutes * 6) - 90));
                                this.ctx.stroke();

                                this.ctx.font = (40 * this.scale * this.fontScale) + "px Arial";
                                this.ctx.fillStyle = '#1B4449';
                                this.ctx.fillText(minutes, 760 * this.scale, 225 * this.scale);
                                this.ctx.fillText("Mins", 705 * this.scale, 315 * this.scale);

                            }

                        }

                        //Seconds
                        if ((seconds > 0 || minutes > 0 || hours > 0) && this.includeSeconds) {

                            this.ctx.beginPath();
                            this.ctx.arc(800 * this.scale, 250 * this.scale, 150 * this.scale,
                                this.degToRad(270), this.degToRad((seconds * 6) - 90));
                            this.ctx.stroke();

                            this.ctx.font = (40 * this.scale * this.fontScale) + "px Arial";
                            this.ctx.fillStyle = '#1B4449';
                            this.ctx.fillText(seconds, 760 * this.scale, 225 * this.scale);
                            this.ctx.fillText("Secs", 725 * this.scale, 315 * this.scale);

                        }

                    }

                };

                dashboard.ajaxRequest(dataPath, function (data) {

                    dashboard['data'] = data;

                    dashboard.ajaxRequest(modulesPath, function (modules) {

                        dashboard.modules = modules;

                        dashboard.buildPage();

                        setInterval(function () {

                            if (dashboard.__$("main")) {

                                dashboard.__$("main").style.height = (window.innerHeight - 225) + "px";

                            }

                            if (dashboard.__$("details")) {
                                dashboard.__$("details").style.height = (window.innerHeight - 270) + "px";
                            }

                            if (dashboard.__$("programs")) {
                                dashboard.__$("programs").style.height = ((window.innerHeight - 270) / 2) + "px";
                            }

                            if (dashboard.__$("relationships")) {
                                dashboard.__$("relationships").style.height = ((window.innerHeight - 370) / 2) + "px";
                            }

                            if (dashboard.__$("visits")) {
                                dashboard.__$("visits").style.height = (window.innerHeight - 270) + "px";
                            }

                            if (dashboard.__$("tasks")) {
                                dashboard.__$("tasks").style.height = (window.innerHeight - 270) + "px";
                            }

                            if (dashboard.__$("dashboard.navPanel")) {

                                dashboard.__$("dashboard.navPanel").style.height = (window.innerHeight - 130) + "px";

                            }

                        }, 10);

                    });

                });

            });

            setInterval(function () {

                dashboard.subscription.sendTimerUpdateEvent();

            }, 1000);

        })

    }

});
