'use strict';

require('dotenv').config();
const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const command_prefix = "!";
var connection = null;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity('WW III | !help', { type: 'COMPETING' })
        .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
        .catch(console.error);
});

client.on("message", (msg) => {
    if (msg.author.bot || msg.member == null) return;
    if (!msg.content.startsWith(command_prefix)) return;

    const commandBody = msg.content.slice(command_prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    switch (command) {
        case "ping":
            callPong(msg, args);
            break;
        case "avatar":
            displayAvatar(msg, args);
            break;
        case "join":
            joinCall(msg, args);
            break;
        case "pause":
            pauseAudio(msg, args);
            break;
        case "resume":
            resumeAudio(msg, args);
            break;
        case "leave":
            leaveCall(msg, args);
            break;
        case "monkey":
        case "ape":
            sendImage(msg, []);
            break;
        case "help":
            helpMessage(msg, args);
            break;
        default:
            break;
    }

    // Functions for commands 

    // Send help message DM from !help
    function helpMessage(msg, args) {
        const embed = new Discord.MessageEmbed()
            .setTitle("Commands List")
            .setColor(0x90ee90)
            .setDescription("This is a simple personal discord bot that will have some cool functionality in it.")
            .setFooter("Made by Daksh Jain")
            .addFields(
                { name: "!ping", value: "Returns 'pong!'" },
                { name: "!avatar", value: "Displays user's avatar" },
                { name: "!join", value: "Make bot join the user's voice call" },
                { name: "!leave", value: "Make bot leave the voice call" }
            )
            .setTimestamp();
        msg.member.send(embed).catch(console.error);
    }

    // Say pong! for !ping 
    function callPong(msg, args) {
        msg.reply("pong!");
    }

    // Return user's avatar URL to !avatar
    function displayAvatar(msg, args) {
        msg.reply(msg.author.displayAvatarURL());
    }

    // Join voice call to !join
    async function joinCall(msg, args) {
        if (!msg.guild) return;
        if (msg.member.voice.channel) {
            connection = await msg.member.voice.channel.join();
            connection.voice.setSelfDeaf(true);
            // const dispatcher = connection.play('./music.mp3');
        } else {
            msg.reply("You must join a voice channel first!");
        }
    }

    // Leave voice call to !leave
    function leaveCall(msg, args) {
        if (!msg.guild.me.voice.channel) return msg.channel.send("I'm not in a voice channel");
        msg.guild.me.voice.channel.leave();
    }

    // Send image based on args
    function sendImage(msg, args) {
        var attatchment;
        if (args.length < 1) {
            attatchment = new Discord.MessageAttachment('./monkey.png');
        } else {
            attatchment = new Discord.MessageAttachment(args[1]);
        }
        msg.channel.send(attatchment);
    }

});

// Login robot to Discord API
client.login(process.env.BOT_TOKEN);