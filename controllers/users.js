const connection = require('../db/connection');

exports.getAllUsers = (req, res, next) => {
  connection('users')
    .select('*')
    .then(users => res.status(200).send({ users }))
    .catch(next);
};

exports.getUserById = (req, res, next) => {
  const { user_id } = req.params;
  connection('users')
    .select('*')
    .where('user_id', user_id)
    .then((user) => {
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: 'Page Not Found' });
      }
      return res.status(200).send({ user });
    })
    .catch(next);
};
