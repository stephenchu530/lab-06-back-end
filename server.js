'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/hello', (request, response) => {
  response.status(200).send('Hello');
});

app.get('/location', (request, response) => {
  let locationData = require('./data/geo.json');
  let locationObj = new Location(request.query.data, locationData);
  response.status(200).send(locationObj);
});

app.get('/weather', (request, response) => {
  let weatherData = require('./data/darksky.json');
  let lat = request.query.data.latitude;
  let lng = request.query.data.longitude;
  console.log(lat, lng);
  let weatherObj = new Weather(weatherData);
  console.log(weatherObj);
  response.status(200).send(weatherObj);
});


app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));

app.listen(PORT,() => console.log(`Listening on port ${PORT}`));

let Location = function(searchQuery, jsonData) {
  this.searchQuery = searchQuery;
  this.formattedQuery = jsonData['results'][0]['formatted_address'];
  this.latitude = jsonData['results'][0]['geometry']['location']['lat'];
  this.longitude = jsonData['results'][0]['geometry']['location']['lng'];
};

let Weather = function(jsonData) {
  this.dailyForecast = [];
  jsonData['daily']['data'].forEach(forecast => {
    let summary = forcast['summary'];
    let time = Date(forecast['time']).split(' ').slice(0, 4).join(' ');
    this.forcast.push({
      'forecast': summary,
      'time': time
    });
  });
};
