//import modules
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const {MessagingResponse} = require('twilio').twiml;
const fetch = require('node-fetch');

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

//HELPER FUNCTIONS
function containsFiveNumbers(string){
    return /\d{5}/.test(string);
};

async function getCoordinateFromZip(zip){
    const url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip}&appid=${process.env.OPEN_WEATHER_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function getWeatherFromCoordinates(lat, lon){
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${process.env.OPEN_WEATHER_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

//Testing Browser GET
app.get("/", (req,res) => {
    res.send("Hello World");
});

//Twilio Handling
app.post("/sms", (req,res) => {
    const twiml = new MessagingResponse();
    var userSMS = req.body.Body;
    if (containsFiveNumbers(userSMS)){
        getCoordinateFromZip(userSMS).then((geoData) => {
            getWeatherFromCoordinates(geoData.lat, geoData.lon).then((weatherData) => {
                twiml.message(`The weather in ${geoData.name} is currently ${weatherData.current.weather[0].description} with a temperature of ${weatherData.current.temp}ºF.`);
                res.type('text/xml').send(twiml.toString());
            });
        });
    } else if (userSMS == 'hello') {
        twiml.message('hi!');
    } else {
        twiml.message(
            'Not what we were expecting. Try that again please'
        );
        res.type('text/xml').send(twiml.toString());
    }
});

//error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!")
});

module.exports = app;