-- Tạo database 
CREATE DATABASE CHAT_REALTIME_APP;

-- Xóa table Users
DROP TABLE dbo.Users;

-- Tạo table Users
CREATE TABLE dbo.Users(
	id INT IDENTITY(1, 1) PRIMARY KEY,
	fullName NVARCHAR(50) NOT NULL,
	email NVARCHAR(50) NOT NULL UNIQUE,
	hashedPassword NVARCHAR(100) NOT NULL,
	profilePic NVARCHAR(1000) NULL DEFAULT(''),
	createdAt DATETIME NOT NULL DEFAULT GETDATE(),
	updatedAt DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tạo trigger để cập nhật updateddAt tự động khi UPDATE
CREATE TRIGGER updateTimestamp
ON dbo.Users
AFTER UPDATE
AS
BEGIN
	UPDATE dbo.Users
	SET updatedAt = GETDATE()
	WHERE id IN (SELECT id FROM inserted);
END;

-- Thêm User dùng vào
INSERT INTO dbo.Users (fullName, email, hashedPassword)
VALUES ('Chu Văn Sơn', 'son@gmail.com', 'iuhd8ahhdbasjbduyast782');

-- Sửa thông tin User
UPDATE dbo.Users
SET fullName = 'Phạm Mai Hương'
WHERE id = 1;

-- Xóa thông tin User
DELETE dbo.Users
WHERE id = 1;

-- Lấy User ra
SELECT * FROM dbo.Users;