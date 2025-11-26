import sql from "mssql";
import dotenv from "dotenv";

// load biến môi trường để sử dụng
dotenv.config();

// trustServerCertificate = true => bỏ qua kiểm tra chứng chỉ SSL/TLS(mã hóa dữ liêu giữa Node và SQL Server)
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    trustServerCertificate: true
  }
};

// Kết nối với database
let connection;

export const getConnection = async () => {
  try {
    if (!connection) {
      connection = await sql.connect(config);
      console.log("✅ ", "Kết nối MSSQL database thành công!")
    }

    return connection;
  } catch (error) {
    console.error("❌ ", "Kết nối MSSQL datatbase thất bại: ", error);
    throw error;
  }
};