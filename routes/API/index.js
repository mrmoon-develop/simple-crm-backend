var express = require('express');
var router = express.Router();
var usersController = require('../../controller/API/usersController');
const issuesController = require('../../controller/API/issuesController');

/**
 * ------------------ Users - start ------------------
 */

/**
 * Get all users from db
 */
router.get('/getUsers', usersController.getUsers);

/**
 * Get user by id from db
 */
router.get('/getUser/:id', usersController.getUser);

/**
 * ------------------ Users - end ------------------
 */

/**
 * ------------------ Issues - start ------------------
 */

/**
 * Get all issues from db
 */
router.get('/getIssues', issuesController.getIssues);

/**
 * Get active issues from db
 */
router.get('/getActiveIssues', issuesController.getActiveIssues);

/**
 * Get finished issues from db
 */
router.get('/getFinishedIssues', issuesController.getFinishedIssues);
/**
 * Store issue on database
 */
router.post('/createIssue', issuesController.createIssue);

/**
 * ------------------ Issues - end ------------------
 */

/**
 * Get all companies from db
 */
router.get('/getCompanies', usersController.getCompanies);

/**
 * Validate login
 */
router.post('/login', usersController.login);

module.exports = router;
