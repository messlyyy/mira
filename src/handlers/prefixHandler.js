const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const blockedFolders = ['moderation', 'admin', 'ai'];
    const commandPath = path.join(__dirname, '../commands/prefix');

    fs.readdirSync(commandPath).forEach(folder => {
        if (blockedFolders.includes(folder)) return;
        const folderPath = path.join(commandPath, folder);
        fs.readdirSync(folderPath).forEach(file => {
            if (file.endsWith('.js')) {
                const command = require(path.join(folderPath, file));
                if (command && command.name && command.execute) {
                    client.prefixCommands.set(command.name, command);
                }
            }
        });
    });
};
