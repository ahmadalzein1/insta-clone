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

function App() {
  return (
    <Routes>

      {/* 🛑 PUBLIC ROUTES (No Navbar) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* 🟢 EVERYTHING IN HERE GETS THE NAVBAR! */}
      <Route element={<MainLayout />}>

        {/* 🔐 Standard Users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* ⚠️ CATCH-ALL ROUTE (404 NOT FOUND) */}
        <Route path="*" element={<NotFound />} />
      </Route>

    </Routes>
  );
}

export default App;
