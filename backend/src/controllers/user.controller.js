import { Users } from "../models/users.model.js";

export const searchUsers = async (req, res) => {
  try {
    const { q: name } = req.query;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Không có tham số q" });
    }

    const result = await Users.findByName({ name, userId });

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Lỗi trong searchUsers", error);
    return  res.status(500).json({ message: "Lỗi server!" });
  }
};