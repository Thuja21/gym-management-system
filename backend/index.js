import express from "express";
const app = express();
import authRoutes from "./routes/auth.js";
import membersRoutes from "./routes/member.js";
import trainersRoutes from "./routes/trainer.js";
import equipmentsRoutes from "./routes/equipment.js";
import supplementsRoutes from "./routes/supplement.js";
import plansRoutes from "./routes/plan.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { db } from "./config/connectDatabase.js";
import cron from "node-cron";

//middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5174",
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/trainers" , trainersRoutes);
app.use("/api/equipments", equipmentsRoutes);
app.use("/api/supplements", supplementsRoutes);
app.use("/api/plans", plansRoutes);



//listen port
app.listen(8800, () => {
  console.log("API working!!!");
});


