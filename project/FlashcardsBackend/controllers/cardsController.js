import mongoose from 'mongoose';
import { Card } from '../models/Card.js';

export const  createCard = async (req, res) => {
    try {
        const { deckId } = req.params.deckId;
        if (!mongoose.Types.ObjectId.isValid(deckId)) {
            return res.status(400).json({ error: 'Invalid deck id' });
        }
        const card = await Card.create({ deckId: deckId, question: req.body.question, answer: req.body.answer });
        return res.status(201).json(card);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


export const getAllCards = async (req, res) => {
    try {
        const cards = await Card.find().sort({ createdAt: -1 });
        return res.status(200).json(cards);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


export const getCardById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid card id' });
        }

        const card = await Card.findById(id);
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        return res.status(200).json(card);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getCardsByDeck = async (req, res) => {
    try {
        const { deckId } = req.params.deckId;
        if (!mongoose.Types.ObjectId.isValid(deckId)) {
            return res.status(400).json({ error: 'Invalid deck id' });
        }

        const cards = await Card.find({ deckId: deckId }).sort({ createdAt: -1 });
        return res.status(200).json(cards);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const updateCard = async (req, res) => {
    try {
        const { id } = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid card id' });
        }

        const updated = await Card.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Card not found' });
        }

        return res.status(200).json(updated);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const favoriteCard = async (req, res) => {
    try {
        const { id } = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid card id' });
        }
        if (!Card.findById(id).isFavorite) {
        const updated = await Card.findByIdAndUpdate(
            id,
            { $set: { isFavorite: true } },
            { new: true }
        );

        }

        if (!updated) {
            return res.status(404).json({ error: 'Card not found' });
        }

        return res.status(200).json(updated);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid card id' });
        }

        const deleted = await Card.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Card not found' });
        }

        return res.status(200).json({ message: 'Card deleted', id: deleted._id });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};