const { Router } = require("express");
const polybiusController = require("../controllers/polybiusController");

const router = new Router();

router.post("/encrypt", polybiusController.postEncrypt);

router.post("/decrypt", polybiusController.postDecrypt);

module.exports = router;
