const Movie = require("./../models/movieModel");
const qs = require("qs");
const ApiFeatures = require("./../Utils/ApiFeatures");

exports.getHighestRated = (req, res, next) => {
  console.log("before:", req.query.limit);
  // Set the query parameters for highest rated movies
  // req.query.fields = "name,duration,ratings,price";
  const limit = 5;
  // req.query.limit = "5";
  // req.query.sort = "-ratings";
  req.url += "?limit=" + limit + " &sort=-ratings";
  // req.query.fields = "name,duration,ratings,price";
  // req.query = null;

  console.log("Modified req.query:", req.query.limit); // For debugging
  next();
};

exports.getAllMovies = async (req, res) => {
  try {
    const features = new ApiFeatures(Movie.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    // Execute query
    const movies = await features.query;

    // Send response
    res.status(200).json({
      status: "success",
      results: movies.length,
      data: movies,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        status: "failed",
        message: "No movie found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.createNewMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({
        status: "failed",
        message: "No movie found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        status: "failed",
        message: "No movie found with that ID",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.getMovieStats = async (req, res) => {
  try {
    const stats = await Movie.aggregate([
      { $match: { ratings: { $gte: 4.5 } } },
      {
        $group: {
          _id: "$releaseYear",
          avgRating: { $avg: "$ratings" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          totalPrice: { $sum: "$price" },
          count: { $sum: 1 },
        },
      },
      { $sort: { minPrice: 1 } },
      // { $match: { minPrice: { $gte: 57 } } },
    ]);

    res.status(200).json({
      status: "success",
      count: stats.length,
      data: {
        stats: stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      data: {
        message: err.message,
      },
    });
  }
};

exports.getMovieByGenres = async (req, res) => {
  try {
    const genres = req.params.genres;
    const movie = await Movie.aggregate([
      { $unwind: "$genres" },
      {
        $group: {
          _id: "$genres",
          MovieCount: { $sum: 1 },
          movies: { $push: "$name" },
        },
      },
      { $addFields: { genres: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: { movieCount: -1 } },
      // {$limit: 6}
      { $match: { genres: genres } },
    ]);
    res.status(200).json({
      status: "success",
      count: movie.length,
      data: {
        movie: movie,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      data: {
        message: err.message,
      },
    });
  }
};
