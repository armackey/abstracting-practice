var validator = require('validator'),
    _ = require('lodash');

module.exports = function (schemaType, value) {
  if (schemaType.any) {
    var myValue = _.indexOf(schemaType.any, value);
    return myValue > -1;
  }
  switch (schemaType.type) {
    case "alpha" : 
      return validator.isAlpha(value);
    case "boolean" :
      return validator.isBoolean(value);
    case "email" :
      return validator.isEmail(value);
    default : throw new Error('Invalid schema type');
  }
};