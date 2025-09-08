# URL Shortener

A simple and efficient URL Shortener web application that converts long URLs into short, shareable links. Built with Node.js, Express, MongoDB, and React, it also tracks usage analytics (click count, creation date, etc.).
# Features

- Shorten long URLs into unique short links

- Redirect to the original URL when short link is accessed

- Click tracking and analytics (number of visits, timestamps)

- REST API for programmatic access

- Clean and responsive frontend

- Error handling for invalid/expired URLs

# Tech Stack

- Backend: Node.js, Express.js

- Database: postgreSQL(drizzle ORM)

- Other: Docker, dotenv, cors

 #Project Structure
url-shortener/
│── backend/         # Express + MongoDB API
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── server.js
│── docker-compose.yml
│── README.md

# Getting Started
### 1. Clone repo
git clone https://github.com/your-username/url-shortener.git
cd url-shortener

### 2. Setup backend
cd backend
npm install
cp .env.example .env
npm start

### 3. Setup frontend
cd frontend
npm install
npm start

### 4. Run with Docker
docker-compose up --build

# Future Improvements

- User authentication & personal dashboards

- Expiry dates for short links

- Custom short URLs (vanity links)

- QR code generation
