const mongoose = require('mongoose');
const Card = require('../models/deckModel');

/**
 * Create a new deck.
 * Expects { title } in req.body. Decks only have a title and createdAt.
 */
const createDeck = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const deck = await Deck.create({ title: title.trim() });
        return res.status(201).json(deck);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

/**
 * Get all decks.
 */
const getAllDecks = async (req, res) => {
    try {
        const decks = await Deck.find().sort({ createdAt: -1 });
        return res.status(200).json(decks);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

/**
 * Get a single deck by id.
 */
const getDeckById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid deck id' });
        }

        const deck = await Deck.findById(id);
        if (!deck) {
            return res.status(404).json({ error: 'Deck not found' });
        }

        return res.status(200).json(deck);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

/**
 * Delete a deck by id.
 */
const deleteDeck = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid deck id' });
        }

        const deleted = await Deck.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Deck not found' });
        }

        return res.status(200).json({ message: 'Deck deleted', id: deleted._id });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createDeck,
    getAllDecks,
    getDeckById,
    deleteDeck,
};