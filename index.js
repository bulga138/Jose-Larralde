// require the discord.js module
const { Client, MessageEmbed } = require('discord.js');

// require prefix and token from config.json
// const { prefix, token } = require("./config.json");
require('dotenv').config()
const prefix = process.env.PREFIX;
const token = process.env.TOKEN;
const youtubeAPI = process.env.YOUTUBE_API_KEY;

// require ytdl-core module
const ytdl = require("ytdl-core");

// create a new Discord client
const client = new Client();

// Include the file-system module
const fs = require("fs");

//const path = require('path');

const ytpl = require('ytpl');

const streamOptions = {
    seek: 0,
    volume: 1
};

//const cron = require('node-cron');

const idPlaylist = "PLVDzogCteAXr1D0H3pHo1v1mO0i7mj0QW";

// Read the text file that contains all replies
let reply_data = fs.readFileSync("./replies.txt").toString();

// Take each reply in the text file and put them into an array
let replies = reply_data.split("\n");

let musicUrls = [];

// when the client is ready, run this code, this event will only trigger one time after logging in
client.once("ready", () => {
    console.log(`Ready as ${client.user.tag}!`);
});
client.once("reconnecting", () => {
    console.log("Reconnecting!");
});
client.once("disconnect", () => {
    console.log("Disconnect!");
});
client.on("message", async message => {
    if (message.author.bot) return;
    if (message.content.toLowerCase().startsWith(`${prefix}play`)) {
        let args = message.content.split(" ");
        let url = args[1];
        const voiceChannel = message.member.voice.channel;
        try {
            if (voiceChannel === null) {
                const embed = new MessageEmbed()
                    .setTitle(':robot: | `No te quierá hacer el vivo, andá para el canal de voz y volveme a llamar`')
                    .setColor('RANDOM');
                return message.channel.send({ embed });
            } else {
                const voiceConnection = await voiceChannel.join();

                if (ytdl.validateURL(url)) {
                    console.log("Valid URL!");
                    let flag = musicUrls.some(element => element === url);
                    if (!flag) {
                        musicUrls.push(url);
                        if (voiceChannel != null) {
                            const songInfo = await ytdl.getBasicInfo(url);
                            const song = {
                                title: songInfo.videoDetails.title,
                                url: songInfo.videoDetails.video_url,
                                thumbnail: songInfo.player_response.videoDetails.thumbnail.thumbnails[songInfo.player_response.videoDetails.thumbnail.thumbnails.length - 1].url,
                            };

                            if (voiceConnection.status === 0 && musicUrls.length - 1 !== 0) {
                                let embed = new MessageEmbed()
                                    .setThumbnail(song.thumbnail)
                                    .addFields(
                                        { name: `:robot: | \`Agregada a la lista de reproducción\``, value: `\ ${song.title}` },
                                        { name: 'URL:', value: `${song.url}` }
                                    )
                                    .setColor('RANDOM');
                                message.channel.send(embed);
                            } else {
                                try {
                                    const voiceConnection = await voiceChannel.join();
                                    await playSong(message.channel, voiceConnection, voiceChannel);

                                } catch (ex) {
                                    console.error(ex);
                                }
                            }

                        }

                    }
                }
                console.log("Invalid URL!");
            }
        } catch (er) {
            console.error(er);
        }
    } else if (message.content.startsWith(`${prefix}skip`)) {
        const voiceChannel = message.member.voice.channel;
        try {
            const voiceConnection = await voiceChannel.join();
            await skipi(message.channel, voiceConnection, voiceChannel);
        } catch (er) {
            console.error(er);
        }
        return
    } else if (message.content.startsWith(`${prefix}stop`)) {
        const voiceChannel = message.member.voice.channel;

        try {
            const voiceConnection = await voiceChannel.join();
            await stop(message.channel, voiceConnection, voiceChannel);

        } catch (ex) {
            console.error(ex);
        }
        return;
    } else if (message.content.includes(`${prefix}ping`)) {
        try {
            await ping(message);
        } catch (er) {
            console.error(er);
        }
    } else if (message.content.startsWith(`${prefix}beep`)) {
        try {
            beep(message);
        }
        catch (ex) {
            console.error(er);
        }
        // message.channel.send(':robot: | `Boop` | :gear:');
    } else if (message.content.toLowerCase().includes(`larralde`)) {
        try {
            randomReply(message)
        }
        catch (er) {
            console.error(er);
        }
    } else if (message.content === `${prefix}server`) {
        try {
            server(message);
        } catch (er) {
            console.error(er);
        }
    } else if (message.content === `${prefix}user`) {
        try {
            user(message);
        } catch (er) {
            console.error(er);
        }

    } else if (message.content === `${prefix}info`) {
        try {
            await info(message);
        } catch (er) {
            return console.err(er);
        }
    } else if (message.content === `${prefix}mute`) {
        try {
            const voiceChannel = message.member.voice.channel;
            const voiceConnection = await voiceChannel.join();
            await mute(message.channel, voiceConnection, voiceChannel);

        } catch (ex) {
            console.error(ex);
        }
    } else if (message.content.startsWith(`${prefix}pause`)) {

        try {
            const voiceChannel = message.member.voice.channel;
            const voiceConnection = await voiceChannel.join();
            message.channel.send("Pausa");
            await pause(message.channel, voiceConnection, voiceChannel);

        } catch (ex) {
            console.error(ex);
        }
    } else if (message.content.startsWith(`${prefix}resume`)) {


        try {
            const voiceChannel = message.member.voice.channel;
            const voiceConnection = await voiceChannel.join();
            message.channel.send("Resuming");
            await resume(message.channel, voiceConnection, voiceChannel);

        } catch (ex) {
            console.error(ex);
        }
    } else if (message.content.startsWith(`${prefix}say`)) {


        try {
            message.delete({ timeout: 1000 }); //Supposed to delete message
            message.reply(message.content.slice(5, message.content.length));
        }
        catch (ex) {
            console.error(ex);
        }

    } else if (message.content.startsWith(`${prefix}deleteMsg`)) {
        let args = message.content.split(" ");
        let number = args[1];
        try { deleteMessages(message, number) }
        catch (er) { console.error(er) };
    } else if (message.content.startsWith(`${prefix}seek`)) {
        let args = message.content.split(" ");
        let sec = args[1] || 0;
        const voiceChannel = message.member.voice.channel;
        const voiceConnection = await voiceChannel.join();
        try { seek(message.channel, voiceConnection, voiceChannel, sec) }
        catch (er) { console.error(er) };
    } else if (message.content === `${prefix}`) {
        message.channel.send("You need to enter a valid command!");

    }
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (message.content.toLowerCase().includes('cantate una pampa') && !message.member.voice.channel) {
        const embed = new MessageEmbed()
            .setTitle(':robot: | `No te quierá hacer el vivo, andá para el canal de voz y volveme a llamar`')
            .setColor('RANDOM');
        return message.channel.send({ embed });
    }
    else if (message.content.toLowerCase().includes('cantate una pampa')) {
        if (message.member.voice.channel) {
            let { items } = await ytpl(idPlaylist);
            items.map(item => {
                musicUrls.push(item.shortUrl);
            });
            const voiceChannel = message.member.voice.channel;
            if (voiceChannel != null) {
                try {
                    const voiceConnection = await voiceChannel.join();
                    await playSong(message.channel, voiceConnection, voiceChannel, true);

                } catch (ex) {
                    console.error(ex);
                }
            }

        }
    }
}
);
client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
    if (!channel) return;
    const embed = new MessageEmbed()
        .setDescription(`Hola, loc@de mierda, **${member.user.username}**`)
        .setColor('RANDOM');
    channel.send(embed);
});
client.on('guildMemberRemove', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
    if (!channel) return;
    const embed = new MessageEmbed()
        .setDescription(`**${member.user.username}**, se fue a la mierda che`)
        .setColor('RANDOM');
    channel.send(embed);
});

/*
client.on("message", async message => {
    if (message.author.bot) return;

    if(message.content.toLowerCase().startsWith(`${prefix}play`)) {
        let args = message.content.split(" ");
        let url = args[1];
        const voiceChannel = message.member.voice.channel;
        if (voiceChannel === null){
            const embed = new MessageEmbed()
            .setTitle(':robot: | `No te quierá hacer el vivo, andá para el canal de voz y volveme a llamar`')
            .setColor('RANDOM');
            return message.channel.send({embed});
        }else {
        const voiceConnection = await voiceChannel.join();

        if(ytdl.validateURL(url))
        {
            //console.log("Valid URL!");
            let flag = musicUrls.some(element => element === url);
            if(!flag) {
                musicUrls.push(url);
                if(voiceChannel != null)
                {
                    const songInfo = await  ytdl.getBasicInfo(url);
                    const song = {
                                title: songInfo.videoDetails.title,
                                url: songInfo.videoDetails.video_url,
                                thumbnail: songInfo.player_response.videoDetails.thumbnail.thumbnails[songInfo.player_response.videoDetails.thumbnail.thumbnails.length-1].url,
                            };
                    
                    if(voiceConnection.status === 0 && musicUrls.length-1 !==0)
                    {
                        let embed = new MessageEmbed()
                        .setThumbnail(song.thumbnail)
                        .addFields(
                            { name: `:robot: | \`Agregada a la lista de reproducción\``, value: `\ ${song.title}` },
                            { name: 'URL:', value:  `${song.url}` }
                        )
                        .setColor('RANDOM');
                        message.channel.send(embed);
                    } else
                    {
                            try{
                                const voiceConnection = await voiceChannel.join();
                                await playSong(message.channel, voiceConnection, voiceChannel);
                                        
                            } catch(ex){
                                console.error(ex);
                            }
                        }
         
                }
                
            }
        }
    }
    }    
});
*/


async function info(message) {
    if (musicUrls.length !== 0) {
        let embed = new MessageEmbed()
            .addFields(
                { name: 'Canciones por tocar:', value: `${musicUrls.length - 1}` },
                { name: '¿Querés el listado de temas que faltan?', value: '`Tenés 15 segundos para responder reaccionando.`\n✅:\ Sí\n❎:\ No' }
            )
            .setColor('RANDOM')
            .setTitle(':robot:| Acá está la info')
            .setColor('RANDOM');
        const msg = await message.channel.send({ embed })
        msg.react('✅');
        msg.react('❎');

        await msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❎'), { max: 1, time: 15000, error: ['time'] })
            .then(async collected => {
                if (collected.first().emoji.name === '✅') {
                    let musicInfo = [];
                    for (let uri of musicUrls) {
                        let stringUrl = JSON.stringify(uri);
                        const songInfo = await ytdl.getBasicInfo(stringUrl);
                        const songs = {
                            title: songInfo.videoDetails.title,
                            url: songInfo.videoDetails.video_url,
                        }
                        musicInfo.push(songs);
                    };

                    let firstIteration = true;
                    musicInfo.forEach(video => {
                        let embed = new MessageEmbed()
                            .setColor('RANDOM');
                        if (firstIteration) {
                            embed.setTitle(':robot:| Acá está la info');
                            embed.addFields({ name: `:notes: | Now playing`, value: `${JSON.stringify(video.title)}` },
                                { name: 'URL:', value: `${JSON.stringify(video.url)}` },
                                { name: 'id:', value: `${musicInfo.indexOf(video)}` },
                            )
                            message.channel.send({ embed })
                        } else {
                            embed.addFields(
                                { name: ':robot: :notes: |` Next:`', value: `${JSON.stringify(video.title)}` },
                                { name: '`URL:`', value: `${JSON.stringify(video.url)}` },
                                { name: 'id:', value: `${musicInfo.indexOf(video)}` },
                            )
                            message.channel.send({ embed });
                        };
                        firstIteration = false;
                    });
                    let embed = new MessageEmbed()
                        .addFields(
                            { name: 'Canciones por tocar:', value: `${musicUrls.length - 1}` },
                            { name: '¿Querés el listado de temas que faltan?', value: ':robot:| `Done`' }
                        )
                        .setColor('RANDOM')
                        .setTitle(':robot:| Acá está la info')
                        .setColor('RANDOM');
                    msg.edit({ embed });
                } else if (collected.first().emoji.name === '❎') {
                    let embed = new MessageEmbed()
                        .addFields(
                            { name: 'Canciones por tocar:', value: `${musicUrls.length - 1}` },
                            { name: '¿Querés el listado de temas que faltan?', value: '`❎`:\ No' }
                        )
                        .setColor('RANDOM')
                        .setTitle(':robot:| Acá está la info')
                    return msg.edit({ embed });
                } else return message.channel.send("error")
            })
            .catch(async () => {
                let embed = new MessageEmbed()
                    .addFields(
                        { name: 'Canciones por tocar:', value: `${musicUrls.length - 1}` },
                        { name: '¿Querés el listado de temas que faltan?', value: ':robot:| `Time\'s up`' }
                    )
                    .setTitle(':robot:| Acá está la info')
                    .setColor('RANDOM');
                msg.edit({ embed });
            })
    } else {
        let embed = new MessageEmbed()
            .setTitle(':robot:| `No hay canciones en la lista`')
            .setColor('RANDOM');
        return message.channel.send(embed)
    }
};

async function seek(messageChannel, voiceConnection, voiceChannel, sec) {
    const stream = ytdl(musicUrls[currentId], { filter: 'audioonly' });
    const streamOptions = {
        seek: sec,
        volume: 1
    };
    const dispacher = await voiceConnection.play(stream, streamOptions);
    dispacher.on('finish', () => {
        musicUrls.splice(random, 1);
        if (musicUrls.length === 0) {
            voiceChannel.leave();
        } else {
            setTimeout(() => {
                playSong(messageChannel, voiceConnection, voiceChannel, false);
            }, 1000);
        }
    });
};

async function randomReply(message) {
    let random = Math.floor(Math.random() * replies.length);
    const embed = new MessageEmbed()
        .addFields(
            { name: ':robot: | `Aca te va una estrofa che:`', value: `**${replies[random]}**` }
        )
        .setColor('RANDOM');
    message.channel.send({ embed });
};

async function playSong(messageChannel, voiceConnection, voiceChannel, iteration) {
    let random = Math.floor(Math.random() * musicUrls.length);
    getRandom(random);

    const stream = ytdl(musicUrls[random], { filter: 'audioonly' });

    const songInfo = await ytdl.getBasicInfo(musicUrls[random]);

    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        thumbnail: songInfo.player_response.videoDetails.thumbnail.thumbnails[songInfo.player_response.videoDetails.thumbnail.thumbnails.length - 1].url,
    };
    let firstIteration = iteration;
    const embed = new MessageEmbed()

        .addFields(
            { name: `:notes: | Now playing`, value: `${song.title}` },
            { name: 'URL:', value: `${song.url}` },
            { name: 'id', value: `${random}` }
        )
        .setColor('RANDOM')
        .setThumbnail(song.thumbnail);
    firstIteration ? embed.setTitle(':robot: | Vamo\' a tocar una milonga che') : embed.setTitle(':robot: | Vamo\' a tocar la que viene');
    messageChannel.send({ embed });
    const dispacher = voiceConnection.play(stream, streamOptions);
    console.log(dispacher.volume);
    dispacher.on('finish', () => {
        musicUrls.splice(random, 1);
        if (musicUrls.length === 0) {
            voiceChannel.leave();
        } else {
            setTimeout(() => {
                playSong(messageChannel, voiceConnection, voiceChannel, false);
            }, 1000);
        }

    })

};

let currentId = 0;
const getRandom = (random) => {
    return currentId = random;
};

/*
messageChannel.id

      queue.get(message.guild.id).connection.dispatcher.resume()
    serverQueue.connection.dispatcher.pause(true)
    if (url.includes("list=")) {
    const playlist = await ytpl(url.split("list=")[1])
    const videos = playlist.items;

    message.channel.send(`✅ Playlist **${playlist.title}** (${videos.length}) has been added to the queue!`)

    for (const video of videos) await queueSong(video, message, voiceChannel, queue)
    */

async function pause(_messageChannel, voiceConnection, _voiceChannel) {
    const stream = ytdl(musicUrls[currentId], { filter: 'audioonly' });
    const dispacher = await voiceConnection.play(stream);
    return await dispacher.pause(true);

};

async function resume(_messageChannel, voiceConnection, _voiceChannel) {
    const stream = ytdl(musicUrls[currentId], { filter: 'audioonly' });
    const dispacher = await voiceConnection.play(stream);
    return await dispacher.resume();
};

async function skipi(messageChannel, voiceConnection, voiceChannel) {
    const stream = ytdl(musicUrls[currentId], { filter: 'audioonly' });
    const dispacher = voiceConnection.play(stream, streamOptions);

    try {
        if (musicUrls.length - 1 !== 0) {
            //messageChannel.send(':robot: | `Vamo\' a tocar la que viene`');
            dispacher.destroy();
            musicUrls.splice(currentId, 1);
            setTimeout(() => {
                playSong(messageChannel, voiceConnection, voiceChannel);
            }, 1000);
        } else {
            messageChannel.send(':robot: | `No hay más canciones`');
            return await stop(messageChannel, voiceConnection, voiceChannel);
        }

    } catch (ex) {
        console.error(ex);
    }
};

async function stop(messageChannel, voiceConnection, voiceChannel) {
    const stream = ytdl(musicUrls[currentId], { filter: 'audioonly' });
    const dispacher = voiceConnection.play(stream, streamOptions);
    const embed = new MessageEmbed()
        .setTitle(':robot: | `Bueno, dejo de tocar`')
        .setColor('RANDOM');
    messageChannel.send({ embed });
    dispacher.destroy();
    musicUrls = [];
    voiceChannel.leave();

};

let vol = 1;
async function mute(messageChannel, voiceConnection, _voiceChannel) {
    const stream = ytdl(musicUrls[currentId], { filter: 'audioonly' });
    const dispacher = voiceConnection.play(stream);
    console.log(dispacher.volume);
    if (vol === 1) {
        const embed = new MessageEmbed()
            .setTitle(':robot: | `Mute`')
            .setColor('RANDOM');
        messageChannel.send({ embed });
        dispacher.setVolume(0)
        return vol = 0;


    } else {
        const embed = new MessageEmbed()
            .setTitle(':robot: | `Unmute`')
            .setColor('RANDOM');
        messageChannel.send({ embed });
        dispacher.setVolume(1)
        return vol = 1;
    }

    //const dispacher = voiceConnection.play(stream, streamOptions);
    //dispacher.on('finish', () => {playSong(messageChannel, voiceConnection, voiceChannel)});
};

const deleteMessages = async (message, number) => {
    let fetched;
    try {
        do {
            fetched = await message.channel.messages.fetch({ limit: number });
            message.channel.bulkDelete(fetched);
        }
        while (fetched.size >= 2);
    }
    catch (er) { console.error(er) };

};

const ping = async (message) => {
    const embed = new MessageEmbed()
        .setTitle(':robot: | `Pinging...`')
        .setColor('RANDOM');
    const msg = await message.reply({ embed });
    const latency = msg.createdTimestamp - message.createdTimestamp;
    embed.setTitle(':robot: | `Pong`🏓');
    embed.addFields(
        { name: '`Latency is:`', value: `${latency} ms` },
        { name: '`API Latency is: `', value: `${Math.round(client.ws.ping)} ms` })
    msg.edit({ embed });
};

const beep = async (message) => {
    const embed = new MessageEmbed()
        .setTitle(':robot: | `Boop` | :gear:')
        .setColor('RANDOM');
    message.channel.send({ embed });
};
const server = async (message) => {
    const embed = new MessageEmbed()
        .setTitle(':robot: | `Acá tenés la info`')
        .addFields(
            { name: '`Server name:`', value: `${message.guild.name}` },
            { name: '`Total members:`', value: `${message.guild.memberCount}` }
        )
        .setColor('RANDOM');
    message.channel.send({ embed });
};

const user = async (message) => {
    let avatarEmbed = new MessageEmbed()
        .setTitle(':robot: | `Acá tenés la info`')
        .addFields(
            { name: '`Your username:`', value: `${message.author.username}` },
            { name: '`Your ID:`', value: `${message.author.id}` }
        )
        .setImage(message.author.avatarURL())
        .setColor('RANDOM');
    message.channel.send(avatarEmbed);
};

/*
# ┌────────────── second (optional)
# │ ┌──────────── minute
# │ │ ┌────────── hour
# │ │ │ ┌──────── day of month
# │ │ │ │ ┌────── month
# │ │ │ │ │ ┌──── day of week
# │ │ │ │ │ │
# │ │ │ │ │ │
# * * * * * *
cron.schedule('* * 10 * *', () => {
    console.log('running a task at 10 am');
  });
  Que ejecute a las 10 una función (lunfardo del día)
*/


// login to Discord with your app's token
client.login(token)