/**
 * Created by chimwemwe on 6/28/17.
 */

"use strict"

exports.DDE = ({

    ddePath: null,
    client: null,
    globalToken: null,
    settings: null,
    expireTime: null,

    checkIfDDEAuthenticated: function (callback) {

        var self = this;

        if (!self.globalToken) {

            self.authenticateWDDE(callback);

        } else {

            (new self.client()).get(self.ddePath + "/v1/authenticated/" + self.globalToken, function (result) {

                if (!result.error) {

                    callback(true);

                } else {

                    callback(false);

                }

            })

        }

    },

    addDDEUser: function (callback) {

        var self = this;

        if (!self.settings)
            return callback();

        var username = self.settings.app.username;
        var password = self.settings.app.password;
        var application = self.settings.app.application;
        var site_code = self.settings.app.site_code;

        var args = {
            data: {
                username: username,
                password: password,
                application: application,
                site_code: site_code,
                description: "User for " + application.toUpperCase()
            },
            headers: {"Content-Type": "application/json"}
        };

        (new self.client({
            user: self.settings.default.username,
            password: self.settings.default.password
        })).put(self.ddePath + "/v1/add_user", args, function (result) {

            if (!result.error) {

                self.globalToken = result.data.token;

                self.expireTime = result.data.expire_time;

            } else {

                console.log("###############################################");

                console.log("ERROR ADDING USER");

                console.log("Result:");

                console.log(JSON.stringify(result, undefined, 2));

                console.log("###############################################");

            }

            if (callback)
                callback(result);

        })

    },

    /*
     *  authenticateWDDE
     *
     *  Authenticate the user on DDE API and keep the token in self.globalToken for use later
     */
    authenticateWDDE: function (callback) {

        var self = this;

        if (!self.settings)
            return callback();

        var username = self.settings.app.username;
        var password = self.settings.app.password;

        var args = {
            data: {
                username: username,
                password: password
            },
            headers: {"Content-Type": "application/json"}
        };

        (new self.client()).post(self.ddePath + "/v1/authenticate", args, function (result) {

            if (!result.error) {

                self.globalToken = result.data.token;

                self.expireTime = result.data.expire_time;

                if (callback)
                    callback(result);

            } else {

                self.addDDEUser(callback);

            }

        })

    },

    /*
     *  init
     *
     *  Main entry point to the library.
     *
     *  @params {OBJECT} client     An instance of node-rest-client
     *  @params {string} ddePath    The path to access DDE from. This will typically be in public/config/patient.settings.json
     *  @params {object} settings   The object containing site specific definitions where the app name, siteCode,
     *                                  username, password and app name. This usually will be in config/dde.json
     */
    init: function (client, ddePath, settings) {

        this.ddePath = ddePath;

        this.client = client;

        this.settings = settings;

    }

})