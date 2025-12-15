import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import followRoutes from "./routes/followRoute.js";
import postRoutes from "./routes/postRoute.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();
import authRoutes from "./routes/authRoute.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/follow", followRoutes);


app.use("/api/users", userRoutes);




app.listen(process.env.PORT || 5000, () =>
  console.log("Server running on port", process.env.PORT || 5000)
);
