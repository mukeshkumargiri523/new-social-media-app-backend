import express from "express";
import {
  createPost,
  deletePost,
  // getNameOfPost,
  getPost,
  getTimelinePosts,
  likePost,
  updatePost,
} from "../controller/PostController.js";

const router = express.Router();

router.post("/", createPost);
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.put("/like/:id", likePost);
router.get("/timeline/:id", getTimelinePosts);
//router.get("/getpostname/:id", getNameOfPost);

export default router;
