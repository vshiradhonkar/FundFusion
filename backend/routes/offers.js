import express from "express";
import {
  makeOffer,
  getOffersForStartup,
  getOffersForInvestor,
  acceptOffer,
  rejectOffer,
} from "../controllers/offerController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Offer Routes
 * Handles investor offer creation, startup offer management,
 * and retrieval for both sides.
 */

// Investor creates new offer for startup
router.post("/make", authMiddleware, (req, res, next) => {
  console.log("➡️ POST /api/offers/make");
  next();
}, makeOffer);

//offers for  specific startup(startup view)
router.get("/startup/:startupId", authMiddleware, (req, res, next) => {
  console.log("➡️ GET /api/offers/startup/" + req.params.startupId);
  next();
}, getOffersForStartup);

// all offers made by investor
router.get("/investor", authMiddleware, (req, res, next) => {
  console.log("➡️ GET /api/offers/investor");
  next();
}, getOffersForInvestor);

//Startup accepts an offer — creates a deal
router.post("/accept/:offerId", authMiddleware, (req, res, next) => {
  console.log("➡️ POST /api/offers/accept/" + req.params.offerId);
  next();
}, acceptOffer);

//Startup rejects an offer
router.post("/reject/:offerId", authMiddleware, (req, res, next) => {
  console.log("➡️ POST /api/offers/reject/" + req.params.offerId);
  next();
}, rejectOffer);

export default router;
