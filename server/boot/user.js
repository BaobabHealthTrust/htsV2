"use strict";

module.exports = function (app) {

  const router = app
    .loopback
    .Router();
  const url = require("url");
  const User = app.models.User;
  const Users = app.models.Users;
  const Person = app.models.Person;
  const PersonName = app.models.PersonName;
  const Role = app.models.Role;
  const RoleMapping = app.models.RoleMapping;
  const HtsValidUsernames = app.models.HtsValidUsernames;
  const uuid = require('uuid');

  const debug = (msg) => {

    if (String(process.env.DEBUG_APP) === 'true') {
      console.log(msg);
    }

  }

  const validActiveToken = (token) => {

    return new Promise((resolve, reject) => {

      User
        .accessToken
        .findById(token, (err, result) => {

          debug(result);

          if (result) {

            const ttl = result.ttl;
            const ttd = (new Date(result.created)).getTime() + ttl;

            const now = (new Date()).getTime();

            if (ttd > now) {

              resolve(result.userId);

            } else {

              reject();

            }

          } else {

            reject();

          }

        });

    });

  }

  router
    .get('/logout/:id', function (req, res, next) {

      debug(req.params.id);

      User.logout(req.params.id, (err) => {

        if (err) {

          debug(err);

          res.clearCookie('location', { path: '/' });
          res.clearCookie('username', { path: '/' });
          res.clearCookie('role', { path: '/' });
          res.clearCookie('accessToken', { path: '/' });

          return res
            .status(401)
            .json(err);

        }

        res
          .status(200)
          .json({});

      })

    })

  router.post('/login', function (req, res, next) {

    debug(req.body);

    User.login({
      username: req.body.username,
      password: req.body.password,
      ttl: 60 * 60 * 4    // 4 Hours
    }, 'user', (err, token) => {

      if (err) {

        debug(err);

        return res
          .status(err.statusCode)
          .json(err);

      }

      User.findById(token.userId, {
        include: ['roles', 'users']
      }, (err, userRoles) => {

        if (err) {

          debug(err);

          return res
            .status(401)
            .json({});

        };

        if (userRoles.__data.users[0].retired !== 0) {

          return res
            .status(401)
            .json({});

        }

        debug(userRoles);

        const role = Object.assign({}, userRoles)
          .__data
          .roles
          .map((e) => {
            return e.name
          })
          .reduce((a, e, i) => {
            a = e;
            return a
          }, "");

        debug(role);

        res.cookie('username', req.body.username);
        res.cookie('accessToken', token.id);
        res.cookie('role', role);

        res
          .status(200)
          .json({ username: req.body.username, accessToken: token.id, role });

      })

    })

  })

  router.post('/user/add_user', async function (req, res, next) {

    debug(req.body);

    const json = req.body['Add User'];

    User.findOne({
      where: {
        username: json['user']
      }
    }, (err, creator) => {

      if (err) {

        debug(err);

        return res
          .status(400)
          .json(err);

      };

      User.create([
        {
          realm: json.realm
            ? json.realm
            : 'bht',
          username: json.Username,
          password: json.Password,
          email: ''
        }
      ], function (err, users) {

        if (err) {

          debug(err);

          if (Array.isArray(err)) {

            return res
              .status(err[0].statusCode)
              .json(err[0]);

          } else {

            return res
              .status(err.statusCode)
              .json(err);

          }

        }

        debug(users);

        debug(creator);

        Users.create({
          userId: users[0].id,
          systemId: users[0].username,
          username: users[0].username,
          password: users[0].password,
          creator: creator.id,
          dateCreated: (new Date()),
          retired: 0,
          uuid: uuid.v4()
        }, function (err, secondary) {

          if (err) {

            console.log(err);

            return debug('%j', err);

          }

          Role.findOne({
            where: {
              name: json['Role']
            }
          }, (err, role) => {

            if (err) {

              debug(err);

              return res
                .status(400)
                .json(err);

            };

            role
              .principals
              .create({
                principalType: RoleMapping.USER,
                principalId: users[0].id
              }, function (err, principal) {

                if (err) {

                  debug(err);

                  return res
                    .status(400)
                    .json(err);

                }

                debug(principal);

                Person.create({
                  gender: String(json['Gender'])
                    .trim()
                    .substring(0, 1)
                    .toUpperCase(),
                  birthdateEstimated: 1,
                  creator: creator.id,
                  dateCreated: (new Date()),
                  dead: 0,
                  uuid: uuid.v4()
                }, function (err, person) {

                  if (err) {

                    debug(err);

                    return res
                      .status(400)
                      .json(err);

                  }

                  PersonName
                    .create({
                      personId: person.personId,
                      givenName: json['First Name'],
                      familyName: json['Last Name'],
                      creator: creator.id,
                      dateCreated: (new Date()),
                      dead: 0,
                      uuid: uuid.v4()
                    }, function (err, name) {

                      if (err) {

                        debug(err);

                        return res
                          .status(400)
                          .json(err);

                      }

                      Users
                        .upsertWithWhere({
                          userId: secondary.userId
                        }, {
                            personId: person.personId
                          }, function (err, name) {

                            if (err) {

                              debug(err);

                              return res
                                .status(400)
                                .json(err);

                            }

                            console.log(name);

                            res
                              .status(200)
                              .json({});

                          });

                    });

                });

              });

          });

        });

      });

    })

  })

  router.get('/user/block_user/:id', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    debug(req.params.id);

    Users.upsertWithWhere({
      username: req.params.id
    }, {
        retired: 1
      }, function (err, user) {

        if (err) {

          debug(err);

          return res
            .status(400)
            .json(err);

        }

        const page = (query.page
          ? query.page
          : 1);
        const pageSize = (query.pageSize
          ? query.pageSize
          : 10);

        const skip = (pageSize * (page - 1));

        User.find({
          skip,
          limit: pageSize,
          include: ['person', 'roles', 'users']
        }, async (err, users) => {

          if (err) {

            debug(err);

            return [];

          }

          let json = [];

          let i = skip;

          for (let u of users) {

            i++;

            const name = await PersonName.find({
              where: {
                personId: u.__data.person[0].personId
              }
            });

            json.push({
              pos: i,
              username: u.__data.username,
              givenName: name[0].givenName,
              familyName: name[0].familyName,
              gender: u.__data.person[0].gender,
              retired: u.__data.users[0].retired,
              role: u.__data.roles[0].name
            });

          };

          debug(json);

          res
            .status(200)
            .json(json);

        })

      })

  })

  router.get('/user/activate_user/:id', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    debug(req.params.id);

    Users.upsertWithWhere({
      username: req.params.id
    }, {
        retired: 0
      }, function (err, user) {

        if (err) {

          debug(err);

          return res
            .status(400)
            .json(err);

        }

        const page = (query.page
          ? query.page
          : 1);
        const pageSize = (query.pageSize
          ? query.pageSize
          : 10);

        const skip = (pageSize * (page - 1));

        User.find({
          skip,
          limit: pageSize,
          include: ['person', 'roles', 'users']
        }, async (err, users) => {

          if (err) {

            debug(err);

            return [];

          }

          let json = [];

          let i = skip;

          for (let u of users) {

            i++;

            const name = await PersonName.find({
              where: {
                personId: u.__data.person[0].personId
              }
            });

            json.push({
              pos: i,
              username: u.__data.username,
              givenName: name[0].givenName,
              familyName: name[0].familyName,
              gender: u.__data.person[0].gender,
              retired: u.__data.users[0].retired,
              role: u.__data.roles[0].name
            });

          };

          debug(json);

          res
            .status(200)
            .json(json);

        })

      })

  })

  router.get('/active/:id', function (req, res, next) {

    validActiveToken(req.params.id).then(() => {

      res
        .status(200)
        .json({ valid: true });

    }).catch(() => {

      res
        .status(401)
        .json({ valid: false });

    });

  })

  router.get('/users/list', async function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    const page = parseInt((query.page
      ? query.page
      : 1), 10);
    const pageSize = (query.pageSize
      ? query.pageSize
      : 6);

    const skip = (pageSize * (page - 1));

    User.find({
      skip,
      limit: pageSize,
      include: ['person', 'roles', 'users']
    }, async (err, users) => {

      const total = await User.count({
        skip,
        include: ['person', 'roles', 'users']
      });

      debug(total);

      const pages = Math.ceil(total / pageSize);

      if (err) {

        debug(err);

        return res
          .status(200)
          .json({ users: [], page, pages });

      }

      let json = [];

      let i = skip;

      for (let u of users) {

        i++;

        const name = await PersonName.find({
          where: {
            personId: u.__data.person[0].personId
          }
        });

        json.push({
          pos: i,
          username: u.__data.username,
          givenName: name[0].givenName,
          familyName: name[0].familyName,
          gender: u.__data.person[0].gender,
          retired: u.__data.users[0].retired,
          role: u.__data.roles[0].name
        });

      };

      debug(json);

      res
        .status(200)
        .json({ users: json, page, pages });

    })

  })

  router.post('/user/update_user/:id', async function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    debug(req.params.id);

    debug(req.body);

    let json = {};

    if (req.body && req.body['Edit User']) {

      const data = req.body['Edit User'];

      if (data['First Name']) {

        if (!json.name)
          json.name = {};

        json.name.givenName = data['First Name'];

      }

      if (data['Last Name']) {

        if (!json.name)
          json.name = {};

        json.name.familyName = data['Last Name'];

      }

      if (data['Gender']) {

        if (!json.person)
          json.person = {};

        json.person.gender = data['Gender'];

      }

      if (data['Role']) {

        if (!json.role)
          json.role = {};

        json.role = data['Role'];

      }

    }

    const user = await User.findOne({
      where: {
        username: req.params.id
      },
      include: ['person', 'roles', 'users']
    });

    const userId = (user
      ? user.__data.users[0].userId
      : null);

    const personId = (user
      ? user.__data.person[0].personId
      : null);

    debug("######################");

    debug(user);

    debug(personId);

    debug(userId);

    debug("######################");

    if (json.name && personId) {

      await PersonName.upsertWithWhere({
        personId
      }, json.name);

    }

    if (json.person && personId) {

      await Person.upsertWithWhere({
        personId
      }, json.person);

    }

    if (json.role && userId) {

      const role = await Role.findOne({
        where: {
          name: json.role
        }
      });

      debug("##################");

      debug(role);

      debug("##################");

      await RoleMapping.upsertWithWhere({
        principalId: userId
      }, { roleId: role.id });

    }

    const page = (query.page
      ? query.page
      : 1);
    const pageSize = (query.pageSize
      ? query.pageSize
      : 10);

    const skip = (pageSize * (page - 1));

    setTimeout(() => {

      User.find({
        skip,
        limit: pageSize,
        include: ['person', 'roles', 'users']
      }, async (err, users) => {

        if (err) {

          debug(err);

          return [];

        }

        let json = [];

        let i = skip;

        for (let u of users) {

          i++;

          const name = await PersonName.find({
            where: {
              personId: u.__data.person[0].personId
            }
          });

          json.push({
            pos: i,
            username: u.__data.username,
            givenName: name[0].givenName,
            familyName: name[0].familyName,
            gender: u.__data.person[0].gender,
            retired: u.__data.users[0].retired,
            role: u.__data.roles[0].name
          });

        };

        debug(json);

        res
          .status(200)
          .json(json);

      })

    }, 100);

  })

  router.post('/user/change_password/:id', async function (req, res, next) {

    console.log(req.params.id);

    console.log(req.body);

    let data = {};

    if (req.body && req.body['Change Password'])
      data = req.body['Change Password'];

    if (data.password && data['Current Password'] && data.password !== data['Current Password'])
      return res.status(401).json({ error: true, message: "Unauthorized password!" });

    if (data['Confirm Password'] && data['New Password'] && data['New Password'] !== data['Confirm Password'])
      return res.status(400).json({ error: true, message: "Password mismatch!" });

    await User.upsertWithWhere({
      username: req.params.id
    }, { password: data['New Password'] });

    res
      .status(200)
      .json({});

  })

  router.get('/username_valid/:username', async function (req, res, next) {

    let valid = false;

    const username = await HtsValidUsernames.findOne({
      where: {
        username: req.params.username
      }
    }).catch((e) => { console.log(e) });

    valid = username !== null ? true : false;

    res.status(200).json({ valid })

  })

  router.post('/user/change_password', async function (req, res, next) {

    debug(req.body);

    await User.upsertWithWhere({
      username: req.body.username
    }, { password: req.body.password });

    res.status(200).json({});

  })

  router.get('/screen_timeout_minutes', function (req, res, next) {

    const fs = require('fs');

    const settings = JSON.parse(fs.readFileSync(__dirname + "/../../configs/site.json", 'utf-8'));

    debug(settings);

    res.status(200).json({ screen_timeout_minutes: (settings.screen_timeout_minutes || 0) });

  })

  app.use(router);

};