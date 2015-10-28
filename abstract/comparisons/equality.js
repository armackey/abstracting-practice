var _ = require('lodash');

/*
objective is to remove items that are not equal to what client is searching for
*/
module.exports = function (array, queryValue, key) {
  return _.filter(array, function (item) {
    return queryValue === item[key];
  });
};