const apiRouter = require('express').Router();
const { getAllTopics, postNewTopic } = require('../controllers/topics');
const {
  getArticlesByTopic, postNewArticleToTopic, getAllArticles, getArticleById,
} = require('../controllers/articles');
const { handle405 } = require('../errors/index');


// routing middleware

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

apiRouter.route('/articles/:article_id')
  .get(getArticleById)
  .all(handle405);

module.exports = apiRouter;
