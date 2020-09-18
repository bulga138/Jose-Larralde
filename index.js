// require the discord.js module
const Discord = require('discord.js');

// require prefix and token from config.json
const { prefix, token } = require('./config.json');

// create a new Discord client
const client = new Discord.Client();

// Include the file-system module
const fs = require("fs");

// Read the text file that contains all replies
let reply_data = fs.readFileSync("./replies.txt").toString();

// Take each reply in the text file and put them into an array
let replies = reply_data.split("\n");

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if message.content.toLowerCase().includes(`larralde`)) {
// Declare random for replies
	let random = Math.floor(Math.random() * replies.length);
		message.channel.send(replies[random]);
	}
});

// login to Discord with your app's token
client.login(token);
