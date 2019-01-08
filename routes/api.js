const apiRouter = require('express').Router();
const { serveEndpoints } = require('../controllers/api');
const {
  handle405,
} = require('../errors/index');
const topicRouter = require('../routes/topics');
const articleRouter = require('../routes/articles');
const userRouter = require('../routes/users');
const commentRouter = require('../routes/comments');

apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/comments', commentRouter);



apiRouter.route('/')
  .get(serveEndpoints)
  .all(handle405);

module.exports = apiRouter;
