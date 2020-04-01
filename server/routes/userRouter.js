const router = require("express").Router();
const UserModel = require("../models/UserModel");

router
    .route("/profile/:id")
    .get(async (req, res, next) => {
        try {
            const userInfo = await UserModel.findById(req.user._id);
            res.json({ ...userInfo });
        } catch (err) {
            res.status(400).json(err);
        }
    })
    .post((req, res, next) => {})
    .put((req, res, next) => {});

router
    .route("/draft/:id")
    .get((req, res, next) => {})
    .post((req, res, next) => {})
    .put((req, res, next) => {})
    .delete((req, res, next) => {});

module.exports = router;
