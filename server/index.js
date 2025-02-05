import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = 3003;
const DB_USER = "sidoroffstas";
const DB_PASSWORD = "roDdsQjbf9LMv6fw";

import tricksRouter from "./routes/Trick.js";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.use("/api/tricks", tricksRouter);

async function start() {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.8k6gr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`);
    });
  } catch (error) {
    console.log("error", error);
  }
}
start();
