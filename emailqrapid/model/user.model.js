const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        required: [true, "Email can't be empty"],
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Email format is not correct"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    token: {
        type: String,
    },
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
    } catch (err) {
        throw err;
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
