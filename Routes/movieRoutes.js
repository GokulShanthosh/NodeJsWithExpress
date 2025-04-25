const express = require("express");
const moviesController = require("./../Controllers/movieController");
const authController = require("./../Controllers/authController");
const userController = require("./../Controllers/userController");

const router = express.Router(); //returns a middleware

//Authentication routes
router.post("/signUp", authController.signUp);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword/:token", authController.resetPassword);
router.post(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);
//User routers
router.get("/users", userController.getAllUsers);

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
