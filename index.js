'use strict';

require('dotenv').config();
const Discord = require("discord.js");
const client = new Discord.Client();
const command_prefix = "!";

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", (msg) => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(command_prefix)) return;

    const commandBody = msg.content.slice(command_prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    switch (command) {
        case "ping":
            callPong(msg, args);
            break;
        default:
            break;
    }
});

function callPong(msg, args) {
    msg.reply("pong!");
}

client.login(process.env.BOT_TOKEN);