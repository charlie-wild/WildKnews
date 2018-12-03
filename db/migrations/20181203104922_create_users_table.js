
exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments('user_id').primary().unique();
    table.string('username');
    table.string('avatar_url');
    table.string('name').notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users');
};
