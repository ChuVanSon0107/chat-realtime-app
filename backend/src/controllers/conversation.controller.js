import { Conversation } from "../models/conversation.model.js";
import { Friendship } from "../models/friendship.model.js";

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

      let alreadyConversation = await Conversation.findPersonalConversation({ user1Id, user2Id });

      if (alreadyConversation) {
        return res.status(200).json({ message: "Bạn đã nhắn tin với người đó trước rồi", conversationId: alreadyConversation });
      }

      // Tạo hội thoại
      const conversation = await Conversation.create({ name: "", type: "personal", creatorId: userId });
      const conversationId = conversation.id;

      // Thêm thành viên
      await Conversation.insertConversationMember({ conversationId, userId, role: "member" });
      await Conversation.insertConversationMember({ conversationId, userId: memberIds[0], role: "member" });
      await Conversation.updateLastReadAt({ conversationId, userId });
      await Conversation.updateLastReadAt({ conversationId, userId: memberIds[0] });

      return res.status(200).json({ message: "Bạn đã tạo thành công", conversationId });
    }

    // Nhắn tin nhóm
    if (type === "group") {
      // Tạo nhóm
      const conversation = await Conversation.create({ name, type, creatorId: userId });
      const conversationId = conversation.id;

      // Thêm thành viên
      await Conversation.insertConversationMember({ conversationId, userId, role: "admin" });
      await Conversation.updateLastReadAt({ conversationId, userId });

      for (const memberId of memberIds) {
        await Conversation.insertConversationMember({ conversationId, userId: memberId, role: "member" });
        await Conversation.updateLastReadAt({ conversationId, userId: memberId });
      }

      return res.status(200).json({ message: "Bạn đã tạo thành công", conversationId });
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



