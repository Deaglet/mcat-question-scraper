import { model, Schema } from "mongoose";
import { type ImcatQuestion } from "./types/ImcatQuestion"

const mcatQuestionSchema = new Schema<ImcatQuestion>({
    question: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
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
const mcatQuestion = model<ImcatQuestion>('mcatQuestion', mcatQuestionSchema);
export default mcatQuestion