WeatherMap

Project Description

WeatherMap is a single-page weather application that allows users to search for cities, view current weather information, and explore locations on an interactive map.

Live Demo

Visit the application here:

https://malaz-mo456.github.io/WeatherMap/

Features

- Search for cities by name.
- Display current weather information.
- View temperature, weather conditions, humidity, cloud coverage, and wind speed.
- Explore locations using an interactive map.
- Save favorite cities.
- Remove cities from the favorites list.
- Copy weather reports to the clipboard.
- Share weather reports on Facebook or using the device's sharing feature.
- Display loading and error messages.
- Responsive design for different screen sizes.

Technologies Used

- HTML5
- CSS3
- JavaScript
- Leaflet.js
- OpenStreetMap
- OpenWeatherMap API
- Browser Local Storage

APIs and Services

OpenWeatherMap Geocoding API

Used to retrieve the geographic coordinates of a city from its name.

OpenWeatherMap Current Weather API

Used to retrieve current weather information based on the city's geographic coordinates.

Leaflet.js

Used to create and control the interactive map.

OpenStreetMap

Provides the map tiles displayed in the application.

Project Structure

WeatherMap/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── map.js
    ├── geocoding.js
    ├── weather.js
    └── app.js

Setup Instructions

1. Clone or download this repository.
2. Open the project folder in your code editor.
3. Configure a valid OpenWeatherMap API key in the required JavaScript files.
4. Open "index.html" in a web browser or use a local development server such as VS Code Live Server.
5. Enter a city name and click Get Weather to view its current weather information.

API Key Configuration

An OpenWeatherMap API key is required to retrieve city coordinates and current weather information.

Configure the API key in the following files:

- "js/geocoding.js"
- "js/weather.js"

Make sure the API key is valid and active before running the application.


Deployment
The application is deployed using GitHub Pages.

Live URL: https://malaz-mo456.github.io/WeatherMap/

The application is deployed using GitHub Pages.

Live URL: https://malaz-mo456.github.io/WeatherMap/
