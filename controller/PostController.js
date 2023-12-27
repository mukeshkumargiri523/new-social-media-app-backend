import PostModel from "../model/PostModel.js";
import UserModel from "../model/UserModel.js";
import mongoose from "mongoose";

//Create new Post

export const createPost = async (req, res) => {
  const newPost = new PostModel(req.body);
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get a post
export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    let post = await PostModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update a post
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  try {
    let post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("post updated success");
    } else {
      res.status(403).json("Not authorized to update");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//delete a post
export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("post deleted success");
    } else {
      res.status(403).json("Not authorized to delete");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//like/dislike a post
export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(id);
    if (post.likes.includes(userId)) {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post disliked");
    } else {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post liked");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get timeline post

export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const currentUserPosts = await PostModel.find({ userId: userId });
    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json(
      currentUserPosts
        .concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
          return b.createdAt - a.createdAt;
        })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const getNameOfPost = async (req, res) => {
//   const userId = req.params.id;
//   try {
//     const currentUser = await UserModel.find({
//       _id: new mongoose.Types.ObjectId(userId),
//     });
//     const namePost = await UserModel.aggregate([
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId(userId),
//         },
//       },
//       {
//         $lookup: {
//           from: "posts",
//           localField: "following",
//           foreignField: "userId",
//           as: "users",
//         },
//       },
//       {
//         $project: {
//           users: 1,
//           _id: 0,
//         },
//       },
//     ]);
//     res.status(200).json(currentUser.concat(namePost));
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
