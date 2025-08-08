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

// Helper function to get weather data
async function getWeatherData(city, apiKey) {
  if (apiKey === "demo") {
    return getDemoWeatherData(city);
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Helper function to get forecast data
async function getForecastData(city, apiKey) {
  if (apiKey === "demo") {
    return getDemoForecastData(city);
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Demo weather data with more variety
function getDemoWeatherData(city) {
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
      visibility: 10000,
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
      visibility: 8000,
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
      visibility: 10000,
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
      visibility: 10000,
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
      visibility: 9000,
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
      visibility: 7000,
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
      visibility: 10000,
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
      visibility: 6000,
    },
  };

  const cityData = demoData[city] || demoData["London"];

  return {
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
    visibility: cityData.visibility,
    dt: Math.floor(Date.now() / 1000),
  };
}

// Demo forecast data
function getDemoForecastData(city) {
  const forecasts = [];
  const baseTemp = getDemoWeatherData(city).main.temp;

  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    forecasts.push({
      dt: Math.floor(date.getTime() / 1000),
      main: {
        temp: baseTemp + (Math.random() - 0.5) * 10,
        humidity: 60 + Math.random() * 30,
      },
      weather: [
        {
          main: ["Clear", "Clouds", "Rain"][Math.floor(Math.random() * 3)],
          icon: ["01d", "03d", "10d"][Math.floor(Math.random() * 3)],
        },
      ],
      dt_txt: date.toISOString(),
    });
  }

  return {
    list: forecasts,
    city: { name: city },
  };
}

// Routes
app.get("/", async (req, res) => {
  try {
    const city = req.query.city || "London";
    const apiKey = process.env.OPENWEATHER_API_KEY;

    let weatherData = null;
    let error = null;

    if (apiKey && apiKey !== "demo") {
      try {
        weatherData = await getWeatherData(city, apiKey);
      } catch (apiError) {
        error =
          "Unable to fetch weather data. Please check the city name or try again later.";
        console.error("Weather API Error:", apiError.message);
      }
    } else {
      weatherData = getDemoWeatherData(city);
    }

    res.render("index", {
      weather: weatherData,
      error: error,
      city: city,
      hasApiKey: apiKey && apiKey !== "demo",
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

// Forecast route
app.get("/forecast", async (req, res) => {
  try {
    const city = req.query.city || "London";
    const apiKey = process.env.OPENWEATHER_API_KEY;

    let forecastData = null;
    let error = null;

    if (apiKey && apiKey !== "demo") {
      try {
        forecastData = await getForecastData(city, apiKey);
      } catch (apiError) {
        error =
          "Unable to fetch forecast data. Please check the city name or try again later.";
        console.error("Forecast API Error:", apiError.message);
      }
    } else {
      forecastData = getDemoForecastData(city);
    }

    res.render("forecast", {
      forecast: forecastData,
      error: error,
      city: city,
      hasApiKey: apiKey && apiKey !== "demo",
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.render("forecast", {
      forecast: null,
      error: "An unexpected error occurred. Please try again.",
      city: req.query.city || "London",
      hasApiKey: false,
    });
  }
});

// Multiple cities comparison
app.get("/compare", async (req, res) => {
  try {
    const cities = req.query.cities
      ? req.query.cities.split(",")
      : ["London", "New York", "Tokyo"];
    const apiKey = process.env.OPENWEATHER_API_KEY;

    let citiesData = [];
    let error = null;

    for (const city of cities) {
      try {
        if (apiKey && apiKey !== "demo") {
          const data = await getWeatherData(city, apiKey);
          citiesData.push(data);
        } else {
          const data = getDemoWeatherData(city);
          citiesData.push(data);
        }
      } catch (apiError) {
        console.error(`Error fetching data for ${city}:`, apiError.message);
      }
    }

    res.render("compare", {
      cities: citiesData,
      error: error,
      cityList: cities.join(","),
      hasApiKey: apiKey && apiKey !== "demo",
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.render("compare", {
      cities: [],
      error: "An unexpected error occurred. Please try again.",
      cityList: "London,New York,Tokyo",
      hasApiKey: false,
    });
  }
});

// Air quality route (demo data)
app.get("/air-quality", async (req, res) => {
  try {
    const city = req.query.city || "London";

    // Demo air quality data
    const airQualityData = {
      name: city,
      aqi: Math.floor(Math.random() * 200) + 50,
      components: {
        co: (Math.random() * 2000 + 500).toFixed(1),
        no2: (Math.random() * 50 + 10).toFixed(1),
        o3: (Math.random() * 100 + 20).toFixed(1),
        pm2_5: (Math.random() * 50 + 5).toFixed(1),
        pm10: (Math.random() * 100 + 10).toFixed(1),
      },
      dt: Math.floor(Date.now() / 1000),
    };

    res.render("air-quality", {
      airQuality: airQualityData,
      city: city,
      error: null,
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.render("air-quality", {
      airQuality: null,
      error: "An unexpected error occurred. Please try again.",
      city: req.query.city || "London",
    });
  }
});

// API endpoints
app.get("/api/weather/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === "demo") {
      return res.status(400).json({ error: "API key not configured" });
    }

    const weatherData = await getWeatherData(city, apiKey);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.get("/api/forecast/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === "demo") {
      return res.status(400).json({ error: "API key not configured" });
    }

    const forecastData = await getForecastData(city, apiKey);
    res.json(forecastData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch forecast data" });
  }
});

// Health check endpoint for AWS
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: "2.0.0",
  });
});

// Stats endpoint
app.get("/stats", (req, res) => {
  res.json({
    server: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
    },
    app: {
      version: "2.0.0",
      features: [
        "Current Weather",
        "5-Day Forecast",
        "City Comparison",
        "Air Quality",
        "API Endpoints",
      ],
      endpoints: [
        "/",
        "/forecast",
        "/compare",
        "/air-quality",
        "/api/weather/:city",
        "/api/forecast/:city",
      ],
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`New features: Forecast, Compare, Air Quality, API endpoints`);
});
