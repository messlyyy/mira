const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const commandFolders = fs.readdirSync(path.join(__dirname, '../commands/slash'));

    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(path.join(__dirname, '../commands/slash', folder)).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(__dirname, '../commands/slash', folder, file));
            if (command && command.data && command.execute) {
                client.slashCommands.set(command.data.name, command);
            }
        }
    }
};
