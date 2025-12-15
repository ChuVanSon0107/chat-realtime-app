import { useAuthStore } from "../stores/useAuthStore.js";
import { Link } from 'react-router';
import { LogOut, Home, User, LogIn } from "lucide-react";
import styles from './NavBar.module.css';

export const NavBar = () => {
  const { signout, authUser } = useAuthStore();

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <Link to="/" className={styles.leftSectionLink}>
          <Home className={styles.icon} />
          <span className={styles.linkName}>Trang chủ</span>
        </Link>
      </div>
      <div className={styles.rightSection}>
        { authUser ? 
        ( 
          <>
            <Link to="/profile" className={styles.rightSectionLink}>
            <User className={styles.icon} />
              <span className={styles.linkName}>Thông tin</span>
            </Link>
            <button onClick={signout} className={styles.buttonSignOut}>
              <LogOut className={styles.icon}/>
              <span className={styles.linkName}>Đăng xuất</span>
            </button>
          </>
        ) : (
          <Link to="/signin" className={styles.rightSectionLink}>
            <LogIn className={styles.icon} />
            <span className={styles.linkName}>Đăng nhập</span>
          </Link>
        )}
      </div>
    </header>
  )
}
