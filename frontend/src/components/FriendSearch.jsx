import { useState } from 'react';
import styles from './FriendSearch.module.css';
import { useFriendStore } from '../stores/useFriendStore.js';
import { useAuthStore } from '../stores/useAuthStore.js';

export const FriendSearch = () => {
  const authUser = useAuthStore(state => state.authUser);
  const searchResults = useFriendStore(state => state.searchResults);
  const searchUsers = useFriendStore(state => state.searchUsers);
  const isSearching = useFriendStore(state => state.isSearching);
  const sendFriendRequest = useFriendStore(state => state.sendFriendRequest);
  const isSendingFriendRequest = useFriendStore(state => state.isSendingFriendRequest);

  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState(`Mình tên là ${authUser.fullName}. Mình làm quen nha. `)

  if (isSearching) {
    return <div>Đang tải...</div>
  }

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.titleContainer}>
        <h3 className={styles.title}>Tìm kiếm bạn bè</h3>
      </div>
      <div className={styles.searchBox}>
        <input 
          className={styles.searchInput}
          value={keyword} 
          onChange={(event) => setKeyword(event.target.value)}
          placeholder='Nhập tên...'
        />
        <button 
          className={styles.searchButton}
          onClick={() => {
            searchUsers(keyword);
          }}
        >
          Tìm kiếm
        </button>
      </div>

      <div className={styles.resultList}>
        {searchResults.length === 0 && (
          <div className={styles.empty}>
            Không tìm thấy người dùng
          </div>
        )}

        { searchResults.length > 0 && searchResults.map((user) => (
          <div key={user.id} className={styles.resultItem}>
            <img 
              src={user.profilePic ? user.profilePic : "/images/avatar.png"} 
              className={styles.avatar}
            />
            
            <div className={styles.info}>
              <div className={styles.name}>{user.fullName}</div>
              <input  
                className={styles.messageInput}
                value={message} 
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Thông điệp gửi gắm"
              />
            </div>

            <div className={styles.actions}>
              <button 
                className={styles.addButton}
                onClick={() => {
                  sendFriendRequest(user.id, message)
                }}
                disabled={isSendingFriendRequest}
              >
                Kết bạn
              </button>
            </div>
          </div>
        )) }
      </div>
    </div>
  )
}
