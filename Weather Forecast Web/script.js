const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "124339b53996d7e1e8adbbd4a1696ff7";

const iconMap = {
    "01d": "sunny.png", // clear sky day
    "01n": "sunny.png", // clear sky night, can choose a night version if available
    "02d": "cloudy.png", // few clouds day
    "02n": "clouds.png", // few clouds night
    "03d": "cloudy.png", // scattered clouds day
    "03n": "clouds.png", // scattered clouds night
    "04d": "cloudy.png", // broken clouds day
    "04n": "clouds.png", // broken clouds night
    "09d": "rainy.png", // shower rain day
    "09n": "rainy.png", // shower rain night
    "10d": "rainy.png", // rain day
    "10n": "rainy.png", // rain night
    "11d": "rainy.png", // thunderstorm day
    "11n": "rainy.png", // thunderstorm night
    "13d": "snow.png", // snow day
    "13n": "snow.png", // snow night
    "50d": "cloudy.png", // mist day
    "50n": "cloudy.png"  // mist night
};


const createWeatherCard = (cityName, weatherItem, index) => {
    const iconCode = weatherItem.weather[0].icon;
    const weatherIconURL = `/image/${iconMap[iconCode]}`;
    if(index === 0) {
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp - 273).toFixed(0)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} km/h</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                    <h4>Visibility: ${weatherItem.visibility / 1000} km</h4>
                    <h4>Pressure: ${weatherItem.main.pressure} mb</h4>
                </div>
                <div class="icon">
                    <img  src="${weatherIconURL}" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    }else {
        return `<li class="card text-white">
                    <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
                    <img  src="${weatherIconURL}" alt="weather-icon">
                    <h4>Temp: ${(weatherItem.main.temp - 273).toFixed(0)}°C</h4>
                    <h4>Wind: ${(weatherItem.wind.speed).toFixed(1)} km/h</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </li>`;
    }        
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        // Filter the forecasts to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        // Clearing previous weather data
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        // Create weather cards and add them to the DOM
        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });
    }).catch(() => {
        alert("An error occured while fetching the weather forecast!") 
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); // Get user entered city name and remove extra spaces
    if(!cityName) return;
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
    // Get entered city coordinates (latitude, longtitude and name) from the API response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);

        // Display Google Map
        displayGoogleMap(lat, lon);
    }).catch(() => {
        alert("An error occured while fetching the coordinates!") 
    });
}

// Function to display Google Map
const displayGoogleMap = (latitude, longitude) => {
    const mapContainer = document.getElementById('map-container');
    mapContainer.innerHTML = `<iframe src="https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed" width="400" height="250" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
};

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const {latitude, longitude} = position.coords; // Get coordinates of user location
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            
            // Get city name from coordinates using reverse geocoding API
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                if(!data.length) return alert(`No coordinates found for ${cityName}`);
                const { name, lat, lon } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occured while fetching the city!") 
            });
        },
        error => {
            if(error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.")
            }
        }
    )
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());