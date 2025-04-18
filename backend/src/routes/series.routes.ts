import { Router } from "express";
import {
  getAllSeriesByMember,
  getSeriesById,
  createSeries,
  updateSeries,
  deleteSeries,
} from "../controllers/series.controller"; // Make sure path is correct
import { requireAuth } from "@clerk/express";

const router = Router();

router.get("/", requireAuth(), getAllSeriesByMember);
router.get("/:id", requireAuth(), getSeriesById);
router.post("/", requireAuth(), createSeries);
router.put("/:id", requireAuth(), updateSeries); // Or PATCH if you prefer partial updates
router.delete("/:id", requireAuth(), deleteSeries);

export default router;
