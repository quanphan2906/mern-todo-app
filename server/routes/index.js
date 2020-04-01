const router = require("express").Router();
const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const promptsRouter = require("./promptsRouter");
const passport = require("passport");

router.use(authRouter);

router.use(
    "/user",
    (req, res, next) => {
        passport.authenticate("jwt", (err, user, info) => {
            if (!user) {
                return res.json({ message: info.message });
            }
            req.user = user;
            next();
        })(req, res, next);
    },
    userRouter
);

router.use("/prompts", promptsRouter);

module.exports = router;
