const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const {
  handle404, handle405, handle400, handle422,
} = require('./errors/index');

app.use(bodyParser.json());
app.use(cors());
app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
  next({ status: 404, msg: 'Page Not Found' });
});

app.use(handle404);
app.use(handle405);
app.use(handle400);
app.use(handle422);


module.exports = app;
