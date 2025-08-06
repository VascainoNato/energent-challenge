import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat";
import uploadRouter from "./routes/upload";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRouter);
app.use("/api/upload", uploadRouter);

app.listen(5000, () => console.log("Backend running on port 5000"));