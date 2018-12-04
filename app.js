const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const { handle404, middleErr } = require('./errors/index');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
  next({ status: 404, msg: 'Page Not Found' });
});

app.use(handle404);
app.use(middleErr);


module.exports = app;
