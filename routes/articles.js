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
  postNewCommentToArticle,
  modifyCommentVotes,
  deleteComment,
} = require('../controllers/comments');

articleRouter.param('article_id', (req, res, next, param) => {
    if (/^\d+$/.test(param)) return next();
    next({ status: 400
    });
})


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
  .post(postNewCommentToArticle)
  .all(handle405);

articleRouter.route('/:article_id/comments/:comment_id')
  .patch(modifyCommentVotes)
  .delete(deleteComment)
  .post(handle405);


module.exports = articleRouter;
