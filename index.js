import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import "dotenv/config";
import routes from "./src/routes/index.js";
import mongoose from "mongoose";
import compression from "compression";
// import connectDatabase from './src/mongo/mongoDb.js'

const app = express();

app.use(cors({
  origin: "*",
}));
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// connectDatabase()
app.use("/api/v1", routes,cors({
  origin: "*",
}));

const port = process.env.PORT || 5000;

const server = http.createServer(app);
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("db connected");
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}).catch((err) => {
  console.log({ err });
  process.exit(1);
});
