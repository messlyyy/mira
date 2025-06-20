const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
require('dotenv').config();

// DEBUG ENV VARS
console.log("🧪 CLIENT_ID:", process.env.CLIENT_ID);
console.log("🧪 CLIENT_SECRET exists?", !!process.env.CLIENT_SECRET);
console.log("🧪 CALLBACK_URL:", 'http://localhost:3000/auth/discord/callback');

passport.serializeUser((user, done) => {
    console.log("🔐 Serializing user:", user?.id || 'undefined');
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    console.log("🔓 Deserializing user:", obj?.id || 'undefined');
    done(null, obj);
});

passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/discord/callback',
    scope: ['identify', 'guilds.join']
}, async (accessToken, refreshToken, profile, done) => {
    console.log("✅ Discord user authenticated:");
    console.log("🧾 ID:", profile.id);
    console.log("👤 Username:", profile.username);
    console.log("🔢 Discriminator:", profile.discriminator);
    console.log("🖼️ Avatar:", profile.avatar);
    done(null, profile);
}));

// EXTRA: Middleware para mostrar cualquier error global
function errorLogger(err, req, res, next) {
    console.error("❌ Error Middleware:", err);
    res.status(500).send("Error en login con Discord.");
}

module.exports = { passport, errorLogger };
