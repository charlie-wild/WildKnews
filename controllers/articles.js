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
      if (sort_ascending === true) {
        articleQuery.orderBy(sort_criteria, 'asc');
      } else {
        articleQuery.orderBy(sort_criteria, 'desc');
      }
    })
    .where('topic', topic)
    .join('users', 'created_by', '=', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .count('comments.article_id AS comment_count')
    .groupBy('articles.article_id', 'users.username')
    .then(((articles) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: 'Page Not Found' });
      }
      return res.status(200).send({ articles });
    }))
    .catch(next);
};

exports.postNewArticleToTopic = (req, res, next) => {
  const newObj = { ...req.body, ...req.params };
  newObj.created_by = newObj.user_id;
  delete newObj.user_id;
  return connection('articles')
    .insert(newObj)
    .returning('*')
    .then((article) => {
      if (Object.keys(article[0]).length !== 7 || article[0].created_by == null) {
        return Promise.reject({ status: 400, msg: 'Invalid Input' });
      }
      return res.status(201).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const {
    limit = 10, sort_criteria = 'created_by', p = 1, sort_ascending,
  } = req.query;
  return connection('articles')
    .select('articles.article_id', 'title', 'articles.votes', 'articles.created_by', 'articles.created_at', 'topic', 'articles.body', 'users.username AS author')
    .limit(limit)
    .offset(Math.floor(limit * (p - 1)))
    .modify((articleQuery) => {
      if (sort_ascending === true) {
        articleQuery.orderBy(sort_criteria, 'asc');
      } else {
        articleQuery.orderBy(sort_criteria, 'desc');
      }
    })
    .join('users', 'created_by', '=', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .count('comments.article_id AS comment_count')
    .groupBy('articles.article_id', 'users.username')
    .then(((articles) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: 'Page Not Found' });
      }
      return res.status(200).send({ articles });
    }))
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const {
    limit = 10, sort_criteria = 'created_by', p = 1, sort_ascending,
  } = req.query;
  const { article_id } = req.params;
  return connection('articles')
    .select('articles.article_id', 'title', 'articles.votes', 'articles.created_by', 'articles.created_at', 'topic', 'articles.body', 'users.username AS author')
    .limit(limit)
    .offset(Math.floor(limit * (p - 1)))
    .where('articles.article_id', article_id)
    .modify((articleQuery) => {
      if (sort_ascending) {
        articleQuery.orderBy(sort_criteria, 'asc');
      } else {
        articleQuery.orderBy(sort_criteria, 'desc');
      }
    })
    .join('users', 'created_by', '=', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .count('comments.article_id AS comment_count')
    .groupBy('articles.article_id', 'users.username')
    .then(((articles) => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Page Not Found',
        });
      }
      return res.status(200).send({
        articles,
      });
    }))
    .catch(next);
};

exports.modifyArticleVotes = (req, res, next) => {
  if (typeof req.body.inc_votes === 'string') {
    return next({ status: 400 });
  }
  const incOrDec = req.body.inc_votes > 0 ? 'increment' : 'decrement';
  const { article_id } = req.params;
  const votesInt = Math.abs(req.body.inc_votes);
  return connection('articles')
    .select('*')[incOrDec]('votes', votesInt)
    .where('articles.article_id', article_id)
    .returning('*')
    .then((article) => {
      if (article.length === 0) {
        res.status(404).send({ msg: 'Page Not Found' });
      } else { res.status(200).send({ article }); }
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const {
    article_id,
  } = req.params;
  return connection('articles')
    .select('*')
    .where('articles.article_id', article_id)
    .del()
    .returning('*')
    .then((article) => {
      if (article.length === 0) {
        res.status(404).send({
          msg: 'Page Not Found',
        });
      } else { res.status(204).send({ result: {} }); }
    })
    .catch(next);
};
