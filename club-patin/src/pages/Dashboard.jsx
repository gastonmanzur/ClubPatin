import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';


export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }, []);

  return user ? (
    <div>
      <h2>Bienvenido al Dashboard</h2>
      <p>Usuario ID: {user.id}</p>
      <p>Rol: {user.tipoUsuario}</p>
    </div>
  ) : (
    <p>Cargando...</p>
  );
}
