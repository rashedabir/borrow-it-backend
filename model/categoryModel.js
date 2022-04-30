const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    image: {
      type: Object,
      required: true,
    },
    slug: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    totalProduct: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
