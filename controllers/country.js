require("pretty-error").start();
const Country = require("../models/Country");
const asyncHandler = require("express-async-handler");
const chalk = require("chalk");

// * @route GET /api/countries
// @desc    Get All countries
// @access  Public
exports.getContries = asyncHandler(async (req, res, next) => {
  const country = await Country.find();
  if (country.length === 0) {
    return res
      .status(404)
      .json({ success: true, message: "Country Data is Empty" });
  }
  res.status(200).json({ success: true, data: country });
});

// * @route POST /countries
// @desc    Create New country
// @access  Public
exports.createCountry = asyncHandler(async (req, res, next) => {
  const { country, capital, image } = req.body;

  // * Validation
  if (!country) {
    return res
      .status(400)
      .json({ success: false, message: "Country Name is Required" });
  }

  // * Push data to mongodb
  const countryData = new Country({
    country,
    capital,
    image,
  });
  const result = await countryData.save();
  res.status(201).json({ success: true, data: result });
});

// * @route PATCH /contries/:id
// @desc    Update Country
// @access  Public
exports.updateCountry = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const country = await Country.findById(id);
  if (!country) {
    return res
      .status(404)
      .json({ success: false, message: "No country With This ID" });
  }

  const result = await Country.findByIdAndUpdate(id, req.body);
  res.status(200).json({ success: true, data: result });
});

// * @route DELETE /contries/:id
// @desc    Delete country
// @access  Public
exports.deleteCountry = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const country = await Country.findById(id);
  if (!country) {
    return res.status(404).json({
      success: false,
      message: `No Country With ID: ${id}`,
    });
  }
  await Country.findByIdAndDelete(id);
  res.status(200).json({ success: true, message: "Country Succesfull Delete" });
});
