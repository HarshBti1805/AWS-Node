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

    // Temporarily use demo mode until API key is activated
    const useDemoMode = true; // Set to false when API key is ready

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
      weatherData = {
        name: city,
        main: {
          temp: 22,
          feels_like: 24,
          humidity: 65,
          pressure: 1013,
        },
        weather: [
          {
            main: "Clouds",
            description: "scattered clouds",
            icon: "03d",
          },
        ],
        wind: {
          speed: 3.5,
        },
        sys: {
          country: "GB",
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
