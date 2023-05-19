const router = require('express').Router();

const UserController = require('../controllers/user');

const usersRouter = require('./users');
const auth = require('../middlewares/authentication');

router.use('/users', auth, usersRouter);
router.post('/signup', UserController.createUser);
router.post('/signin', UserController.login);

module.exports = router;