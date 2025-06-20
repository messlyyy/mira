const express = require('express');
const session = require('express-session');
const path = require('path');
const { passport, errorLogger } = require('./passport'); // ⬅️ Ahora exporta ambos

require('dotenv').config();

const app = express();

// DEBUG: Mostrar variables de entorno
console.log("🧪 ENV CHECK");
console.log("CLIENT_ID:", process.env.CLIENT_ID);
console.log("CLIENT_SECRET exists?", !!process.env.CLIENT_SECRET);
console.log("REDIRECT_URI:", 'http://216.201.73.158:3000/auth/discord/callback');

// Session
app.use(session({
    secret: 'mira-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/dashboard'));
app.use('/auth', require('./routes/auth'));

// Middleware para capturar cualquier error no manejado
app.use(errorLogger); // ⬅️ Añade esto al final

app.listen(3000, '0.0.0.0', () => {
  console.log('? Mira Web running on http://216.201.73.158:3000');
});

