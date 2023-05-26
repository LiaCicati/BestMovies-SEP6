const router = require("express").Router();
const {
  validateUserRegister,
  validateUserLogin,
} = require("../middlewares/celebrateValidation");
const UserController = require("../controllers/user");

const usersRouter = require("./users");
const moviesRouter = require("./movies");
const ratingsRouter = require("./ratings");
const auth = require("../middlewares/authentication");

router.use("/users", auth, usersRouter);
router.use("/movies", auth, moviesRouter);
router.use("/ratings", auth, ratingsRouter);
router.post("/signup", validateUserRegister, UserController.createUser);
router.post("/signin", validateUserLogin, UserController.login);

module.exports = router;
