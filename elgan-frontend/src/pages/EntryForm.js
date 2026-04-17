const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const auth = require('../middleware/authMiddleware'); // Protecting the route

// POST: Save a new waste manifest
router.post('/', auth, async (req, res) => {
    try {
        const { volume, wasteType } = req.body;

        // Business Logic: Automatic Revenue Calculation
        // You can refine these rates later
        const rates = { sludge: 150, plastic: 40, food: 30, bilge: 100 };
        const unitRate = rates[wasteType.toLowerCase()] || 20;
        const amountMade = volume * unitRate;

        const newEntry = new Entry({
            ...req.body,
            amountMade,
            submittedBy: req.user.id // Link entry to the officer who typed it
        });

        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during entry submission');
    }
});

module.exports = router;import axios from 'axios';

// Inside your EntryForm component:
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const token = localStorage.getItem('elgan_token'); // Retrieve the digital pass
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token // Send token so backend knows who you are
    }
  };

  try {
    await axios.post('http://localhost:5000/api/entries', formData, config);
    alert("Manifest Digitized Successfully!");
    navigate('/fleet'); // Go back to the log view
  } catch (err) {
    alert("Submission Failed. Check if you are still logged in.");
  }
};