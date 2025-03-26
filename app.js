//import modules
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const {MessagingResponse} = require('twilio').twiml;

//import routes
//const weatherRoutes = requir('./routes/weatherRoutes');

//connect middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: false }));

//connect routes
app.use(express.static("public"));
//app.use("/api/v1/weather", weatherRoutes);

//Testing Browser GET
app.get("/", (req,res) => {
    res.send("Hello World");
});

//Twilio Handling
app.post("/sms", (req,res) => {
    console.log(req.body);
    const twiml = new MessagingResponse();
    if (req.body.Body == 'test'){
        twiml.message('test success');
    } else if (req.body.Body == 'hello') {
        twiml.message('hi!');
    } else {
        twiml.message(
            'Not what we were expecting. Try that again please'
        );
    }
    res.type('text/xml').send(twiml.toString());
});

//error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!")
});

module.exports = app;