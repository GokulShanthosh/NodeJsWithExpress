//import package
const express = require("express"); //returns a function, so stored in a variable
let app = express(); //function is called, it returns a object which is stored app variable and using this app we can use bunch of methods
const fs = require("fs");
const morgan = require("morgan");
const moviesRouter = require("./Routes/movieRoutes");

//ROUTE = HTTP Method + URL
// app.get("/", (req, res) => {
//   res.status(200).send("<h1>Hello From Express Js</h1>");
//   // .json({ message: "Hello", id: 1 });  //used to send a json file in response
// });

//middlewares
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static("./public")); //used to serve static files

// const movies = JSON.parse(fs.readFileSync("./data/movies.json")); //reading json file synchronously

// //Route Handler Function (Refactoring)
// const getAllMovies = (req, res) => {
//   res.status(200).json({
//     status: "sucess",
//     count: movies.length,
//     data: {
//       movies: movies,
//     },
//   });
// };

// const createNewMovie = (req, res) => {
//   const newId = movies[movies.length - 1].id + 1;
//   const newMovie = Object.assign({ id: newId }, req.body);

//   movies.push(newMovie);

//   fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
//     res.status(201).json({
//       status: "success",
//       data: {
//         movie: newMovie,
//       },
//     });
//   });
// };

// const getMovie = (req, res) => {
//   const id = +req.params.id;

//   const movie = movies.find((el) => id === el.id);

//   if (!movie) {
//     return res.status(404).json({
//       status: "error",
//       message: "Movie with " + id + " is not found",
//     });
//   }
//   res.status(200).json({
//     status: "success",
//     data: {
//       movie: movie,
//     },
//   });
// };

// const updateMovie = (req, res) => {
//   const id = +req.params.id;

//   const movieToUpdate = movies.find((el) => id === el.id);

//   if (!movieToUpdate) {
//     return res.status(404).json({
//       status: "error",
//       data: {
//         movie: `There is no movie with id: ${id}. Please enter valid id to update!`,
//       },
//     });
//   }

//   const movieIndex = movies.indexOf(movieToUpdate);
//   Object.assign(movieToUpdate, req.body);
//   // console.log(movieToUpdate);

//   movies[movieIndex] = movieToUpdate;
//   // console.log(movies);

//   fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
//     res.status(200).json({
//       status: "success",
//       data: {
//         movie: movieToUpdate,
//       },
//     });
//   });
// };

// const deleteMovie = (req, res) => {
//   const id = +req.params.id;
//   const movieToDelete = movies.find((el) => id === el.id);

//   if (!movieToDelete) {
//     return res.status(404).json({
//       status: "error",
//       data: {
//         movie: `There is no movie with id ${id}`,
//       },
//     });
//   }

//   const movieIndex = movies.indexOf(movieToDelete);

//   movies.splice(movieIndex, 1);

//   fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
//     res.status(204).json({
//       status: "success",
//       data: {
//         movie: null,
//       },
//     });
//   });
// };

// //API for get request

// app.get("/api/v1/movies", getAllMovies);

// //API for post request
// app.post("/api/v1/movies", createNewMovie);

// //API: Handling Route Parameters
// app.get("/api/v1/movies/:id", getMovie);

// //API for patch request
// app.patch("/api/v1/movies/:id", updateMovie);

// //Api for delete request
// app.delete("/api/v1/movies/:id", deleteMovie);

//Chaining the routes (Refactoring)
// app.route("/api/v1/movies").get(getAllMovies).post(createNewMovie);

// app
//   .route("/api/v1/movies/:id")
//   .get(getMovie)
//   .patch(updateMovie)
//   .delete(deleteMovie);

// //Mounting Routes

// const movieRouter = express.Router(); //returns a middleware

// movieRouter.route("/").get(getAllMovies).post(createNewMovie);

// movieRouter.route("/:id").get(getMovie).patch(updateMovie).delete(deleteMovie);

//Using routes
app.use("/api/v1/movies", moviesRouter);

module.exports = app;
