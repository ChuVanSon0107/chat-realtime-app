import { Friendship } from "../models/friendship.model.js";

export const getAllFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const friend = await Friendship.findFriend({ userId });

    return res.status(200).json(friend);
  } catch (error) {
    console.error("❌ Lỗi trong getAllFriends", error);
    return  res.status(500).json({ message: "Lỗi server!" });
  }
};