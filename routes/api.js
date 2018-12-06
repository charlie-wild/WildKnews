const apiRouter = require('express').Router();

const {
  handle405,
} = require('../errors/index');
const topicRouter = require('../routes/topics');
const articleRouter = require('../routes/articles');
const userRouter = require('../routes/users');

apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/users', userRouter);


// routing middleware


apiRouter.route('/')
  .all(handle405);

module.exports = apiRouter;
