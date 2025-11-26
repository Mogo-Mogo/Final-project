import mongoose from 'mongoose’;
import 'dotenv/config';
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Mongo connection error:', err));