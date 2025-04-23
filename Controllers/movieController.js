const Movie = require("./../models/movieModel");
const qs = require("qs");
const ApiFeatures = require("./../Utils/ApiFeatures");
const CustomerError = require("../Utils/CustomError");
const AsynHandler = require("../Utils/catchAsync");

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

exports.getAllMovies = AsynHandler(async (req, res) => {
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
});

exports.getMovie = AsynHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return next(new CustomerError("No Movie found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      movie,
    },
  });
});

exports.createNewMovie = AsynHandler(async (req, res) => {
  const movie = await Movie.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      movie,
    },
  });
});

exports.updateMovie = AsynHandler(async (req, res, next) => {
  44;
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!movie) {
    return next(new CustomerError("No Movie found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      movie,
    },
  });
});

exports.deleteMovie = AsynHandler(async (req, res, next) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) {
    return next(new CustomerError("No Movie found with that id", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getMovieStats = AsynHandler(async (req, res) => {
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
});

exports.getMovieByGenres = AsynHandler(async (req, res) => {
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
});
