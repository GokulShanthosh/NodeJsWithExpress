const express = require("express");
const moviesController = require("./../Controllers/movieController");

const router = express.Router(); //returns a middleware

// router.param("id", moviesController.checkId);

router
  .route("/")
  .get(moviesController.getAllMovies)
  .post(moviesController.createNewMovie);

router
  .route("/:id")
  .get(moviesController.getMovie)
  .patch(moviesController.updateMovie)
  .delete(moviesController.deleteMovie);

module.exports = router;
