const jwt = require("jsonwebtoken");
const config = require("../config/jwt-secret.config");
const EUserType = require("../enums/EUserTypes")

exports.EnumRoleToString = (EUserType, value ) => {
  for (var k in EUserType) if (EUserType[k] == value) return k;
  return null;
}