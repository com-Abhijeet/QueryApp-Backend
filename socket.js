import { Server } from "socket.io";
import { addMessage } from "./controller/chatController.js"; // Import the addMessage function

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinRoom", ({ chatId }) => {
      socket.join(chatId);
      console.log(`User joined room: ${chatId}`);
    });

    socket.on("sendMessage", async ({ chatId, senderId, message, replyId, creatorId }) => {
      // Emit the message to the room
      io.to(chatId).emit("receiveMessage", { chatId, senderId, message, replyId });

      // Save message to database using addMessage function
      try {
        const req = {
          body: {
            creatorId: creatorId,
            replyId,
            message,
          },
        };
        const res = {
          status: (statusCode) => ({
            json: (data) => console.log(`Status: ${statusCode}, Data: ${JSON.stringify(data)}`),
          }),
        };
        await addMessage(req, res);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

export default setupSocket;