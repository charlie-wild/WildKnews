const {
  articleData,
  topicData,
  commentData,
  userData
} = require('../data/index.js');
const {
  userIdSetter, formatArticles, articleIdSetter,
  formatComments,
} = require('../utils');

exports.seed = function (knex, Promise) {
  return Promise.all([knex('topics').del(), knex('users').del(), knex('articles').del(), knex('comments').del()]).then(() => knex('topics').insert(topicData).returning('*'))
    .then(() => knex('users').insert(userData).returning('*'))
    .then((userRows) => {
      const userlookup = userIdSetter(userRows);
      const result = formatArticles(articleData, userlookup);
      return Promise.all([userlookup, knex('articles').insert(result).returning('*')]);
    })
    .then(([userlookup, articleRows]) => {
      const articleLookup = articleIdSetter(articleRows);
      const result = formatComments(commentData, articleLookup, userlookup);
      return knex('comments').insert(result).returning('*');
    });
};
