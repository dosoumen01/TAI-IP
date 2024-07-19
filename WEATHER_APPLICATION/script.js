const apiKey = '8f7db3ffe043a0bf89f9fc65ca4d140b';

document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landing-page');
    const weatherPage = document.getElementById('weather-page');
    const cityForm = document.getElementById('city-form');
    const cityInput = document.getElementById('city-input');
    const locationBtn = document.getElementById('location-btn');
    const backBtn = document.getElementById('back-btn');
    const loadingIndicator = document.createElement('p');
    loadingIndicator.textContent = 'Loading...';
    loadingIndicator.style.display = 'none';
    weatherPage.appendChild(loadingIndicator);

    cityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherByCity(city);
        }
    });

    locationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoordinates(latitude, longitude);
            }, error => {
                console.error('Geolocation error:', error);
                alert('Unable to retrieve your location. Please try again.');
            });
        } else {
            console.error('Geolocation not supported');
            alert('Geolocation not supported by your browser.');
        }
    });

    backBtn.addEventListener('click', () => {
        showPage(landingPage);
    });

    function fetchWeatherByCity(city) {
        toggleLoadingIndicator(true);
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                updateUI(data);
                showPage(weatherPage);
            })
            .catch(error => console.error('Error fetching weather data:', error))
            .finally(() => toggleLoadingIndicator(false));
    }

    function fetchWeatherByCoordinates(lat, lon) {
        toggleLoadingIndicator(true);
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                updateUI(data);
                showPage(weatherPage);
            })
            .catch(error => console.error('Error fetching weather data:', error))
            .finally(() => toggleLoadingIndicator(false));
    }

    function updateUI(data) {
        document.querySelector('.location-name').textContent = data.name;
        document.querySelector('.temperature').textContent = `${Math.round(data.main.temp)}°C`;
        document.querySelector('.weather-condition').textContent = data.weather[0].description;
        document.querySelector('.feels-like-temp').textContent = `${Math.round(data.main.feels_like)}°C`;
        document.querySelector('.humidity-level').textContent = `${data.main.humidity}%`;

        const currentDate = new Date();
        document.querySelector('.current-date').textContent = currentDate.toDateString();
        document.querySelector('.weather-description i').textContent = getWeatherIcon(data.weather[0].main);
    }

    function showPage(page) {
        landingPage.classList.add('hidden');
        weatherPage.classList.add('hidden');
        page.classList.remove('hidden');
        page.classList.add('active');
    }

    function toggleLoadingIndicator(show) {
        loadingIndicator.style.display = show ? 'block' : 'none';
    }

    function getWeatherIcon(weather) {
        const iconMapping = {
            'Clear': 'wb_sunny',
            'Clouds': 'wb_cloudy',
            'Rain': 'umbrella',
            'Thunderstorm': 'flash_on',
            'Drizzle': 'grain',
            'Snow': 'ac_unit',
            'Mist': 'cloud',
            'Smoke': 'cloud',
            'Haze': 'cloud',
            'Fog': 'cloud',
        };
        return iconMapping[weather] || 'help';
    }

    showPage(landingPage);
});
