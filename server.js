const { Client } = require("discord.js");
const client = new Client();

const config = require('./config.json');
var quotes = require('./quotes.json')

var cooldowns = {};

if (!config.token) {
    console.log('Token not set.');
    process.exit();
} else if (!config.keywords) {
    console.log('Keyword not set.');
    process.exit();
}

client.on('message', msg => {
    for (var i in config.keywords) {
        var keyword = config.keywords[i];
        if  (msg.content.toLowerCase().includes(keyword) ||
            msg.content === `<@${client.user.id}>`) {
            if (!cooldowns.hasOwnProperty(msg.author) || cooldowns.hasOwnProperty(msg.author) && new Date().getTime() - cooldowns[msg.author] > config.cooldown) {
                msg.channel.send(quotes.length > 0 ? getRandomQuote() : "Hello!");
                addCooldown(msg.author);
            } else {
                msg.channel.send(config.cooldownMessage.replace("%seconds%", (config.cooldown/1000-(new Date().getTime() - cooldowns[msg.author])/1000)));
            }
            return;
        }
    }
    
});

client.on('ready', () => {
    console.log(`Bot is in ${client.guilds.array().length} guilds`);
});

client.on('guildCreate', (guild) => {
    console.log(`Bot joined guild: ${guild.name}`)
})

function addCooldown(author) {
    if (config.cooldown <= 0) return; 
    var date = new Date().getTime();
    for (var id in cooldowns) if (date - cooldowns[id] > config.cooldown) delete cooldowns[id];
    cooldowns[author] = date;
}

client.login(config.token);

function getRandomQuote() {
    return quotes[rand(quotes.length)];    
}

function rand(max) {
    return Math.round(Math.random() * max);
}