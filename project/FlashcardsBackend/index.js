import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

import cardsRoutes from './routes/cardsRoutes.js';
import decksRoutes from './routes/decksRoutes.js'; 
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/cards', cardsRoutes);
app.use('/api/decks', decksRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Flashcards Backend API' });
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flashcards';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET /api/cards');
    console.log('  GET /api/decks');
});

