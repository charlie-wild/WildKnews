
exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (table) => {
    table.increments('comment_id').primary().unique();
    table.integer('user_id').references('users.user_id');
    table.integer('article_id').references('articles.article_id').onDelete('CASCADE');
    table.integer('votes').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('body', 5000).notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};
