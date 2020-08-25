module.exports = {
  getIssues,
  getActiveIssues,
  getFinishedIssues,
  createIssue,
};

const models = require('../../database/models');
const Knex = require('knex');

/**
 * Get issues from db
 */
async function getIssues(req, res) {
  var dbResponse = await models.Issue.fetchAll();
  dbResponse = dbResponse.toJSON();

  if (dbResponse.length == 0) {
    dbResponse = 'Empty response';
  }
  res.status(200).json({
    code: 200,
    data: dbResponse,
  });
}

/**
 * Get active issues from db
 */
async function getActiveIssues(req, res) {
  var code = 200;
  var dbResponse = await models.Issue.where('issues.state', '!=', 'F')
    .query((qb) => {
      qb.leftJoin('companies', 'issues.company_id', 'companies.id');
      qb.leftJoin('users as uCustomer', 'issues.customer_id', 'uCustomer.id');
      qb.leftJoin('users as uAttender', 'issues.attender_id', 'uAttender.id');
    })
    .fetchAll({
      columns: ['issues.id', 'issues.title', 'issues.state', 'issues.priority'],
    });
  dbResponse = dbResponse.toJSON();

  if (dbResponse.length == 0) {
    code = 50202;
    dbResponse = 'Empty response';
  }

  res.status(200).json({
    code,
    data: dbResponse,
  });
}

/**
 * Get finished issues from db
 */
async function getFinishedIssues(req, res) {
  var dbResponse = await models.Issue.where('issues.state', 'F')
    .query((qb) => {
      qb.leftJoin('companies', 'issues.company_id', 'companies.id');
      qb.leftJoin('users as uCustomer', 'issues.customer_id', 'uCustomer.id');
      qb.leftJoin('users as uAttender', 'issues.attender_id', 'uAttender.id');
    })
    .fetchAll({
      columns: ['issues.id', 'issues.title', 'issues.state', 'issues.priority'],
    });

  dbResponse = dbResponse.toJSON();

  if (dbResponse.length == 0) {
    dbResponse = 'Empty response';
  }

  res.status(200).json({
    code: 200,
    data: dbResponse,
  });
}

async function createIssue(req, res) {
  var code = 200;
  var dbResponse = await new models.Issue(req.body).save();
  console.log('dbResponse', dbResponse);
  res.status(200).json({
    code,
    data: dbResponse,
  });
}
