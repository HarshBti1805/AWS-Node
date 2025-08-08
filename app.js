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

// New: Helper function to get UV index data
async function getUVIndexData(lat, lon, apiKey) {
  if (apiKey === "demo") {
    return getDemoUVIndexData();
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// New: Helper function to get weather alerts
async function getWeatherAlerts(city, apiKey) {
  if (apiKey === "demo") {
    return getDemoWeatherAlerts(city);
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?q=${city}&appid=${apiKey}&units=metric&exclude=current,minutely,hourly,daily`
    );
    return response.data.alerts || [];
  } catch (error) {
    return [];
  }
}

// New: Helper function to get air quality data
async function getAirQualityData(lat, lon, apiKey) {
  if (apiKey === "demo") {
    return getDemoAirQualityData();
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
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
      lat: 40.7128,
      lon: -74.006,
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
      lat: 51.5074,
      lon: -0.1278,
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
      lat: 35.6762,
      lon: 139.6503,
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
      lat: -33.8688,
      lon: 151.2093,
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
      lat: 48.8566,
      lon: 2.3522,
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
      lat: 19.076,
      lon: 72.8777,
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
      lat: 25.2048,
      lon: 55.2708,
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
      lat: 1.3521,
      lon: 103.8198,
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
      sunrise: Math.floor(Date.now() / 1000) - 21600, // 6 hours ago
      sunset: Math.floor(Date.now() / 1000) + 21600, // 6 hours from now
    },
    coord: {
      lat: cityData.lat,
      lon: cityData.lon,
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

// New: Demo UV index data
function getDemoUVIndexData() {
  return {
    lat: 51.5074,
    lon: -0.1278,
    date_iso: new Date().toISOString(),
    date: Math.floor(Date.now() / 1000),
    value: Math.floor(Math.random() * 10) + 1,
  };
}

// New: Demo weather alerts
function getDemoWeatherAlerts(city) {
  const alerts = [
    {
      sender_name: "Weather Service",
      event: "Heavy Rain Warning",
      start: Math.floor(Date.now() / 1000),
      end: Math.floor(Date.now() / 1000) + 3600,
      description: "Heavy rainfall expected in the next hour",
      tags: ["rain", "warning"],
    },
    {
      sender_name: "Weather Service",
      event: "Wind Advisory",
      start: Math.floor(Date.now() / 1000),
      end: Math.floor(Date.now() / 1000) + 7200,
      description: "Strong winds expected, secure loose objects",
      tags: ["wind", "advisory"],
    },
  ];

  return Math.random() > 0.5 ? alerts : [];
}

// New: Demo air quality data
function getDemoAirQualityData() {
  return {
    coord: {
      lat: 51.5074,
      lon: -0.1278,
    },
    list: [
      {
        dt: Math.floor(Date.now() / 1000),
        main: {
          aqi: Math.floor(Math.random() * 5) + 1,
        },
        components: {
          co: (Math.random() * 2000 + 500).toFixed(1),
          no2: (Math.random() * 50 + 10).toFixed(1),
          o3: (Math.random() * 100 + 20).toFixed(1),
          so2: (Math.random() * 20 + 5).toFixed(1),
          pm2_5: (Math.random() * 50 + 5).toFixed(1),
          pm10: (Math.random() * 100 + 10).toFixed(1),
        },
      },
    ],
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

// New: Weather alerts route
app.get("/alerts", async (req, res) => {
  try {
    const city = req.query.city || "London";
    const apiKey = process.env.OPENWEATHER_API_KEY;

    let alerts = [];
    let error = null;

    if (apiKey && apiKey !== "demo") {
      try {
        alerts = await getWeatherAlerts(city, apiKey);
      } catch (apiError) {
        console.error("Alerts API Error:", apiError.message);
      }
    } else {
      alerts = getDemoWeatherAlerts(city);
    }

    res.render("alerts", {
      alerts: alerts,
      city: city,
      error: error,
      hasApiKey: apiKey && apiKey !== "demo",
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.render("alerts", {
      alerts: [],
      error: "An unexpected error occurred. Please try again.",
      city: req.query.city || "London",
      hasApiKey: false,
    });
  }
});

// New: UV Index route
app.get("/uv-index", async (req, res) => {
  try {
    const city = req.query.city || "London";
    const apiKey = process.env.OPENWEATHER_API_KEY;

    let uvData = null;
    let error = null;

    if (apiKey && apiKey !== "demo") {
      try {
        const weatherData = await getWeatherData(city, apiKey);
        uvData = await getUVIndexData(
          weatherData.coord.lat,
          weatherData.coord.lon,
          apiKey
        );
      } catch (apiError) {
        error = "Unable to fetch UV index data.";
        console.error("UV Index API Error:", apiError.message);
      }
    } else {
      uvData = getDemoUVIndexData();
    }

    res.render("uv-index", {
      uvData: uvData,
      city: city,
      error: error,
      hasApiKey: apiKey && apiKey !== "demo",
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.render("uv-index", {
      uvData: null,
      error: "An unexpected error occurred. Please try again.",
      city: req.query.city || "London",
      hasApiKey: false,
    });
  }
});

// New: Weather maps route
app.get("/maps", async (req, res) => {
  try {
    const city = req.query.city || "London";
    const apiKey = process.env.OPENWEATHER_API_KEY;

    res.render("maps", {
      city: city,
      apiKey: apiKey && apiKey !== "demo" ? apiKey : null,
      hasApiKey: apiKey && apiKey !== "demo",
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.render("maps", {
      city: req.query.city || "London",
      apiKey: null,
      hasApiKey: false,
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

// New: Weather widget API endpoint
app.get("/api/widget/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    let weatherData = null;
    if (apiKey && apiKey !== "demo") {
      weatherData = await getWeatherData(city, apiKey);
    } else {
      weatherData = getDemoWeatherData(city);
    }

    // Return minimal data for widget
    res.json({
      city: weatherData.name,
      country: weatherData.sys.country,
      temp: Math.round(weatherData.main.temp),
      weather: weatherData.weather[0].main,
      icon: weatherData.weather[0].icon,
      humidity: weatherData.main.humidity,
      wind: weatherData.wind.speed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch widget data" });
  }
});

// New: UV Index API endpoint
app.get("/api/uv-index/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === "demo") {
      return res.status(400).json({ error: "API key not configured" });
    }

    const weatherData = await getWeatherData(city, apiKey);
    const uvData = await getUVIndexData(
      weatherData.coord.lat,
      weatherData.coord.lon,
      apiKey
    );
    res.json(uvData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch UV index data" });
  }
});

// New: Air Quality API endpoint
app.get("/api/air-quality/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === "demo") {
      return res.status(400).json({ error: "API key not configured" });
    }

    const weatherData = await getWeatherData(city, apiKey);
    const airQualityData = await getAirQualityData(
      weatherData.coord.lat,
      weatherData.coord.lon,
      apiKey
    );
    res.json(airQualityData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch air quality data" });
  }
});

// Health check endpoint for AWS
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: "3.0.0",
  });
});

// ALB health check endpoint
app.get("/alb-health", (req, res) => {
  res.status(200).send("OK");
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
      version: "3.0.0",
      features: [
        "Current Weather",
        "5-Day Forecast",
        "City Comparison",
        "Air Quality",
        "Weather Alerts",
        "UV Index",
        "Weather Maps",
        "Weather Widget",
        "API Endpoints",
      ],
      endpoints: [
        "/",
        "/forecast",
        "/compare",
        "/air-quality",
        "/alerts",
        "/uv-index",
        "/maps",
        "/api/weather/:city",
        "/api/forecast/:city",
        "/api/widget/:city",
        "/api/uv-index/:city",
        "/api/air-quality/:city",
      ],
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(
    `New features: Weather Alerts, UV Index, Maps, Widget API, Enhanced API endpoints`
  );
});
