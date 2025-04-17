const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const Movie = require("./../models/movieModel");
const { error, log } = require("console");

dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.LOCAL_CONN_STR, {
    allowPartialTrustChain: true,
  })
  .then((conn) => {
    console.log("DB Connection Successful!");
  })
  .catch((error) => {
    console.log("Some error occured!");
  });

const movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));

const deleteMovies = async () => {
  try {
    await Movie.deleteMany();
    console.log("Movies Deleted Successfully!");
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

const importMovies = async () => {
  try {
    await Movie.create(movies);
    console.log("Movies Imported to DB successfully!");
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importMovies();
}
if (process.argv[2] === "--delete") {
  deleteMovies();
}
