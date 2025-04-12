"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEventById = exports.getAllEvents = void 0;
const event_model_1 = __importDefault(require("../models/event.model")); // Import the Mongoose model
// Get all events
const getAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield event_model_1.default.find();
        res.status(200).json(events);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching events", error });
    }
});
exports.getAllEvents = getAllEvents;
// Get a single event by ID
const getEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield event_model_1.default.findById(req.params.id);
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        res.status(200).json(event);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching event", error });
    }
});
exports.getEventById = getEventById;
// Create a new event
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Basic validation example (consider using a validation library like Joi or Zod)
        const { title, date, description } = req.body;
        if (!title || !date) {
            res
                .status(400)
                .json({ message: "Missing required fields: title and date" });
            return;
        }
        const newEvent = new event_model_1.default({
            title,
            date,
            description,
        });
        const savedEvent = yield newEvent.save();
        res.status(201).json(savedEvent);
    }
    catch (error) {
        // Handle potential validation errors from Mongoose
        if (error instanceof Error && error.name === "ValidationError") {
            res
                .status(400)
                .json({ message: "Validation Error", errors: error.errors });
        }
        else {
            res.status(500).json({ message: "Error creating event", error });
        }
    }
});
exports.createEvent = createEvent;
// Update an event by ID
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedEvent = yield event_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true } // Return the updated document and run schema validators
        );
        if (!updatedEvent) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        res.status(200).json(updatedEvent);
    }
    catch (error) {
        // Handle potential validation errors from Mongoose
        if (error instanceof Error && error.name === "ValidationError") {
            res
                .status(400)
                .json({ message: "Validation Error", errors: error.errors });
        }
        else {
            res.status(500).json({ message: "Error updating event", error });
        }
    }
});
exports.updateEvent = updateEvent;
// Delete an event by ID
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedEvent = yield event_model_1.default.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        // Send No Content status or a confirmation message
        res.status(204).send();
        // Or: res.status(200).json({ message: 'Event deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting event", error });
    }
});
exports.deleteEvent = deleteEvent;
