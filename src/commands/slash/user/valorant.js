const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const API_KEY = '834f7665-1482-4d82-9cc2-73d218ff6d06';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('valorant')
        .setDescription('Get Valorant stats from Tracker.gg')
        .addStringOption(opt => opt.setName('username').setDescription('Your Riot username').setRequired(true))
        .addStringOption(opt => opt.setName('tag').setDescription('Your Riot tag').setRequired(true)),

    async execute(interaction) {
        const username = interaction.options.getString('username');
        const tag = interaction.options.getString('tag');
        const url = `https://public-api.tracker.gg/v2/valorant/standard/profile/riot/${username}%23${tag}`;

        try {
            const res = await fetch(url, {
                headers: { 'TRN-Api-Key': API_KEY }
            });

            const data = await res.json();
            if (!data || data.errors) return interaction.reply({ content: '❌ Player not found or API error.', ephemeral: true });

            const info = data.data;
            const stats = info.segments.find(s => s.type === 'overview');

            const embed = new EmbedBuilder()
                .setTitle(`${info.platformInfo.platformUserHandle}'s Valorant Stats`)
                .setThumbnail(info.platformInfo.avatarUrl)
                .addFields(
                    { name: 'Level', value: `${info.segments[0]?.stats?.level?.displayValue || 'N/A'}`, inline: true },
                    { name: 'Rank', value: `${stats?.stats?.rank?.displayValue || 'N/A'}`, inline: true },
                    { name: 'K/D', value: `${stats?.stats?.kd?.displayValue || 'N/A'}`, inline: true },
                )
                .setColor('#FF4655');

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error('❌ Valorant fetch error:', err);
            interaction.reply({ content: '❌ Could not fetch Valorant stats.', ephemeral: true });
        }
    }
};
