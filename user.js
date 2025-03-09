const weatherForm = document.querySelector(".weatherform");
const cityInput = document.querySelector(".inputbox");
const card = document.querySelector(".displayCard");
const apiKey = "ccdd93d23188f4ddabafa2533ae60531";

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value;
  if (city) {
    try {
      card.style.display = "none"; // Hide card while loading
      showLoading(); // Show loading spinner
      const weatherData = await getWeatherData(city);
      displayWeatherInfo(weatherData);
    } catch (error) {
      console.error(error);
      displayError("Could not fetch weather data. Please try again.");
    } finally {
      hideLoading(); // Hide loading spinner
    }
  } else {
    displayError("Please enter a city");
  }
});

async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Could not fetch weather data");
  }
  return await response.json();
}

function displayWeatherInfo(data) {
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = data;
  card.textContent = "";
  card.style.display = "flex";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const emojiDisplay = document.createElement("p");

  cityDisplay.textContent = city;
  tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C / ${(
    (temp - 273.15) * (9 / 5) +
    32
  ).toFixed(1)}°F`;
  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  descDisplay.textContent = description;
  emojiDisplay.textContent = getWeatherEmoji(id);

  cityDisplay.classList.add("city");
  tempDisplay.classList.add("temp");
  humidityDisplay.classList.add("humidity");
  descDisplay.classList.add("desc");
  emojiDisplay.classList.add("emoji");

  card.appendChild(cityDisplay);
  card.appendChild(tempDisplay);
  card.appendChild(humidityDisplay);
  card.appendChild(descDisplay);
  card.appendChild(emojiDisplay);
}

function getWeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "⛈️";
    case weatherId >= 300 && weatherId < 400:
      return "🌦️";
    case weatherId >= 500 && weatherId < 600:
      return "🌧️";
    case weatherId >= 600 && weatherId < 700:
      return "❄️";
    case weatherId >= 700 && weatherId < 800:
      return "🌫️";
    case weatherId === 800:
      return "☀️";
    case weatherId >= 801 && weatherId < 810:
      return "☁️";
    default:
      return "❓";
  }
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("error");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}

function showLoading() {
  const loading = document.createElement("div");
  loading.classList.add("loading");
  loading.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Loading...`;
  card.parentNode.insertBefore(loading, card.nextSibling);
}

function hideLoading() {
  const loading = document.querySelector(".loading");
  if (loading) {
    loading.remove();
  }
}
