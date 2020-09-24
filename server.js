require("dotenv").config();
require("pretty-error").start();
const express = require("express");
const app = express();
const countryRoutes = require("./routes/country");
const mongoConnection = require("./utils/db");
const chalk = require("chalk");
const morgan = require("morgan");
const PORT = 1000;

// * Main
app.use(morgan("dev"));
app.use(express.json());

// * Routing
app.use(countryRoutes);

// * Database & Server
mongoConnection();

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(chalk.greenBright.inverse(`Server is Up on : ${PORT}`));
});
