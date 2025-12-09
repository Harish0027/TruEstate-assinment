const { Router } = require("express");
const salesController = require("../controllers/salesController");

const router = Router();

router.get("/meta", salesController.getSalesMeta);
router.get("/", salesController.getSales);

module.exports = router;
