// Get the coordinates of a city
async function getCityCoordinates(cityName) {
    const apiKey = '6ca1cf0d417cffbc0ad43037339fb3e9';

    const url =` https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to get city coordinates.');
    }

    const data = await response.json();

    if (data.length === 0) {
        throw new Error('City not found. Please try another city.');
    }

    return {
        latitude: data[0].lat,
        longitude: data[0].lon,
        name: data[0].name,
        country: data[0].country
    };
}