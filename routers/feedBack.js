const express = require('express');
const router = express.Router();
const FeedBack = require('../models/feedback');

// Create a new feedback entry
router.post('/', async(req, res) => {
    try {
        const { userName, department, contactNumber, feedBack } = req.body;
        const feedback = await FeedBack.create({ userName, department, contactNumber, feedBack });
        res.status(201).json(feedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all feedback entries
router.get('/', async(req, res) => {
    try {
        const feedbackList = await FeedBack.findAll();
        res.status(200).json(feedbackList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Get a specific feedback entry by ID
router.get('/:id', async(req, res) => {
    const feedbackId = req.params.id;
    try {
        const feedback = await FeedBack.findByPk(feedbackId);
        if (feedback) {
            res.status(200).json(feedback);
        } else {
            res.status(404).json({ error: 'Feedback not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a specific feedback entry by ID
router.put('/:id', async(req, res) => {
    const feedbackId = req.params.id;
    try {
        const feedback = await FeedBack.findByPk(feedbackId);
        if (feedback) {
            const { userName, department, contactNumber, feedBack, type } = req.body;
            await feedback.update({ userName, department, contactNumber, feedBack, type });
            res.status(200).json(feedback);
        } else {
            res.status(404).json({ error: 'Feedback not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a specific feedback entry by ID
router.delete('/:id', async(req, res) => {
    const feedbackId = req.params.id;
    try {
        const feedback = await FeedBack.findByPk(feedbackId);
        if (feedback) {
            await feedback.destroy();
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Feedback not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;