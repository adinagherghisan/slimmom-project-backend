const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        maxLength: 20,
        required: [true, 'Name is required for contact'],
    },
    email: {
        type: String,
        unique: [true, 'Email must be unique'],
        required: [true, 'Email is required'],
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        minLength: 6,
        maxLength: 60,
        required: [true, 'Password is required'],
    },
    token: {
        type: String,
        default: null,
    },
}, {
    versionKey: false,
    timestamps: true
});


userSchema.methods.setPassword = async function (password) {
    this.password = await bcryptjs.hash(password, 10);
};


userSchema.methods.isValidPassword = async function (password) {
    return await bcryptjs.compare(password, this.password);
};


userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        await this.setPassword(this.password);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
