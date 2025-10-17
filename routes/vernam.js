const { Router } = require("express");
const vernamController = require("../controllers/vernamController");

const router = new Router();

router.get("/", vernamController.getVernamEncrypt);

router.post("/encrypt", vernamController.postVernamEncrypt);

router.post("/decrypt", vernamController.postVernamDecrypt);

module.exports = router;
