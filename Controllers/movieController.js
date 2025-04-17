const Movie = require("./../models/movieModel");
const qs = require("qs");

exports.getAllMovies = async (req, res) => {
  //filtering logic
  let queryStr = JSON.stringify(req.query);
  console.log(queryStr);

  queryStr = queryStr.replace(/\b(gte|lte|lt|gt)\b/g, (match) => `$${match}`);

  const queryObj = qs.parse(JSON.parse(queryStr), { allowDots: true });
  console.log("Parsed query object:", queryObj);

  // Movie.find({duration: {$gte:90},rating: {$gte:4}, price: {$lt:150})  example
  let query = Movie.find(queryObj);
  let query1 = Movie.find();

  //!Sorting Logic
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query1.sort(sortBy);
  } else {
    query = query1.sort("-releaseYear"); // - is used to sort by descending order
  }

  //*Limiting Field Logic
  if (req.params.fields) {
  }

  const movie = await query.exec();

  try {
    res.status(200).json({
      status: "success",
      length: movie.length,
      data: {
        movie,
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

exports.getMovie = async (req, res) => {
  try {
    // const movie = await Movie.find(_id: req.params.id);
    const movie = await Movie.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      data: {
        message: err.message,
      },
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
    // console.log(req.body);

    res.status(400).json({
      status: "falied",
      data: {
        message: err.message,
      },
    });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }); //new returns updated document, runvalidators used to validation in updating document also
    res.status(200).json({
      status: "success",
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      data: {
        message: err.message,
      },
    });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
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
