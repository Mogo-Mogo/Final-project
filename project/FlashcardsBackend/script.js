import mongoose from 'mongoose';
import 'dotenv/config';
import Event from './models/Event.js';

const MONGODB_URI = process.env.MONGOURI || 'mongodb+srv://mosesgordon_db_user:mUiUAz8hW3uRQ9V2@cluster0.f4avlus.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGODB_URI).then(async () => {
    const events = await Event.find({});
    console.log(events);
    process.exit(0);
});