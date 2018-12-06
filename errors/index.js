exports.handle400 = (err, req, res, next) => {
  const codes = {
    23502: 'violates not null violation',
    '22P02': 'invalid input syntax for type integer',
    42703: 'invalid sort criteria',
  };
  if (codes[err.code]) res.status(400).send({ msg: codes[err.code] });
  else next(err);
};

exports.handle404 = (err, req, res, next) => {
  if (err.constraint === 'comments_article_id_foreign') {
    res.status(404).send({ msg: err.msg });
  }
  if (err.status === 404) {
    res.status(404).send({
      msg: err.msg,
    });
  } else {
    next(err);
  }
};

exports.handle422 = (err, req, res, next) => {
  const codes = {
    23505: 'Key Already Exists',
    23503: 'Invalid Parameter',
  };
  if (codes[err.code]) {
    res.status(422).send({ msg: codes[err.code] });
  } else next(err);
};


exports.handle405 = (req, res, next) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};
