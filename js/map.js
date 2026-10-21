// Default map coordinates: Khartoum, Sudan
const defaultLatitude = 15.5007;
const defaultLongitude = 32.5599;
const defaultZoom = 6;

// Initialize the map
const map = L.map('map').setView(
    [defaultLatitude, defaultLongitude],
    defaultZoom
);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);