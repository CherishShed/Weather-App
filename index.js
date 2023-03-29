const os = require("os");
const fs = require("fs");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


app.get("/", (req, res) => {
    getWeather("lagos", res)
})
app.post("/", (req, res) => {
    var place = req.body.search
    getWeather(place, res);

})
app.use((req, res) => {
    res.render("error", { root: `${__dirname}/views`, title: "Error", })
})

const getWeather = (place, res) => {
    var path = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=7ef268a05cee7cdfb64551cea41eb187&units=metric`;
    https.get(path, (response) => {
        if (response.statusCode != 200) {
            res.render("error", { root: `${__dirname}/views`, title: "Error", })
        }
        else {
            response.on("data", (data) => {
                const weatherData = JSON.parse(data);
                const neededData = getNeededData(weatherData);
                res.render("index", { root: `${__dirname}/views`, title: "Weather App", neededData });
            })
        }
    })
}

const getNeededData = (weatherData) => {
    const today = new Date();
    let month = months[today.getMonth()];
    let date = today.getDate();
    let day = days[today.getDay()];
    let weatherIcon = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

    const myData = {
        country: weatherData.sys.country, city: weatherData.name, date: `${day}, ${date} ${month}`, forecast: weatherData.weather[0].description, icon: weatherIcon, humidity: weatherData.main.humidity, pressure: weatherData.main.pressure, temperature: weatherData.main.temp, windSpeed: weatherData.wind.speed, background: `images/${weatherData.weather[0].main}.jpg`
    }
    return myData;
}
app.listen(8081, () => {
    console.log("server is running");
})