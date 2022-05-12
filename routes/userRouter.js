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
router.patch("/generate-token", userCTRL.generateToken);
router.post("/forgot-password", userCTRL.forgotPassword);
router.post("/verify-token", userCTRL.verifyToken);
router.post("/account-active", userCTRL.accountActive);

module.exports = router;
