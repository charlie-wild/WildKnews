const connection = require('../db/connection');


exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const {
    limit = 10, sort_criteria = 'created_at', p = 1, sort_ascending,
  } = req.query;
  return connection('comments')
    .select('comments.comment_id', 'comments.votes', 'comments.created_at', 'users.username AS author', 'comments.body')
    .limit(limit)
    .offset(Math.floor(limit * (p - 1)))
    .modify((articleQuery) => {
      if (sort_ascending) {
        articleQuery.orderBy(sort_criteria, 'asc');
      } else {
        articleQuery.orderBy(sort_criteria, 'desc');
      }
    })
    .where('article_id', article_id)
    .join('users', 'comments.user_id', '=', 'users.user_id')
    .then((comments) => {
      if (comments.length === 0) {
        res.status(404).send({ msg: 'Page Not Found' });
      } else {
        res.status(200).send({ comments });
      }
    })
    .catch(next);
};
