import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import {
  createWeatherRecord,
  getWeatherRecords,
  getWeatherRecordbyId,
  updateWeatherRecord,
  deleteWeatherRecord
} from './controllers/weatherController.js';
import { 
  validateRecordId,
  validateWeatherRecord, 
  validateLocation 
} from './middleware/validation.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// simple cors configuration (not for production)
const corsOptions = {
  origin: '*', 
  methods: '*',  
  allowedHeaders: '*',  
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Database Connection 
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/weathertracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);  // Exit process on connection failure
});

app.post('/api/weather', 
  validateWeatherRecord, 
  validateLocation, 
  createWeatherRecord
);
app.get('/api/weather', getWeatherRecords);
app.get('/api/weather/:id', validateRecordId, getWeatherRecordbyId);
app.put('/api/weather/:id', 

  updateWeatherRecord
);
app.delete('/api/weather/:id', deleteWeatherRecord);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    details: err.message
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Graceful shutdown  
process.on('SIGINT', () => {
  console.log('Shutting down server');
  server.close(() => {
    console.log('Server has been shut down');
    process.exit(0);
  });
});
