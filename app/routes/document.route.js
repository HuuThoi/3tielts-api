const express = require("express");
const controller = require("../controllers/document.controller");
const { authJwt } = require("../middlewares/index");

var router = express.Router();

router.use(function(req, res, next) {
    // res.header(
    //     "Access-Control-Allow-Headers",
    //     "x-access-token, Origin, Content-Type, Accept"
    // );
    next();
});

router.get("/all", [authJwt.verifyToken], controller.findAll);
router.get("/all-nopaging", [authJwt.verifyToken], controller.findAllNoPaging);
router.post("/", [authJwt.verifyToken], controller.create);
router.get("/:id", [authJwt.verifyToken], controller.findById);
router.put("/:id", [authJwt.verifyToken], controller.update);
router.delete("/:id", [authJwt.verifyToken], controller.delete);

module.exports = router;