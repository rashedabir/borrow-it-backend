const router = require("express").Router();
const categoryCTRL = require("../controller/categoryCTRL");
const auth = require("../middleware/auth");

router
  .route("/category")
  .post(auth, categoryCTRL.createCategory)
  .get(categoryCTRL.getCategory);

router
  .route("/category/:id")
  .patch(auth, categoryCTRL.updateCategory)
  .delete(auth, categoryCTRL.deleteCategory);

module.exports = router;
