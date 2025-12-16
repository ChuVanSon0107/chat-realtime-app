import sql from 'mssql';
import { getConnection } from '../lib/database.js';

export const FriendRequest = {
  async create({ senderId, receiverId, message }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('senderId', sql.BigInt, senderId)
      .input('receiverId', sql.BigInt, receiverId)
      .input('message', sql.NVarChar(300), message)
      .query(`
        INSERT INTO FriendRequest (senderId, receiverId, message)
        VALUES (@senderId, @receiverId, @message)
        SELECT * FROM FriendRequest
        WHERE senderId = @senderId AND receiverId = @receiverId;
      `);
    
    return result.recordset[0];
  },

  async delete({ requestId }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('id', sql.BigInt, requestId)
      .query(`
        DELETE FROM FriendRequest
        WHERE id = @id;
        `);
    
  },

  async findFriendRequest({ senderId, receiverId }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('senderId', sql.BigInt, senderId)
      .input('receiverId', sql.BigInt, receiverId)
      .query(`
        SELECT * FROM FriendRequest
        WHERE senderId = @senderId AND receiverId = @receiverId;
        `);
    
    return result.recordset[0];
  },

  async findById({ requestId }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('id', sql.BigInt, requestId)
      .query(`
        SELECT * FROM FriendRequest
        WHERE id = @id;
        `);
      
    return result.recordset[0];
  },

  // Tìm kiếm thông tin về các user đã gửi lời mời kết bạn đến user hiện tại (Thông tin người gửi)
  async findByReceiverId({ receiverId }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('receiverId', sql.BigInt, receiverId)
      .query(`
          SELECT DISTINCT Users.id, requestId, fullName, profilePic
          FROM Users JOIN (SELECT senderId AS id, id AS requestId FROM FriendRequest WHERE receiverId = @receiverId) AS Sender
          ON Users.id = Sender.id;
        `);
    
    return result.recordset;
  },

  // Tìm kiếm thông tin về các user mà user hiện tại đã gửi lời mời kết bạn (Thông tin người nhận)
  async findBySenderId({ senderId }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('senderId', sql.BigInt, senderId)
      .query(`
          SELECT DISTINCT Users.id, requestId, fullName, profilePic
          FROM Users JOIN (SELECT receiverId AS id, id AS requestId FROM FriendRequest WHERE senderId = @senderId) AS Receiver
          ON Users.id = Receiver.id;
        `);
    
    return result.recordset;
  },
}