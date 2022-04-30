const mongoose = require("mongoose");

const divisionSchema = new mongoose.Schema(
  {
    id: {
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
      require: true,
    },
    url: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Division", divisionSchema);
