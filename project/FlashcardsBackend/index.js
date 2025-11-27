import mongoose from 'mongoose';
import 'dotenv/config';
import express from 'express';
import notesRoutes from './routes/notes.js';
async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://mosesgordon_db_user:mUiUAz8hW3uRQ9V2@cluster0.f4avlus.mongodb.net/?appName=Cluster0");
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Mongo connection error:', err);
    }
}
connectDB()

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: String,
    createdAt: { type: Date, default: Date.now }
});
const Note = mongoose.model('Note', noteSchema);

const getNotes = async (req, res) => {
    const notes = await Note.find();
    res.json(notes);
};
const addNote = async (req, res) => {
    try {
        const note = new Note(req.body);
        await note.save();
        res.status(201).json(note);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


/*const app = express();
// Listen for GET requests to "/"
app.get('/', (req, res) => {
    res.send('Welcome to the homepage!');
});
// Listen for GET requests to "/about"
app.get('/about', (req, res) => {
    res.send('About page');
});
// Listen for POST requests to "/submit"
app.post('/register', (req, res) => {
    res.send('Form submitted successfully!');
});*/

const app = express();
app.use(express.json());           
app.use(logger);                   
app.use('/notes', notesRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Welcome to the homepage!');
});

function logger(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next(); // pass control to the next middleware or route
}

