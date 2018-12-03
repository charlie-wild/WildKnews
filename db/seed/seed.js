const topicsData = require('../data/test-data/topics');
const userData = require('../data/test-data/users');
const articleData = require('../data/test-data/articles');
const commentData = require('../data/test-data/comments');

exports.seed = function (knex, Promise) {
  return Promise.all([knex('topics').del(), knex('users').del(), knex('articles').del(), knex('comments').del()]).then(() => {
    return knex('topics').insert(topicsData).returning('*');
  })
    .then(() => {      
      return knex('users').insert(userData).returning('*');
    })
    .then(() => {
      const formattedArticles = articleData.map((article) => {
        article.created_at = new Date();
        return article;
      });
      return knex('articles').insert(formattedArticles).returning('*')
    })
    .then(() => {
      return knex('comments').insert(commentData).returning('*');
    });
};
