/*
This module defines the router for rating-related operations
*/
const router = require("express").Router();
const RatingController = require("../controllers/rating");
const { validateRating } = require("../middlewares/celebrateValidation");

router.get("/", RatingController.getRatings);
router.post("/", validateRating, RatingController.addRating);
router.get("/:id", RatingController.getRatingById);
router.patch("/:id", RatingController.updateRating);

module.exports = router;
