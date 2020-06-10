const express = require("express");
var router = express.Router();
const controller = require("../controllers/user.controller");

router.use(function (req, res, next) {
    next();
})

router.get("/:limit/:offset", controller.findAll);
// router.get("/:name", controller.fin)
router.post("/register", controller.register);
// router.put('/update', controller.);
// router.get("/all", controller.getList);

module.exports = router;
