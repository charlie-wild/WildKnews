const connection = require('../db/connection');

exports.getArticlesByTopic = (req, res, next) => {
  const {
    limit = 10, sort_criteria = 'created_at', p = 1, sort_ascending,
  } = req.query;
  const { topic } = req.params;
  connection('articles')
    .select('articles.article_id', 'title', 'articles.votes', 'articles.created_by', 'articles.created_at', 'topic', 'articles.body', 'users.username AS author')
    .limit(limit)
    .offset(Math.floor(limit * (p - 1)))
    .modify((articleQuery) => {
      if (sort_ascending) {
        articleQuery.orderBy(sort_criteria, 'asc');
      } else {
        articleQuery.orderBy(sort_criteria, 'desc');
      }
    })
    .where('topic', topic)
    .join('users', 'created_by', '=', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    // add count column to result
    .count('comments.article_id AS comment_count')
    .groupBy('articles.article_id', 'users.username')
    .then(((articles) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: 'Topic Not Found' });
      }
      return res.status(200).send({ articles });
    }))
    .catch(next);
};
