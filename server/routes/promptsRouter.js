const router = require("express").Router();
const PromptModel = require("../models/PromptModel");
const AppError = require("../errors_handlers/AppError");

router.get("/", async (req, res, next) => {
    try {
        const prompts = await PromptModel.find({});
        if (prompts.length !== 0) {
            //TODO: pagination over here!
        }
        res.json({ prompts });
    } catch (err) {
        next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const promptId = req.params.id;
        const prompt = await PromptModel.findById(promptId);
        if (prompt === null) {
            throw new AppError("notFound", 404);
        }
        res.json({ prompt });
    } catch (err) {
        next(err);
    }
});

router.post("/create", async (req, res, next) => {
    try {
        const prompt = await PromptModel.create({
            content: req.body.content
        });
        res.json({ message: "success", prompt: prompt });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
