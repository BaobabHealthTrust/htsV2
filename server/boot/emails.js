module.exports = function (app) {
  delete app.models.User.validations.email;
};