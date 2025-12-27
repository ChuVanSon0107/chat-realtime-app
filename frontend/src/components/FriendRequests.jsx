import { useEffect } from 'react';
import { useFriendStore } from '../stores/useFriendStore.js';
import styles from './FriendRequests.module.css';

export const FriendRequests = () => {
  const friendRequests = useFriendStore(state => state.friendRequests);
  const fetchFriendRequests = useFriendStore(state => state.fetchFriendRequests);
  const acceptFriendRequest = useFriendStore(state => state.acceptFriendRequest);
  const declineFriendRequest = useFriendStore(state => state.declineFriendRequest);

  useEffect(() => {
    fetchFriendRequests();
  }, [fetchFriendRequests]);

  console.log(friendRequests);

  return (
    <div>
      <h3>Lời mời kết bạn</h3>

      <div>
        { friendRequests.map((friendRequest) => (
        <div key={friendRequest.requestId}>
          <div>
            <img src={friendRequest.profilePic ? friendRequest.profilePic : "/images/avatar.png" }/>
          </div>
          <div>{friendRequest.fullName}</div>
          <button onClick={() => acceptFriendRequest(friendRequest.requestId)}>Chấp nhận</button>
          <button onClick={() => declineFriendRequest(friendRequest.requestId)}>Từ chối</button>
        </div>
        )) }
      </div>
    </div>
  )
}
