import { useEffect } from 'react';
import { useFriendStore } from '../stores/useFriendStore.js';
import styles from './Friends.module.css';

export const Friends = () => {
  const friends = useFriendStore(state => state.friends);
  const fetchFriends = useFriendStore(state => state.fetchFriends);
  const isLoadingFriends = useFriendStore(state => state.isLoadingFriends);

  useEffect(() => {
    fetchFriends();
  }, []);

  if (isLoadingFriends) {
    return <div>Đang tải...</div>
  }

  return (
    <div>
      <h3>Danh sách bạn bè</h3>
      { friends.map((friend) => (
        <div key={friend.id}>
          <div>
            <img src={friend.profilePic ? friend.profilePic : "/images/avatar.png"} />
          </div>
          <div>{friend.fullName}</div>
        </div>
      )) }
    </div>
  );
};