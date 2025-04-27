
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import helmet from "helmet";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import router from "./routes/api.js"
import { MAX_JSON_SIZE, URL_ENCODED, WEB_CACHE, REQUEST_LIMIT_NUMBER, REQUEST_LIMIT_TIME } from "./app/config/config.js"
import { config } from 'dotenv';
config();
import path from "path";
const app = express();

// Global Application Middleware
app.use(
    cors({
        origin: "http://localhost:5173", 
        credentials: true, 
    })
);
app.use(express.json({ limit: MAX_JSON_SIZE }));
app.use(express.urlencoded({ extended: URL_ENCODED }));
app.use(hpp())
app.use(helmet())
app.use(cookieParser())




// Rate Limiter
const limiter = rateLimit({ windowMs: REQUEST_LIMIT_TIME, max: REQUEST_LIMIT_NUMBER })
app.use(limiter)




// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { autoIndex: true }).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log("Error connecting to MongoDB",err.message);
})


// Set API Routes
app.use("/api/v1", router)


if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    app.get("*",(req,res)=>{
      res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    });
}

// Run Your Express Back End Project
app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`);
})
