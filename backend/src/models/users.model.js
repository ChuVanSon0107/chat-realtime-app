import sql from "mssql";
import { getConnection } from "../lib/database.js";

export const Users = {
  // Hàm tạo người dùng mới
  async create({ fullName, email, hashedPassword }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("fullName", sql.NVarChar(50), fullName)
      .input("email", sql.NVarChar(50), email)
      .input("hashedPassword", sql.NVarChar(100), hashedPassword)
      .query(`
        INSERT INTO Users (fullName, email, hashedPassword)
        VALUES (@fullName, @email, @hashedPassword);
        SELECT * FROM Users WHERE email = @email;
      `);

    return result.recordset[0]; // Lấy dòng đầu tiên của bảng đầu tiên trả về từ query
  },

  // Hàm lấy thông tin của tất cả người dùng
  async getAll() {
    const connection = await getConnection();
    const result = await connection
      .request()
      .query(`SELECT * FROM Users;`);
    
    return result.recordset; // Lấy tất cả các dòng của bảng đầu tiên trả về từ query
  },

  // Tìm người dùng dùng dựa vào email
  async findByEmail(email) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("email", sql.NVarChar(50), email)
      .query(`SELECT * FROM Users WHERE email = @email;`);
    
    return result.recordset[0]; // Lấy dòng đầu tiên của bảng đầu tiên trả về từ query
  },

  // Tìm người dùng dựa vào id
  async findById(id) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("id", sql.Int, id)
      .query(`SELECT * FROM Users WHERE id = @id;`);

    return result.recordset[0]; // Lấy dòng đầu tiên của bảng đầu tiên trả về từ query
  },

  // Cập nhật ảnh đại diện
  async updateProfilePic(id) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("id", sql.BigInt, id)
      .input("profilePic", sql.NVarChar(1000), profilePic)
      .query(`UPDATE Users
              SET profilePic = @profilePic
              WHERE id = @id;
              SELECT * FROM Users WHERE id = @id;
      `);
    
      return result.recordset[0];
  },

  
};