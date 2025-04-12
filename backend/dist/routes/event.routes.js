"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller"); // Make sure path is correct
const router = (0, express_1.Router)();
router.get("/", event_controller_1.getAllEvents);
router.get("/:id", event_controller_1.getEventById);
router.post("/", event_controller_1.createEvent);
router.put("/:id", event_controller_1.updateEvent); // Or PATCH if you prefer partial updates
router.delete("/:id", event_controller_1.deleteEvent);
exports.default = router;
