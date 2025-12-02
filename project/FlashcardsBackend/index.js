import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

import cardsRoutes from './routes/cardsRoutes.js';
import decksRoutes from './routes/decksRoutes.js'; 
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/api/cards', cardsRoutes);
app.use('/api/decks', decksRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'Flashcards Backend API' });
});

const MONGODB_URI = process.env.MONGOURI || 'mongodb+srv://mosesgordon_db_user:mUiUAz8hW3uRQ9V2@cluster0.f4avlus.mongodb.net/?appName=Cluster0';

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

/*import express from 'express';

const app = express();

app.get('/', (req, res) => {
    console.log('Request received!');
    res.json({ message: 'Test server works' });
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Test server running on port ${PORT}`);
});*/

