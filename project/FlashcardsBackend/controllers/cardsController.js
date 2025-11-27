import mongoose from 'mongoose';
import { Card } from '../models/Card.js';

export const  createCard = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const card = await Card.create({ title: title.trim() });
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

const deleteCard = async (req, res) => {
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

module.exports = {
    createCard,
    getAllCards,
    getCardById,
    deleteCard,
};