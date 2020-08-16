// Setting up the database connection
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'mrmoondb',
    password: '0128',
    database: 'simple_crm',
    charset: 'utf8',
  },
});
const bookshelf = require('bookshelf')(knex);

module.exports = {
  MySQL: knex,
};
