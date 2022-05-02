const router = require("express").Router();
const userCTRL = require("../controller/userCTRL");
const auth = require("../middleware/auth");

router.post("/register", userCTRL.register);
router.post("/login", userCTRL.login);
router.get("/refresh_token", userCTRL.refreshToken);
router.get("/logout", userCTRL.logout);
router.get("/profile", auth, userCTRL.getUser);
router.get("/product", auth, userCTRL.productList);
router.post("/change-password", auth, userCTRL.updatePassword);

module.exports = router;
