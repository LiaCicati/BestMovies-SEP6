const router = require("express").Router();
const UserController = require('../controllers/user');

router.get("/me", UserController.getUser);
router.patch('/me', UserController.updateUser);

module.exports = router;
