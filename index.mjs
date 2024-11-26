import express from "express";
import bodyParser from "body-parser";
import http from "http";
import chatRouter from "./route/chatRoute.js";
import userRouter from "./route/userRoute.js" 
import queryRouter from"./route/queryRoute.js";
import setupSocket from "./socket.js"; // Import the socket setup
import databaseConfig from "./configs/databaseConfig.js"

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
databaseConfig();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));


app.use(express.json());
app.use("/api/chat", chatRouter); 
app.use("/api/user", userRouter); 
app.use("/api/query", queryRouter); 

// Set up Socket.IO
setupSocket(server);

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});