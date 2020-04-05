const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const PromptSchema = new Schema(
    {
        topic: {
            type: String,
            required: true,
            maxlength: 20,
        },
        content: {
            type: String,
            required: true,
            maxlength: 500,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model("prompts", PromptSchema);
