import { useEffect } from 'react';
import { useFriendStore } from '../stores/useFriendStore.js';
import styles from './Friends.module.css';

export const Friends = () => {
  const friends = useFriendStore(state => state.friends);
  const fetchFriends = useFriendStore(state => state.fetchFriends);
  const isLoadingFriends = useFriendStore(state => state.isLoadingFriends);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  if (isLoadingFriends) {
    return <div className={styles.loading}>Đang tải...</div>
  }

  return (
    <div className={styles.friendsWrapper}>
      <div className={styles.titleContainer}>
        <h3 className={styles.title}>Danh sách bạn bè</h3>
      </div>
      <div className={styles.friendList}>
        { friends.map((friend) => (
          <div key={friend?.id} className={styles.friendItem}>
            <img 
              src={friend?.profilePic ? friend?.profilePic : "/images/avatar.png"} 
              className={styles.avatar}
            />

            <div className={styles.info}>
              <div className={styles.name}>{friend?.fullName}</div>
            </div>
          </div>
        )) }
      </div>
    </div>
  );
};