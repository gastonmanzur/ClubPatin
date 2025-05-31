import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    tipoUsuario: 'Deportista',
    codigoEspecial: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.nombre) errs.nombre = 'Nombre requerido';
    if (!form.apellido) errs.apellido = 'Apellido requerido';
    if (!form.email.includes('@')) errs.email = 'Email inválido';
    if (form.password.length < 6) errs.password = 'Contraseña muy corta';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Las contraseñas no coinciden';
    if ((form.tipoUsuario === 'Tecnico' || form.tipoUsuario === 'Delegado') && !form.codigoEspecial) {
      errs.codigoEspecial = 'Se requiere un código especial';
    }
    return errs;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error al registrar');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Crear Cuenta</h2>
        <input name="nombre" placeholder="Nombre" onChange={handleChange} style={styles.input} />
        {errors.nombre && <span style={styles.error}>{errors.nombre}</span>}

        <input name="apellido" placeholder="Apellido" onChange={handleChange} style={styles.input} />
        {errors.apellido && <span style={styles.error}>{errors.apellido}</span>}

        <input name="email" type="email" placeholder="Email" onChange={handleChange} style={styles.input} />
        {errors.email && <span style={styles.error}>{errors.email}</span>}

        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} style={styles.input} />
        {errors.password && <span style={styles.error}>{errors.password}</span>}

        <input name="confirmPassword" type="password" placeholder="Confirmar Contraseña" onChange={handleChange} style={styles.input} />
        {errors.confirmPassword && <span style={styles.error}>{errors.confirmPassword}</span>}

        <select name="tipoUsuario" onChange={handleChange} style={styles.input}>
          <option value="Deportista">Deportista</option>
          <option value="Tecnico">Técnico</option>
          <option value="Delegado">Delegado</option>
        </select>

        {(form.tipoUsuario === 'Tecnico' || form.tipoUsuario === 'Delegado') && (
          <>
            <input name="codigoEspecial" placeholder="Código especial" onChange={handleChange} style={styles.input} />
            {errors.codigoEspecial && <span style={styles.error}>{errors.codigoEspecial}</span>}
          </>
        )}

        <button type="submit" style={styles.button}>Registrarse</button>
        <p style={styles.redirect}>¿Ya tienes cuenta? <Link to="/login" style={styles.link}>Inicia sesión</Link></p>
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
    gap: '10px'
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
    color: '#0db8de',
    fontSize: '13px',
    textAlign: 'center'
  },
  error: {
    color: '#f66',
    fontSize: '12px'
  }
};
