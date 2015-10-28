var express = require('express'),
    bodyParser = require('body-parser'),
    Router = express.Router,
    _ = require('lodash'),
    generateId = require('./generate-id'),
    schemaValidator = require('./schema-validator'),
    acceptRender = require('./accept-render'),
    equality = require('./comparisons/equality');

module.exports = function (name, schema, array)  {
  var router = new Router();
  router.get('/', function (req, res, next) {
    // search function
    
    var filteredArray = _.reduce(schema, function (currentArray, schemaType, key) {
      var queryValue = req.query[key];

      if (!schemaValidator(schemaType, queryValue)) {
        return currentArray;
      }

      return equality(currentArray, queryValue, key);
    }, array);

    res.locals.result = filteredArray;
    next();
  }, acceptRender);  

  router.post('/', bodyParser(), function (req, res, next) {
    // post function
    var newItem = _.reduce(schema, function (currentItem, schemaType, key) {
      var currentValue = req.body[key];
      
      if (!schemaValidator(schemaType, currentValue)) {
        throw new Error('invalid body ' + key);
      }

      currentItem[key] = currentValue;
      return currentItem;
    }, {});
    newItem.id = generateId(name);
    array.push(newItem);
    

    res.locals.render = 'single';
    res.locals.result = newItem;
    next();
  }, acceptRender);

  router.param('id', function (req, res, next, id) {
    // grabs specific item
    var foundIndex = _.findIndex(array, function(item) {
      return item.id === id;
    });

    if (foundIndex < -1) {
      return next(new Error('not found' + id)); 
    }
    res.locals.index = foundIndex;
    res.locals.item = array[foundIndex];
    next();
  });

  router.get('/:id', function (req, res, next) {
    // grabs indiviual id
    res.locals.render = 'single';
    res.locals.result = res.locals.item;
    next();
  }, acceptRender);

  router.post('/:id', bodyParser(), function (req, res, next) {
    // update
    var item = _.clone(res.locals.item);

    item = _.reduce(schema, function (currentItem, schemaType, key) {
      var currentValue = req.body[key];
      
      if (typeof currentValue === 'undefined') {
        return currentItem;
      }
      if (!schemaValidator(schemaType, currentValue)) {
        throw new Error('invalid body ' + key);
      }

      currentItem[key] = currentValue;
      return currentItem;
    }, item);
    array.splice(res.locals.index, 1, item);
   res.locals.render = 'single';
   res.locals.result = item;
   next();
   }, acceptRender);

  router.delete('/:id', function (req, res, next) {
    // deletes a indiviual id
    array.splice(res.locals.index, 1);
    res.locals.render = 'single';
    res.locals.result = res.locals.item;
    next();
    }, acceptRender);
  return router;
};




