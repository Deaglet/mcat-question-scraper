import express from "express"
import mongoose from "mongoose";
import mcatQuestion from "./models/mcatQuestion" 
// const mcatQuestion = require("./models/mcatQuestion");
import keys from "./config/keys"
// import cors from "cors"

// Database connection
mongoose
    .connect(keys.mongoProdURI)
    .then(() => console.log(`Mongodb Connected`))
    .catch(error => console.log(error));


const app = express();
// So, for some reason this causes the API to just come to a screeching halt
// app.use(cors)
app.use(function(req, res, next) {
    //This seems like a bad idea but yolo
    // Version Upgrade: This is real bad, should definetly split domains apart or something in the future, this is super hacky
    res.header("Access-Control-Allow-Origin", "http://localhost:3002"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const port = 8080;
let questions;

app.get('/question', async (req, res : any) => {
    mcatQuestion.find().exec()
    .then(returnData => { 
        console.log('What is this actually returning??', returnData)
        questions = returnData
        return res.json( questions )
    })
    .catch(err => console.log(err))
    console.log('What do the numbers mean Mason', JSON.stringify(await mcatQuestion.find().exec()))
    
})

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${ port}`)
})