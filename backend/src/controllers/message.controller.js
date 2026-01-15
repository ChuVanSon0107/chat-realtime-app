import { Message } from '../models/message.model.js';
import { io } from '../lib/socket.js';

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const userId = req.user.id;
    const file = req.file;

    let imageURL = null;
    if (file) {
      imageURL = `/uploads/${file.filename}`;
    }

    if (!content && !imageURL) {
      return res.status(400).json({ message: "Không có nội dung" });
    }

    const message = await Message.create({ conversationId, senderId: userId, content, image: imageURL });

    // socket.io => realtime
    io.to(conversationId.toString()).emit("new-message", message);
    return res.status(200).json(message);
  } catch (error) {
    console.error("❌ Lỗi trong sendMessage controller:", error);
    return  res.status(500).json({ message: "Lỗi server!" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cursor } = req.query;
    const { conversationId } = req.params;
    const limit = Number(req.query.limit) || 50;

    let messages;
    if (!cursor) {
      messages = await Message.getMessagesFirst({ conversationId, limit });
    } else {
      messages = await Message.getMessagesWithCursor({ conversationId, limit, cursor });
    }

    messages = messages.reverse();

    return res.json({
      messages,
      nextCursor: messages.length ? messages[0].id : null,
      hasMore: messages.length === limit ? true : false 
    });

  } catch (error) {
    console.error("❌ Lỗi trong getMessages controller:", error);
    return  res.status(500).json({ message: "Lỗi server!" });
  }
};
