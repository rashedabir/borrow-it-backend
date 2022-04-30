const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    division_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      require: true,
      trim: true,
    },
    bn_name: {
      type: String,
    },
    lat: {
      type: String,
    },
    lon: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("District", districtSchema);
