const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const PromptSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
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
        isPublic: { type: Boolean, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = model("Prompt", PromptSchema);
