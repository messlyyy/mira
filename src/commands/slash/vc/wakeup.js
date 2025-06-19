const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wakeup')
        .setDescription('Forcefully wake someone from AFK by moving them around.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to wake up')
                .setRequired(true)
        ),

    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(target.id);

        if (!member || !member.voice.channel) {
            return interaction.reply({ content: '❌ That user is not in a voice channel.', ephemeral: true });
        }

        const originalChannel = member.voice.channel;
        const vcsPath = path.join(__dirname, '../../../data/vcs.json');
        let vcsData = {};
        if (fs.existsSync(vcsPath)) vcsData = JSON.parse(fs.readFileSync(vcsPath));

        const temp1 = await interaction.guild.channels.create({
            name: 'wakeup1',
            type: 2,
            parent: originalChannel.parent
        });

        const temp2 = await interaction.guild.channels.create({
            name: 'wakeup2',
            type: 2,
            parent: originalChannel.parent
        });

        // Registrar ambos canales como tipo wakeup
        [temp1, temp2].forEach(temp => {
            vcsData[temp.id] = {
                ownerId: interaction.user.id,
                private: true,
                type: 'wakeup',
                createdAt: Date.now()
            };
        });
        fs.writeFileSync(vcsPath, JSON.stringify(vcsData, null, 2));

        await interaction.reply({ content: `⏰ Wakey wakey... Moving <@${target.id}> until they wake up.`, ephemeral: false });

        let counter = 0;
        const interval = setInterval(async () => {
            if (!member.voice.channel) return;

            if (!member.voice.selfDeaf && !member.voice.serverDeaf) {
                clearInterval(interval);
                await member.voice.setChannel(originalChannel).catch(() => {});
                await temp1.delete().catch(() => {});
                await temp2.delete().catch(() => {});
                delete vcsData[temp1.id];
                delete vcsData[temp2.id];
                fs.writeFileSync(vcsPath, JSON.stringify(vcsData, null, 2));
                await interaction.followUp({ content: `✅ He's up! Returned <@${target.id}> to their channel.`, ephemeral: false });
                return;
            }

            counter++;
            const nextChannel = counter % 2 === 0 ? temp1 : temp2;
            await member.voice.setChannel(nextChannel).catch(() => {});
        }, 1000);

        // Auto eliminar canales después de 2 minutos
        setTimeout(() => {
            [temp1, temp2].forEach(async temp => {
                if (temp && !temp.deleted) {
                    await temp.delete().catch(() => {});
                    delete vcsData[temp.id];
                    fs.writeFileSync(vcsPath, JSON.stringify(vcsData, null, 2));
                }
            });
        }, 2 * 60 * 1000); // 2 minutos
    }
};
