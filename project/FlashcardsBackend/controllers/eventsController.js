import mongoose from 'mongoose';
import { Event } from '../models/Event.js';

export const createEvent = async (req, res) => {
    try {
        const { title, start, end, weekly, plan, person, location } = req.body;
        const event = await Event.create({ title: title, start: start, end: end, weekly: weekly, plan: plan, person: person, location: location });
        return res.status(201).json(event);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ start: 1 });
        return res.status(200).json(events);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid event id' });
        }
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        return res.status(200).json(event);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid event id' });
        }
        const event = await Event.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        return res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getPlanEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ start: 1 });
        const planEvents = events.filter(event => event.plan);
        return res.status(200).json(planEvents);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getUserEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ start: 1 });
        const planEvents = events.filter(event => !event.plan);
        return res.status(200).json(planEvents);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const deletePlanEvents = async (req, res) => {
    try {
        const events = await Event.find({ plan: true });
        /*if (events.length === 0) {
                    return res.status(404).json({ error: 'No plan events found' });
                }*/
        await Event.deleteMany({ plan: true });
        return res.status(200).json({ message: 'Plan events deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};