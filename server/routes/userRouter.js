const router = require("express").Router();
const UserModel = require("../models/UserModel");
const DraftModel = require("../models/DraftModel");
const PromptModel = require("../models/PromptModel");
const AppError = require("../errors_handlers/AppError");

router
    .route("/profile")
    .get(async (req, res, next) => {
        try {
            const userId = res.locals.user._id;
            const snapshot = await UserModel.findById(userId).exec();
            if (snapshot === null) {
                throw new AppError("notFound", 404);
            }
            const userInfo = snapshot._doc;
            res.json({ user: { ...userInfo } });
        } catch (err) {
            next(err);
        }
    })
    .put(async (req, res, next) => {
        try {
            const userId = res.locals.user._id;

            //if change username, check if sb else has used that username
            if (req.body.username) {
                const sameUsernameUser = await UserModel.findOne({
                    username: req.body.username,
                }).exec();
                if (sameUsernameUser !== null) {
                    return res.json({ message: "usedUsername" });
                }
            }

            const doc = await UserModel.findById(userId).exec();
            if (req.body.username) doc.username = req.body.username;
            if (req.body.password) doc.password = req.body.password;

            const snapshot = await doc.save();
            const newUserInfo = snapshot._doc;

            res.json({ user: { ...newUserInfo } });
        } catch (err) {
            next(err);
        }
    });

router.get("/draft/", async (req, res, next) => {
    try {
        const resPerPage = req.query.perPage ? parseInt(req.query.perPage) : 2;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        const queryObj = {
            author: res.locals.user._id,
            topic: req.query.topic || "education",
        };

        const total = await DraftModel.countDocuments(queryObj).exec();
        const totalPage =
            total % resPerPage === 0
                ? total / resPerPage
                : Math.floor(total / resPerPage) + 1;

        if (page > totalPage) {
            return res.json({ drafts: [], totalPage, message: "notFound" });
        }

        const drafts = await DraftModel.find(queryObj)
            .skip((page - 1) * resPerPage)
            .limit(resPerPage)
            .sort({ createdAt: -1 })
            .populate("prompt")
            .exec();

        res.json({ drafts, totalPage });
    } catch (err) {
        next(err);
    }
});

router.post("/draft/create", async (req, res, next) => {
    try {
        const author = res.locals.user._id;
        const { content, topic } = req.body;
        var prompt = req.body.prompt;
        //parse the whole prompt that is queried here
        if (prompt._id === "") {
            prompt = await PromptModel.create({
                author,
                topic,
                content: prompt.content,
                isPublic: false,
            });
        }
        const newDraft = await DraftModel.create({
            author,
            topic,
            content,
            prompt: prompt._id,
        });

        res.json({ draft: newDraft, message: "Create success" });
    } catch (err) {
        next(err);
    }
});

router
    .route("/draft/:id")
    .all(async (req, res, next) => {
        try {
            const userId = res.locals.user._id;
            const draftId = req.params.id;
            const draft = await DraftModel.findById(draftId)
                .populate("prompt")
                .exec();
            if (draft === null) {
                throw new AppError("notFound", 404);
            }
            if (draft.author === userId) {
                res.locals.draft = draft;
                next();
            } else {
                throw new AppError("notAuthorized", 403);
            }
        } catch (err) {
            next(err);
        }
    })
    .get((req, res, next) => {
        res.json({ draft: res.locals.draft, message: "success" });
    })
    .put(async (req, res, next) => {
        try {
            const draftId = res.locals.draft._id;

            const newDraft = await DraftModel.findByIdAndUpdate(
                draftId,
                { ...req.body },
                { new: true }
            );

            res.json({ draft: newDraft, message: "success" });
        } catch (err) {
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            const draftId = res.locals.draft._id;
            await DraftModel.findByIdAndDelete(draftId);
            res.json({ message: "success" });
        } catch (err) {
            next(err);
        }
    });

module.exports = router;
