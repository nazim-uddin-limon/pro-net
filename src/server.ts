import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app/app.js";
import { connectDB } from "./config/database.js";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pronet";

const startServer = async () => {
  try {
    await connectDB(MONGODB_URI);
    
    const httpServer = http.createServer(app);
    
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
