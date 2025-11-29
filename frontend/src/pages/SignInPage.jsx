import React from 'react';
import './SignInPage.css';

export const SignInPage = () => {
  return (
    <div class="container">
      <div class="left">
        <div class="wrapper">
          <div class="logo-section">
            <div class="logo-box">
              💬
            </div>
            <h1>Chào bạn</h1>
            <p>Hãy bắt đầu trò chuyện đi nào</p>
          </div>


          <form class="form">
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


            <button class="btn-primary">Đăng nhập</button>
          </form>


          <div class="signin-text">
            Bạn chưa có tài khoản? <a href="/signup">Đăng ký</a>
          </div>
        </div>
      </div>


      <div class="right">
        <div class="auth-pattern">
          <h2>Chat Realtime App</h2>
          <p>Trò chuyện với bất kỳ người bạn nào của bạn.</p>
        </div>
      </div>
    </div>
  )
}
