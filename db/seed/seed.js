const topicsData = require('../data/test-data/topics');
const userData = require('../data/test-data/users');
const articleData = require('../data/test-data/articles');
const commentData = require('../data/test-data/comments');
const {
  formattedForDate, userIdSetter, formatArticles, articleIdSetter,
  formatComments,
} = require('../utils');

exports.seed = function (knex, Promise) {
  return Promise.all([knex('topics').del(), knex('users').del(), knex('articles').del(), knex('comments').del()]).then(() => knex('topics').insert(topicsData).returning('*'))
    .then(() => knex('users').insert(userData).returning('*'))
    .then((userRows) => {
      const formattedArticles = formattedForDate(articleData);
      const userlookup = userIdSetter(userRows);
      const result = formatArticles(formattedArticles, userlookup);
      return Promise.all([userlookup, knex('articles').insert(result).returning('*')]);
    })
    .then(([userlookup, articleRows]) => {
      const articleLookup = articleIdSetter(articleRows);
      const dateComment = formattedForDate(commentData);
      const result = formatComments(dateComment, articleLookup, userlookup);
      return knex('comments').insert(result).returning('*');
    });
};
