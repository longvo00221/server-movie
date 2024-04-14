import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import "dotenv/config";
import routes from "./src/routes/index.js";
import mongoose from "mongoose";
import compression from "compression";
import bodyParser from "body-parser";
import helmet from "helmet";

const app = express();
const fe_url = process.env.CLIENT_URL
// middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/v1", routes);
app.get("/",(req,res)=>{
  res.send("run")
})
const port = process.env.PORT || 5000;

const server = http.createServer(app);
try {
  mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("db connected");
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  });
} catch (error) {
  console.log({ err });
  process.exit(1);
}
