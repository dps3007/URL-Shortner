import "dotenv/config";
import express from "express";
import cors from "cors";

import userRouter from "./routes/user.routes.js";
import urlRouter from "./routes/url.routes.js";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(
  cors({
    origin: "https://url-shortner-frontend-five-psi.vercel.app",
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
