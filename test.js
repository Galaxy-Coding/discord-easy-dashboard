/* Require discord.js and discord-easy-dashboard */
const { Client, Intents } = require('discord.js');
const Dashboard = require('./index.js');

/* create the discord client */
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

/* Initiate the Dashboard class and attach it to the discord client for easy access */
client.dashboard = new Dashboard(client, {
    name: 'DashBot', // Bot's name
    description: 'A super cool bot with an online dashboard!', // Bot's description
    baseUrl: 'http://localhost', // Leave this if ur in local development
    port: 80,
    secret: 'cl13nt.s3cr3t', // client.secret -> accessible at https://discord.com/developers/applications (OAuth2 section)
});

client.prefixes = {}; // We' ll store the prefixes of each server here

const validatePrefix = prefix => prefix.length <= 5; // Only accepts prefixes of up to 5 characters
const setPrefix = (discordClient, guild, value) => discordClient.prefixes[guild.id] = value; // Stores the prefix in the client.prefixes object
const getPrefix = (discordClient, guild) => discordClient.prefixes[guild.id] || '!'; // Get the prefix in the client.prefixes object or give the default one

// Here we indicate to the module that we want the user to be able to set the prefix of his bot
client.dashboard.addTextInput('Prefix', 'The prefix that is added to discord messages in order to invoke commands.', validatePrefix, setPrefix, getPrefix);

client.on('ready', () => console.log(`${client.user.tag} is ready !`)); // To know when the bot is launched
client.dashboard.on('ready', () => {
    console.log(`Dashboard launched on port ${config.port} - ${config.baseUrl}${config.port === 80 ? '' : ':' + config.port}`);
})

client.on('messageCreate', message => {
    
    let prefix = getPrefix(client, message.guild); // We reuse our function to gain in readability!

    if (message.content.startsWith(prefix + 'ping')) message.reply('Pong !'); // 🏓 :D
});

client.login('sup3r-s3cr3t-t0k3n'); // Discord API login