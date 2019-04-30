'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

app.use(cors());
//app.use(express.static('./public'));

app.get('/hello', (request, response) => {
  response.status(200).send('Hello');
});

app.get('/location', (request, response) => {
  let locationData = require('./data/geo.json');
  if (locationData['status'] === 'OK') {
    let responseData = new LocationResponseObj(request.query.data, locationData);
    response.status(200).send(responseData);
  } else {
    response.status(400);
  }
});

app.get('/weather', (request, response) => {
  //response.status(200).json(airplanes);
});


app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));

app.listen(PORT,() => console.log(`Listening on port ${PORT}`));

let LocationResponseObj = function(searchQuery, jsonData) {
  this.searchQuery = searchQuery;
  this.formattedQuery = jsonData['results'][0]['formatted_address'];
  this.latitude = jsonData['results'][0]['geometry']['location']['lat'];
  this.longitude = jsonData['results'][0]['geometry']['location']['lng'];
};
