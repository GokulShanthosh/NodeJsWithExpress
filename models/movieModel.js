const { log } = require("console");
const fs = require("fs");
const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Movie name filed is required!"], //making field required
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
    createdBy: {
      type: String,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Document MidddleWares
movieSchema.pre("save", function (next) {
  this.createdBy = "Gokul";
  next();
});

movieSchema.post("save", function (doc, next) {
  const content = `\nThe movie name ${doc.name} is created by ${doc.createdBy} at ${doc.createdAt} \n`;

  try {
    fs.writeFileSync("./Log/log.txt", content, { flag: "a" });
    next();
  } catch (err) {
    console.log(err.message);
  }
});

//! helper function for query middleware
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");
  const timezoneOffset = -date.getTimezoneOffset();
  const timezoneHours = String(
    Math.floor(Math.abs(timezoneOffset) / 60)
  ).padStart(2, "0");
  const timezoneMinutes = String(Math.abs(timezoneOffset) % 60).padStart(
    2,
    "0"
  );
  const timezoneSign = timezoneOffset >= 0 ? "+" : "-";

  return new Date(
    `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneSign}${timezoneHours}:${timezoneMinutes}`
  );
}
let startTime;
let endTime;
//query middlewares
movieSchema.pre("find", function (next) {
  this.find({ ratings: { $lte: formatTimestamp(Date.now()) } });
  startTime = Date.now();
  next();
});

movieSchema.post("find", function (docs, next) {
  endTime = Date.now();
  fs.writeFileSync(
    "./Log/log.txt",
    `\nTime taken to find is ${endTime - startTime}milliseconds \n`,
    { flag: "a" }
  );
  next();
});

movieSchema.pre("findOne", function (next) {
  this.findOne({ ratings: { $lte: formatTimestamp(Date.now()) } });
  next();
});

//Virtual Property
movieSchema.virtual("durationInHours").get(function () {
  return this.duration / 60;
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
