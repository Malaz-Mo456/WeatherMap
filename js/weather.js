// Fetch the current weather for a location
async function getCurrentWeather(latitude, longitude) {

    const apiKey = '6ca1cf0d417cffbc0ad43037339fb3e9';

    const url =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?lat=${latitude}` +
        `&lon=${longitude}` +      
        `&units=metric` +
        `&appid=${apiKey}`;
// wait until fetch response
    const response = await fetch(url);
    // test the type of response
     if (!response.ok) {

        if (response.status === 401) {
            throw new Error(
                'The weather API key is invalid or not active yet.'
            );
        }

        if (response.status === 404) {
            throw new Error(
                'Weather information was not found for this location.'
            );
        }

        if (response.status === 429) {
            throw new Error(
                'Too many requests. Please wait and try again.'
            );
        }

        throw new Error(
            'Unable to load weather information. Please try again.'
        );
    }
    // make the response readable for js and assigment to data value
  const data = await response.json();
// test the data 
    if (!data.main || !data.weather || data.weather.length === 0) {
        throw new Error(
            'The weather information is incomplete.'
        );
    }
// return the information of weather
    return {
        cityName: data.name,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        clouds: data.clouds.all,
        description: data.weather[0].description,
        icon: data.weather[0].icon 
    };

    
}