import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import MyAI from "openai";
import AIMessage from "../models/aimessage.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";


const token = process.env.GITHUB_PAT ;

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



const client = new MyAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: process.env.GITHUB_PAT,
});

export const handleChat = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // 1️⃣ Save the user's message in AIMessage collection
    const userMessage = new AIMessage({
      userId: req.user._id,
      text: `act as users . this is message: ${message}`,
      role: "user",
    });
    await userMessage.save();

    // 2️⃣ Retrieve previous messages to build minimal context
    const previousMessages = await AIMessage.find({ userId: req.user._id }).sort({ createdAt: 1 });

    // 3️⃣ Format previous messages for OpenAI API
    const formattedMessages = previousMessages.map((msg) => ({
      role: msg.role,
      content: msg.text,
    }));

    // 4️⃣ Add the new user message at the end (if not already included)
    formattedMessages.push({
      role: "user",
      content: message,
    });

    // 5️⃣ Call the AI API
    const response = await client.chat.completions.create({
      messages: formattedMessages,
      model: "openai/gpt-4o",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    });

    const reply = response.choices[0].message.content;

    // 6️⃣ Save the AI's reply in AIMessage collection
    const aiReply = new AIMessage({
      userId: req.user._id,
      text: reply,
      role: "assistant",
    });
    await aiReply.save();

    // 7️⃣ Send the reply back to the client
    res.json({ reply });
  } catch (err) {
    console.error("Error in handleChat:", err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};
