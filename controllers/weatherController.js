import { WeatherRecord } from '../models/Weather.js';
import dotenv from 'dotenv';
dotenv.config();

export const createWeatherRecord = async (req, res) => {
  try {
    const { location, dateRange, temperatures } = req.body;
    
    if (!temperatures || !Array.isArray(temperatures) || temperatures.length === 0) {
      return res.status(400).json({ 
        error: 'Temperatures data is required',
        details: 'Please provide an array of temperature records'
      });
    }

    const newRecord = new WeatherRecord({
      location,
      dateRange,
      temperatures: temperatures.map(temp => ({
        date: new Date(temp.date),
        temperature: temp.temperature,
        description: temp.description || 'No description',
        humidity: temp.humidity,
        windSpeed: temp.windSpeed
      }))
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error creating weather record:', error);
    res.status(500).json({ 
      error: 'Failed to create weather record', 
      details: error.message 
    });
  }
};

export const getWeatherRecords = async (req, res) => {
  try {
    const records = await WeatherRecord.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWeatherRecordbyId = async (req, res) => {
  try {
    const record = await WeatherRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updateWeatherRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { location, dateRange, temperatures } = req.body;

    if (!temperatures || !Array.isArray(temperatures) || temperatures.length === 0) {
      return res.status(400).json({ 
        error: 'Temperatures data is required',
        details: 'Please provide an array of temperature records'
      });
    }

    const record = await WeatherRecord.findById(id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    record.location = location;
    record.dateRange = dateRange;
    record.temperatures = temperatures.map(temp => ({
      date: new Date(temp.date),
      temperature: temp.temperature,
      description: temp.description || 'No description',
      humidity: temp.humidity,
      windSpeed: temp.windSpeed
    }));

    await record.save();
    res.json(record);
  } catch (error) {
    console.error('Error updating weather record:', error);
    res.status(500).json({ 
      error: 'Failed to update weather record', 
      details: error.message 
    });
  }
};
export const deleteWeatherRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await WeatherRecord.findByIdAndDelete(id);
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
