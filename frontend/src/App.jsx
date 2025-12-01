import { Routes, Route } from "react-router-dom";
import { HomePage } from './pages/HomePage.jsx';
import { SignInPage } from './pages/SignInPage.jsx';
import { SignUpPage } from './pages/SignUpPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { LoadingPage } from './pages/LoadingPage.jsx';
import { ChatPage } from './pages/ChatPage.jsx';
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./stores/useAuthStore.js";
import { useEffect } from "react";

export const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  // Kiểm tra truy cập khi reload lại page
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return <LoadingPage />
  }

  return (
    <>
      <Toaster />

      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <SignInPage />} />
        <Route path='/chat' element={authUser ? <ChatPage /> : <SignInPage /> } />
        <Route path='/*' element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
