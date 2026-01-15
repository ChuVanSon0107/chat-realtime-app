import { useState } from 'react';
import { X } from 'lucide-react';
import styles from './PersonalConversationModal.module.css';
import { getImageURL } from '../lib/getImageURL.js';

export const PersonalConversationModal = ({ friends, createPersonalConversation, onClose, isCreatingConversation }) => {
  const type = "personal";
  const [selectedId, setSelectedId] = useState(null);

  const handleSelectFriend = async (friend) => {
    if (!selectedId || selectedId !== friend.id) {
      setSelectedId(friend.id);
    } else {
      setSelectedId(null);
    }
  };

  const handleCreate = async () => {
    if (!selectedId || isCreatingConversation) return;

    await createPersonalConversation(type, selectedId);
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
              onClick={() => handleSelectFriend(friend)}
            >
              <img src={friend.profilePic ? getImageURL(friend.profilePic) : '/images/avatar.png'} />
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
