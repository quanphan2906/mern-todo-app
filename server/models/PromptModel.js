const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const PromptSchema = new Schema(
    {
        content: String
    },
    {
        timestamps: true
    }
);

module.exports = model("prompts", PromptSchema);
