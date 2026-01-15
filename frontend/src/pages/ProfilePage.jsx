import { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Camera, User, Mail } from 'lucide-react';
import styles from './ProfilePage.module.css';
import { NavBar } from '../components/NavBar.jsx'
import { Friends } from '../components/Friends.jsx';
import { FriendRequests } from '../components/FriendRequests.jsx';
import { FriendSearch } from '../components/FriendSearch.jsx';
import { FriendTabs } from '../components/FriendTabs.jsx';
import { useFriendStore } from '../stores/useFriendStore.js';
import { getImageURL } from '../lib/getImageURL.js';

export const ProfilePage = () => {
  const friends = useFriendStore(state => state.friends);
  const fetchFriends = useFriendStore(state => state.fetchFriends);
  const isLoadingFriends = useFriendStore(state => state.isLoadingFriends);
  const friendRequests = useFriendStore(state => state.friendRequests);
  const fetchFriendRequests = useFriendStore(state => state.fetchFriendRequests);
  const acceptFriendRequest = useFriendStore(state => state.acceptFriendRequest);
  const declineFriendRequest = useFriendStore(state => state.declineFriendRequest);
  const searchResults = useFriendStore(state => state.searchResults);
  const searchUsers = useFriendStore(state => state.searchUsers);
  const isSearching = useFriendStore(state => state.isSearching);
  const sendFriendRequest = useFriendStore(state => state.sendFriendRequest);
  const isSendingFriendRequest = useFriendStore(state => state.isSendingFriendRequest);

  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const avatar = selectedImage ? selectedImage :
    (authUser.profilePic ? getImageURL(authUser.profilePic) : '/images/avatar.png')

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    await updateProfile(file);
  };

  const [activeTab, setActiveTab] = useState("friends");

  const renderContent = () => {
    switch (activeTab) {
      case "friends":
        return (
          <Friends
            friends={friends}
            fetchFriends={fetchFriends}
            isLoadingFriends={isLoadingFriends}
          />);
      case "requests":
        return (
          <FriendRequests
            friendRequests={friendRequests}
            fetchFriendRequests={fetchFriendRequests}
            acceptFriendRequest={acceptFriendRequest}
            declineFriendRequest={declineFriendRequest}
          />);
      case "search":
        return (
          <FriendSearch
            authUser={authUser}
            searchResults={searchResults}
            isSearching={isSearching}
            searchUsers={searchUsers}
            isSendingFriendRequest={isSendingFriendRequest}
            sendFriendRequest={sendFriendRequest}
          />);
      default:
        return null;
    }
  };

  return (
    <>
      <NavBar />

      <div className={styles.profilePage}>
        <div className={styles.profilePageBody}>
          {/* Left section */}
          <div className={styles.leftSection}>
            <div className={styles.avatarContainer}>
              <img src={avatar}
                alt='Profile Picture'
                className={styles.avatar} />
              <label className={styles.uploadAvatarSection}>
                <Camera className={styles.cameraIcon} />
                <input
                  type="file"
                  accept='image/*'
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                  className={styles.inputAvatar}
                />
              </label>
            </div>

            {/* Right section */}
            <div className={styles.informationContainer}>
              <div className={styles.information}>
                <div className={styles.field}>
                  Họ và tên
                </div>
                <div className={styles.info}>
                  <User className={styles.icon} />
                  <div className={styles.detail}>{authUser.fullName}</div>
                </div>
              </div>
              <div className={styles.information}>
                <div className={styles.field}>
                  Email
                </div>
                <div className={styles.info}>
                  <Mail className={styles.icon} />
                  <div className={styles.detail}>{authUser.email}</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rightSection}>
            <FriendTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className={styles.contentWrapper}>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>

  )
}
