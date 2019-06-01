var pgp = require("pg-promise")(/*options*/);
var sigap = pgp('postgres://modulo4:modulo4@67.205.143.180:5432/tcs2');

module.exports = sigap;