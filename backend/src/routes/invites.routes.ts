import { Router } from "express";
import {
  getAllInvites,
  getInviteById,
  createInvite,
  updateInvite,
  deleteInvite,
} from "../controllers/invites.controller"; // Make sure path is correct
import { requireAuth } from "@clerk/express";

const router = Router();

router.get("/", requireAuth(), getAllInvites);
router.get("/:id", requireAuth(), getInviteById);
router.post("/", requireAuth(), createInvite);
router.put("/:id", requireAuth(), updateInvite); // Or PATCH if you prefer partial updates
router.delete("/:id", requireAuth(), deleteInvite);

export default router;
