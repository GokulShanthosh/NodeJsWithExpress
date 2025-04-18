const Movie = require("./../models/movieModel");
const qs = require("qs");
const ApiFeatures = require("./../Utils/ApiFeatures");

exports.getHighestRated = (req, res, next) => {
  console.log("before:", req.query);
  // Set the query parameters for highest rated movies
  req.query.limit = "5";
  req.query.sort = "-ratings";
  req.query.fields = "name,duration,ratings,price";

  console.log("Modified req.query:", req.query); // For debugging
  next();
};

exports.getAllMovies = async (req, res) => {
  try {
    const features = new ApiFeatures(Movie.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    // 1. Create a shallow copy of req.query to avoid modifying the original
    // const queryObj = { ...req.query };

    // // 2. Exclude special field names from filtering
    // const excludedFields = ["page", "sort", "limit", "fields"];
    // excludedFields.forEach((field) => delete queryObj[field]);

    // // 3. Advanced filtering for gte, gt, lte, lt
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // // Start building the query
    // let query = Movie.find(qs.parse(JSON.parse(queryStr)));

    // // 4. Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(",").join(" ");
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort("-createdAt"); // Default sorting
    // }

    // // 5. Field limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(",").join(" ");
    //   query = query.select(fields);
    // } else {
    //   query = query.select("-__v"); // Exclude __v field by default
    // }

    // // 6. Pagination
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 10;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // // Check if page exists
    // if (req.query.page) {
    //   const moviesCount = await Movie.countDocuments();
    //   if (skip >= moviesCount) {
    //     throw new Error("This page does not exist");
    //   }
    // }

    // Execute query
    const movies = await features.query;

    // Send response
    res.status(200).json({
      status: "success",
      results: movies.length,
      data: { movies },
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
