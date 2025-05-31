import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EmailConfirmed() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate('/login'), 3000);
  }, [navigate]);

  return <h2>¡Correo confirmado! Serás redirigido al login.</h2>;
}
