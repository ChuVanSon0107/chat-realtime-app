import { Conversation } from '../models/conversation.model.js';
import { Message } from '../models/message.model.js';

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content, image } = req.body;
    const userId = req.user.id;

    if (!conversationId) {
      return res.status(400).json({ message: "Không có thông tin hội thoại" });
    }

    if (!content && !image) {
      return res.status(400).json({ message: "Không có nội dung" });
    }

    // Kiểm tra có quyền được nhắn hay không
    const isAllowed = await Conversation.isMember({ conversationId, userId});

    if (!isAllowed) {
      return res.status(401).json({ message: "Không có quyền gửi tin nhắn" });
    }

    const message = await Message.create({ conversationId, senderId: userId, content, image });

    return res.status(200).json({ messageId: message.id });
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

    if (!conversationId) {
      return res.status(400).json({ message: "Không có thông tin cuộc hội thoại" });
    }

    // Kiểm tra thành viên
    const isAllowed = await Conversation.isMember({ conversationId, userId });
    if (!isAllowed) {
      return res.status(401).json({ message: "Không có quyền gửi tin nhắn" });
    }

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
