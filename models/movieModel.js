const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Movie name filed is required!"], //makinf field required
    unique: true, //making unique field
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description filed is required!"], //making field required
    trim: true,
  },

  duration: {
    type: Number,
    required: [true, "Duration field is required!"],
  },
  ratings: {
    type: Number,
  },
  totalRating: {
    type: Number,
  },
  releaseYear: {
    type: Number,
    required: [true, "Release year is required field!"],
  },
  releaseDate: {
    type: Date,
    required: [true, "Release Date is required field!"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  genres: {
    type: [String],
    required: [true, "Genres is required field!"],
  },
  directors: {
    type: [String],
    required: [true, "Directors is required field!"],
  },
  coverImage: {
    type: String,
    require: [true, "Image Cover is required field!"],
  },
  actors: {
    type: [String],
    require: [true, "actors is required field!"],
  },
  price: {
    type: Number,
    require: [true, "Price is required field"],
  },
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
