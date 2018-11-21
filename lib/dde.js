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
    version: null,

    checkIfDDEAuthenticated: function (callback) {

        var self = this;

        if (!self.globalToken) {

            self.authenticateWDDE(callback);

        } else {

            if (this.version === '3.0') {

                (new self.client()).get(self.ddePath + "/v1/authenticated/" + self.globalToken, function (result) {

                    if (!result.error) {

                        callback(true);

                    } else {

                        callback(false);

                    }

                })

            } else {

                (new self.client()).post(self.ddePath + "/v1/verify_token", {
                    data: {
                        token: self.globalToken
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                }, function (result) {

                    if (result.message === 'Successful') {

                        callback(true);

                    } else {

                        callback(false);

                    }

                })

            }

        }

    },

    addDDEUser: function (callback) {

        var self = this;

        if (!self.settings && this.version !== '3.0')
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
            headers: { "Content-Type": "application/json" }
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
            headers: { "Content-Type": "application/json" }
        };

        (new self.client()).post(`${self.ddePath}/v1/${this.version === '3.0' ? 'authenticate' : 'login'}`, args, function (result) {

            if (!result.error) {

                if (version === '3.0') {

                    self.globalToken = result.data.token;

                    self.expireTime = result.data.expire_time;

                } else {

                    self.globalToken = result.access_token;

                }

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
    init: function (client, ddePath, settings, version) {

        this.ddePath = ddePath;

        this.client = client;

        this.settings = settings;

        this.version = version;

    }

})