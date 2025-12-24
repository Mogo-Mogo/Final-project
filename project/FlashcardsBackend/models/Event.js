import mongoose from "mongoose";
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    weekly: { type: Boolean, default: false },
    plan: { type: Boolean, default: false },
    person: { type: String, default: "" },
    location: { type: String, default: "" },
});
export const Event = mongoose.model("Event", eventSchema);
export default Event;