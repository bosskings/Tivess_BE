import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import usersRouter from "./routes/users.js";
import adminRouter from "./routes/admin.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/users", usersRouter); // users routes
app.use("/api/v1/admin", adminRouter); // admin routes

app.get("/", (req, res) => {
  res.send("Hello World");
});

// connect to database
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to database");
  app.listen(3500, () => {
    console.log(`Server is running on port 3500`);
  });
}).catch((err) => {
  console.log(err);
});
