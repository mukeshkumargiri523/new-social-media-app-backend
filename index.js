import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import PostRoute from "./routes/PostRoute.js";
import UploadRoute from "./routes/UploadRoute.js";
import ChatRoute from "./routes/ChatRoute.js";
import MessageRoute from "./routes/MessageRoute.js";

import cors from "cors";

dotenv.config();
const app = express();

//to serve images to public
app.use(express.static("public"));
app.use("/images", express.static("images"));

//middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log("Listening at port " + process.env.PORT)
    );
  })
  .catch((error) => console.log(error));

//using routes
app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRoute);
app.use("/api/post", PostRoute);
app.use("/api/upload", UploadRoute);
app.use("/api/chat", ChatRoute);
app.use("/api/message", MessageRoute);
