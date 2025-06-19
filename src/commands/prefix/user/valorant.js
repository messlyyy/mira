const { EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const API_KEY = '834f7665-1482-4d82-9cc2-73d218ff6d06';

module.exports = {
    name: 'valorant',
    description: 'Get Valorant stats from Tracker.gg',
    async execute(client, message, args) {
        if (args.length < 2) return message.reply('❌ Usage: `valorant <username> <tag>`');

        const username = args[0];
        const tag = args[1];
        const url = `https://public-api.tracker.gg/v2/valorant/standard/profile/riot/${encodeURIComponent(username)}%23${encodeURIComponent(tag)}`;

        try {
            const res = await fetch(url, {
                headers: { 'TRN-Api-Key': API_KEY }
            });

            const data = await res.json();

            if (!data || !data.data || !Array.isArray(data.data.segments)) {
                console.error('❌ Unexpected API structure:', data);
                return message.reply('❌ Player not found or API structure changed.');
            }

            const info = data.data;
            const profile = info.platformInfo || {};
            const segments = info.segments;
            const overview = segments.find(s => s.type === 'overview');

            const embed = new EmbedBuilder()
                .setTitle(`${profile.platformUserHandle || username}'s Valorant Stats`)
                .setURL(`https://tracker.gg/valorant/profile/riot/${username}%23${tag}/overview`)
                .setThumbnail(profile.avatarUrl || null)
                .addFields(
                    { name: 'Level', value: `${overview?.stats?.level?.displayValue || 'N/A'}`, inline: true },
                    { name: 'Rank', value: `${overview?.stats?.rank?.displayValue || 'N/A'}`, inline: true },
                    { name: 'K/D', value: `${overview?.stats?.kd?.displayValue || 'N/A'}`, inline: true }
                )
                .setColor('#FF4655');

            message.reply({ embeds: [embed] });

        } catch (err) {
            console.error('❌ Valorant fetch error:', err);
            message.reply('❌ Could not fetch Valorant stats.');
        }
    }
};
