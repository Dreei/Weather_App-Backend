import Joi from 'joi';
import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const validateWeatherRecord = (req, res, next) => {
  const schema = Joi.object({
    location: Joi.object({
      name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
          'string.min': 'Location name must be at least 2 characters long',
          'string.max': 'Location name cannot exceed 100 characters',
          'any.required': 'Location name is required'
        }),
      coordinates: Joi.object({
        lat: Joi.number()
          .min(-90)
          .max(90)
          .required()
          .messages({
            'number.min': 'Latitude must be between -90 and 90',
            'number.max': 'Latitude must be between -90 and 90',
            'any.required': 'Latitude is required'
          }),
        lon: Joi.number()
          .min(-180)
          .max(180)
          .required()
          .messages({
            'number.min': 'Longitude must be between -180 and 180',
            'number.max': 'Longitude must be between -180 and 180',
            'any.required': 'Longitude is required'
          })
      }).required()
    }).required(),
    dateRange: Joi.object({
      startDate: Joi.date()
        .max('now')
        .required()
        .messages({
          'date.max': 'Start date cannot be in the future',
          'any.required': 'Start date is required'
        }),
      endDate: Joi.date()
        .min(Joi.ref('startDate'))
        .max(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
        .required()
        .messages({
          'date.min': 'End date must be after start date',
          'date.max': 'Date range cannot exceed 7 days',
          'any.required': 'End date is required'
        })
    }).required(),
    temperatures: Joi.array()
      .items(
        Joi.object({
          date: Joi.date()
            .required()
            .messages({ 'any.required': 'Date is required for each temperature record' }),
          temperature: Joi.number()
            .required()
            .messages({ 'any.required': 'Temperature is required for each record' }),
          description: Joi.string()
            .trim()
            .default('No description')
            .messages({ 'string.empty': 'Description must be a string' }),
          humidity: Joi.number()
            .optional(),
          windSpeed: Joi.number()
            .optional()
        })
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'At least one temperature record is required',
        'any.required': 'Temperatures array is required'
      })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    console.error('Validation Error:', error.details[0].message);
    return res.status(400).json({
      error: 'Validation Failed',
      details: error.details[0].message
    });
  }

  next();
};

export const validateRecordId = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: 'Invalid record ID',
      details: 'Provided ID is not a valid MongoDB ObjectId'
    });
  }

  try {
    const record = await mongoose.model('WeatherRecord').findById(id);
    if (!record) {
      return res.status(404).json({
        error: 'Record Not Found',
        details: 'No weather record exists with the given ID'
      });
    }
    next();
  } catch (error) {
    console.error('ID Validation Error:', error);
    res.status(500).json({
      error: 'Server Error',
      details: 'Error validating record ID'
    });
  }
};

export const validateLocation = async (req, res, next) => {
  try {
    const { lat, lon } = req.body.location.coordinates;
    const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon,
        appid: process.env.OPENWEATHERMAP_API_KEY,
        units: 'metric'
      }
    });

    if (weatherResponse.status !== 200) {
      return res.status(404).json({
        error: 'Invalid Location',
        details: 'Unable to fetch weather data for the specified coordinates'
      });
    }

    next();
  } catch (error) {
    console.error('Location Validation Error:', error);
    res.status(500).json({
      error: 'Location Validation Failed',
      details: error.message
    });
  }
};
