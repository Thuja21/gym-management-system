import express from "express";
const app = express();
import authRoutes from "./routes/auth.js";
import membersRoutes from "./routes/member.js";
import trainersRoutes from "./routes/trainer.js";
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
    origin: "http://localhost:5173",
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/trainers" , trainersRoutes);

// cron.schedule("0 0 * * *", async () => {
//     try {
//       const query = `
//       UPDATE users
//       SET status = 'expired'
//       WHERE DATE_ADD(plan_start_date, INTERVAL plan_duration MONTH) < CURDATE()
//         AND status = 'active';
//     `;
//         await db.query(query); // Execute the query
//         console.log("Cron job executed: Plan statuses updated successfully.");
//     } catch (error) {
//         console.error("Cron job error:", error.message);
//     }
// });

//listen port
app.listen(8800, () => {
  console.log("API working!!!");
});
