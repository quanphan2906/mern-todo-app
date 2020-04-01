const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const DraftSchema = new Schema(
    {
        author: {
            type: String,
            required: true
        },
        prompt: {
            isFromLib: Boolean,
            content: String
        },
        content: String
    },
    {
        timestamps: true
    }
);

module.exports = model("drafts", DraftSchema);
