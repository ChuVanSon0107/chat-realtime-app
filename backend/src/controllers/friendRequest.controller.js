import { FriendRequest } from "../models/friendRequest.model.js";
import { Friendship } from "../models/friendship.model.js";
import { Users } from "../models/users.model.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    if (!receiverId) {
      return res.status(400).json({ message: "Không có người nhận trong request" });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ message: "Không thể gửi lời mời kết bạn cho chính mình" });
    }

    const userExists = await Users.findById(receiverId);
    if (!userExists) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    let user1Id = parseInt(senderId);
    let user2Id = parseInt(receiverId);
    if (user1Id > user2Id) {
      [user1Id, user2Id] = [user2Id, user1Id];
    }

    const alreadyRequest = await FriendRequest.findFriendRequest({ senderId, receiverId });
    if (alreadyRequest) {
      return res.status(400).json({ message: "Bạn đã gửi lời mời kết bạn rồi" });
    }

    const alreadyBeRequested = await FriendRequest.findFriendRequest({ senderId: receiverId, receiverId: senderId });
    if (alreadyBeRequested) {
      return res.status(400).json({ message: "Người ta đã gửi lời mời kết bạn cho bạn rồi, hãy chấp nhận nhé" });
    }

    const alreadyFriend = await Friendship.findFriendship({ user1Id, user2Id });
    if(alreadyFriend) {
      return res.status(400).json({ message: "Hai người đã là bạn bè" });
    }

    const request = await FriendRequest.create({ senderId, receiverId, message });

    return res.status(201).json({ message: "Gửi lời mời kết bạn thành công", request });
  } catch (error) {
    console.error("❌ Lỗi trong sendFriendRequest controller: ", error);
    return  res.status(500).json({ message: "Lỗi server!" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const userId = req.user.id;

    const request = await FriendRequest.findById({ requestId });
    if (!request) {
      return res.status(404).json({ message: "Không tồn tại lời mời kết bạn" });
    }

    if (request.receiverId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Bạn không có quyền chấp nhận lời mời" });
    }

    let user1Id = request.senderId.toString();
    let user2Id = userId.toString();
    if (user1Id > user2Id) {
      [user1Id, user2Id] = [user2Id, user1Id];
    }

    await Friendship.create({ user1Id, user2Id, requestId });

    return res.status(200).json({ message: "Chấp nhận lời mời kết bạn thành công", requestId });
  } catch(error) {
    console.error("❌ Lỗi trong acceptFriendRequest controller: ", error);
    return  res.status(500).json({ message: "Lỗi server!" });
  }
};

export const declineFriendRequest = async (req, res) => {
  try { 
    const { id: requestId } = req.params;
    const userId = req.user.id;
    
    const request = await FriendRequest.findById({ requestId });
    if (!request) {
      return res.status(404).json({ message: "Không tồn tại lời mời kết bạn" });
    }

    if (request.receiverId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Bạn không có quyền từ chối lời mời kết bạn" });
    }

    await FriendRequest.delete({ requestId });

    return res.status(200).json({ message: "Từ chối lời mời kết bạn thành công", requestId });
  } catch (error) {
    console.error("❌ Lỗi trong declineFriendRequest controller:", error);
    return  res.status(500).json({ message: "Lỗi server!" });
  }
};

export const getAllFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    // Tìm thông tin về những người đã gửi lời mời kết bạn cho user
    const received = await FriendRequest.findByReceiverId({ receiverId: userId });

    // Tìm thông tin về những người đã được user gửi lời mời kết bạn cho
    const sent = await FriendRequest.findBySenderId({ senderId: userId });

    return res.status(200).json({ sent, received });
  } catch (error) {
    console.error("❌ Lỗi trong getALllFriendRequests controller: ", error);
    return  res.status(500).json({ message: "Lỗi server!" });
  }
};