const topicsData = require('../data/test-data/topics');
const userData = require('../data/test-data/users');
const articleData = require('../data/test-data/articles');
const commentData = require('../data/test-data/comments');
const { formattedForDate, userIdSetter, formatArticles, articleLookup,
  formatComments } = require('../utils');

exports.seed = function (knex, Promise) {
  return Promise.all([knex('topics').del(), knex('users').del(), knex('articles').del(), knex('comments').del()]).then(() => knex('topics').insert(topicsData).returning('*'))
    .then(() => knex('users').insert(userData).returning('*'))
    .then((userRows) => {
      const formattedArticles = formattedForDate(articleData);
      const lookup = userIdSetter(userRows);
      const result = formatArticles(formattedArticles, lookup);
      return knex('articles').insert(result).returning('*');
    })
    .then((articleRows) => {
      const formattedComments = formattedForDate(commentData);
      const lookup = articleLookup(articleRows);
      const lookup2 = userIdSetter(articleRows);
      // need to link lookup obj
      const result = formatComments(formattedComments, lookup, lookup2);
      return knex('comments').insert(result).returning('*');
    
    });
};
