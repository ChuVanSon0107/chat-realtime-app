import { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Camera, User, Mail } from 'lucide-react';
import styles from './ProfilePage.module.css';
import { NavBar } from '../components/NavBar.jsx'
import { Friends } from '../components/Friends.jsx';
import { FriendRequests } from '../components/FriendRequests.jsx';
import { FriendSearch } from '../components/FriendSearch.jsx';
import { FriendTabs } from '../components/FriendTabs.jsx';

export const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    // Đọc ảnh và chuyển ảnh về dạng string base 64
    reader.readAsDataURL(file);

    // event handler
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const [activeTab, setActiveTab] = useState("friends");

  const renderContent = () => {
    switch(activeTab) {
      case "friends":
        return <Friends />;
      case "requests":
        return <FriendRequests />;
      case "search":
        return <FriendSearch />;
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
              <img src={selectedImage || authUser.profilePic || '/images/avatar.png'}
                alt='Profile Picture' 
                className={styles.avatar}/>
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
            <div>
              { renderContent() }
            </div>
          </div>
        </div>
      </div>
    </>

  )
}
