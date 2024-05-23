const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Get all Movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json(error);
    }
})

// Get a Movie by ID
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if(!movie) {
            return res.status(404).json("Movie not found!");
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json(error);
    }
})

// Create New Movie
router.post("/", async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json(error);
    }
})

// Update a Movie by ID
router.put('/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        if (!movie) {
            return res.status(404).json("Movie Not Found!");
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json(error);
    }
})

// Delete a Movie by ID
router.delete('/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if(!movie) {
            return res.status(404).json("Movie Not Found!")
        }
        res.status(204).json("Movie Deleted Successfully!")
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;