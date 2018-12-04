const connection = require('../db/connection');

exports.getArticlesByTopic = (req, res, next) => {
  const { id } = req.params;
  connection('articles')
    .select()
    .where('topic_id', id)
    .then(((articles) => {
      res.status(200).send({ articles });
    }))
    .catch(next);
};
