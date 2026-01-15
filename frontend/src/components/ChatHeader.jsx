import styles from './ChatHeader.module.css';
import { getImageURL } from '../lib/getImageURL.js';

export const ChatHeader = ({ conversation, authUser, selectConversation, onlineUsers }) => {
  if (!conversation) {
    return null;
  }

  let isOnline = false;

  let title = "";
  let avatar = "/images/avatar.png";

  if (conversation.type === "personal") {
    const friend = conversation.members.find((m) => Number(m.id) !== Number(authUser.id));
    title = friend?.fullName || "Người dùng";
    avatar = friend?.profilePic ? getImageURL(friend?.profilePic) : "/images/avatar.png";

    isOnline = onlineUsers.includes(String(friend?.id)) ? true : false;
  } else {
    title = conversation?.name || "Nhóm chat";
    avatar = conversation?.groupPic ? getImageURL(conversation?.groupPic) : "/images/avatar.png";
  }

  console.log(conversation?.groupPic);

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <div className={styles.avatarWrapper}>
          <img src={avatar} className={styles.avatar} />
          {isOnline && <span className={styles.status}></span>}
        </div>

        <div className={styles.info}>
          <span className={styles.title}>{title}</span>
          {conversation.type === "personal" && (
            <span className={styles.sub}>
              {isOnline ? "Đang hoạt động" : "Ngoại tuyến"}
            </span>
          )}
        </div>
      </div>

      <button
        className={styles.closeButton}
        onClick={() => selectConversation(null)}
      >
        ✕
      </button>
    </div>
  )
}
