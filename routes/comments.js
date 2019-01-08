const commentRouter = require('express').Router();
const { getAllComments } = require('../controllers/comments')
const { handle405 } = require('../errors/index');

commentRouter.route('/')
  .get(getAllComments)
  .all(handle405)


module.exports = commentRouter;

