import { Loader2, EyeOff, Eye } from "lucide-react";
import styles from './SignInPage.module.css';
import { useAuthStore } from '../stores/useAuthStore.js';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router';

export const SignInPage = () => {
  const { isSigningIn, signin } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  
  // Lấy tài khoản, mật khẩu trong localStorage
  const rememberedFormData = JSON.parse(localStorage.getItem("remember")) || { email: "", password: "" };

  const [formData, setFormData] = useState({
    email: rememberedFormData.email,
    password: rememberedFormData.password
  });

  // Ghi nhớ đăng nhập
  const [rememberMe, setRememberMe] = useState(true);

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Bạn chưa điền email!");
    if (!formData.password) return toast.error("Bạn chưa điền mật khẩu!");

    return true;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      // Nếu ấn ghi nhớ đăng nhập => lưu tài khoản, mật khẩu vào localStorage
      if (rememberMe) {
        localStorage.setItem("remember", JSON.stringify(formData));
      } else {
        localStorage.clear();
      }

      // Gửi api đăng nhập
      await signin(formData);

    }
  }

  return (
    <>
      <title>Đăng nhập</title>

      <div className={styles.signInPage}>
        <div className={styles.signInContainer}>
          <div className={styles.signInLeft}>
            <div className={styles.imageContainer}>
              <img src="images/sign-in.jpg" alt="hust-image" />
            </div>
          </div>

          <div className={styles.signInRight}>
            <div className={styles.signInRightHeaderContainer}>
              <h2 className={styles.signInRightHeader}>Đăng nhập</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="email" 
                    placeholder="example@gmail.com" 
                    value={formData.email}
                    onChange={(event) => setFormData({...formData, email: event.target.value})}
                  />
                </div>
              </div>
              <div className={styles.passwordGroup}>
                <label>Mật khẩu</label>
                <div className={styles.passwordWrapper}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"  
                    value={formData.password}
                    onChange={(event) => setFormData({...formData, password: event.target.value})}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff />
                    ) : (
                      <Eye />
                    )}
                  </button>           
                </div>     
              </div>
              <button type="submit" disabled={isSigningIn} className={styles.signInButton}>
                {isSigningIn ? (
                  <>
                    <Loader2 className={styles.loader} />
                    Loading...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </button>
              <div className={styles.loginOptions}>
                <div className={styles.rememberSection}>
                  <input type="checkbox" value="remember-me" 
                    onChange={() => {
                      setRememberMe(!rememberMe);
                    }}
                    checked = {rememberMe}
                  />
                  <label>Ghi nhớ đăng nhập</label>
                </div>
                <div>
                  <Link className={styles.forgotLink} to="/forgot">Quên mật khẩu</Link>
                </div>
              </div>
            </form>

            <div className={styles.signUpLinkContainer}>
              <Link className={styles.signUpLink} to="/signup">
                Đăng ký tài khoản →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
