# Weather_App Backend
## Author : Andrei Villanueva
## AI/ML Application Tech Assessment

This is a Weather Backend that allows users to create, read, update, and delete weather records. It's built with Node.js, Express, and MongoDB.

## Features

- Create weather records with location, date range, and temperature data
- Retrieve all weather records or a specific record by ID
- Update existing weather records
- Delete weather records
- Data validation using Joi
- Location validation using OpenWeatherMap API
- MongoDB for data persistence

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm
- MongoDB (local installation or a cloud-hosted instance)
      - MONGODB_URI (in the `.env` file)
- API key for OpenWeatherMap
      - OPENWEATHERMAP_API_KEY (in the `.env` file)

 

## Getting Started

To get the frontend running locally:

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies using npm install
4. Create a `.env` file in the root directory and add the following environment variables:
    - MONGODB_URI
    - OPENWEATHERMAP_API_KEY

