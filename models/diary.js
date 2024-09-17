const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    entries: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products", 
            required: true
        },
        product_weight: {
            type: Number,
            required: true
        },
        product_Calories: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now, 
            required: true,
        }
    }]
}, {
    versionKey: false,  
    timestamps: true 
});

const Diary = mongoose.model('Diary', diarySchema);

module.exports = Diary;
