const router = require("express").Router();
const productCTRL = require("../controller/productCTRL");
const auth = require("../middleware/auth");

router
  .route("/product")
  .post(auth, productCTRL.createProduct)
  .get(productCTRL.getCategory);

router.route("/product/:slug").get(productCTRL.getProductBySlug);
router.route("/product-details/:id").get(productCTRL.getProductDetails);

router
  .route("/product/:id")
  .patch(auth, productCTRL.updateProduct)
  .delete(auth, productCTRL.deleteProduct);

module.exports = router;
