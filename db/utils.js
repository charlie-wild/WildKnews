

exports.userIdSetter = (users) => {
  const userLookup = {};
  users.forEach(user => userLookup[user.username] = user.user_id);
  return userLookup;
};

exports.formatArticles = (data, lookupObj) => {
  const formatted = data.map((article) => {
    const newArticle = { ...article };
    newArticle.created_at = new Date(article.created_at);
    newArticle.created_by = lookupObj[article.created_by];
    const {
      title, topic, created_by, body, created_at,
    } = newArticle;
    return {
      title, topic, created_by, body, created_at,
    };
  });
  return formatted;
};

exports.articleIdSetter = (articles) => {
  const articleLookup = {};
  articles.forEach(article => articleLookup[article.title] = article.article_id);
  return articleLookup;
};

exports.formatComments = (data, aL, uL) => {
  const formatted = data.map((comment) => {
    const newComment = { ...comment };
    newComment.created_at = new Date(comment.created_at);
    newComment.article_id = aL[comment.belongs_to];
    newComment.user_id = uL[comment.created_by];
    const {
      comment_id, article_id, created_at, body, votes, user_id,
    } = newComment;
    return {
      comment_id, article_id, created_at, body, votes, user_id,
    };
  });
  return formatted;
};
