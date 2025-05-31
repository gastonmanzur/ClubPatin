import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (!token) return;

    fetch(`http://localhost:5000/api/auth/verify-email/${token}`)
      .then(() => navigate('/email-confirmed'))
      .catch(() => navigate('/register'));
  }, [location, navigate]);

  return <p>Verificando cuenta...</p>;
}
