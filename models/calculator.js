const mongoose = require('mongoose');

const calculatorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    data: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
        },
        height: {
            type: Number,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        current_weight: {
            type: Number,
            required: true
        },
        desired_weight: {
            type: Number,
            required: true
        },
        blood_type: {
            type: String,
            enum: ['0(I)', 'A(II)', 'B(III)', 'AB(IV)'],
            required: true
        }
    }]
}, {
    versionKey: false,
    timestamps: true
});

const Calculator = mongoose.model('Calculator', calculatorSchema);

module.exports = Calculator;
