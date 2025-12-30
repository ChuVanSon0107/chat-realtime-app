import { Conversation } from "../models/conversation.model.js";
import { Friendship } from "../models/friendship.model.js";
import { io, onlineUsers } from '../lib/socket.js';

export const createConversation = async (req, res) => {
  try {
    const { memberIds, name, type } = req.body;
    const userId = req.user.id;

    if (!type) {
      return res.status(400).json({ message: "Không có loại nhóm" });
    } 

    if (type === "group" && !name) {
      return res.status(400).json({ message: "Không có tên nhóm" });
    }

    if (!Array.isArray(memberIds) || memberIds.length < 1) {
      return res.status(400).json({ message: "Không có danh sách thành viên" });
    }

    if (type === "personal" && memberIds.length > 1) {
      return res.status(400).json({ message: "Chat cá nhân chỉ có chat với 1 người" });
    }

    // Kiểm tra bạn bè
    for (const memberId of memberIds) {
      let user1Id = userId;
      let user2Id = memberId;

      if (user1Id > user2Id) {
        [user1Id, user2Id] = [user2Id, user1Id];
      }

      const isFriend = await Friendship.checkFriendship({ user1Id, user2Id });
      
      if (!isFriend) {
        if (type === "personal") {
          return res.status(400).json({ message: "Bạn chỉ có thể nhắn tin với bạn bè" });
        } 

        if (type === "group") {
          return res.status(400).json({ message: "Bạn chỉ có thể thêm bạn bè vào nhóm" });
        }
      }
    }

    // Nhắn tin cá nhân
    if (type === "personal") {
      let user1Id = userId;
      let user2Id = memberIds[0];

      if (user1Id > user2Id) {
        [user1Id, user2Id] = [user2Id, user1Id];
      }

      const alreadyConversation = await Conversation.findPersonalConversation({ user1Id, user2Id });

      if (alreadyConversation) {
        return res.status(200).json({ message: "Bạn đã nhắn tin với người đó trước rồi", conversationId: alreadyConversation });
      }

      // Tạo hội thoại
      const conversation = await Conversation.create({ name: "", type: "personal", creatorId: userId });
      const conversationId = conversation.id;

      // Thêm thành viên
      await Conversation.insertConversationMember({ conversationId, userId, role: "member" });
      await Conversation.insertConversationMember({ conversationId, userId: memberIds[0], role: "member" });

      // Lấy conversation vừa tạo
      const newConversation = await Conversation.getNewConversation({ conversationId });

      // socket.io => realtime
      for (const memberId of [...memberIds, userId]) {
        const socketId = onlineUsers.get(memberId);
        if (socketId) {
          io.to(socketId).emit("new-conversation", newConversation);
        }
      }

      return res.status(200).json(newConversation);
    }

    // Nhắn tin nhóm
    if (type === "group") {
      // Tạo nhóm
      const conversation = await Conversation.create({ name, type, creatorId: userId });
      const conversationId = conversation.id;

      // Thêm thành viên
      await Conversation.insertConversationMember({ conversationId, userId, role: "admin" });

      for (const memberId of memberIds) {
        await Conversation.insertConversationMember({ conversationId, userId: memberId, role: "member" });
      }

      // Lấy conversation vừa tạo
      const newConversation = await Conversation.getNewConversation({ conversationId });

      // socket.io => realtime
      for (const memberId of [...memberIds, userId]) {
        const socketId = onlineUsers.get(memberId);
        if (socketId) {
          io.to(socketId).emit("new-conversation", newConversation);
        }
      }

      return res.status(200).json(newConversation);
    }

  } catch (error) {
    console.error("❌ Lỗi trong createConversation controller: ", error);
    return  res.status(500).json({ message: "Lỗi server!" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.getConversations({ userId });
    return res.status(200).json(conversations);

  } catch (error) {
    console.error("❌ Lỗi trong getConversations controller: ", error);
    return  res.status(500).json({ message: "Lỗi server!" });
  }
};

export const getUserConversationsForSocketIO = async (userId) => {
  try {
    const conversationIds = await Conversation.getConversationIds({ userId });
    return conversationIds;
  } catch (error) {
    console.error("❌ Lỗi trong getUserConversationsForSocketIO controller: ", error);
    return [];
  }
}



