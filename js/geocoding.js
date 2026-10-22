// Convert a city name into geographic coordinates
async function getCityCoordinates(cityName) {

    const apiKey = '6ca1cf0d417cffbc0ad43037339fb3e9';

    const url =
        `https://api.openweathermap.org/geo/1.0/direct` +
        `?q=${encodeURIComponent(cityName)}` +
        `&limit=1` +
        `&appid=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error(
                'The API key is invalid or not active yet.'
            );
        }

        throw new Error(
            'Unable to find the city. Please try again later.'
        );
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error(
            'City not found. Please check the spelling and try again.'
        );
    }

    return {
        latitude: data[0].lat,
        longitude: data[0].lon,
        name: data[0].name,
        country: data[0].country
    };
}