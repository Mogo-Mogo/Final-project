import mongoose from "mongoose";
const cardSchema = new mongoose.Schema({
    deckId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    