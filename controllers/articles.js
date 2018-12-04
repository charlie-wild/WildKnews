const connection = require('../db/connection');

exports.getArticlesByTopic = (req, res, next) => {
  const { topic } = req.params;
  connection('articles')
    .select('articles.article_id', 'title', 'articles.votes', 'articles.created_by', 'articles.created_at', 'topic', 'articles.body', 'users.username AS author')
    .where('topic', topic)
    .join('users', 'created_by', '=', 'users.user_id')
    .join('comments', 'articles.article_id', '=', 'comments.article_id')
    .count('comments.article_id')
    .groupBy('articles.article_id', 'users.username')
    .then(((articles) => {
      res.status(200).send({ articles });
    }))
    .catch(next);
};

// join on username
