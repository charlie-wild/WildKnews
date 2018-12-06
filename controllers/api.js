
exports.serveEndpoints = (req, res, next) => {
  const endpoints = {
    '/api/topics': {
      methods: ['get', 'post'],
      description: 'Get and post a new topic',
    },
    '/api/:topic/articles': {
      methods: ['get', 'post'],
      description: 'Get and post a new article to a topic',
    },
    '/api/articles': {
      methods: ['get'],
      description: 'Get all articles',
    },
    '/api/articles/:article_id': {
      methods: ['get', 'patch', 'delete'],
      description: 'Get article by id, change votes on article and delete an article',
    },
    '/api/articles/:article_id/comments': {
      methods: ['get', 'post'],
      description: 'Get comments by article id, and post new comments to article',
    },
    '/api/articles/:article_id/comments/:comment_id': {
      methods: ['patch', 'delete'],
      description: 'Change votes on comment, and delete a comment',
    },
    '/api/users': {
      methods: ['get'],
      description: 'get all users',
    },
    'api/users/:user_id': {
      methods: ['get'],
      description: 'get user by id',
    },

  };
  return res.status(200).send({
    endpoints,
  }).catch(next);
};
