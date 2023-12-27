import UserModel from "../model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//get All Users
export const getAllUsers = async (req, res) => {
  try {
    let users = await UserModel.find();
    users = users.map((user) => {
      const { password, ...restDetails } = user._doc;
      return restDetails;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get user

export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);

    if (user) {
      const { password, ...restDetails } = user._doc;
      res.status(200).json(restDetails);
    } else {
      res.status(404).json("no user exists");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update user

export const updateUser = async (req, res) => {
  const id = req.params.id;

  const { _id, userAdminStatus, password } = req.body;
  if (id === _id || userAdminStatus) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }

      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({ user, token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(403).json("Access Denied you are not authorized to update");
  }
};

//delete user

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { _id, userAdminStatus } = req.body;

  if (_id === id || userAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("user deleted successfully");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(403).json("Access Denied you are not authorized to delete");
  }
};

//follow user

export const followUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  if (_id === id) {
    res.status(403).json("Sorry You can't follow yourself");
  } else {
    try {
      const followerUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);
      if (!followerUser.followers.includes(_id)) {
        await followerUser.updateOne({
          $push: { followers: _id },
        });

        await followingUser.updateOne({
          $push: { following: id },
        });
        res.status(200).json("user Followed success");
      } else {
        res.status(403).json("User is already followed by you");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

//unfollow user

export const unFollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  if (_id === id) {
    res.status(403).json("Sorry You can't unfollow yourself");
  } else {
    try {
      const followerUser = await UserModel.findById(id);
      let followingUser = await UserModel.findById(_id);

      if (followerUser.followers.includes(_id)) {
        await followerUser.updateOne({ $pull: { followers: _id } });
        await followingUser.updateOne({
          $pull: { following: id },
        });

        res.status(200).json("user unfollowed success");
      } else {
        res.status(403).json("User is not followed by you");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
