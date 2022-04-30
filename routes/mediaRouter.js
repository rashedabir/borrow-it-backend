const router = require("express").Router();
const mediaCTRL = require("../controller/mediaCTRL");
const auth = require("../middleware/auth");

router.post("/upload", mediaCTRL.uploadFile);
router.post("/destroy", mediaCTRL.deleteFile);

module.exports = router;
