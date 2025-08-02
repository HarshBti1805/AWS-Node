require("dotenv").config();
const axios = require("axios");

console.log("Testing OpenWeatherMap API...");
console.log(
  "API Key:",
  process.env.OPENWEATHER_API_KEY ? "Found" : "Not found"
);

if (!process.env.OPENWEATHER_API_KEY) {
  console.log("❌ No API key found in .env file");
  console.log(
    "Please create a .env file with: OPENWEATHER_API_KEY=862b2828c307f68b800b95505bbe1a29"
  );
  process.exit(1);
}

const apiKey = process.env.OPENWEATHER_API_KEY;
const city = "London";
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

console.log("Testing API call to:", weatherUrl);

axios
  .get(weatherUrl)
  .then((response) => {
    console.log("✅ API call successful!");
    console.log("City:", response.data.name);
    console.log("Temperature:", response.data.main.temp + "°C");
    console.log("Weather:", response.data.weather[0].description);
  })
  .catch((error) => {
    console.log("❌ API call failed:");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Error:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
  });
