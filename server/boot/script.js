module.exports = function (app) {

  var User = app.models.User;
  var Users = app.models.Users;
  var Person = app.models.Person;
  var PersonName = app.models.PersonName;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  User.hasMany(Role, {
    through: RoleMapping,
    foreignKey: 'principalId',
    keyThrough: 'roleId',
    as: 'roles'
  });

  User.hasMany(Person, {
    through: Users,
    foreignKey: 'id',
    keyThrough: 'personId',
    as: 'person'
  })

  User.hasMany(Users, {
    foreignKey: 'userId',
    as: 'users'
  })

};