const router = require("express").Router();
const divisionCTRL = require("../controller/divisionCTRL");

router
  .route("/division")
  .post(divisionCTRL.createDivision)
  .get(divisionCTRL.getDivision);

router.route("/division/:id").delete(divisionCTRL.deleteDivision);

module.exports = router;
