import styles from "./ConversationItem.module.css";
import { useChatStore } from "../stores/useChatStore.js";

export const ConversationItem = ({ conversation, authUser}) => { 
  const { members, lastMessage, type, name } = conversation;
  const selectConversation = useChatStore(state => state.selectConversation);
  const selectedConversation = useChatStore(state => state.selectedConversation);

  // Chat cá nhân => lấy người còn lại
  const friend =
    type === "personal"
      ? members.find(m => Number(m.id) !== Number(authUser.id))
      : null;

  const avatar =
    type === "personal"
      ? friend?.profilePic || "/images/avatar.png"
      : "/images/avatar.png";

  const displayName = (type === "personal") ? friend?.fullName : name;

  let lastText;
  if (Number(lastMessage.senderId) === Number(authUser.id)) {
    lastText = lastMessage ? lastMessage.content || "Bạn: đã gửi ảnh" : "Chưa có tin nhắn";
  } else {
    lastText = lastMessage ? lastMessage.content || `${friend?.fullName}: đã gửi ảnh` : "Chưa có tin nhắn";
  }


  const handleClick = async () => {
    if (!selectedConversation || conversation.id !== selectedConversation.id) {
      await selectConversation(conversation);
    }
  }

  return (
    <div className={styles.item} onClick={handleClick}>
      <img src={avatar} className={styles.avatar} />

      <div className={styles.info}>
        <div className={styles.name}>{displayName}</div>
        <div className={styles.lastMessage}>{lastText}</div>
      </div>
    </div>
  );
};