import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import morgan from "morgan"
import http from "http"

import connectDb from "./database/connectdb.js";
import corsMethod from "./utils/cors.js"
import authRouter from "./routes/auth-route.js";
import deviceRouter from "./routes/device-route.js"
import sockets from "./sockets/index.js";
import { deviceHeartbeats } from "./middlewares/check-device.js";

const app = express();
const server = http.createServer(app);

app.use(morgan("dev"))

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/device", deviceRouter)

await connectDb()

sockets(server)

function checkDeviceDisconnections() {
  const now = Date.now();
  deviceHeartbeats.forEach((timestamp, deviceId) => {
    const timeSinceLastHeartbeat = now - timestamp;
    if (timeSinceLastHeartbeat > 3000) {
      // Handle disconnection of the device with deviceId
      console.log(`Device ${deviceId} disconnected.`);
      deviceHeartbeats.delete(deviceId); // Remove the disconnected device
    }
  });
}

setInterval(checkDeviceDisconnections, 5000);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log("🍉🍉🍉 http://localhost:" + PORT));