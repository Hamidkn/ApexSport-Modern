import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar      from './components/Navbar';
import HomePage    from './pages/HomePage';
import ProgramsPage from './pages/ProgramsPage';
import CoachesPage  from './pages/CoachesPage';
import LoginPage    from './pages/LoginPage';
import SignupPage   from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';

function AppRoutes() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <>
      {!isDashboard && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"          element={<HomePage />} />
          <Route path="/programs"  element={<ProgramsPage />} />
          <Route path="/coaches"   element={<CoachesPage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/signup"    element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
