require("pretty-error").start();
const express = require("express");
const router = express.Router();
const countryController = require("../controllers/country");

router.get("/api/countries", countryController.getContries);

router.post("/api/countries", countryController.createCountry);

router.patch("/api/countries/:id", countryController.updateCountry);

router.delete("/api/countries/:id", countryController.deleteCountry);

module.exports = router;
