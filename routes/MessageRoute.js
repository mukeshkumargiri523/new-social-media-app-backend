import express from "express";
import { addMessage, getMessages } from "../controller/MessageController.js";

const router = express.Router();

router.post("/", addMessage);
router.get("/:chatId", getMessages);

export default router;
