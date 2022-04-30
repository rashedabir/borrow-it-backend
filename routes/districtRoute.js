const router = require("express").Router();
const districtCTRL = require("../controller/districtCTRL");

router.route("/district").post(districtCTRL.createDistrict);

router
  .route("/district/:id")
  .delete(districtCTRL.deleteDistrict)
  .get(districtCTRL.getDistrict);

module.exports = router;
