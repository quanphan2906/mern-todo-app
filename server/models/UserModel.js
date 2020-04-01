const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 6
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 30
        }
    },
    {
        timestamps: true
    }
);

UserSchema.pre("save", function(next) {
    const hash = bcrypt.hashSync(this.password, 10);
    this.password = hash;
    next();
});

UserSchema.methods.validatePassword = function(password) {
    const compare = bcrypt.compareSync(password, this.password);
    return compare;
};

module.exports = model("users", UserSchema);
