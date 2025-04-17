const Movie = require("./../models/movieModel");
const qs = require("qs");

exports.getAllMovies = async (req, res) => {
  try {
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gte|lte|lt|gt)\b/g, (match) => `$${match}`);
    const queryObj = qs.parse(JSON.parse(queryStr), { allowDots: true });

    let query = Movie.find(queryObj);
    console.log(query);

    //Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ").trimEnd();
      console.log(sortBy);

      query = Movie.find(queryObj).sort(sortBy);
    } else {
      query = query.sort("-price"); // Default sorting
    }

    // 4. Execute query
    const movies = await query;

    res.status(200).json({
      status: "success",
      length: movies.length,
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
