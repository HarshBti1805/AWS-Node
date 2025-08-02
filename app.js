const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", async (req, res) => {
  try {
    // Default city (can be changed via query parameter)
    const city = req.query.city || "London";

    // Using OpenWeatherMap API (free tier)
    const apiKey = process.env.OPENWEATHER_API_KEY || "demo"; // You'll need to get a free API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    let weatherData = null;
    let error = null;

    // Check if we should use demo mode (only if no API key or API key is invalid)
    const useDemoMode = apiKey === "demo";

    if (apiKey !== "demo" && !useDemoMode) {
      try {
        const response = await axios.get(weatherUrl);
        weatherData = response.data;
      } catch (apiError) {
        error =
          "Unable to fetch weather data. Please check the city name or try again later.";
        console.error("Weather API Error:", apiError.message);
      }
    } else {
      // Demo data for when no API key is provided
      // Generate different demo data based on city name for variety
      const demoData = {
        "New York": {
          temp: 18,
          feels_like: 20,
          humidity: 70,
          pressure: 1015,
          weather: "Clear",
          icon: "01d",
          country: "US",
          wind: 4.2,
        },
        London: {
          temp: 15,
          feels_like: 13,
          humidity: 80,
          pressure: 1010,
          weather: "Rain",
          icon: "10d",
          country: "GB",
          wind: 6.1,
        },
        Tokyo: {
          temp: 25,
          feels_like: 28,
          humidity: 65,
          pressure: 1018,
          weather: "Clouds",
          icon: "03d",
          country: "JP",
          wind: 2.8,
        },
        Sydney: {
          temp: 22,
          feels_like: 24,
          humidity: 75,
          pressure: 1012,
          weather: "Clear",
          icon: "01d",
          country: "AU",
          wind: 5.5,
        },
        Paris: {
          temp: 20,
          feels_like: 22,
          humidity: 68,
          pressure: 1016,
          weather: "Clouds",
          icon: "03d",
          country: "FR",
          wind: 3.7,
        },
        Mumbai: {
          temp: 30,
          feels_like: 35,
          humidity: 85,
          pressure: 1008,
          weather: "Clear",
          icon: "01d",
          country: "IN",
          wind: 2.1,
        },
        Dubai: {
          temp: 35,
          feels_like: 38,
          humidity: 45,
          pressure: 1010,
          weather: "Clear",
          icon: "01d",
          country: "AE",
          wind: 8.3,
        },
        Singapore: {
          temp: 28,
          feels_like: 32,
          humidity: 80,
          pressure: 1014,
          weather: "Thunderstorm",
          icon: "11d",
          country: "SG",
          wind: 4.8,
        },
      };

      const cityData = demoData[city] || demoData["London"];

      weatherData = {
        name: city,
        main: {
          temp: cityData.temp,
          feels_like: cityData.feels_like,
          humidity: cityData.humidity,
          pressure: cityData.pressure,
        },
        weather: [
          {
            main: cityData.weather,
            description: cityData.weather.toLowerCase(),
            icon: cityData.icon,
          },
        ],
        wind: {
          speed: cityData.wind,
        },
        sys: {
          country: cityData.country,
        },
      };
    }

    res.render("index", {
      weather: weatherData,
      error: error,
      city: city,
      hasApiKey: apiKey !== "demo",
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.render("index", {
      weather: null,
      error: "An unexpected error occurred. Please try again.",
      city: req.query.city || "London",
      hasApiKey: false,
    });
  }
});

// Health check endpoint for AWS
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
