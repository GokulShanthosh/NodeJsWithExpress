const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
process.on("uncaughtException", (err) => {
  // @ts-ignore
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: "./config.env" });

// node js practice

//Setting up mongoose driver for local db
mongoose.connect(process.env.LOCAL_CONN_STR).then((conn) => {
  // console.log(conn);
  console.log("DB connection successfull");
});
// .catch((err) => {
//   console.log("Connection Unsuccessful");
// });

//Create a server.
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log("Server Started Successfully!");
});
process.on("unhandledRejection", (err) => {
  // @ts-ignore
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
