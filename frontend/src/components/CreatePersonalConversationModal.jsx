import { useState } from 'react';
import { X } from 'lucide-react';
import styles from './CreatePersonalConversationModal.module.css';

export const CreatePersonalConversationModal = ({ friends, createConversation, onClose, isCreatingConversation }) => {
  const type = "personal";
  const name = "";
  const [selectedId, setSelectedId] = useState();

  const handleCreate = async () => {
    if (!selectedId || isCreatingConversation) return;

    await createConversation(name, type, [selectedId]);
    onClose();
  }

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
          <h3>Tạo cuộc trò chuyện mới</h3>
          <button 
            className={styles.closeButton}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>  

        <div className={styles.friendList}>
          { friends && friends.map((friend) => (
            <div 
              key={friend.id}
              className={`${styles.friendItem} ${ selectedId === friend.id ? styles.selected : "" }`}
              onClick={() => setSelectedId(friend.id)}
            >
              <img src={friend.profilePic || "/images/avatar.png"} />
              <span>{friend.fullName}</span>
            </div>
          )) }
        </div>

        <div className={styles.actions}>
          <button onClick={onClose}>Hủy</button>
          <button
            onClick={handleCreate}
            disabled={isCreatingConversation || !selectedId}
          >
            {isCreatingConversation ? "Đang tạo..." : "Tạo"}
          </button>
        </div>
      </div>
    </div>
  )
}
