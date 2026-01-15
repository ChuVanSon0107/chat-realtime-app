import styles from './GroupConversationModal.module.css'
import { X } from 'lucide-react';
import { useState } from 'react';
import { Camera } from 'lucide-react';
import { getImageURL } from '../lib/getImageURL.js';

export const GroupConversationModal = ({ friends, createGroupConversation, onClose, isCreatingConversation }) => {
  const type = "group";
  const [groupName, setGroupName] = useState("");
  const [memberIds, setMemberIds] = useState([]);
  const [groupPic, setGroupPic] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const selectMember = (id) => {
    setMemberIds((prev) => (
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    ));
  };

  const handleCreate = async () => {
    if (isCreatingConversation || !groupName.trim() || !memberIds || memberIds < 1) {
      return;
    }

    await createGroupConversation(groupName, type, memberIds, groupPic);
    onClose();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // giới hạn size
    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh tối đa 5MB");
      return;
    }

    setGroupPic(file);
    setSelectedImage(URL.createObjectURL(file));
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

          <div className={styles.avatarWrapper}>
            <div className={styles.avatarContainer}>
              <img src={selectedImage || '/images/avatar.png'}
                alt='Profile Picture'
                className={styles.avatar} />
              <label className={styles.uploadAvatarSection}>
                <Camera className={styles.cameraIcon} />
                <input
                  type="file"
                  accept='image/*'
                  className={styles.inputAvatar}
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

        <div className={styles.friendList}>
          {friends && friends.map((friend) => (
            <div
              key={friend.id}
              className={`${styles.friendItem} ${ memberIds.includes(friend.id) ? styles.selected : "" }`}
              onClick={() => {selectMember(friend.id)}}
            >
              <img 
                src={friend.profilePic ?  getImageURL(friend.profilePic) : "/images/avatar.png"}
              />
              <span>{friend.fullName}</span>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button onClick={onClose}>Hủy</button>
          <button
            onClick={handleCreate}
            disabled={isCreatingConversation || !groupName.trim() || !memberIds || memberIds.length < 2}
          >{isCreatingConversation ? "Đang tạo..." : "Tạo nhóm"}</button>
        </div>
      </div>
    </div>
  )
}
