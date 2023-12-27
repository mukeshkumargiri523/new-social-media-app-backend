import express from "express";
import {
  createChat,
  findChat,
  getUserChat,
} from "../controller/ChatController.js";

const router = express.Router();

router.post("/", createChat);
router.get("/:userId", getUserChat);
router.get("/find/:firstId/:secondId", findChat);

export default router;
