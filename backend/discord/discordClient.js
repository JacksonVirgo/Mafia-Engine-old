const Discord = require('discord.js');
const Client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

Client.on('ready', async () => {
    console.log(Client.user.username + ' is online.');
});

Client.on('message', async (message) => {
    console.log('Message ');
});
