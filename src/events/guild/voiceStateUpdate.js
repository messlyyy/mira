const fs = require('fs');
const path = require('path');
const names = require('../../data/names.json');

module.exports = async (client, oldState, newState) => {
    if (!newState.channel || newState.channel === oldState.channel) return;
    if (newState.channel.name.toLowerCase() !== 'create') return;

    const channelName = names.channels[Math.floor(Math.random() * names.channels.length)];

    try {
        const tempChannel = await newState.guild.channels.create({
            name: channelName,
            type: newState.channel.type,
            parent: newState.channel.parent,
            permissionOverwrites: [
                {
                    id: newState.guild.id,
                    allow: ['Connect', 'ViewChannel']
                },
                {
                    id: newState.member.id,
                    allow: ['ManageChannels', 'MuteMembers', 'DeafenMembers']
                }
            ]
        });

        await newState.setChannel(tempChannel);

        // Guardar VC info en vcs.json
        const vcsPath = path.join(__dirname, '../../data/vcs.json');
        let vcsData = {};
        if (fs.existsSync(vcsPath)) vcsData = JSON.parse(fs.readFileSync(vcsPath));
        vcsData[tempChannel.id] = {
            ownerId: newState.member.id,
            private: false
        };
        fs.writeFileSync(vcsPath, JSON.stringify(vcsData, null, 2));

        // Auto-delete cuando quede vacío
        const interval = setInterval(() => {
            if (!tempChannel || tempChannel.deleted) return clearInterval(interval);

            const vcInfo = vcsData[tempChannel.id];
            if (vcInfo?.type === 'wakeup') return;

            if (tempChannel.members.size === 0) {
                tempChannel.delete().catch(() => {});
                delete vcsData[tempChannel.id];
                fs.writeFileSync(vcsPath, JSON.stringify(vcsData, null, 2));
                clearInterval(interval);
            }
        }, 2000);

    } catch (err) {
        console.error('❌ Error en voiceStateUpdate:', err);
    }
};
