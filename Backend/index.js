import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import authRouter from "./route/authRoute.js";
import cors from "cors";
import userRoute from "./route/userRoute.js";
import courseRoute from "./route/courseRoute.js"
import paymentRouter from "./route/paymentRoute.js"
import reviewRouter from "./route/reviewRoute.js"


dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("/api/auth", authRouter);
app.use("/api/user", userRoute);
app.use("/api/course", courseRoute);
app.use("/api/order", paymentRouter);
app.use("/api/review", reviewRouter);


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});