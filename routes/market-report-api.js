var express = require("express");
var router = express.Router();
let oMainModel = require("../models/market-report");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource1");
});

router.post("/reports", function (req, res, next) {
  oMainModel.createReport(req, res);
});

router.get("/reports", function (req, res, next) {
  oMainModel.getReport(req, res);
});

module.exports = router;
