import styles from "./ConversationItem.module.css";
import formatDateTime from '../lib/formatDateTime.js';

export const ConversationItem = ({ conversation, authUser, selectConversation, selectedConversation, onlineUsers }) => { 
  const { members, lastMessage, type, name, groupPic } = conversation;

  // Chat cá nhân => lấy người còn lại
  const friend =
    type === "personal"
      ? members.find(m => Number(m.id) !== Number(authUser.id))
      : null;

  const isOnline = 
    type === "personal" 
      ? onlineUsers.includes(String(friend?.id))
      : false;

  const avatar =
    type === "personal"
      ? friend?.profilePic || "/images/avatar.png"
      : groupPic || "/images/avatar.png";

  const displayName = (type === "personal") ? friend?.fullName : name;

  // Tin nhắn cuối cùng
  const senderId = lastMessage?.senderId;
  const sender = members.find(m => Number(m.id) === Number(senderId));
  let lastText;
  if (!lastMessage) {
    lastText = "Chưa có tin nhắn nào";
  } else {
    if (Number(senderId) === Number(authUser.id)) {
      lastText = "Bạn: " + (lastMessage.content ||  "Gửi một ảnh");
    } else {
      lastText = `${sender.fullName}: ` + (lastMessage.content ||  "Gửi một ảnh");
    }
  }

  // Chưa được chọn => mới chọn
  const isSelected = (selectedConversation?.id === conversation.id);

  const handleClick = async () => {
    if (!isSelected) {
      await selectConversation(conversation);
    }
  }

  return (
    <div className={`${styles.item} ${isSelected ? styles.active : ""}`} onClick={handleClick}>
      <div className={styles.avatarWrapper}>
        <img src={avatar} className={styles.avatar} />

        {isOnline && <span className={styles.status}></span>}
      </div>

      <div className={styles.info}>
        <div className={styles.name}>{displayName}</div>
        <div className={styles.lastLine}>
          <span className={styles.lastMessage}>{lastText}</span>
          { lastMessage?.createdAt && <span className={styles.time}>{formatDateTime(lastMessage?.createdAt)}</span> }
        </div>
      </div>
    </div>
  );
};