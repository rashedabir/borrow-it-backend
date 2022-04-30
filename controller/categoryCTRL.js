const Category = require("../model/categoryModel");
const slugify = require("slugify");

const categoryCTRL = {
  getCategory: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createCategory: async (req, res) => {
    try {
      const { name, image } = req.body;
      if (!name || !image) {
        return res.status(400).json({ msg: "Invalid Category" });
      }
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ msg: "This Category Already Exists" });
      }
      const slug = slugify(name);
      const newCategory = new Category({ name, image, slug });
      await newCategory.save();
      res.json(newCategory);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.json({ msg: "Category Deleted" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name, image } = req.body;
      if (!name || !image) {
        return res.status(400).json({ msg: "Invalid Category" });
      }
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ msg: "This Category Already Exists" });
      }
      const slug = slugify(name);
      await Category.findOneAndUpdate(
        { _id: req.params.id },
        { name, image, slug }
      );
      res.json({ msg: "Category Updated" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = categoryCTRL;
