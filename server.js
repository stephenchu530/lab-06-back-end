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
  const weatherData = require('./data/darksky.json');
  // const lat = request.query.data.latitude;
  // const lng = request.query.data.longitude;

  const weatherObj = new Weather(weatherData);

  response.status(200).send(weatherObj.dailyForecast);
});


app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));

app.listen(PORT,() => console.log(`Listening on port ${PORT}`));

const Location = function(searchQuery, jsonData) {
  const formattedQuery = jsonData['results'][0]['formatted_address'];
  const latitude = jsonData['results'][0]['geometry']['location']['lat'];
  const longitude = jsonData['results'][0]['geometry']['location']['lng'];

  this.search_query = searchQuery;
  this.formatted_query = formattedQuery;
  this.latitude = latitude;
  this.longitude = longitude;
};

const Weather = function(jsonData) {
  const forecastSummary = jsonData['daily']['data'];

  this.dailyForecast = [];

  forecastSummary.forEach(forecast => {
    const summary = forecast['summary'];
    const time = Date(forecast['time']).split(' ').slice(0, 4).join(' ');

    this.dailyForecast.push({
      'forecast': summary,
      'time': time,
    });
  });
};
