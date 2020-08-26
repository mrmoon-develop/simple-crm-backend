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

const Poll = bookshelf.model('poll', {
  tableName: 'polls',
});

module.exports = {
  User,
  Issue,
  Company,
  Poll,
};
