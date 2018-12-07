const topicRouter = require('express').Router();
const {
  getAllTopics,
  postNewTopic,
} = require('../controllers/topics');
const {
  getArticlesByTopic,
  postNewArticleToTopic,
} = require('../controllers/articles');
const {
  handle405,
} = require('../errors/index');

topicRouter.param('slug', (req, res, next, param) => {
  if (/^[a-zA-Z]+$/.test(param)) return next();
  next({
    status: 400,
  });
});


topicRouter.route('/')
  .get(getAllTopics)
  .post(postNewTopic)
  .all(handle405);

topicRouter.route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(postNewArticleToTopic)
  .all(handle405);


module.exports = topicRouter;
