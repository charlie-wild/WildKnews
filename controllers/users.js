const connection = require('../db/connection');

exports.getAllUsers = (req, res, next) => {
  connection('users')
    .select('*')
    .then(users => res.status(200).send({ users }))
    .catch(next);
};

exports.getUserById = (req, res, next) => {
  const { username } = req.params;
  connection('users')
    .select('*')
    .where('username', username)
    .then(([user]) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: 'Page Not Found' });
      }
      return res.status(200).send({ user });
    })
    .catch(next);
};
