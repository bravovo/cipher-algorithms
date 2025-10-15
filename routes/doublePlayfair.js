const { Router } = require("express");
const doublePlayfairController = require("../controllers/doublePlayfairController");

const router = new Router();

router.get("/", doublePlayfairController.getDoublePlayfair);

router.post("encrypt", doublePlayfairController.postEncrypt);

router.post("decrypt", doublePlayfairController.postDecrypt);

module.exports = router;
