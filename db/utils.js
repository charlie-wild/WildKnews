exports.formattedForDate = (data) => {
  data.map(i => i.created_at = new Date());
  return data;
};

exports.userIdSetter = (users) => {
  const userLookup = {};
  users.forEach(user => userLookup[user.username] = user.user_id);
  return userLookup;
};

exports.formatArticles = (data, lookupObj) => {
  data.map((article) => {
    article.created_by = lookupObj[article.created_by];
    return article;
  });
  return data;
};

exports.articleIdSetter = (articles) => {
  const articleLookup = {};
  articles.forEach(article => articleLookup[article.title] = article.article_id);
  return articleLookup;
};

exports.formatComments = (data, aL, uL) => {
  data.map((comment) => {
    comment.article_id = aL[comment.belongs_to];
    comment.user_id = uL[comment.created_by];
    delete comment.belongs_to;
    delete comment.created_by;
    return comment;
  });
  return data;
};
