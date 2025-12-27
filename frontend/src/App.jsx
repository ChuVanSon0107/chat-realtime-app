import { Routes, Route, Navigate } from "react-router-dom";
import { ChatPage } from './pages/ChatPage.jsx';
import { SignInPage } from './pages/SignInPage.jsx';
import { SignUpPage } from './pages/SignUpPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { LoadingPage } from './pages/LoadingPage.jsx';
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
        <Route path='/' element={ authUser ? <ChatPage /> : <Navigate to ='/signin' />} />
        <Route path='/signin' element={authUser ? <Navigate to='/' /> : <SignInPage />} />
        <Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUpPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/signin' />} /> 
        <Route path='/*' element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
