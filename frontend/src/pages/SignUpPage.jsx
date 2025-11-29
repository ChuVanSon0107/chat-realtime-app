import React from 'react';
import './SignUpPage.css';

export const SignUpPage = () => {
  return (
    <div class="container">
      <div class="left">
        <div class="wrapper">
          <div class="logo-section">
            <div class="logo-box">
              <span class="logo-icon">💬</span>
            </div>
            <h1>Đăng ký tài khoản</h1>
            <p>Chúc bạn có trải nghiệm tuyệt vời</p>
          </div>


          <form class="form">
            <div class="form-control">
              <label>Họ và tên</label>
              <div class="input-icon">
                <span class="icon">👤</span>
                <input type="text" placeholder="John Doe" />
              </div>
            </div>


            <div class="form-control">
              <label>Email</label>
              <div class="input-icon">
                <span class="icon">📧</span>
                <input type="email" placeholder="you@example.com" />
              </div>
            </div>


            <div class="form-control">
              <label>Mật khẩu</label>
              <div class="input-icon">
                <span class="icon">🔒</span>
                <input type="password" placeholder="••••••••" />
              </div>
            </div>


            <div class="btn-container">
              <button class="btn-primary">Tạo tài khoản</button>
            </div>
          </form>


          <div class="signin-text">
            Bạn có tài khoản? <a href="/signin">Đăng nhập</a>
          </div>
        </div>
      </div>


      <div class="right">
        <div class="auth-pattern">
          <h2>Chat Realtime App</h2>
          <p>Bạn có thể kết nối dễ dàng với những người bạn yêu thương nhất.</p>
        </div>
      </div>
    </div>
  )
}
