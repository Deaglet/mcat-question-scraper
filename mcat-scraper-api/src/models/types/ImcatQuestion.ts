export interface ImcatQuestion {
    question: string
    date: Date,
    answers: {    
        answerA: string,
        answerB: string,
        answerC: string,
        answerD: string,
    },
    correctAnswer: string,
    answerExplanation: string
}