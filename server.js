'use strict';

// Load environment variables from the .env
require('dotenv').config();

// Declare application dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// Application setup
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

// ROUTES
// route syntax = app.<operation>('route', callback);
// Home page route for server testing
app.get('/', (request, response) => {
  response.send('home page!!!!');
});

app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
// app.get('/events', eventsHandler);
// app.get('/yelp', yelpHandler);
// app.get('/movies', moviesHandler);


// Location Functions
function locationHandler(request, response) {
  try {
    // //Getting info for object
    const city = request.query.city;
    let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json&limit=1`;

    superagent.get(url)
      .then(data => {
        const geoData = data.body[0]; //first item
        const locationData = new Location(city, geoData);
        response.send(locationData);
        // console.log(geoData);
      })

  } catch (error) {
    errorHandler('it went wrong.', request, response);
  }
}

// Location Object Constructor
function Location(city, geoData) {
  // console.log('locationbuildobj');
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}

//Route for weather

function weatherHandler(request, response) {
  try {
    const latitude = request.query.latitude;
    const longitude = request.query.longitude;
    let weatherURL = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${latitude},${longitude}`;
    // console.log(weatherURL);

    superagent.get(weatherURL)
      .then(data => {
        const forecastArray = data.body.daily.data.map(object => new Weather(object));
        response.send(forecastArray);
      })

  } catch (error) {
    errorHandler('something went wrong', request, response);
  }
}


//constructor for weather


function Weather(weatherObj) {
  this.forecast = weatherObj.summary
  this.time = new Date(weatherObj.time *1000).toString().slice(0, 15);
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}

// Ensure the server is listening for requests
// ***This must be at the end of the file***

app.listen(PORT, () => console.log(`Server up on port ${PORT}`));

