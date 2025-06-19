const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rbx')
        .setDescription('Get Roblox user info by username')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Roblox username')
                .setRequired(true)
        ),

    async execute(interaction) {
        const input = interaction.options.getString('username');
        await interaction.deferReply();

        try {
            const userRes = await fetch('https://users.roblox.com/v1/usernames/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernames: [input], excludeBannedUsers: false })
            });

            const userData = await userRes.json();
            const user = userData?.data?.[0];
            if (!user) return interaction.editReply({ content: '❌ Usuario no encontrado.' });

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

            interaction.editReply({ embeds: [embed] });

        } catch (err) {
            console.error('❌ Error fetching Roblox user:', err);
            interaction.editReply({ content: '❌ Failed to fetch Roblox user data.' });
        }
    }
};
