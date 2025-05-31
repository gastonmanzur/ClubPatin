import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function PrivateRoute() {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    if (decoded.exp < now) {
      localStorage.removeItem('token');
      return <Navigate to="/login" />;
    }
    return <Outlet />;
  } catch {
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }
}
