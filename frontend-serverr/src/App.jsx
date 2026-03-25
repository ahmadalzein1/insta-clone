import { Routes, Route } from 'react-router-dom';

// Route Guards & Layouts
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import { MainLayout } from './layouts/MainLayout/MainLayout';

// Pages
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { NotFound } from './pages/NotFound/NotFound';
import { VerifyEmail } from './pages/VerifyEmail/VerifyEmail';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword/ResetPassword';
import { Profile } from './pages/Profile/Profile';

function App() {
  return (
    <Routes>

      {/* 🛑 PUBLIC ROUTES (No Navbar, no auth required) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* 🔓 AUTH UTILITY PAGES (No Navbar, accessible without login) */}
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 🟢 EVERYTHING IN HERE GETS THE NAVBAR */}
      <Route element={<MainLayout />}>

        {/* 🔐 Protected — must be logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Route>

        {/* ⚠️ CATCH-ALL ROUTE (404) */}
        <Route path="*" element={<NotFound />} />
      </Route>

    </Routes>
  );
}

export default App;

