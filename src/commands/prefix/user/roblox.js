const { EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
    name: 'rbx',
    description: 'Get Roblox user info by username',
    async execute(client, message, args) {
        const input = args.join(' ');
        if (!input) return message.reply('❌ Please provide a Roblox username.');

        try {
            const userRes = await fetch('https://users.roblox.com/v1/usernames/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernames: [input], excludeBannedUsers: false })
            });

            const userData = await userRes.json();
            const user = userData?.data?.[0];
            if (!user) return message.reply('❌ Usuario no encontrado.');

            const [infoRes, presenceRes, avatarFullRes] = await Promise.all([
                fetch(`https://users.roblox.com/v1/users/${user.id}`),
                fetch('https://presence.roblox.com/v1/presence/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userIds: [user.id] })
                }),
                fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${user.id}&size=720x720&format=Png`)
            ]);

            const info = await infoRes.json();
            const presence = (await presenceRes.json()).userPresences?.[0];
            const avatarFull = (await avatarFullRes.json()).data?.[0]?.imageUrl;

            const embed = new EmbedBuilder()
                .setTitle(`${user.displayName} (@${user.name})`)
                .setURL(`https://www.roblox.com/users/${user.id}/profile`)
                .setDescription(info.description || '*No description.*')
                .addFields(
                    { name: 'ID', value: user.id.toString(), inline: true },
                    {
                        name: 'Status',
                        value: presence?.userPresenceType === 2 ? `🟢 Playing: ${presence?.lastLocation}` : '⚪️ Offline',
                        inline: true
                    }
                )
                .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${user.id}&width=150&height=150&format=png`)
                .setImage(avatarFull)
                .setColor('#da1b60');

            message.reply({ embeds: [embed] });

        } catch (err) {
            console.error('❌ Error fetching Roblox user:', err);
            message.reply('❌ Failed to fetch Roblox user data.');
        }
    }
};
