import "dotenv/config";
import express from "express";
import cors from "cors";

import userRouter from "./routes/user.routes.js";
import urlRouter from "./routes/url.routes.js";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://url-shortner-nu-virid.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);


app.use(express.json());

app.use("/url", urlRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  return res.json({ status: "Server is up and running 🚀" });
});

app.listen(PORT, () => {
  console.log(`✅ Server Running on port ${PORT}`);
});
