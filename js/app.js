// 1. Get HTML Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const statusMessage = document.getElementById('status-message');
const favoritesList = document.getElementById('favorites-list');

// 2. Store Current Data
let currentMarker = null;
let currentCity = null;
let currentWeather = null;

// Load saved cities
let favoriteCities = [];

try {
    favoriteCities = JSON.parse(
        localStorage.getItem('weatherMapFavorites')
    ) || [];
} catch (error) {
    favoriteCities = [];
}


// 3. Show Messages
function showStatus(message, type = '') {
    statusMessage.className = 'status-card';
    statusMessage.textContent = message;

    if (type) {
        statusMessage.classList.add('status-' + type);
    }
}

function showLoading() {
    statusMessage.className = 'status-card status-loading';

    statusMessage.innerHTML = `
        <span class="loading-spinner"></span>
        <span>Loading weather information...</span>
    `;
}


// 4. Create Weather Report
function createWeatherMessage(city, weather) {
    return `Weather in ${city.name}, ${city.country}
Temperature: ${weather.temperature}°C
Conditions: ${weather.description}
Humidity: ${weather.humidity}%
Clouds: ${weather.clouds}%
Wind speed: ${weather.windSpeed} m/s

Shared from WeatherMap`;
}


// 5. Display Weather Popup
function createWeatherPopup(city, weather) {
    currentCity = city;
    currentWeather = weather;

    const iconURL =
        `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

    const saved = favoriteCities.some(function (favorite) {
        return favorite.name === city.name &&
               favorite.country === city.country;
    });

    return `
        <div class="weather-popup">
            <h3>${city.name}</h3>
            <p class="weather-country">${city.country}</p>

            <div class="weather-main">
                <img class="weather-icon"
                     src="${iconURL}"
                     alt="${weather.description}">

                <div>
                    <div class="weather-temperature">
                        ${weather.temperature.toFixed(1)}°C
                    </div>

                    <p class="weather-description">
                        ${weather.description}
                    </p>
                </div>
            </div>

            <div class="weather-details">
                <div class="weather-detail">
                    <span>Humidity</span>
                    <span>${weather.humidity}%</span>
                </div>

                <div class="weather-detail">
                    <span>Clouds</span>
                    <span>${weather.clouds}%</span>
                </div>

                <div class="weather-detail">
                    <span>Wind speed</span>
                    <span>${weather.windSpeed} m/s</span>
                </div>
            </div>

            <div class="popup-actions">
                <button class="popup-button"
                        data-action="copy-weather">
                    Copy Report
                </button>

                <button class="popup-button facebook-button"
                        data-action="facebook-weather">
                    Share on Facebook
                </button>

                <button class="popup-button favorite-button"
                        id="favorite-weather"
                        data-action="favorite-weather"
                        aria-pressed="${saved}">
                    ${saved ? '♥ Saved' : '♡ Favorite'}
                </button>

                <button class="popup-button"
                        data-action="native-share-weather">
                    Share More
                </button>
            </div>
        </div>
    `;
}


// 6. Search for a City
async function searchWeather(cityName) {
    cityName = cityName.trim();

    if (!cityName) {
        showStatus('Please enter a city name.', 'error');
        return;
    }

    searchButton.disabled = true;
    showLoading();

    try {
        // Get city coordinates
        const city = await getCityCoordinates(cityName);

        // Get current weather
        const weather = await getCurrentWeather(
            city.latitude,
            city.longitude
        );

        currentCity = city;
        currentWeather = weather;

        // Move the map
        map.flyTo(
            [city.latitude, city.longitude],
            10,
            { animate: true, duration: 1.5 }
        );

        // Remove the old marker
        if (currentMarker) {
            map.removeLayer(currentMarker);
        }

        // Add a new marker and popup
        currentMarker = L.marker([
            city.latitude,
            city.longitude
        ]).addTo(map);

        currentMarker
            .bindPopup(createWeatherPopup(city, weather), {
                maxWidth: 300
            })
            .openPopup();

        showStatus(
            `Weather loaded successfully for ${city.name}, ${city.country}.`,
            'success'
        );

    } catch (error) {
        console.error(error);

        showStatus(
            error.message || 'Something went wrong. Please try again.',
            'error'
        );

    } finally {
        searchButton.disabled = false;
    }
}


// 7. Search Form
searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    searchWeather(cityInput.value);
});


// 8. Save and Display Favorites
function saveFavorites() {
    localStorage.setItem(
        'weatherMapFavorites',
        JSON.stringify(favoriteCities)
    );
}

function renderFavorites() {
    favoritesList.replaceChildren();

    if (favoriteCities.length === 0) {
        const message = document.createElement('p');

        message.className = 'empty-favorites';
        message.textContent =
            'No favorite cities yet. Add one from the weather popup.';

        favoritesList.appendChild(message);
        return;
    }

    favoriteCities.forEach(function (city, index) {
        const container = document.createElement('div');
        container.className = 'favorite-city';

        const cityButton = document.createElement('button');
        cityButton.type = 'button';
        cityButton.className = 'favorite-city-name';
        cityButton.textContent = `${city.name}, ${city.country}`;
        cityButton.dataset.action = 'open-favorite';
        cityButton.dataset.index = index;

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'remove-favorite';
        removeButton.textContent = '×';
        removeButton.dataset.action = 'remove-favorite';
        removeButton.dataset.index = index;

        container.append(cityButton, removeButton);
        favoritesList.appendChild(container);
    });
}

function toggleFavorite(city) {
    const index = favoriteCities.findIndex(function (favorite) {
        return favorite.name.toLowerCase() === city.name.toLowerCase() &&
               favorite.country.toLowerCase() === city.country.toLowerCase();
    });

    if (index !== -1) {
        favoriteCities.splice(index, 1);
    } else {
        favoriteCities.push({
            name: city.name,
            country: city.country,
            latitude: city.latitude,
            longitude: city.longitude
        });
    }

    try {
        saveFavorites();
        renderFavorites();
        updateFavoriteButton();
    } catch (error) {
        showStatus('Unable to save favorites.', 'error');
    }
}

function updateFavoriteButton() {
    const button = document.getElementById('favorite-weather');

    if (!button || !currentCity) {
        return;
    }

    const saved = favoriteCities.some(function (city) {
        return city.name.toLowerCase() === currentCity.name.toLowerCase() &&
               city.country.toLowerCase() === currentCity.country.toLowerCase();
    });

    button.textContent = saved ? '♥ Saved' : '♡ Favorite';
    button.setAttribute('aria-pressed', String(saved));
    button.classList.toggle('is-favorite', saved);
}


// 9. Copy Weather Report
async function copyWeatherReport() {
    if (!currentCity || !currentWeather) {
        showStatus('Search for a city first.', 'error');
        return;
    }

    const message = createWeatherMessage(currentCity, currentWeather);

    try {
        await navigator.clipboard.writeText(message);
        showStatus('Weather report copied!', 'success');
    } catch (error) {
        showStatus(
            'Unable to copy. Try running the project on localhost or HTTPS.',
            'error'
        );
    }
}


// 10. Share on Facebook
function shareWeatherOnFacebook() {
    if (!currentCity || !currentWeather) {
        showStatus('Search for a city first.', 'error');
        return;
    }

    const message = createWeatherMessage(currentCity, currentWeather);

    const url =
        'https://www.facebook.com/sharer/sharer.php' +
        `?u=${encodeURIComponent(window.location.href)}` +
        `&quote=${encodeURIComponent(message)}`;

    window.open(url, '_blank', 'noopener,noreferrer');
}


// 11. Share Using the Device
async function shareWeather() {
    if (!currentCity || !currentWeather) {
        showStatus('Search for a city first.', 'error');
        return;
    }

    const message = createWeatherMessage(currentCity, currentWeather);

    if (navigator.share) {
        try {
            await navigator.share({
                title: `Weather in ${currentCity.name}`,
                text: message,
                url: window.location.href
            });
        } catch (error) {
            if (error.name !== 'AbortError') {
                showStatus('Unable to share the weather report.', 'error');
            }
        }
    } else {
        await copyWeatherReport();
    }
}


// 12. Handle Popup and Favorites Buttons
document.addEventListener('click', async function (event) {
    const button = event.target.closest('[data-action]');

    if (!button) {
        return;
    }

    const action = button.dataset.action;
    const index = Number(button.dataset.index);

    if (action === 'copy-weather') {
        await copyWeatherReport();
    }

    else if (action === 'facebook-weather') {
        shareWeatherOnFacebook();
    }

    else if (action === 'favorite-weather' && currentCity) {
        toggleFavorite(currentCity);
    }

    else if (action === 'native-share-weather') {
        await shareWeather();
    }

    else if (action === 'open-favorite' && favoriteCities[index]) {
        cityInput.value = favoriteCities[index].name;
        await searchWeather(favoriteCities[index].name);
    }

    else if (action === 'remove-favorite' && favoriteCities[index]) {
        favoriteCities.splice(index, 1);
        saveFavorites();
        renderFavorites();
        updateFavoriteButton();
    }
});


// 13. Show Saved Favorites
renderFavorites();