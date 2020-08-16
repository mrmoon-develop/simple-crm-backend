module.exports = {
  getIssues,
  getActiveIssues,
  getFinishedIssues,
};

const models = require('../../database/models');

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
  var dbResponse = await models.Issue.where(
    'issues.state',
    '!=',
    'F'
  ).fetchAll();
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
  var dbResponse = await models.Issue.where('issues.state', 'F').fetchAll();
  dbResponse = dbResponse.toJSON();

  if (dbResponse.length == 0) {
    dbResponse = 'Empty response';
  }
  res.status(200).json({
    code: 200,
    data: dbResponse,
  });
}
