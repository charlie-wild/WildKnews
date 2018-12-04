const apiRouter = require('express').Router();
const { getAllTopics, postNewTopic } = require('../controllers/topics');
const { getArticlesByTopic } = require('../controllers/articles');
const { middleErr } = require('../errors/index');

apiRouter.route('/topics')
  .get(getAllTopics)
  .post(postNewTopic)
  .all(middleErr);

apiRouter.route('/topics/:topic/articles')
  .get(getArticlesByTopic)
  .all(middleErr);

module.exports = apiRouter;
