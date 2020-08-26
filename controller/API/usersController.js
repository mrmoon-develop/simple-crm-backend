module.exports = {
  getUser,
  getUsers,
  getTechnicalUsers,
  getCompanies,
  login,
};

const models = require('../../database/models');

/**
 * Get user by id
 */
async function getUser(req, res) {
  console.log('req.params', req.params);
  await models.User.where('users.id', req.params.id)
    .query((qb) => {
      qb.leftJoin('companies', 'users.company_id', 'companies.id');
      qb.leftJoin('role', 'role.code', 'users.type');
    })
    .fetch({
      columns: [
        'users.*',
        'companies.name as company_name',
        'role.name as role_name',
      ],
    })
    .then((user) => {
      res.status(200).json({
        code: 200,
        data: user,
      });
      console.log('user', user);
    })
    .catch((error) => {
      res.status(200).json({
        code: 50201,
        data: 'Empty response',
      });
      console.log('error', error);
    });
}

/**
 * Get users from db
 */
async function getUsers(req, res) {
  var dbResponse = await models.User.query((qb) =>
    qb.leftJoin('companies', 'users.company_id', 'companies.id')
  ).fetchAll({
    columns: ['users.*', 'companies.name as company_name'],
  });
  dbResponse = dbResponse.toJSON();
  res.status(200).json({
    code: 200,
    data: dbResponse,
  });
  return dbResponse;
}

async function getTechnicalUsers(req, res) {
  var dbResponse = await models.User.where('type', 2).fetchAll({
    columns: ['*', 'name as title'],
  });

  var code = '50201';
  if (!dbResponse || dbResponse.length == 0) {
    dbResponse = 'Empty response';
  } else {
    code = 200;
    dbResponse = dbResponse.toJSON();
  }

  res.status(200).json({
    code,
    data: dbResponse,
  });
}

/**
 * Get companies from db
 */
async function getCompanies(req, res) {
  var dbResponse = await models.Company.fetchAll();
  dbResponse = dbResponse.toJSON();
  res.status(200).json({
    code: 200,
    data: dbResponse,
  });
  return dbResponse;
}

/**
 * Get companies from db
 */
async function login(req, res) {
  var dbResponse = await models.User.where('users.email', req.body.email)
    .query((qb) => {
      qb.leftJoin('companies', 'users.company_id', 'companies.id');
      qb.leftJoin('role', 'role.code', 'users.type');
    })
    .fetch({
      columns: [
        'users.*',
        'companies.name as company_name',
        'role.name as role_name',
      ],
    })
    .then((user) => {
      res.status(200).json({
        code: 200,
        data: user,
      });
      console.log('user', user);
    })
    .catch((error) => {
      res.status(200).json({
        code: 50201,
        data: 'Invalid credentials',
      });
      console.log('error', error);
    });

  return dbResponse;
}
