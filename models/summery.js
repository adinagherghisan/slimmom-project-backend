const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true  
    },
    summaryInfo: [{
        diaryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Diary', 
            required: true, 
        },
        daily_left: {
            type: Number,
            required: true,
        },
        daily_consumed: {
            type: Number,
            required: true
        },
        daily_rate: {
            type: Number,
            default: 2800
        },
        percentage: {
            type: Number,
            required: true,
        }
    }]
}, {
    versionKey: false, 
    timestamps: true    
});

const Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;
