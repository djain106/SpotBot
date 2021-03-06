'use strict';

require('dotenv').config();
const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const command_prefix = "!";
const queue = new Map();

// Music variables
var connection = null;
const songs = [];
var dispatcher = null;

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
        case "play":
            // songs.push(args.join(' '));
            // if (connection == null) joinCall(msg, args);
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
            msg.reply("Invalid Command!");
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
                { name: "!leave", value: "Make bot leave the voice call" },
                { name: "!monkey or !ape", value: "Send a high quality meme pic" },
                { name: "!play [url]", value: "Play audio from a given link" },
                { name: "!pause", value: "Pause audio if currently playing" }
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
        if (msg.member.voice.channel && connection == null) {
            connection = await msg.member.voice.channel.join();
            connection.voice.setSelfDeaf(true);
            dispatcher = connection.play(ytdl("https://www.youtube.com/watch?v=rUWxSEwctFU"), { quality: "highestaudio" });
            // const dispatcher = connection.play('./music.mp3');
        } else if (connection != null) {
            msg.reply("Already in a voice channel.");
        } else {
            msg.reply("You must join a voice channel first!");
        }
    }

    function play() {
        console.log('test');
        if (dispatcher == null) return;
        dispatcher.play("https://www.youtube.com/watch?v=rUWxSEwctFU");
    }

    // Add a song to current songs
    function addSong(msg, args) {
        console.log(dispatcher);
        if (dispatcher == null) return;
        console.log(args);
    }

    // Set volume for music 
    function changeVolume(msg, args) {
        if (dispatcher == null) return;

    }

    // Pause currently playing audio
    function pauseAudio(msg, args) {
        if (dispatcher != null) {
            dispatcher.pause();
        }
    }

    // Resume audio
    function resumeAudio(msg, args) {
        if (dispatcher != null) {
            dispatcher.resume();
        }
    }

    // Leave voice call to !leave
    function leaveCall(msg, args) {
        if (!msg.guild.me.voice.channel) return msg.channel.send("I'm not in a voice channel!");
        dispatcher = null;
        connection = null;
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