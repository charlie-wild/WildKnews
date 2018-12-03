
exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (table) => {
    table.increments('article_id').primary().unique();
    table.string('title').notNullable();
    table.string('body', 5000).notNullable();
    table.integer('votes').defaultTo(0);
    table.string('topic').references('topics.slug');
    table.integer('created_by').references('users.user_id');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
