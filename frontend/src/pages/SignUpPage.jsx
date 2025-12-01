import { Link } from 'react-router';
import styles from './SignUpPage.module.css';
import { useState} from 'react';
import { useAuthStore } from '../stores/useAuthStore';

import toast from "react-hot-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";

export function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Bạn chưa điền Họ và tên!");
    if (!formData.email.trim()) return toast.error("Bạn chưa điền Email!");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Sai định dạng Email"); // Kiểm tra định dạng email
    if (!formData.password) return toast.error("Bạn chưa điền Mật khẩu!");
    if (formData.password.length < 6) return toast.error("Mật khẩu phải ít nhất 6 kí tự")

    return true;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      await signup(formData);
    }
  }

  return (
    <>
      <title>Đăng ký</title>

      <div className={styles.signUpPage}>
        <div className={styles.signUpContainer}>
          <div className={styles.signUpLeft}>
            <img src="images/sign-up.jpg" alt="hust" />
          </div>
          <div className={styles.signUpRight}>
            <div>
              <h2>Đăng ký</h2>
            </div>
            <form onSubmit={submit}>
              <div className={styles.inputGroup}>
                <label>Họ và tên</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="text" 
                    placeholder="Chu Văn Sơn" 
                    value={formData.fullName}
                    onChange={(event) => setFormData({...formData, fullName: event.target.value})}
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="text" 
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
              <button 
                type="submit"
                disabled={isSigningUp}
                className={styles.signUpButton}
              >{isSigningUp ? (
                <>
                  < Loader2 className={styles.loader} />
                  Loading...
                </>
              ) : ("Đăng kí")}
              </button>
            </form>

            <div>
              <Link className={styles.signInLink} to="/signin">
                Đã có tài khoản →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}