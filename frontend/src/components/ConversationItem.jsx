import styles from "./ConversationItem.module.css";

export const ConversationItem = ({ conversation, authUser }) => {
  const { members, lastMessage, type, name } = conversation;

  // Chat cá nhân => lấy người còn lại
  const friend =
    type === "personal"
      ? members.find(m => m.id !== authUser.id)
      : null;

  const avatar =
    type === "personal"
      ? friend?.profilePic || "/images/avatar.png"
      : "/images/avatar.png";

  const displayName = (type === "personal") ? friend?.fullName : name;

  const lastText = lastMessage ? lastMessage.content || "📷 Ảnh" : "Chưa có tin nhắn";

  return (
    <div className={styles.item}>
      <img src={avatar} className={styles.avatar} />

      <div className={styles.info}>
        <div className={styles.name}>{displayName}</div>
        <div className={styles.lastMessage}>{lastText}</div>
      </div>
    </div>
  );
};