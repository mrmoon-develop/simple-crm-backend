var express = require('express');
var router = express.Router();
const issuesController = require('../../controller/API/issuesController');

/**
 * Get all users from db
 */
router.get('/getIssues', issuesController.getIssues);

module.exports = router;
