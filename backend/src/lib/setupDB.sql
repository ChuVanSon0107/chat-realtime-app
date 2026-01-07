-- Tạo database 
CREATE DATABASE CHAT_REALTIME_APP;

DROP DATABASE CHAT_REALTIME_APP;

-- Xóa Table
DROP TABLE Users;
DROP TABLE Friendship;
DROP TABLE FriendRequest;
DROP TABLE Conversation;
DROP TABLE ConversationMember;
DROP TABLE Message;
DROP TABLE ConversationRead;

-- Tạo Table
CREATE TABLE Users(
	id BIGINT IDENTITY(1, 1) PRIMARY KEY,
	fullName NVARCHAR(50) NOT NULL,
	email NVARCHAR(50) NOT NULL UNIQUE,
	hashedPassword NVARCHAR(100) NOT NULL,
	profilePic VARCHAR(MAX) NULL DEFAULT(''),
	createdAt DATETIME NOT NULL DEFAULT GETDATE(),
	updatedAt DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Friendship (
	user1Id BIGINT NOT NULL,
	user2Id BIGINT NOT NULL,
	createdAt DATETIME NOT NULL DEFAULT GETDATE(),

	CHECK (user1Id < user2Id),
	CONSTRAINT PK_friendship PRIMARY KEY (user1Id, user2Id),
	CONSTRAINT FK_friendship_user1 FOREIGN KEY (user1Id) REFERENCES Users(id),
	CONSTRAINT FK_friendship_user2 FOREIGN KEY (user2Id) REFERENCES Users(id)
);

CREATE TABLE FriendRequest (
	id BIGINT IDENTITY(1, 1) PRIMARY KEY,
	senderId BIGINT NOT NULL,
	receiverId BIGINT NOT NULL,
	message NVARCHAR(300),
	createdAt DATETIME NOT NULL DEFAULT GETDATE(),

	CONSTRAINT FK_fr_sender FOREIGN KEY (senderId) REFERENCES Users(id),
	CONSTRAINT FK_fr_receiver FOREIGN KEY (receiverId) REFERENCES Users(id),
	CHECK(senderId <> receiverId)
);

CREATE TABLE Conversation (
	id BIGINT IDENTITY(1, 1) PRIMARY KEY,
	type VARCHAR(20) NOT NULL CHECK (type IN ('personal', 'group')),
	name NVARCHAR(100),
	creatorId BIGINT,
	createdAt DATETIME NOT NULL DEFAULT GETDATE(),
	groupPic VARCHAR(MAX) NULL DEFAULT(''),

	CONSTRAINT FK_converation_creator FOREIGN KEY (creatorId) REFERENCES Users(id)
);

CREATE TABLE ConversationMember (
	conversationId BIGINT NOT NULL,
	userId BIGINT NOT NULL,
	role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'member')),
	joinedAt DATETIME NOT NULL DEFAULT GETDATE(),

	CONSTRAINT PK_conversationMember PRIMARY KEY (conversationId, userId),
	CONSTRAINT FK_conversation_conversation FOREIGN KEY (conversationId) REFERENCES Conversation(id),
	CONSTRAINT FK_conversation_user FOREIGN KEY (userId) REFERENCES Users(id)
);

CREATE TABLE Message (
	id BIGINT IDENTITY(1, 1) PRIMARY KEY,
	conversationId BIGINT NOT NULL,
	senderId BIGINT NOT NULL,
	content NVARCHAR(MAX),
	image VARCHAR(MAX),
	createdAt DATETIME DEFAULT GETDATE(),
	isDeleted BIT DEFAULT 0,

	CHECK (NOT (content IS NULL AND image IS NULL)),
	CONSTRAINT FK_message_conversation FOREIGN KEY (conversationId) REFERENCES Conversation(id),
	CONSTRAINT FK_message_sender FOREIGN KEY (senderId) REFERENCES Users(id)
);

CREATE TABLE ConversationRead (
	conversationId BIGINT NOT NULL,
	userId BIGINT NOT NULL,
	lastReadAt DATETIME DEFAULT GETDATE(),

	CONSTRAINT PK_read PRIMARY KEY (conversationId, userId),
	CONSTRAINT FK_read_conversation FOREIGN KEY (conversationId) REFERENCES Conversation(id),
	CONSTRAINT FK_read_user FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Đánh INDEX cho các bảng 
CREATE NONCLUSTERED INDEX idx_friendRequest_receiver_status 
ON FriendRequest (receiverId, createdAt DESC)
INCLUDE (senderId);

CREATE NONCLUSTERED INDEX idx_friendRequest_sender
ON FriendRequest (senderId, createdAt DESC)
INCLUDE (receiverId);

CREATE NONCLUSTERED INDEX idx_conversationMember_user
ON ConversationMember (userId)
INCLUDE (conversationId, role, joinedAt);

CREATE NONCLUSTERED INDEX idx_message_Message_created
ON Message (conversationId, createdAt DESC, id DESC)
INCLUDE (senderId, content, image, isDeleted);

CREATE NONCLUSTERED INDEX idx_conversationRead_user
ON ConversationRead (userId)
INCLUDE (conversationId, lastReadAt);


-- Tạo Trigger
CREATE TRIGGER updateTimestamp
ON dbo.Users
AFTER UPDATE
AS
BEGIN
	UPDATE Users
	SET updatedAt = GETDATE()
	WHERE id IN (SELECT id FROM inserted);
END;


-- Lấy User ra
SELECT * FROM Users;

SELECT * FROM FriendRequest;

SELECT * FROM Friendship;

SELECT * FROM Conversation;

SELECT * FROM ConversationMember;

SELECT * FROM ConversationRead;

SELECT * FROM Message;
