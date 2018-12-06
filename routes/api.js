const apiRouter = require('express').Router();

const {
  handle405,
} = require('../errors/index');
const topicRouter = require('../routes/topics');
const articleRouter = require('../routes/articles');

apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articleRouter);


// routing middleware


apiRouter.route('/')
  .all(handle405);

module.exports = apiRouter;
