import sql from 'mssql';
import { getConnection } from '../lib/database.js';

export const Conversation = {
  async findPersonalConversation({ user1Id, user2Id }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('user1Id', sql.BigInt, user1Id)
      .input('user2Id', sql.BigInt, user2Id)
      .query(`
          SELECT C.id 
          FROM Conversation C
          JOIN ConversationMember CM1 ON C.id = CM1.conversationId
          JOIN ConversationMember CM2 ON C.id =  CM2.conversationId
          WHERE C.type = 'personal' AND CM1.userId = @user1Id AND CM2.userId = @user2Id;
        `);

    return result.recordset[0];
  },

  async create({ name, type, creatorId }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('name', sql.NVarChar(100), name)
      .input('type', sql.VarChar(20), type)
      .input('creatorId', sql.BigInt, creatorId)
      .query(`
        INSERT INTO Conversation (type, name, creatorId)
        VALUES (@type, @name, @creatorId);
        
        SELECT SCOPE_IDENTITY() AS id;
        `);

    return result.recordset[0];
  },

  async insertConversationMember({ conversationId, userId, role }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('conversationId', sql.BigInt, conversationId)
      .input('userId', sql.BigInt, userId)
      .input('role', sql.VarChar(20), role)
      .query(`
        BEGIN TRANSACTION;
        INSERT INTO ConversationMember (conversationId, userId, role)
        VALUES (@conversationId, @userId, @role);
        INSERT INTO ConversationRead (conversationId, userId)
        VALUES (@conversationId, @userId);
        COMMIT TRANSACTION;
        `);
  },

  async updateLastReadAt({ conversationId, userId }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('conversationId', sql.BigInt, conversationId)
      .input('userId', sql.BigInt, userId)
      .query(`
        INSERT INTO ConversationRead (conversationId, userId)
        VALUES (@conversationId, @userId);
        `);
  },

  async getConversations({ userId }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('userId', sql.BigInt, userId)
      .query(`
        SELECT C.id AS conversationId, type, name, (
          SELECT U.id AS userId, fullName, profilePic
          FROM Users AS U
          JOIN ConversationMember AS CM1 ON CM1.userId = U.id
          WHERE CM1.conversationId = C.id
          FOR JSON PATH
        ) AS members
        FROM Conversation AS C
        JOIN ConversationMember AS CM
        ON C.id = CM.conversationId
        WHERE CM.userId = @userId
        GROUP BY C.id, type, name;
        `);

    return result.recordset.map((c) => ({
      ...c,
      members: c.members ? JSON.parse(c.members) : []
    }));
  },

  async isMember({ conversationId, userId }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('conversationId', sql.BigInt, conversationId)
      .input('userId', sql.BigInt, userId)
      .query(`
        SELECT 1
        FROM ConversationMember
        WHERE conversationId = @conversationId AND userId = @userId;
        `);
    
    return result.recordset[0];
  },
};