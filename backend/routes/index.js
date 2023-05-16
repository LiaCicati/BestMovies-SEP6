const router = require('express').Router();

const { createUser, login } = require('../controllers/users');

const usersRouter = require('./users');
const auth = require('../middlewares/authentication');

router.use('/users', auth, usersRouter);
router.post('/signup', createUser);
router.post('/signin', login);

module.exports = router;