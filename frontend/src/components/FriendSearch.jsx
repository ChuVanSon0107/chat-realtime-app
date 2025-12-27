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

  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState(`Mình tên là ${authUser.fullName}. Mình làm quen nha. `)

  if (isSearching) {
    return <div>Đang tải...</div>
  }

  return (
    <div>
      <h3>Tìm kiếm bạn bè</h3>
      <div>
        <input 
          value={keyword} 
          onChange={(event) => setKeyword(event.target.value)}
          placeholder='Nhập tên...'
        />
        <button onClick={() => {
          searchUsers(keyword);
        }}>
          Search
        </button>
      </div>
      <div>
        { searchResults.map((user) => (
          <div key={user.id}>
            <div>
              <img src={user.profilePic ? user.profilePic : "/images/avatar.png"} />
            </div>
            <div>{user.fullName}</div>
          
            <input  
              value={message} 
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Thông điệp gửi gắm"
            />

            <button onClick={() => {
              sendFriendRequest(user.id, message)
            }}>
              Kết bạn
            </button>
          </div>
        )) }
      </div>
    </div>
  )
}
