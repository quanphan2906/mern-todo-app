const passport = require("passport");
const router = require("express").Router();

router.post("/register", (req, res, next) => {
    passport.authenticate("register", (err, user, info) => {
        if (err) return next(err);

        if (!user) return res.json({ message: info.message });

        return res.json({ user });
    })(req, res, next);
});

router.post("/login", (req, res, next) => {
    passport.authenticate("login", (err, user, info) => {
        if (err) return next(err);

        if (!user) return res.json({ message: info.message, token: null });

        return res.json({ ...info });
    })(req, res, next);
});

module.exports = router;
