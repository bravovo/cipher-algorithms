const { Router } = require("express");

const gronsfeldController = require("../controllers/gronsfeldController");

const router = new Router();

router.get("/", gronsfeldController.getEncrypt);

router.post("/encrypt", gronsfeldController.postEncrypt);

router.post("/decrypt", gronsfeldController.postDecrypt);

module.exports = router;
