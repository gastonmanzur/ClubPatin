import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import GoogleSuccess from './pages/GoogleSuccess';
import Dashboard from './pages/Dashboard';
import VerifyEmail from './pages/VerifyEmail';
import EmailConfirmed from './pages/EmailConfirmed';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Páginas sin navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/email-confirmed" element={<EmailConfirmed />} />

        {/* Páginas con navbar */}
        <Route element={<MainLayout />}>
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Más rutas públicas con navbar si deseas */}
          <Route path="/" element={<h1>Bienvenido al Club de Patinaje</h1>} />
          <Route path="/alumnos" element={<h2>Alumnos</h2>} />
          <Route path="/gestionar" element={<h2>Gestionar Club</h2>} />
          <Route path="/noticias" element={<h2>Noticias</h2>} />
          <Route path="/contacto" element={<h2>Contacto</h2>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
