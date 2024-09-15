import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDatabase from "./src/database/database";
import router from "./src/routes/index";

const app = express();

connectDatabase();
app.use(cors());
app.use(express.json());
app.use(router);

export default app;