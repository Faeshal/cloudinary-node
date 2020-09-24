require("pretty-error").start();
const Country = require("../models/Country");
const asyncHandler = require("express-async-handler");
const chalk = require("chalk");
const cloudinary = require("cloudinary").v2;

// * Cloduinary Setup
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// * @route POST /countries
// @desc    Create New country
// @access  Public
exports.createCountry = asyncHandler(async (req, res, next) => {
  const { country, capital } = req.body;
  const image = req.file.buffer.toString("base64");

  // * Validation
  if (!country) {
    return res
      .status(400)
      .json({ success: false, message: "Country Name is Required" });
  }

  // * Push to Cloudinary
  const uploadResponse = await cloudinary.uploader.upload(
    "data:image/png;base64," + image,
    { public_id: country, tags: capital },
    (error, result) => {
      if (error) {
        console.error(chalk.red.bold(error));
        process.exit(1);
      }
      console.log(chalk.green.inverse("hasil:" + JSON.stringify(result)));
    }
  );

  // * Push data to mongodb
  const countryData = new Country({
    country,
    capital,
    image: uploadResponse.secure_url,
  });

  const result = await countryData.save();
  res.status(201).json({ success: true, data: result });
});

// * @route PATCH /contries/:id
// @desc    Update Country
// @access  Public
exports.updateCountry = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let image;
  const countryData = await Country.findById(id);

  if (!countryData) {
    return res
      .status(404)
      .json({ success: false, message: `No country With ID: ${id}` });
  }

  if (!image) {
    image = countryData.image;
  }

  if (image) {
    image = req.file.buffer.toString("base64");
  }

  // * Push to Cloudinary
  // await cloudinary.uploader.rename(
  //   "data:image/png;base64," + image,
  //   { public_id: country, tags: capital },
  //   (error, result) => {
  //     if (error) {
  //       console.error(chalk.red.bold(error));
  //       process.exit(1);
  //     }
  //     console.log(chalk.green.inverse("hasil:" + JSON.stringify(result)));
  //   }
  // );

  const result = await Country.findByIdAndUpdate(id, req.body);
  res.status(200).json({ success: true, data: result });
});

// * @route DELETE /contries/:id
// @desc    Delete country
// @access  Public
exports.deleteCountry = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const countryData = await Country.findById(id);
  if (!countryData) {
    return res.status(404).json({
      success: false,
      message: `No Country With ID: ${id}`,
    });
  }
  await cloudinary.uploader.destroy(countryData.country, (error, result) => {
    if (error) {
      console.error(chalk.red.bold(error));
      process.exit(1);
    }
    console.log(chalk.green.inverse("hasil:" + JSON.stringify(result)));
  });
  await Country.findByIdAndDelete(id);
  res.status(200).json({ success: true, message: "Country Succesfull Delete" });
});

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
