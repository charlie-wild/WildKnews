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

exports.articleIdSetter = (article) => {
  const articleLookup = {};
  article.forEach(article => articleLookup[article.title] = article.article_id);
  return articleLookup;
};

exports.formatComments = (data, aL, uL) => {
  data.map((comment) => {
    comment.article_id = aL[comment.belongs_to];
    //comment.created_by = uL[comment.article_id];
    delete comment.belongs_to;
    return comment;
  });
  return data;
};
