const router = require("express").Router();

// router.get(
//     "/",
//     passport.authenticate("jwt", { session: false }),
//     (req, res, next) => {
//         res.json({
//             message: "you have made it to a secure route",
//             user: req.user
//         });
//     }
// );

router.get("/:id", (req, res, next) => {});

router.post("/create", (req, res, next) => {});

module.exports = router;
