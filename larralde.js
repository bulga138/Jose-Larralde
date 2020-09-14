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

// Configure the array used for random replies (without replies.txt)
//let replies = ["reply 1", "reply 2", "reply 3"];

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.content.startsWith(`${prefix}ping`)) {
		message.channel.send('Pong.');
	} else if (message.content.startsWith(`${prefix}beep`)) {
		message.channel.send('Boop.');
	} else if (message.content.includes(`Larralde`)) {
// Declare random for replies
		let random = Math.floor(Math.random() * replies.length);
		message.channel.send(replies[random]);
	} else if (message.content === `${prefix}server`) {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
	} else if (message.content === `${prefix}user-info`) {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	} else if (message.content.includes('larralde')) {
		// Declare random for select the replies
		let random = Math.floor(Math.random() * replies.length);
		message.channel.send(replies[random]);
	}
});

// login to Discord with your app's token
client.login(token);