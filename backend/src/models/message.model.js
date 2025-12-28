import sql from 'mssql';
import { getConnection } from '../lib/database.js';

export const Message = {
  async create({ conversationId, senderId, content, image }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('conversationId', sql.BigInt, conversationId)
      .input('senderId', sql.BigInt, senderId)
      .input('content', sql.NVarChar(sql.MAX), content)
      .input('image', sql.VarChar(sql.MAX), image)
      .query(`
        INSERT INTO Message (conversationId, senderId, content, image)
        VALUES (@conversationId, @senderId, @content, @image);

        SELECT SCOPE_IDENTITY() AS id;
        `);
    
    return result.recordset[0];
  },

  async getMessagesFirst({ conversationId, limit }) {
    const connection = await getConnection();
    const result = await connection 
      .request()
      .input('conversationId', sql.BigInt, conversationId)
      .input('limit', sql.Int, limit)
      .query(`
          SELECT TOP(@limit) M.id, M.conversationId, M.senderId, U.fullName, U.profilePic,
            M.content, M.image, M.createdAt
          FROM Message AS M
          JOIN Users AS U 
          ON M.senderId = U.id
          WHERE M.conversationId = @conversationId AND M.isDeleted = 0
          ORDER BY M.id DESC;
        `);

    return result.recordset;
  },

  async getMessagesWithCursor({ conversationId, limit, cursor }) {
    const connection = await getConnection();
    const result = await connection 
      .request()
      .input('conversationId', sql.BigInt, conversationId)
      .input('limit', sql.Int, limit)
      .input('cursor', sql.BigInt, cursor)
      .query(`
          SELECT TOP(@limit) M.id , M.conversationId, M.senderId, U.fullName, U.profilePic,
            M.content, M.image, M.createdAt
          FROM Message AS M
          JOIN Users AS U 
          ON M.senderId = U.id
          WHERE M.conversationId = @conversationId AND M.isDeleted = 0 AND M.id < @cursor
          ORDER BY M.id DESC;
        `);

    return result.recordset;
  }
};