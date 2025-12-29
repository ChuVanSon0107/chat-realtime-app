import styles from './CreateGroupConversationModal.module.css'
import { X } from 'lucide-react';
import { useState } from 'react';

export const CreateGroupConversationModal = ({ friends, createConversation, onClose, isCreatingConversation }) => {
  const type = "group";
  const [groupName, setGroupName] = useState("");
  const [memberIds, setMemberIds] = useState([]);

  const selectMember = (id) => {
    setMemberIds((prev) => (
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    ));
  };

  const handleCreate = async () => {
    if (isCreatingConversation || !groupName.trim() || !memberIds || memberIds < 1) {
      return;
    }

    await  createConversation(groupName, type, memberIds);
    onClose();
  };
  
  return (
    <div 
      className={styles.overlay}
      onClick={onClose}
    >
      <div 
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3>Tạo nhóm chat</h3>
          <button
            className={styles.closeButton}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <input 
          className={styles.input}
          placeholder="Nhập tên nhóm..."
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)} />

        <div className={styles.friendList}>
          {friends && friends.map((friend) => (
            <div
              key={friend.id}
              className={`${styles.friendItem} ${ memberIds.includes(friend.id) ? styles.selected : "" }`}
              onClick={() => {selectMember(friend.id)}}
            >
              <img 
                src={friend.profilePic || "/images/avatar.png"}
              />
              <span>{friend.fullName}</span>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button onClick={onClose}>Hủy</button>
          <button
            onClick={handleCreate}
            disabled={isCreatingConversation || !groupName.trim() || !memberIds || memberIds.length < 1}
          >{isCreatingConversation ? "Đang tạo..." : "Tạo nhóm"}</button>
        </div>
      </div>
    </div>
  )
}
