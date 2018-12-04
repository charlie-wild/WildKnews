const apiRouter = require('express').Router();
const { getAllTopics, postNewTopic } = require('../controllers/topics');
const { getArticlesByTopic } = require('../controllers/articles');
const { handle405 } = require('../errors/index');

apiRouter.route('/topics')
  .get(getAllTopics)
  .post(postNewTopic)
  .all(handle405);

apiRouter.route('/topics/:topic/articles')
  .get(getArticlesByTopic)
  .all(handle405);

module.exports = apiRouter;
