var express = require('express'),
    app = express(),
    crudRouter = require('./abstract/crud-router'),
    schema = require('./schemas/person.model'),
    port = port || 3000;

app.use('/users', crudRouter('', schema, []));
app.use(function (req, res) {
  res.send('not found');
});
app.listen(port);