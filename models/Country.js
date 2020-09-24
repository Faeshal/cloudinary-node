const mongoose = require("mongoose");
// const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const CountrySchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  capital: String,
  image: String,
});

// ProductSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Country", CountrySchema);
