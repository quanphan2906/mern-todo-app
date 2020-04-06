const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const DraftSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        prompt: {
            type: Schema.Types.ObjectId,
            ref: "Prompt",
            required: true,
        },
        topic: String,
        content: String,
    },
    {
        timestamps: true,
    }
);

module.exports = model("Draft", DraftSchema);
