
import mongoose from 'mongoose';
import 'dotenv/config';
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Mongo connection error:', err);
    }
}
connectDB();

// GET /notes – list all notes
app.get('/notes', async (req, res) => {
const notes = await Note.find();
res.json(notes);
});
// POST /notes – create a new note
app.post('/notes', async (req, res) => {
try {
const note = new Note(req.body);
await note.save();
res.status(201).json(note);
} catch (err) {
res.status(400).json({ error: err.message });
}
});