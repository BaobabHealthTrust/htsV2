const path = require('path')
const fs = require("fs");
exports.privateKey = fs.readFileSync(path.join(__dirname, 'certs/privatekey.pem')).toString();
exports.certificate = fs.readFileSync(path.join(__dirname, 'certs/certificate.pem')).toString();