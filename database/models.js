const MySQL = require('./database').MySQL;
const bookshelf = require('bookshelf')(MySQL);

// Defining models
const User = bookshelf.model('User', {
  tableName: 'users',
});

const Issue = bookshelf.model('Issue', {
  tableName: 'issues',
});

const Company = bookshelf.model('Company', {
  tableName: 'companies',
});

module.exports = {
  User,
  Issue,
  Company,
};
