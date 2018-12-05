const apiRouter = require('express').Router();
const { getAllTopics, postNewTopic } = require('../controllers/topics');
const { getArticlesByTopic, postNewArticleToTopic, getAllArticles } = require('../controllers/articles');
const { handle405 } = require('../errors/index');

apiRouter.route('/topics')
  .get(getAllTopics)
  .post(postNewTopic)
  .all(handle405);

apiRouter.route('/topics/:topic/articles')
  .get(getArticlesByTopic)
  .post(postNewArticleToTopic)
  .all(handle405);

apiRouter.route('/articles')
  .get(getAllArticles)
  .all(handle405);

module.exports = apiRouter;
