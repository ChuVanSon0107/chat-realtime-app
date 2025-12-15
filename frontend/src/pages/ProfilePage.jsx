import { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Camera, User, Mail } from 'lucide-react';
import styles from './ProfilePage.module.css';
import { NavBar } from '../components/NavBar.jsx'

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

  return (
    <>
      <NavBar />
      
      <div className={styles.profilePage}>
        <div className={styles.header}>
          Thông tin cá nhân
        </div>
        <div className={styles.profilePageBody}>
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

          </div>
          <div className={styles.rightSection}>
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
        </div>
      </div>
    </>

  )
}
