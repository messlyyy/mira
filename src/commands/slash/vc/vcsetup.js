const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const names = require('../../../data/names.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vcsetup')
        .setDescription('Initializes the voice channel system.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const guild = interaction.guild;

            // Nombre dinámico para la categoría
            const categoryName = names.categories[Math.floor(Math.random() * names.categories.length)];

            // Crear categoría
            const category = await guild.channels.create({
                name: `📞 ${categoryName}`,
                type: ChannelType.GuildCategory,
            });

            // Crear canal de voz
            const voiceChannel = await guild.channels.create({
                name: 'create',
                type: ChannelType.GuildVoice,
                parent: category.id,
            });

            // Crear canal de texto
            const textChannel = await guild.channels.create({
                name: 'panel',
                type: ChannelType.GuildText,
                parent: category.id,
            });

            // Embed del panel
            const embed = new EmbedBuilder()
                .setTitle('🎀 Mira VC Panel')
                .setDescription(`**🔒 Lock** – Prevent others from joining  
**🔓 Unlock** – Allow everyone to join  
**🙈 Ghost** – Hide the VC from others  
**👁️ Show** – Make the VC visible again  
**🛡️ Claim** – Only you can use the buttons  
**🚪 Release** – Everyone can use the buttons  

✏ Rename VC: \`/name <new name>\`  
⏰ Wake someone: \`/wakeup @user\``)
                .setColor('#ffcfe0');

            // Botones en dos filas
            const row1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('lock').setLabel('Lock').setEmoji('🔒').setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId('unlock').setLabel('Unlock').setEmoji('🔓').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('ghost').setLabel('Ghost').setEmoji('🙈').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('show').setLabel('Show').setEmoji('👁️').setStyle(ButtonStyle.Primary)
            );

            const row2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('claim').setLabel('Claim').setEmoji('🛡️').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('release').setLabel('Release').setEmoji('🚪').setStyle(ButtonStyle.Primary)
            );

            // Enviar el panel
            await textChannel.send({ embeds: [embed], components: [row1, row2] });

            await interaction.editReply({ content: '✅ VC system setup complete.' });
        } catch (err) {
            console.error('❌ Error in /vcsetup:', err);
            await interaction.editReply({ content: '❌ Something went wrong during setup.' });
        }
    }
};
