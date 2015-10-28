module.exports = function (req, res, next) {
  // res.redirect(req.baseUrl + '/' + newItem.id);
  switch (req.accepts(['json', 'html'])) {

    case 'json' : 
    console.log('sending json', res.locals.result);
      res.send(res.locals.result);
      break;
    case 'html' : 
      res.render(res.locals.render);
      break;
    default :
      next(new Error('We can\'t do it!'));
  }

};