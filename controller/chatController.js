import Chat from "../model/chatModel.js";

export const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { chatCreatorId, chatReplyId } = req.body;
    let chat;
    console.log("chat find request received");
    console.log("chatId:", chatId);
    console.log("chatCreatorId:", chatCreatorId);
    console.log("chatReplyId:", chatReplyId);

    if (chatId && chatId !== "undefined") {
      chat = await Chat.findById(chatId).populate("messages.senderId", "name");
      console.log("chat found by chat ID:", chat);
    }

    if (!chat) {
      chat = await Chat.findOne({
        $or: [
          { creatorId: chatCreatorId, replyId: chatReplyId },
          { creatorId: chatReplyId, replyId: chatCreatorId },
        ],
      }).populate("messages.senderId", "name");
      console.log("chat found by creator and reply ID:", chat);
    }

    if (!chat) {
      console.log("chatNotFound");
      return res.status(404).json({ message: "Chat not found." });
    }

    console.log(chat);
    res.status(200).json(chat);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Error fetching chats", error });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({
      $or: [{ creatorId: userId }, { replyId: userId }],
    })
      .populate("creatorId", "name")
      .populate("replyId", "name")
      .populate("messages.senderId", "name");
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user chats", error });
  }
};

export const addMessage = async (req, res) => {
  try {
    const { creatorId, replyId, message } = req.body;
    console.log("Received message:", message);
    console.log("Received creatorId:", creatorId);
    console.log("Received replyId:", replyId);
    let chat = await Chat.findOne({
      $or: [
        { creatorId, replyId },
        { creatorId: replyId, replyId: creatorId },
      ],
    });

    if (chat) {
      console.log("Adding message to existing chat");
      chat.messages.push(message);
      await chat.save();
    } else {
      console.log("Creating new chat");
      chat = await Chat.create({ creatorId, replyId, messages: [message] });
    }
    console.log("Message added successfully");
    res.status(201).json({ message: "Message added successfully", chatId: chat._id });
  } catch (error) {
    res.status(500).json({ message: "Error adding message", error });
    console.log(error);
  }
};