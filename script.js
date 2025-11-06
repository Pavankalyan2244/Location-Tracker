// Initialize Leaflet map
const map = L.map('map').setView([0, 0], 2);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Marker and accuracy circle
let marker = L.marker([0, 0]).addTo(map);
let accuracyCircle = L.circle([0, 0], { radius: 0, color: '#0078ff', fillColor: '#0078ff', fillOpacity: 0.2 }).addTo(map);

// DOM elements
const latEl = document.getElementById('lat');
const lonEl = document.getElementById('lon');
const addressEl = document.getElementById('address');

// Update position callback
function updatePosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const accuracy = position.coords.accuracy;

  latEl.textContent = lat.toFixed(6);
  lonEl.textContent = lon.toFixed(6);

  // Update marker and circle
  marker.setLatLng([lat, lon]).bindPopup("📍 You are here!").openPopup();
  accuracyCircle.setLatLng([lat, lon]);
  accuracyCircle.setRadius(accuracy);

  map.setView([lat, lon], 15);

  // Reverse geocode using Nominatim
  fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
    headers: {
      'User-Agent': 'location-tracker-demo/1.0 (youremail@example.com)'
    }
  })
    .then(res => res.json())
    .then(data => {
      addressEl.textContent = data.display_name || 'Address not found';
    })
    .catch(err => {
      console.warn('Reverse geocode failed', err);
      addressEl.textContent = 'Address not available';
    });
}

// Error handler
function handleError(err) {
  console.error('Geolocation error:', err);
  alert('Unable to fetch location. Please allow location access and try again.');
}

// Watch position
if ('geolocation' in navigator) {
  navigator.geolocation.watchPosition(updatePosition, handleError, {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  });
} else {
  alert('Geolocation not supported in your browser.');
}
