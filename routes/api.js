const apiRouter = require('express').Router();
const { getAllTopics, postNewTopic } = require('../controllers/topics');
const { middleErr } = require('../errors/index');

apiRouter.route('/topics')
  .get(getAllTopics)
  .post(postNewTopic)
  .all(middleErr);
module.exports = apiRouter;
