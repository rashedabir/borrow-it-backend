const Product = require("../model/productModel");
const Category = require("../model/categoryModel");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString };

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );
    this.query.find(JSON.parse(queryStr));

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const ProductCTRL = {
  getCategory: async (req, res) => {
    try {
      const features = new APIfeatures(Product.find(), req.query)
        .filtering()
        .paginating();

      const products = await features.query;
      const categories = await Category.find();
      const myArrayFiltered = categories.filter((el) => {
        return products.some((f) => {
          return f.category.slug === el.slug;
        });
      });
      res.json(myArrayFiltered);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getProductBySlug: async (req, res) => {
    try {
      const products = await Product.find({
        "category.slug": req.params.slug,
      });
      res.json(products);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getProductDetails: async (req, res) => {
    try {
      const product = await Product.findOne({
        _id: req.params.id,
      });
      res.json(product);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const {
        condition,
        authenticity,
        title,
        brand,
        model,
        description,
        price,
        damageWaiver,
        division,
        state,
        category,
        images,
        phone1,
        phone2,
      } = req.body;
      if (
        !condition ||
        !authenticity ||
        !title ||
        !brand ||
        !model ||
        !description ||
        !price ||
        !damageWaiver ||
        !division ||
        !category ||
        !images ||
        !phone1
      ) {
        return res.status(400).json({ msg: "Invalid Product" });
      }
      const productCategory = await Category.findOne({ name: category });
      await countProduct(category, productCategory.totalProduct);
      const newProduct = new Product({
        user: req.user.id,
        condition,
        authenticity,
        title,
        brand,
        model,
        description,
        price,
        damageWaiver,
        division,
        state,
        category: productCategory,
        images,
        phone1,
        phone2,
      });

      await newProduct.save();
      res.json(newProduct);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(400).json({ msg: "Product Not Found" });
      }
      const selectedCategory = await Category.findOne({
        name: product?.category.name,
      });
      await decreaseProduct(category.name, selectedCategory.totalProduct);
      res.json({ msg: "Product Deleted" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const {
        condition,
        authenticity,
        title,
        brand,
        model,
        description,
        price,
        damageWaiver,
        division,
        state,
        category,
        images,
        phone1,
        phone2,
      } = req.body;
      if (
        !condition ||
        !authenticity ||
        !title ||
        !brand ||
        !model ||
        !description ||
        !price ||
        !damageWaiver ||
        !division ||
        !category ||
        !images ||
        !phone1
      ) {
        return res.status(400).json({ msg: "Invalid Product" });
      }
      await Product.findOneAndUpdate(
        { _id: req.params.id },
        {
          condition,
          authenticity,
          title,
          brand,
          model,
          description,
          price,
          damageWaiver,
          division,
          state,
          category,
          images,
          phone1,
          phone2,
        }
      );
      res.json({ msg: "Product Updated" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const countProduct = async (name, oldSold) => {
  await Category.findOneAndUpdate(
    { name: name },
    {
      totalProduct: 1 + oldSold,
    }
  );
};

const decreaseProduct = async (name, oldSold) => {
  await Category.findOneAndUpdate(
    { name: name },
    {
      totalProduct: oldSold - 1,
    }
  );
};

module.exports = ProductCTRL;
