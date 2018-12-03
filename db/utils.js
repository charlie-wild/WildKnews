exports.formattedForDate = (data) => {
  data.map(i => i.created_at = new Date());
  return data;
};

exports.userIdSetter = (users) => {
  const userLookup = {};
  users.forEach(user => userLookup[user.username] = user.user_id );
  return userLookup;
};

exports.formatArticles = (data, lookupObj) => {
  data.map((article) => {
    article.created_by = lookupObj[article.created_by];
    return article;
  });
  return data;
};

exports.articleLookup = (article) => {
  const articleLookup = {};
  article.forEach(article => articleLookup[article.title] = article.article_id);
  return articleLookup;
};

exports.formatComments = (data, lookup, lookup2) => {
  data.map((comment) => {
    comment.article_id = lookup[comment.belongs_to];
    delete comment.belongs_to;
    return comment;

  // need to use lookup obj to link username
  });
  return data;
};
