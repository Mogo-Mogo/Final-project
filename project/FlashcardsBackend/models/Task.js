import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    dueDate: { type: Date, default: null },
    work: { type: Number, default: 0 },
    completion: { type: Number, default: 1 },
});
export const Task = mongoose.model("Task", taskSchema);