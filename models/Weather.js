import mongoose from 'mongoose';

const WeatherRecordSchema = new mongoose.Schema({
  location: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lon: {
        type: Number,
        required: true
      }
    }
  },
  dateRange: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  temperatures: [{
    date: {
      type: Date,
      required: true
    },
    temperature: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      trim: true,
      default: 'No description'
    },
    humidity: {
      type: Number
    },
    windSpeed: {
      type: Number
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const WeatherRecord = mongoose.model('WeatherRecord', WeatherRecordSchema);