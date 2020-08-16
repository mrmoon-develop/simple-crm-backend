var express = require('express');
var router = express.Router();
var usersController = require('../../controller/API/usersController');

/**
 * Get all users from db
 */
router.get('/getUsers', usersController.getUsers);

module.exports = router;
