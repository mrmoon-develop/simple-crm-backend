module.exports = {
  getPoll,
  getPollByIssueId,
  getPolls,
};

const models = require('../../database/models');

/**
 * Get poll by id
 */
async function getPoll(req, res) {
  await models.Poll.where('polls.id', req.params.id)
    .query((qb) => {
      qb.leftJoin('issues', 'polls.issue_id', 'issues.id');
      qb.leftJoin('users', 'polls.user_id', 'users.id');
    })
    .fetch({
      columns: ['polls.*', 'issues.id as issue_id', 'users.name as user_name'],
    })
    .then((poll) => {
      res.status(200).json({
        code: 200,
        data: poll,
      });
      console.log('poll', poll);
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
 * Get Poll by issue id
 * @param {Promise} req request data
 * @param {Promise} res response data
 */
async function getPollByIssueId(req, res) {
  var dbResponse = await models.Poll.where('polls.issue_id', req.body.issue_id)
    .query((qb) => {
      qb.leftJoin('issues', 'polls.issue_id', 'issues.id');
      qb.leftJoin('users', 'polls.user_id', 'users.id');
    })
    .fetch({
      columns: ['polls.*', 'issues.id as issue_id', 'users.name as user_name'],
    })
    .catch((err) => console.log('err', err));

  var code = '50201';
  if (!dbResponse) {
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
 * Get polls from db
 */
async function getPolls(req, res) {
  var dbResponse = await models.Poll.query((qb) => {
    qb.leftJoin('issues', 'polls.issue_id', 'issues.id');
    qb.leftJoin('users', 'polls.user_id', 'users.id');
  }).fetchAll({
    columns: ['polls.*', 'issues.id as issue_id', 'users.name as user_name'],
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
  return dbResponse;
}
