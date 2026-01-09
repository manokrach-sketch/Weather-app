const apiKey = 'c953b54a53f05b8ef08807e79606f8fc'; // Get from openweathermap.org
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherInfo = document.getElementById('weatherInfo');
const error = document.getElementById('error');

const cityNameEl = document.getElementById('cityName');
const countryEl = document.getElementById('country');
const temperatureEl = document.getElementById('temperature');
const descriptionEl = document.getElementById('description');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const weatherIconEl = document.getElementById('weatherIcon');

searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') getWeather();
});

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  try {
    // First get city coordinates (free geocoding API)
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
    const geoData = await geoResponse.json();
    
    if (!geoData.results?.[0]) {
      showError('City not found');
      return;
    }

    const { latitude, longitude } = geoData.results[0];

    // Fetch weather
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius&timezone=Africa%2FKampala&forecast_days=1`
    );
    const weatherData = await weatherResponse.json();

    const current = weatherData.current_weather;

    // Update UI
    cityNameEl.textContent = city;
    countryEl.textContent = 'UG'; // Simplified
    temperatureEl.textContent = Math.round(current.temperature);
    descriptionEl.textContent = getWeatherDescription(current.weathercode);
    windEl.textContent = (current.windspeed).toFixed(1);
    weatherIconEl.src = `https://openweathermap.org/img/wn/${weatherCodeToIcon(current.weathercode)}@2x.png`;

    weatherInfo.classList.remove('hidden');
    error.classList.add('hidden');
  } catch (err) {
    showError('Network error. Check connection.');
  }
}

// Helper functions
function getWeatherDescription(code) {
  const descriptions = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 95: 'Thunderstorm'
  };
  return descriptions[code] || 'Unknown';
}

function weatherCodeToIcon(code) {
  if (code >= 0 && code <= 2) return '01d';
  if (code === 3) return '02d';
  if (code >= 45 && code <= 48) return '50d';
  if (code >= 51 && code <= 55) return '09d';
  if (code >= 61 && code <= 65) return '10d';
  if (code >= 71 && code <= 77) return '13d';
  if (code >= 80 && code <= 86) return '09d';
  return '01d';
}


function showError(message) {
  error.textContent = message;
  error.classList.remove('hidden');
  weatherInfo.classList.add('hidden');
}

// Load Gulu weather on start
cityInput.value = 'Gulu';
getWeather();
