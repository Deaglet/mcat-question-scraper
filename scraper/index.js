const cheerio = require("cheerio")
const axios = require("axios")
const mongoose = require('mongoose');
const mcatQuestion = require("./models/mcatQuestion");

// Database connection
const db = require('./config/keys').mongoProdURI;
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log(`Mongodb Connected`))
    .catch(error => console.log(error));

async function scrapeMCATQuestion() {
    const axiosResponse = await axios.request({
        method: "GET",
        url: "https://www.kaplanquizzes.com/mcat/",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })
    let webData = axiosResponse.data
    const $ = cheerio.load(webData)
    let question = ""
    //Version Upgrade: Need to handle images here as well, will probably take more than just a little fix like this
    $('.insidecontainer').children().filter('div').eq(1).children('p').each(function (i, elem){
        question += $(this).text() + '<br>'
    })
    const answerForm = $("#answer_form")
    const correctAnswerText = $("#answer").find("b").text()
    const answer = $("#answer").children("div:last-child").find("p").next()
    let answers = answerForm.find("label")

    let answersObject = {}
    answers.each((index, element) => {
        let letter = ''
        switch (index) {
            case 0:
                letter = 'A'
                break;
            case 1:
                letter = 'B'
                break;
            case 2:
                letter = 'C'
                break;
            case 3:
                letter = 'D'
                break;
            default:
                letter = 'Broken'
                break;
        }
        // This has a high chance to break in the future
        // First replace is for tabs and line breaks, second replace is for spaces
        let answerText = $(element).html().split('>')[1].replace(/(\r\n|\n|\r|\t)/gm, "")
        
        //Version Upgrade: This is kind of jank, should refactor
        if(letter !== 'Broken'){
            answersObject['answer' + letter] = answerText
        } else {
            //Version Upgrade: Should put some sort of alert/notification that will go to me if this gets triggered 
            console.log('Oops')
        }
    })

    //Version Upgrade - Urgent: Should have a better way to grab the answer letter
    let correctAnswerLetter = correctAnswerText.split('Correct Answer')[0].split('is the correct answer')[0].replace(/\s/g, '')
    console.log('Correct answer', correctAnswerLetter)
    
    let newMCATQuestion = new mcatQuestion({
        question: question,
        answers: answersObject,
        correctAnswer: correctAnswerLetter,
        answerExplanation: answer.text()
    });

    
    newMCATQuestion.save()
    .then(mcatQuestion => console.log('Save successful'))
    .catch(err => console.log(err));
    
    //Set to repeat every 6 hours, hopefully that and duplicate detection will keep any weird timezone issues from occuring
    //This looks better than the number it would be in milliseconds, I am willing to lose the performance for readability
    let time = 1000 * 60 * 60 * 6
    queueScraping(time)
}

function queueScraping(time){
    setTimeout(() => {
        scrapeMCATQuestion()
    }, time)
}

scrapeMCATQuestion()