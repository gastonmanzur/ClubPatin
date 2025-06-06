const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../models/User');

require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new User({
        nombre: profile.name.givenName,
        apellido: profile.name.familyName,
        email: profile.emails[0].value,
        tipoUsuario: 'Deportista',
        foto: profile.photos[0].value // 👈 Foto de Google
      });
      await user.save();
    } else if (!user.foto) {
      user.foto = profile.photos[0].value;
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));
