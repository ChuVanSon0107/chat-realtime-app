import { useEffect } from 'react';
import styles from './FriendRequests.module.css';

export const FriendRequests = ({ friendRequests, fetchFriendRequests, acceptFriendRequest, declineFriendRequest }) => {
  useEffect(() => {
    fetchFriendRequests();
  }, [fetchFriendRequests]);

  if (!friendRequests.length) {
    return (
      <div className={styles.requestWrapper}>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>Lời mời kết bạn</h3>
        </div>
        <div className={styles.empty}>
          Không có lời mời kết bạn nào
        </div>
      </div>
    );
  }

  return (
    <div className={styles.requestWrapper}>
      <div className={styles.titleContainer}>
        <h3 className={styles.title}>Lời mời kết bạn</h3>
      </div>

      <div className={styles.requestList}>
        { friendRequests.map((friendRequest) => (
        <div key={friendRequest.requestId} className={styles.requestItem}>
          <img 
            src={friendRequest.profilePic || "/images/avatar.png" }
            className={styles.avatar}
          />

          <div className={styles.info}>
            <div className={styles.name}>{friendRequest.fullName}</div>
            { friendRequest.message && (
              <div className={styles.message}>{friendRequest.message}</div>
            ) }
          </div>

          <div className={styles.actions}>
            <button 
              onClick={() => acceptFriendRequest(friendRequest.requestId)}
              className={styles.acceptButton}
            >Chấp nhận</button>
            <button 
              onClick={() => declineFriendRequest(friendRequest.requestId)}
              className={styles.declineButton}
            >Từ chối</button>
          </div>
        </div>
        )) }
      </div>
    </div>
  )
}
