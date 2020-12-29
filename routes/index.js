var express = require("express");
const bodyParser = require("body-parser");
var router = express.Router();

router.use(bodyParser.json());
/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ message: "API Working" });
});

module.exports = router;
