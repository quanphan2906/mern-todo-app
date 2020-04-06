const router = require("express").Router();
const PromptModel = require("../models/PromptModel");
const AppError = require("../errors_handlers/AppError");
const passport = require("passport");

router.get("/", async (req, res, next) => {
    try {
        const resPerPage = req.query.perPage ? parseInt(req.query.perPage) : 2;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        const topic = req.query.topic || "education";

        const queryObj = { topic, isPublic: true };

        const total = await PromptModel.countDocuments(queryObj);
        const totalPage =
            total % resPerPage === 0
                ? total / resPerPage
                : Math.floor(total / resPerPage) + 1;

        if (page > totalPage) {
            return res.json({ prompts: [], totalPage, message: "notFound" });
        }

        const prompts = await PromptModel.find(queryObj, { prompt: 1, _id: 0 })
            .skip((page - 1) * resPerPage)
            .limit(resPerPage)
            .sort({ createdAt: -1 })
            .exec();

        res.json({ prompts, totalPage });
    } catch (err) {
        next(err);
    }
});

router
    .route("/:id")
    .all(async (req, res, next) => {
        try {
            const promptId = req.params.id;
            const prompt = await PromptModel.findById(promptId).exec();
            if (prompt === null) {
                throw new AppError("notFound", 404);
            }

            res.locals.prompt = prompt;

            passport.authenticate("jwt", (err, user, info) => {
                if (!user) {
                    return res.json({ message: info.message });
                }
                if (prompt.isPublic === false && prompt.author !== user._id) {
                    throw new AppError("notAuthorized", 403);
                }
                res.locals.user = user;
                next();
            })(req, res, next);
        } catch (err) {
            next(err);
        }
    })
    .get((req, res, next) => {
        res.json({ prompt: res.locals.prompt });
    })
    .put(async (req, res, next) => {
        try {
            const prompt = res.locals.prompt;
            const newPrompt = await PromptModel.findByIdAndUpdate(
                prompt._id,
                { ...req.body },
                { new: true }
            );
            res.json({ prompt: newPrompt });
        } catch (err) {
            next(err);
        }
    });

router.post("/create", async (req, res, next) => {
    try {
        //create a guest account in db and add author here
        const prompt = await PromptModel.create({
            topic: req.body.topic,
            content: req.body.content,
            isPublic: true,
        });
        res.json({ message: "success", prompt: prompt });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
