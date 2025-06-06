import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:5000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setUser(data);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
      });
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch('http://localhost:5000/api/auth/upload-avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await res.json();
      setUser((prev) => ({ ...prev, foto: data.foto }));
    } catch {
      alert('Error al subir imagen');
    }
  };

  const initials = user ? (user.nombre?.[0] || '') + (user.apellido?.[0] || '') : 'US';

  const avatarSrc = user?.foto?.startsWith('http')
    ? user.foto
    : user?.foto ? `http://localhost:5000${user.foto}` : null;

  const getMenuLinks = () => {
    if (!user) {
      return [
        { to: '/noticias', label: 'Noticias' },
        { to: '/contacto', label: 'Contacto' }
      ];
    }

    switch (user.tipoUsuario) {
      case 'Tecnico':
        return [
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/alumnos', label: 'Alumnos' },
          { to: '/gestionar', label: 'Gestionar Club' },
          { to: '/noticias', label: 'Noticias' }
        ];
      case 'Delegado':
        return [
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/gestionar', label: 'Gestionar Club' },
          { to: '/noticias', label: 'Noticias' },
          { to: '/contacto', label: 'Contacto' }
        ];
      default:
        return [
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/noticias', label: 'Noticias' },
          { to: '/contacto', label: 'Contacto' }
        ];
    }
  };

  const menuLinks = getMenuLinks();

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <img src="http://localhost:5000/uploads/Logo_patin.png" alt="Club" style={styles.logo} />
      </div>

      <div style={styles.center}>
        {menuLinks.map(link => (
          <Link key={link.to} to={link.to} style={styles.link}>{link.label}</Link>
        ))}
      </div>

      <div style={styles.right}>
        <div style={styles.profileWrapper}>
          <div style={styles.avatar} onClick={() => fileInputRef.current.click()}>
            {avatarSrc ? (
              <img src={avatarSrc} alt="Perfil" style={styles.avatarImg} />
            ) : (
              <span>{initials.toUpperCase()}</span>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept="image/*"
            />
          </div>
          <button onClick={() => setShowMenu(!showMenu)} style={styles.toggleMenu}>▼</button>
          {showMenu && (
            <div style={styles.dropdown}>
              <button onClick={logout}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 20px',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #ccc'
  },
  left: {},
  logo: {
    height: '60px',
    borderRadius: '50%'
  },
  center: {
    display: 'flex',
    gap: '20px'
  },
  link: {
    textDecoration: 'none',
    color: '#333'
  },
  right: {
    position: 'relative'
  },
  profileWrapper: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  avatar: {
    width: '40px',
    height: '40px',
    backgroundColor: '#0077cc',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    overflow: 'hidden',
    marginRight: '10px'
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  toggleMenu: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer'
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '50px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '5px',
    zIndex: 10
  }
};
