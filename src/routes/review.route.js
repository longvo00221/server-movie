import express from "express";
import { body } from "express-validator";
import reviewController from "../controllers/review.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import requestHandler from "../handlers/request.handler.js";
import { rateLimit } from 'express-rate-limit'
const router = express.Router({ mergeParams: true });

router.get(
  "/",
  tokenMiddleware.auth,
  reviewController.getReviewsOfUser
);

router.post(
  "/",
  tokenMiddleware.auth,
  rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 100, 
    message: "Too many accounts created from this IP, please try again after an hour"
  }),
  body("mediaId")
    .exists().withMessage("mediaId is required")
    .isLength({ min: 1 }).withMessage("mediaId can not be empty"),
  body("content")
    .exists().withMessage("content is required")
    .isLength({ min: 1 }).withMessage("content can not be empty"),
  body("mediaType")
    .exists().withMessage("mediaType is required")
    .custom(type => ["movie", "tv"].includes(type)).withMessage("mediaType invalid"),
  body("mediaTitle")
    .exists().withMessage("mediaTitle is required"),
  body("mediaPoster")
    .exists().withMessage("mediaPoster is required"),
  requestHandler.validate,
  reviewController.create
);

router.delete(
  "/:reviewId",
  tokenMiddleware.auth,
  reviewController.remove
);

export default router;