import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app/app.js";

const httpServer = http.createServer(app);

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
