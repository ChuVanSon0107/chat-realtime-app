import sql from 'mssql';
import { getConnection } from '../lib/database.js';

export const Friendship = {
  // Hàm tạo 1 mối quan hệ bạn bè mới
  async create({ user1Id, user2Id, requestId }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("user1Id", sql.BigInt, user1Id)
      .input("user2Id", sql.BigInt, user2Id)
      .input("requestId", sql.BigInt, requestId)
      .query(`
        BEGIN TRANSACTION
        INSERT INTO Friendship (user1Id, user2Id)
        VALUES (@user1Id, @user2Id);
        DELETE FROM FriendRequest
        WHERE id = @requestId;
        COMMIT TRANSACTION;

        SELECT * FROM Friendship
        WHERE user1Id = @user1Id AND user2Id = @user2Id;
      `);

    return result.recordset[0];
  },

  async delete({ user1Id, user2Id }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("user1Id", sql.BigInt, user1Id)
      .input("user2Id", sql.BigInt, user2Id)
      .query(`
        DELETE FROM Friendship
        WHERE (user1Id = @user1Id AND user2Id = @user2Id);
      `);
  },

  async findFriendship({ user1Id, user2Id }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('user1Id', sql.BigInt, user1Id)
      .input('user2Id', sql.BigInt, user2Id)
      .query(`
        SELECT * FROM Friendship
        WHERE user1Id = @user1Id AND user2Id = @user2Id;
      `);

    return result.recordset[0];
  },

  async findFriend({ userId }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('userId', sql.BigInt, userId)
      .query(`
          SELECT Users.id, fullName, profilePic
          FROM Users JOIN ((SELECT user1Id AS id FROM Friendship WHERE user2Id = @userId) UNION (SELECT user2Id AS id FROM Friendship WHERE user1Id = @userId)) AS Friend
          ON Users.id = Friend.id;
        `);
    
    return result.recordset;
  },

  async checkFriendship({ user1Id, user2Id }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('user1Id', sql.BigInt, user1Id)
      .input('user2Id', sql.BigInt, user2Id)
      .query(`
        SELECT 1
        FROM Friendship
        WHERE user1Id = @user1Id AND user2Id = @user2Id;
        `);

    return result.recordset[0];
  },
}