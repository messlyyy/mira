const express = require('express');
const passport = require('passport');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const USERS_FILE = path.join(__dirname, '../users.json');

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/' }),
    async (req, res) => {
        try {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            console.log("📦 Usuario recibido:", req.user);
            console.log("🌐 IP capturada:", ip);

            let geo = {};
            try {
                const response = await axios.get(`http://ip-api.com/json/${ip}`);
                geo = {
                    country: response.data.country,
                    city: response.data.city,
                    region: response.data.regionName,
                    lat: response.data.lat,
                    lon: response.data.lon,
                    timezone: response.data.timezone,
                    isp: response.data.isp
                };
                console.log("🌍 GeoIP:", geo);
            } catch (geoErr) {
                console.error("❌ Error obteniendo GeoIP:", geoErr.message);
            }

            const userData = {
                id: req.user.id,
                username: req.user.username,
                discriminator: req.user.discriminator,
                avatar: req.user.avatar,
                tag: `${req.user.username}#${req.user.discriminator}`,
                geo,
                registeredAt: new Date().toISOString()
            };

            let users = [];
            if (fs.existsSync(USERS_FILE)) {
                users = JSON.parse(fs.readFileSync(USERS_FILE));
            }

            const exists = users.some(u => u.id === userData.id);
            if (!exists) {
                users.push(userData);
                fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
                console.log(`✅ Usuario registrado: ${userData.tag}`);
            } else {
                console.log(`🟡 Usuario ya registrado: ${userData.tag}`);
            }

            res.redirect('/dashboard');
        } catch (err) {
            console.error("❌ Error general:", err);
            res.redirect('/');
        }
    });

module.exports = router;
