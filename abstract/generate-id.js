module.exports = function (modelName) {
  return modelName + '-' + Math.random().toString(32).substring(2, 10) + Date.now();
};