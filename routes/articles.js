const articleRouter = require('express').Router();
const {
  handle405,
} = require('../errors/index');
const {
  getAllArticles,
  getArticleById,
  modifyArticleVotes,
  deleteArticle,
} = require('../controllers/articles');
const {
  getCommentsByArticleId,
} = require('../controllers/comments');

articleRouter.route('/')
  .get(getAllArticles)
  .all(handle405);

articleRouter.route('/:article_id')
  .get(getArticleById)
  .patch(modifyArticleVotes)
  .delete(deleteArticle)
  .all(handle405);

articleRouter.route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .all(handle405);

module.exports = articleRouter;
