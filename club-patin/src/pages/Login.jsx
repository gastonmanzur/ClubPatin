import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  const googleLogin = () => {
    window.open('http://localhost:5000/api/auth/google', '_self');
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Iniciar Sesión</h2>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} style={styles.input} required />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} style={styles.input} required />
        <button type="submit" style={styles.button}>Entrar</button>
        <button type="button" onClick={googleLogin} style={{ ...styles.button, backgroundColor: '#0db8de' }}>
          Iniciar sesión con Google
        </button>
        <p style={styles.redirect}>¿No tienes cuenta? <Link to="/register" style={styles.link}>Regístrate</Link></p>
        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#121212',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: '30px',
    borderRadius: '10px',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  title: {
    color: '#0f0',
    textAlign: 'center'
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    fontSize: '14px'
  },
  button: {
    padding: '10px',
    backgroundColor: '#0f0',
    color: '#000',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  redirect: {
    color: '#fff',
    fontSize: '13px',
    textAlign: 'center'
  },
  link: {
    color: '#0db8de',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  message: {
    color: '#f66',
    fontSize: '13px',
    textAlign: 'center'
  }
};
