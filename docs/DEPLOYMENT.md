# Deployment Guide

This guide explains how to deploy the API Dolar Argentina on an Ubuntu server using PM2.

## Prerequisites

- Node.js (v14 or higher)
- npm or bun
- PM2 (install globally with `npm install -g pm2` or `bun install -g pm2`)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/api-dolar-argentina.git
   cd api-dolar-argentina
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Create the logs directory:
   ```bash
   mkdir logs
   ```

## Running with PM2

### Starting the API

To start the API as a daemon with PM2:

```bash
pm2 start ecosystem.config.js
```

Or use the npm script:

```bash
npm run pm2:start
```

### Managing the API

PM2 provides several commands to manage your application:

- **Check status**:
  ```bash
  pm2 status api-dolar-argentina
  # or
  npm run pm2:status
  ```

- **View logs**:
  ```bash
  pm2 logs api-dolar-argentina
  # or
  npm run pm2:logs
  ```

- **Restart the API**:
  ```bash
  pm2 restart api-dolar-argentina
  # or
  npm run pm2:restart
  ```

- **Stop the API**:
  ```bash
  pm2 stop api-dolar-argentina
  # or
  npm run pm2:stop
  ```

- **Delete from PM2**:
  ```bash
  pm2 delete api-dolar-argentina
  # or
  npm run pm2:delete
  ```

### Setting up PM2 to start on system boot

To ensure your API starts automatically when the server reboots:

```bash
pm2 startup
```

Follow the instructions provided by the command. Then save the current PM2 process list:

```bash
pm2 save
```

## Configuration

The API runs on port 8080 by default. You can change this by:

1. Modifying the PORT in the `.env` file
2. Updating the PORT in the `ecosystem.config.js` file

## Nginx Configuration (Optional)

If you want to use Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save this to `/etc/nginx/sites-available/api-dolar-argentina` and create a symbolic link:

```bash
sudo ln -s /etc/nginx/sites-available/api-dolar-argentina /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL with Let's Encrypt (Optional)

To secure your API with HTTPS:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Follow the prompts to complete the SSL setup. 