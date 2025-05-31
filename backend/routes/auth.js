const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const verifyRoleCode = require('../utils/verifyRoleCode');
const multer = require('multer');
const path = require('path');
const passport = require('passport');

require('dotenv').config();

const router = express.Router();

// Configurar transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Registro de usuario
router.post('/register', async (req, res) => {
  const { nombre, apellido, email, password, tipoUsuario, codigoEspecial } = req.body;

  if ((tipoUsuario === 'Tecnico' || tipoUsuario === 'Delegado') && !verifyRoleCode(tipoUsuario, codigoEspecial)) {
    return res.status(403).json({ error: 'Código especial inválido' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      tipoUsuario,
      verificationToken,
      verified: false
    });

    await newUser.save();

    const verifyURL = `http://localhost:5173/verify-email?token=${verificationToken}`;

    await transporter.sendMail({
      from: `"Club Patín Carrera" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Confirma tu cuenta',
      html: `<h3>Hola ${nombre},</h3><p>Haz clic en el siguiente enlace para confirmar tu cuenta:</p><a href="${verifyURL}">Confirmar cuenta</a>`
    });

    res.status(201).json({ message: 'Registro exitoso. Revisa tu correo para confirmar tu cuenta.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Verificación del email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).send('Token inválido o expirado');

    user.verified = true;
    user.verificationToken = null;
    await user.save();

    res.redirect('http://localhost:5173/email-confirmed');
  } catch {
    res.status(500).send('Error al verificar email');
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (!user.verified) return res.status(403).json({ error: 'Debes confirmar tu email antes de iniciar sesión' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user._id, tipoUsuario: user.tipoUsuario }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        tipoUsuario: user.tipoUsuario
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});


router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }), (req, res) => {
    const token = jwt.sign({
      id: req.user._id,
      tipoUsuario: req.user.tipoUsuario
    }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.redirect(`http://localhost:5173/google-success?token=${token}`);
  });


// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // crea la carpeta si no existe
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Ruta para subir imagen de perfil
router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('No autorizado');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).send('Usuario no encontrado');

   user.foto = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ message: 'Imagen actualizada', foto: user.foto });
  } catch (err) {
    res.status(500).json({ error: 'Error al subir imagen' });
  }
});

router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('No autorizado');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch {
    res.status(500).send('Error al obtener usuario');
  }
});



module.exports = router;
