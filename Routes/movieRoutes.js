const express = require("express");
const moviesController = require("./../Controllers/movieController");
const authController = require("./../Controllers/authController");
const userController = require("./../Controllers/userController");

const router = express.Router(); //returns a middleware

// router.param("id", moviesController.checkId);
router.route("/movieStats").get(moviesController.getMovieStats);

router
  .route("/highestRatedMovie")
  .get(moviesController.getHighestRated, moviesController.getAllMovies);

router
  .route("/movies-by-genres/:genres")
  .get(moviesController.getMovieByGenres);

router
  .route("/")
  .get(authController.protect, moviesController.getAllMovies)
  .post(moviesController.createNewMovie);

router
  .route("/:id")
  .get(moviesController.getMovie)
  .patch(moviesController.updateMovie)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    moviesController.deleteMovie
  );

module.exports = router;
