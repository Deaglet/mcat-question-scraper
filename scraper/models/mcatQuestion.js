const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mcatQuestionSchema = new Schema({
    question: {
        type: String,
        required: true,
        //Version Upgrade:Probably inefficient, but I want to have double unique right now to be sure
        unique: true
    },
    date: {
        type: Date,
        default: Date.now(),
        unique: true
    },
    answers: {    
        answerA: {
            type: String,
            required: true
        },
        answerB: {
            type: String,
            required: true
        },
        answerC: {
            type: String,
            required: true
        },
        answerD: {
            type: String,
            required: true
        }
    },
    correctAnswer: {
        type: String,
        required:true
    },
    answerExplanation: {
        type: String,
        required: true
    }
});

module.exports = mcatQuestion = mongoose.model('mcatQuestion', mcatQuestionSchema);