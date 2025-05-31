import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function GoogleSuccess() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/login';
    }
  }, [location]);

  return <p>Autenticando con Google...</p>;
}
