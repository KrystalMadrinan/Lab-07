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

// route syntax = app.<operation>('route', callback);
// home page for server testing
app.get('/', (request, response) => {
  response.send('home page!!!!');
});

// Routes
app.get('/location', locationHandler);
// app.get('/weather', weatherHandler);
// app.get('/yelp', yelpHandler);
// app.get('/events', eventsHandler);
// app.get('/movies', moviesHandler);

// route for location/map
function locationHandler(request, response) {
  try {
    // //Getting info for object
    const city = request.query.city;
    let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json&limit=1'`;

    superagent.get(url)
      .then(data => {
        const geoData = data.body[0]; //first item
        const locationData = new Location(city, geoData);
        response.send(locationData);
        console.log(geoData);

      })

  } catch (error) {
    errorHandler('it went wrong.', request, response);

  }

}
//routes above function below

//creating object
function Location(city, geoData) {
  console.log('locationbuildobj');
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}

//Route for weather

app.get('/weather', (request, response) => {
  try {
    const weatherData = require('./darksky.json');
    const forecastArray = weatherData.daily.data.map(object => new Weather(object));
    // weatherData.daily.data.forEach(darkSky => {
    // const time = new Date(darkSky.time *1000).toString().slice(0, 15);
    // const forecast = darkSky.summary;
    // const weatherObj = new Weather(time, forecast);
    // forecastArray.push(weatherObj);
    // });

    response.send(forecastArray);

  } catch (error) {
    errorHandler('something went wrong', request, response);
  }
})


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

