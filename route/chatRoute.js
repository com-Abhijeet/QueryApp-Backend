import express from "express";
import { getChat, addMessage, getUserChats } from "../controller/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/:chatId", getChat);
chatRouter.post("/", addMessage);
chatRouter.get("/user/:userId", getUserChats); // Add the route for getUserChats

export default chatRouter;