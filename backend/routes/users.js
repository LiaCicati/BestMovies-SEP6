const router = require("express").Router();
const UserController = require('../controllers/user');

router.get("/me", UserController.getUser);

module.exports = router;
