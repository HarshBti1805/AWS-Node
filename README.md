# Weather Dashboard - Express.js App

A beautiful, responsive weather dashboard built with Express.js, EJS templating, and the OpenWeatherMap API. Perfect for deployment on AWS EC2.

## Features

### 🌤️ Core Weather Features

- **Real-time weather data** from OpenWeatherMap API
- **5-day weather forecast** with detailed predictions
- **Multiple cities comparison** side-by-side
- **Air quality index** with detailed metrics
- **Search any city worldwide** with instant results

### 🎨 User Interface

- **Fully responsive design** for all devices
- **Modern, beautiful UI** with smooth animations
- **Interactive navigation** between different features
- **Glass-morphism effects** and gradient backgrounds
- **Real-time clock** and dynamic weather icons

### 📊 Data & Analytics

- **Detailed weather metrics** (temperature, humidity, wind, pressure, visibility)
- **Air quality components** (CO, NO₂, O₃, PM2.5, PM10)
- **Weather comparison tools** with summary statistics
- **Historical data visualization** (forecast trends)

### 🔧 Technical Features

- **RESTful API endpoints** for external integrations
- **Health monitoring** and system statistics
- **Automatic deployment** with CI/CD pipeline
- **Error handling** and graceful fallbacks
- **Demo mode** for testing without API keys

### 🚀 Deployment & Infrastructure

- **AWS EC2 ready** with optimized configuration
- **PM2 process management** for production stability
- **Nginx reverse proxy** for performance
- **SSL certificate support** for HTTPS
- **Auto-scaling capabilities** for high traffic

## Screenshots

The app features a modern gradient background with a clean, card-based layout displaying:

- Current temperature with weather icon
- City and country information
- Detailed weather metrics
- Interactive search functionality
- Responsive design for all devices

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key (free)

## Installation

1. **Clone or navigate to the project directory:**

   ```bash
   cd AWS-Node
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp env.example .env
   ```

   Edit the `.env` file and add your OpenWeatherMap API key:

   ```
   OPENWEATHER_API_KEY=your_actual_api_key_here
   PORT=3000
   ```

4. **Get a free OpenWeatherMap API key:**
   - Visit [OpenWeatherMap API](https://openweathermap.org/api)
   - Sign up for a free account
   - Get your API key from the dashboard
   - Add it to your `.env` file

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Web Pages

- `GET /` - Main weather dashboard page
- `GET /forecast` - 5-day weather forecast page
- `GET /compare` - Multiple cities comparison page
- `GET /air-quality` - Air quality index page

### REST API

- `GET /api/weather/:city` - Get weather data for a specific city (JSON)
- `GET /api/forecast/:city` - Get forecast data for a specific city (JSON)
- `GET /health` - Health check endpoint (useful for AWS load balancers)
- `GET /stats` - System statistics and application information

### Query Parameters

- `?city=London` - Specify city for weather/forecast/air-quality
- `?cities=London,New York,Tokyo` - Specify multiple cities for comparison

## Project Structure

```
AWS-Node/
├── app.js                 # Main Express application
├── package.json           # Dependencies and scripts
├── env.example           # Environment variables template
├── views/
│   └── index.ejs         # Main EJS template
├── public/
│   ├── css/
│   │   └── style.css     # Styles and responsive design
│   └── js/
│       └── script.js     # Client-side interactions
└── README.md             # This file
```

## AWS EC2 Deployment

### 1. Launch an EC2 Instance

- Choose Amazon Linux 2 or Ubuntu
- Select t2.micro (free tier) or larger
- Configure security group to allow HTTP (port 80) and HTTPS (port 443)

### 2. Connect to Your Instance

```bash
ssh -i your-key.pem ec2-user@your-instance-ip
```

### 3. Install Node.js and npm

**For Amazon Linux 2:**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 16
nvm use 16
```

**For Ubuntu:**

```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 4. Clone and Setup the Application

```bash
# Clone your repository or upload files
git clone your-repo-url
cd AWS-Node

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
nano .env  # Add your API key
```

### 5. Install PM2 (Process Manager)

```bash
npm install -g pm2
```

### 6. Start the Application

```bash
# Start the application with PM2
pm2 start app.js --name "weather-dashboard"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 7. Configure Nginx (Optional but Recommended)

```bash
# Install Nginx
sudo yum install nginx -y  # Amazon Linux 2
# or
sudo apt-get install nginx -y  # Ubuntu

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/weather-dashboard
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # or your EC2 public IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/weather-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Setup SSL with Let's Encrypt (Optional)

```bash
# Install Certbot
sudo yum install certbot python3-certbot-nginx -y  # Amazon Linux 2
# or
sudo apt-get install certbot python3-certbot-nginx -y  # Ubuntu

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## Environment Variables

| Variable              | Description                 | Required | Default |
| --------------------- | --------------------------- | -------- | ------- |
| `OPENWEATHER_API_KEY` | Your OpenWeatherMap API key | Yes      | None    |
| `PORT`                | Port for the application    | No       | 3000    |

## API Usage

The application uses the OpenWeatherMap Current Weather Data API:

- **Endpoint**: `https://api.openweathermap.org/data/2.5/weather`
- **Parameters**: `q` (city name), `appid` (API key), `units=metric`
- **Rate Limit**: 60 calls/minute for free tier

## Troubleshooting

### Common Issues

1. **API Key Not Working**

   - Ensure your API key is correct
   - Check if you've exceeded the free tier limit
   - Verify the API key is properly set in `.env`

2. **Port Already in Use**

   - Change the PORT in `.env` file
   - Or kill the process using the port: `lsof -ti:3000 | xargs kill -9`

3. **PM2 Issues**
   - Check logs: `pm2 logs weather-dashboard`
   - Restart: `pm2 restart weather-dashboard`
   - Delete and recreate: `pm2 delete weather-dashboard && pm2 start app.js --name "weather-dashboard"`

### Health Check

The application includes a health check endpoint at `/health` that returns:

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

- Check the troubleshooting section
- Review the OpenWeatherMap API documentation
- Create an issue in the repository

---

**Happy Weather Tracking! 🌤️**
