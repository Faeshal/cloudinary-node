require("pretty-error").start();
const express = require("express");
const router = express.Router();
const countryController = require("../controllers/country");
const Multer = require("multer");

router.get("/api/countries", countryController.getContries);

router.post(
  "/api/countries",
  Multer({ storage: Multer.memoryStorage() }).single("image"),
  countryController.createCountry
);

router.patch("/api/countries/:id", countryController.updateCountry);

router.delete("/api/countries/:id", countryController.deleteCountry);

module.exports = router;
