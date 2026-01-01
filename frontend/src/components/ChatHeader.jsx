import styles from './ChatHeader.module.css';

export const ChatHeader = ({ conversation, authUser, selectConversation }) => {
  if (!conversation) {
    return null;
  }

  let title = "";
  let avatar = "/images/avatar.png";

  if (conversation.type === "personal") {
    const friend = conversation.members.find((m) => Number(m.id) !== Number(authUser.id));
    title = friend?.fullName || "Người dùng";
    avatar = friend?.profilePic || "/images/avatar.png";
  } else {
    title = conversation.name || "Nhóm chat";
    avatar = conversation.groupPic || "/images/avatar.png";
  }

  return (
    <div className={styles.header}>
      <div>
        <img src={avatar} className={styles.avatar} />
        <span className={styles.title}>{title}</span>
      </div>
      <button className={styles.closeButton} 
        onClick={() => {
          selectConversation(null);
        }}
      > ✕ </button>
    </div>
  )
}
