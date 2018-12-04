exports.handle404 = (err, req, res, next) => {
  if (err.status === 404) res.status(404).send({ msg: err.msg });
  else {
    next(err);
  }
};

exports.middleErr = (req, res, next) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};
