require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];

const foldersPath = path.join(__dirname, 'src/commands/slash');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(path.join(foldersPath, folder)).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./src/commands/slash/${folder}/${file}`);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        }
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

(async () => {
    try {
        console.log('🔁 Refrescando comandos slash...');

        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: commands,
        });

        console.log('✅ Comandos registrados solo en el servidor de prueba');
    } catch (error) {
        console.error('❌ Error al registrar comandos:', error);
    }
})();
