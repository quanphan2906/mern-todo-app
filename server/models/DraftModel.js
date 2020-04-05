const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const DraftSchema = new Schema(
    {
        author: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        topic: String,
        prompt: {
            isFromLib: Boolean,
            content: String,
        },
        content: String,
    },
    {
        timestamps: true,
    }
);

DraftSchema.index({ "$**": "text" });

module.exports = model("drafts", DraftSchema);
