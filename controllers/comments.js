const connection = require('../db/connection');


exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const {
    limit = 10, sort_criteria = 'created_at', p = 1, sort_ascending,
  } = req.query;
  return connection('comments')
    .select('comments.comment_id', 'comments.votes', 'comments.created_at', 'users.username AS author', 'comments.body')
    .offset(Math.floor(limit * (p - 1)))
    .modify((articleQuery) => {
      if (sort_ascending) {
        articleQuery.orderBy(sort_criteria, 'asc');
      } else {
        articleQuery.orderBy(sort_criteria, 'desc');
      }
      if (limit < 1) {
        articleQuery.limit(10);
      } else {
        articleQuery.limit(limit);
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

exports.postNewCommentToArticle = (req, res, next) => {
  const newComment = {
    ...req.body, ...req.params, votes: 0, created_at: new Date(),
  };
  return connection('comments')
    .insert(newComment)
    .returning('*')
    .then((comment) => {
      if (comment[0].user_id === null || comment[0].body === null) {
        return Promise.reject({ status: 400, msg: 'Invalid Input' });
      }
      return res.status(201).send({ comment });
    })
    .catch(next);
};

exports.modifyCommentVotes = (req, res, next) => {
  if (typeof req.body.inc_votes === 'string') {
    return next({
      status: 400,
    });
  }
  const { article_id, comment_id } = req.params;
  const incOrDec = req.body.inc_votes > 0 ? 'increment' : 'decrement';
  const votesInt = Math.abs(req.body.inc_votes);
  return connection('comments')
    .select('*')[incOrDec]('votes', votesInt)
    .where('comments.comment_id', comment_id)
    .where('comments.article_id', article_id)
    .returning('*')
    .then((comment) => {
      if (comment.length === 0) {
        res.status(404).send({ msg: 'Comment Not Found' });
      } else {
        res.status(200).send({ comment });
      }
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { article_id, comment_id } = req.params;
  return connection('comments')
    .select('*')
    .where('comments.comment_id', comment_id)
    .where('comments.article_id', article_id)
    .del()
    .returning('*')
    .then((comment) => {
      if (comment.length === 0) {
        res.status(404).send({ msg: 'Page Not Found' });
      } else {
        res.status(204).send({ result: {} });
      }
    })
    .catch(next);
};
