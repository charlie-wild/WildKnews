const apiRouter = require('express').Router();
const { getAllTopics, postNewTopic } = require('../controllers/topics');
const { getArticlesByTopic } = require('../controllers/topics');

apiRouter.get('/topics', getAllTopics);
apiRouter.post('/topics', postNewTopic);
apiRouter.get('/topic/:topicid/articles', getArticlesByTopic);


module.exports = apiRouter;
