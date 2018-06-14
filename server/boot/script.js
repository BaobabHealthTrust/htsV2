module.exports = function (app) {

  const User = app.models.User;
  const Users = app.models.Users;
  const Person = app.models.Person;
  const PersonAddress = app.models.PersonAddress;
  const Patient = app.models.Patient;
  const PatientIdentifier = app.models.PatientIdentifier;
  const PersonName = app.models.PersonName;
  const Role = app.models.Role;
  const RoleMapping = app.models.RoleMapping;
  const HtsRegister = app.models.HtsRegister;
  const HtsRegisterEncounterMapping = app.models.HtsRegisterEncounterMapping;
  const HtsRegisterLocationType = app.models.HtsRegisterLocationType;
  const HtsRegisterServiceDeliveryPoint = app.models.HtsRegisterServiceDeliveryPoint;

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

  HtsRegister.hasMany(HtsRegisterLocationType, {
    foreignKey: 'locationTypeId',
    as: 'location'
  })

  HtsRegister.hasMany(HtsRegisterServiceDeliveryPoint, {
    foreignKey: 'serviceDeliveryPointId',
    as: 'serviceDeliveryPoint'
  })

  Person.hasMany(PersonName, {
    foreignKey: 'personId',
    as: 'personName'
  })

  Person.hasMany(PersonAddress, {
    foreignKey: 'personId',
    as: 'personAddress'
  })

};