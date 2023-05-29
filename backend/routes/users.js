/*
This module defines the router for user-related operations
*/
const router = require("express").Router();
const UserController = require('../controllers/user');
const { validateUserUpdate } = require("../middlewares/celebrateValidation");

router.get("/me", UserController.getUser);
router.patch('/me', validateUserUpdate, UserController.updateUser);

module.exports = router;
