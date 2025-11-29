import { Routes, Route } from "react-router-dom";
import { HomePage } from './pages/HomePage.jsx';
import { SignInPage } from './pages/SignInPage.jsx';
import { SignUpPage } from './pages/SignUpPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

export const App = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/signin' element={<SignInPage />} />
      <Route path='/signup' element={<SignUpPage />} />
      <Route path='/*' element={<NotFoundPage />} />
    </Routes>
  )
}
