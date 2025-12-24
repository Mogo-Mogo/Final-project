import mongoose from 'mongoose';
import { Task } from '../models/Task.js';

export const createTask = async (req, res) => {
    try {
        const { title, dueDate, work } = req.body;
        const task = await Task.create({ title: title, dueDate: dueDate, work: work });
        return res.status(201).json(task);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getLongTasks = async (req, res) => {
    try {
        const now = new Date();
        //I'm not super familar with complicated MongoDB queries
        //but this is the correct way to do what I'm trying to do
        const tasks = await Task.aggregate([
            { $match: { work: { $gte: 1 } } },
            {
                $addFields: {
                    timeLeft: {
                        //anything due in the next (or last) 24 hours is the top priority
                        $cond: [
                            { $lte: [{ $abs: { $subtract: ["$dueDate", now] } }, 85000000] },
                            1,
                            { $subtract: ["$dueDate", now] }
                        ]
                    },
                    workLeft: { $multiply: ["$work", "$completion"] }
                }
            },
            {
                $addFields: {
                    priority: {
                        $abs: { $divide: ["$workLeft", "$timeLeft"] }
                        //Long-overdue assignments will be deprioritized compared to 
                        //more recent ones and homework that is due soon. This is intentional.
                    }
                }
            },
            { $sort: { priority: -1 } },
            { $project: { timeLeft: 0, workLeft: 0, priority: 0 } }
        ]);
        return res.status(200).json(tasks);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getShortTasks = async (req, res) => {
    try {
        //this one's much simpler thankfully
        const tasks = await Task.aggregate([
            { $match: { work: 0 } },
            { $sort: { dueDate: 1 } },
        ]);
        return res.status(200).json(tasks);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid task id' });
        }

        const updated = await Task.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Task not found' });
        }

        return res.status(200).json(updated);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid task id' });
        }

        const deleted = await Task.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Task not found' });
        }

        return res.status(200).json({ message: 'Task deleted', id: deleted._id });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};