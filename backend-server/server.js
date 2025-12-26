import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import followRoutes from "./routes/followRoute.js";
import postRoutes from "./routes/postRoute.js";
import userRoutes from "./routes/userRoute.js";
import likeRoutes from "./routes/likeRoute.js";
import commentRoutes from "./routes/commentRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import chatRoutes from "./routes/chatRoute.js";
dotenv.config();
import authRoutes from "./routes/authRoute.js";
import { initSocket } from "./socket.js";
// PORT=5000
// JWT_SECRET=supersecretkey
// DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
// EMAIL_USER=vivawallet@gmail.com
// EMAIL_PASS=crxi lctp dbef xyfd
//FRONTEND_URL=http://localhost:3000/
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

app.use("/api/likes", likeRoutes);

app.use("/api/admin", adminRoutes);


app.use("/api/comments", commentRoutes);

app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
const server = http.createServer(app);

initSocket(server);

server.listen(process.env.PORT || 5000, () =>
  console.log("Server running on port", process.env.PORT || 5000)
);
