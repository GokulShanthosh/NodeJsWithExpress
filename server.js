const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

// console.log(process.env);

//Setting up mongoose driver for local db
mongoose
  .connect(process.env.LOCAL_CONN_STR, {
    allowPartialTrustChain: true,
  })
  .then((conn) => {
    console.log(conn);
    console.log("DB connection successfull");
  })
  .catch((err) => {
    console.log("Connection Unsuccessful");
  });

//Create a server.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server Started Successfully!");
});
