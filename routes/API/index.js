var express = require('express');
var router = express.Router();
var usersController = require('../../controller/API/usersController');
const issuesController = require('../../controller/API/issuesController');
const pollsController = require('../../controller/API/pollsController');

/**
 * ------------------ Users - start ------------------
 */

/**
 * Get user by id from db
 */
router.get('/getUser/:id', usersController.getUser);

/**
 * Get all users from db
 */
router.get('/getUsers', usersController.getUsers);

/**
 * Get all technical users from db
 */
router.get('/getTechnicalUsers', usersController.getTechnicalUsers);

/**
 * ------------------ Users - end ------------------
 */

/**
 * ------------------ Issues - start ------------------
 */

/**
 * Get an issue by id
 */
router.get('/getIssue/:issueId', issuesController.getIssue);

/**
 * Get all issues from db
 */
router.get('/getIssues', issuesController.getIssues);

/**
 * Get all issues from db
 */
router.put('/updateIssue', issuesController.updateIssue);

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
 * ------------------ Companies - start ------------------
 */

/**
 * Get all companies from db
 */
router.get('/getCompanies', usersController.getCompanies);

/**
 * ------------------ Companies - end ------------------
 */

/**
 * ------------------ Polls - start ------------------
 */

/**
 * Get polls from db
 */
router.get('/getPolls', pollsController.getPolls);

/**
 * Get polls from db
 */
router.get('/getPoll/:id', pollsController.getPoll);

/**
 * Get polls from db
 */
router.get('/getPollByIssue/:id', pollsController.getPollByIssueId);

/**
 * ------------------ Polls - end ------------------
 */

/**
 * Validate login
 */
router.post('/login', usersController.login);

module.exports = router;
