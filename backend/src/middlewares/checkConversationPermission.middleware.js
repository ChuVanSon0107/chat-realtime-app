import { Conversation } from '../models/conversation.model.js';

export const checkConversationPermission = async (req, res, next) => {
  try {
    const conversationId = req.body?.conversationId || req.params?.conversationId;
    const userId = req.user.id;

    if (!conversationId) {
      return res.status(400).json({ message: "Không có thông tin cuộc hội thoại" });
    }

    const isAllowed = await Conversation.isMember({ conversationId, userId });

    if (!isAllowed) {
      return res.status(401).json({ message: "Không có quyền gửi tin nhắn" });
    }

    next();
  } catch (error) {
    console.error("❌ checkConversationPermission middleware:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
}