module.exports = {
  getPoll,
  getPollByIssueId,
  getPolls,
  createPoll,
  getPollsReportByCompany,
  getPollsByCompany,
};

const models = require('../../database/models');
const fs = require('fs');
const path = require('path');

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
  var dbResponse = await models.Poll.where('polls.issue_id', req.params.issueId)
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

/**
 * Get polls from db
 */
async function createPoll(req, res) {
  var dbResponse = await new models.Poll(req.body)
    .save()
    .catch((err) => console.log('err', err));

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

/**
 * Get polls from db
 */
async function getPollsReportByCompany(req, res) {
  try {
    var dbResponse = await models.Poll.where(
      'issues.company_id',
      req.body.company_id
    )
      .query((qb) => {
        qb.leftJoin('issues', 'issues.id', 'polls.issue_id');
        qb.leftJoin('users', 'users.id', 'polls.user_id');
      })
      .fetchAll({
        columns: [
          'polls.id as encuesta',
          'polls.issue_id as incidencia',
          'users.name as usuario',
          'polls.q1 as respuesta_1',
          'polls.q2 as respuesta_2',
          'polls.q3 as respuesta_3',
          'polls.q4 as respuesta_4',
          'polls.q5 as respuesta_5',
          'polls.comment as comentario',
        ],
      });

    var code = '50201';
    if (!dbResponse || dbResponse.length == 0) {
      dbResponse = 'Empty response';
    } else {
      code = 200;
      dbResponse = dbResponse.toJSON();

      var xl = require('excel4node');
      const fileName = `encuestas.xlsx`;

      // Create a new instance of a Workbook class
      var wb = new xl.Workbook();
      // Add Worksheets to the workbook
      var pollsWS = wb.addWorksheet('Encuestas');

      //Headers
      const titleHeaders = Object.keys(dbResponse[0]);
      // console.log('titleHeaders', titleHeaders);
      titleHeaders.map((item, index) => {
        pollsWS.column(index + 1).setWidth(20);
        pollsWS
          .cell(1, index + 1)
          .string(item.toUpperCase().replace(/_/gi, ' ') + '');
      });

      dbResponse.map((item, index) => {
        pollsWS.cell(index + 2, 1).number(item.encuesta);
        pollsWS.cell(index + 2, 2).number(item.incidencia);
        pollsWS.cell(index + 2, 3).string(item.usuario);
        pollsWS.cell(index + 2, 4).string(item.respuesta_1 == 1 ? 'Si' : 'No');
        pollsWS.cell(index + 2, 5).string(item.respuesta_2 == 1 ? 'Si' : 'No');
        pollsWS.cell(index + 2, 6).string(item.respuesta_3 == 1 ? 'Si' : 'No');
        pollsWS.cell(index + 2, 7).string(item.respuesta_4 == 1 ? 'Si' : 'No');
        pollsWS.cell(index + 2, 8).string(item.respuesta_5 == 1 ? 'Si' : 'No');
        pollsWS.cell(index + 2, 9).string(item.comentario);
      });

      var fullPath = path.join(__dirname, '/../../results/');

      // res.setHeader(
      //   'Content-Type',
      //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      // );
      // res.setHeader(
      //   'Content-Disposition',
      //   'attachment; filename=' + 'customer.xlsx'
      // );

      wb.write(`${fullPath}${fileName}`);

      // console.log('buffer', buffer);

      // fs.writeFile(`${fullPath}${fileName}`, buffer, (err) => {
      //   console.log('err', err);
      // });

      res
        .status(200)
        .json({
          code,
          data: `http://192.168.1.8:3000/api/downloadPollsReport`,
        })
        .download(fullPath + 'encuestas.xlsx');

      // return wb.write('Excel.xlsx');

      // return wb.write('customer.xlsx', res);
      // return wb.writeToBuffer().then((buffer) => {
      //   res.status(200).json({ code: 200, buffer });
      // });
    }
  } catch (error) {
    console.log('error', error);
  }
}

/**
 * Get polls from db
 */
async function getPollsByCompany(req, res) {
  var dbResponse = await models.Poll.where(
    'issues.company_id',
    req.body.company_id
  )
    .query((qb) => {
      qb.leftJoin('issues', 'issues.id', 'polls.issue_id');
      qb.leftJoin('users', 'users.id', 'polls.user_id');
    })
    .fetchAll({
      columns: [
        'polls.*',
        'users.name as user_name',

        // 'polls.id as encuesta',
        // 'polls.issue_id as incidencia',
        // 'users.name as usuario',
        // 'polls.q1 as respuesta_1',
        // 'polls.q2 as respuesta_2',
        // 'polls.q3 as respuesta_3',
        // 'polls.q4 as respuesta_4',
        // 'polls.q5 as respuesta_5',
        // 'polls.comment as comentario',
      ],
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
