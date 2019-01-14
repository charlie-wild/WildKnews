const connection = require('../db/connection');


exports.getAllTopics = (req, res, next) => {
  connection('topics')
    .select('slug', 'description')
    .leftJoin('articles', 'articles.topic', '=', 'topics.slug')
    .count('topics.slug AS article_count')
    .groupBy('articles.topic', 'topics.slug')
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postNewTopic = (req, res, next) => {
  connection('topics')
    .returning('*')
    .insert(req.body)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
