'use strict';
const server = require('./server');
const ds = server.dataSources.hts; // <<<<<<note the datasource name
const lbTables = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role'];

ds.automigrate(lbTables, function (er) {

  if (er) 
    throw er;
  
  console.log('Loopback tables [' + lbTables + '] created in ', ds.adapter.name);

  const User = server.models.User;
  const Users = server.models.Users;
  const Person = server.models.Person;
  const PersonName = server.models.PersonName;
  const Role = server.models.Role;
  const RoleMapping = server.models.RoleMapping;
  const uuid = require('uuid');

  const debug = (msg) => {

    if (String(process.env.DEBUG_APP) === 'true') {
      console.log(msg);
    }

  }

  const cleanUp = () => {

    ds.disconnect();
    process.exit();

  }

  const roles = ["Admin", "Counselor", "HTS Coordinator", "Registration Clerk"];

  for (let name of roles) {

    Role
      .findOne({
        where: {
          name
        }
      }, function (err, role) {

        if (!role) 
          Role.create({name: name});

        }
      );

  }

  User
    .findOne({
      where: {
        username: 'CP6K'
      }
    }, function (err, result) {

      if (!result) {

        setTimeout(() => {

          User
            .create([
              {
                realm: 'bht',
                username: 'CP6K',
                password: 'test',
                email: ''
              }
            ], function (err, users) {

              if (err) {

                debug(err);

                return cleanUp();

              }

              // ... Create projects, assign project owners and project team members ...
              // Create the admin role
              Role
                .findOne({
                  where: {
                    name: "Admin"
                  }
                }, function (err, role) {

                  if (err) {

                    debug(err);

                    return cleanUp();

                  }

                  role
                    .principals
                    .create({
                      principalType: RoleMapping.USER,
                      principalId: users[0].id
                    }, function (err, principal) {

                      if (err) {

                        debug(err);

                        return cleanUp();

                      }

                      debug(principal);

                      Person.create({
                        gender: 'M',
                        birthdateEstimated: 1,
                        creator: 1,
                        dateCreated: (new Date()),
                        dead: 0,
                        uuid: uuid.v4()
                      }, function (err, person) {

                        if (err) {

                          debug(err);

                          return cleanUp();

                        }

                        debug(person);

                        PersonName.create({
                          personId: person.personId,
                          givenName: 'Default',
                          familyName: 'User',
                          creator: 1,
                          dateCreated: (new Date()),
                          dead: 0,
                          uuid: uuid.v4()
                        }, function (err, name) {

                          if (err) {

                            debug(err);

                            return cleanUp();

                          }

                          Users
                            .upsertWithWhere({
                              userId: users[0].id
                            }, {
                              personId: person.personId
                            }, function (err, name) {

                              if (err) {

                                debug(err);

                                return cleanUp();

                              }

                              cleanUp();

                            });

                        });

                      });

                    });
                });

            });

        }, 1000);

      } else {

        cleanUp();

      }

    });

});
