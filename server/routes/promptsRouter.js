const router = require("express").Router();
const PromptModel = require("../models/PromptModel");
const AppError = require("../errors_handlers/AppError");

router.get("/", async (req, res, next) => {
    try {
        const resPerPage = req.query.perPage ? parseInt(req.query.perPage) : 2;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        const topic = req.query.topic || "education";

        const total = await PromptModel.countDocuments({ topic });
        const totalPage =
            total % resPerPage === 0
                ? total / resPerPage
                : Math.floor(total / resPerPage) + 1;

        if (page > totalPage) {
            return res.json({ prompts: [], totalPage, message: "notFound" });
        }

        const prompts = await PromptModel.find({ topic })
            .skip((page - 1) * resPerPage)
            .limit(resPerPage)
            .sort({ createdAt: -1 });

        res.json({ prompts, totalPage });
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
            topic: req.body.topic,
            content: req.body.content,
        });
        res.json({ message: "success", prompt: prompt });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
