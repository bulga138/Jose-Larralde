// require the discord.js module
const { Client, EmbedBuilder, GatewayIntentBits,Collection  } = require('discord.js');

require('dotenv').config()
const prefix = process.env.PREFIX;
const token = process.env.TOKEN;
const youtubeAPI = process.env.YOUTUBE_API_KEY;

// require ytdl-core module
const ytdl = require("ytdl-core");

// create a new Discord client
const client = new Client({ intents: [ 
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
    ]
});

// Include the file-system module
const fs = require("fs");

const ytpl = require('ytpl');

const { joinVoiceChannel, createAudioPlayer, getVoiceConnection, VoiceConnectionStatus } = require('@discordjs/voice');

const player = createAudioPlayer();

const streamOptions = {
    seek: 0,
    volume: 1
};

function getHex() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padEnd(6, '0');
  }

const idPlaylist = "PLVDzogCteAXr1D0H3pHo1v1mO0i7mj0QW";

// Read the text file that contains all replies and take each reply in the text file and put them into an array
let replies = fs.readFileSync("./replies.txt").toString().split("\n");

let musicUrls = [];

// When the client is ready, run this code, this event will only trigger one time after logging in
client.on("ready", () => {
    console.log(`Ready as ${client.user.tag}!`);
});
client.once("reconnecting", () => {
    console.log("Reconnecting!");
});
client.once("disconnect", () => {
    console.log("Disconnect!");
});
// client.on('interactionCreate', async interaction => {
//     if (!interaction.isChatInputCommand()) return;
//     console.log(interaction);
//     if (interaction.commandName === 'ping') {
//       await interaction.reply('Pong!');
//     }
// });

client.on("messageCreate", async message => {
    if (message.author.bot) return;
    
    console.log(message.content);

    if (message.content.toLowerCase().startsWith(`${prefix}play`)) {
        let args = message.content.split(" ");
        let url = args[1];
        const voiceChannel = message.member.voice.channel;
        if (voiceChannel === null) {
            const embed = new EmbedBuilder()
                .setTitle(':robot: | `No te quierá hacer el vivo, andá para el canal de voz y volveme a llamar`')
                .setColor(getHex());
            return message.channel.send({ embeds: [embed]});
        } else {
            const voiceConnection = await voiceChannel.join();

            if (ytdl.validateURL(url)) {
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
                            let embed = new EmbedBuilder()
                                .setThumbnail(song.thumbnail)
                                .addFields(
                                    { name: `:robot: | \`Agregada a la lista de reproducción\``, value: `\ ${song.title}` },
                                    { name: 'URL:', value: `${song.url}` }
                                )
                                .setColor(getHex());
                            message.channel.send(embed);
                        } else {
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
        }
    } else if (message.content.startsWith(`${prefix}skip`)) {

    } else if (message.content.startsWith(`${prefix}stop`)) {

    } else if (message.content.includes(`${prefix}ping`)) {
        try {
            await ping(message);
        } catch (er) {
            console.error(er);
        }
    } else if (message.content.startsWith(`${prefix}beep`)) {
        try {
            await beep(message);
        }
        catch (ex) {
            console.error(er);
        }
        // message.channel.send(':robot: | `Boop` | :gear:');
    } else if (message.content.toLowerCase().includes(`larralde`)) {
        try {
            await randomReply(message)
        }
        catch (er) {
            console.error(er);
        }
    } else if (message.content === `${prefix}server`) {
        try {
            await server(message);
        } catch (er) {
            console.error(er);
        }
    } else if (message.content === `${prefix}user`) {
        try {
            await user(message);
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

    } else if (message.content.startsWith(`${prefix}pause`)) {

    } else if (message.content.startsWith(`${prefix}resume`)) {

    } else if (message.content.startsWith(`${prefix}say`)) {

        try {
            if (message.content.slice(5, message.content.length)) {
                message.delete({ timeout: 1000 }); //Supposed to delete message    
                message.reply(message.content.slice(5, message.content.length));
            } else {
                message.channel.send("You need to enter a valid message!")
            };
        }
        catch (ex) {
            console.error(ex);
        }

    } else if (message.content.startsWith(`${prefix}deleteMsg`)) {
        let args = message.content.split(" ");
        let number = args[1];
        try { await deleteMessages(message, number) }
        catch (er) { console.error(er) };
    } else if (message.content.startsWith(`${prefix}seek`)) {
        
    } else if (message.content === `${prefix}`) {
        message.channel.send("You need to enter a valid command!");
    }
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (message.content.toLowerCase().includes('cantate una pampa') && !message.member.voice.channel) {
        const embed = new EmbedBuilder()
            .setTitle(':robot: | `No te quierá hacer el vivo, andá para el canal de voz y volveme a llamar`')
            .setColor(getHex());
        return await message.channel.send({ embeds: [embed] });

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
client.on('guildMemberAdd', async member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
    if (!channel) return;
    const embed = new EmbedBuilder()
        .setDescription(`Hola, loc@de mierda, **${member.user.username}**`)
        .setColor(getHex());
    await message.channel.send({ embeds: [embed] });
});
client.on('guildMemberRemove', async member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
    if (!channel) return;
    const embed = new EmbedBuilder()
        .setDescription(`**${member.user.username}**, se fue a la mierda che`)
        .setColor(getHex());
    await message.channel.send({ embeds: [embed] });
});

async function info(message) {
    if (musicUrls.length !== 0) {
        let embed = new EmbedBuilder()
            .addFields(
                { name: 'Canciones por tocar:', value: `${musicUrls.length - 1}` },
                { name: '¿Querés el listado de temas que faltan?', value: '`Tenés 15 segundos para responder reaccionando.`\n✅:\ Sí\n❎:\ No' }
            )
            .setColor(getHex())
            .setTitle(':robot:| Acá está la info')
            .setColor(getHex());
        const msg = await message.channel.send({ embeds: [embed] });
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
                    musicInfo.forEach( async video => {
                        let embed = new EmbedBuilder()
                            .setColor(getHex());
                        if (firstIteration) {
                            embed.setTitle(':robot:| Acá está la info');
                            embed.addFields({ name: `:notes: | Now playing`, value: `${JSON.stringify(video.title)}` },
                                { name: 'URL:', value: `${JSON.stringify(video.url)}` },
                                { name: 'id:', value: `${musicInfo.indexOf(video)}` },
                            )
                            await message.channel.send({ embeds: [embed] });
                        } else {
                            embed.addFields(
                                { name: ':robot: :notes: |` Next:`', value: `${JSON.stringify(video.title)}` },
                                { name: '`URL:`', value: `${JSON.stringify(video.url)}` },
                                { name: 'id:', value: `${musicInfo.indexOf(video)}` },
                            )
                            await message.channel.send({ embeds: [embed] });
                        };
                        firstIteration = false;
                    });
                    let embed = new EmbedBuilder()
                        .addFields(
                            { name: 'Canciones por tocar:', value: `${musicUrls.length - 1}` },
                            { name: '¿Querés el listado de temas que faltan?', value: ':robot:| `Done`' }
                        )
                        .setColor(getHex())
                        .setTitle(':robot:| Acá está la info')
                        .setColor(getHex());
                    msg.edit({ embeds:[embed] });
                } else if (collected.first().emoji.name === '❎') {
                    let embed = new EmbedBuilder()
                        .addFields(
                            { name: 'Canciones por tocar:', value: `${musicUrls.length - 1}` },
                            { name: '¿Querés el listado de temas que faltan?', value: '`❎`:\ No' }
                        )
                        .setColor(getHex())
                        .setTitle(':robot:| Acá está la info')
                    return msg.edit({ embeds:[embed] });
                } else return await message.channel.send({ embeds: ["error"] });
            })
            .catch(async () => {
                let embed = new EmbedBuilder()
                    .addFields(
                        { name: 'Canciones por tocar:', value: `${musicUrls.length - 1}` },
                        { name: '¿Querés el listado de temas que faltan?', value: ':robot:| `Time\'s up`' }
                    )
                    .setTitle(':robot:| Acá está la info')
                    .setColor(getHex());
                msg.edit({ embeds:[embed] });
            })
    } else {
        let embed = new EmbedBuilder()
            .setTitle(':robot:| `No hay canciones en la lista`')
            .setColor(getHex());
        return await message.channel.send({ embeds: [embed] });
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
    const embed = new EmbedBuilder()
        .addFields(
            { name: ':robot: | `Aca te va una estrofa che:`', value: `**${replies[random]}**` }
        )
        .setColor(getHex());
        await message.channel.send({ embeds: [embed] });
    };

async function playSong(messageChannel, voiceConnection, voiceChannel, iteration) {
    let random = Math.floor(Math.random() * musicUrls.length);
    getRandom(random);
    console.log(random, currentId, musicUrls.length, musicUrls[random])
    const stream = ytdl(musicUrls[random], { filter: 'audioonly' });

    const songInfo = await ytdl.getBasicInfo(musicUrls[random]);

    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        thumbnail: songInfo.player_response.videoDetails.thumbnail.thumbnails[songInfo.player_response.videoDetails.thumbnail.thumbnails.length - 1].url,
    };
    console.log(song);

    let firstIteration = iteration;
    const embed = new EmbedBuilder()
        .addFields(
            { name: `:notes: | Now playing`, value: `${song.title}` },
            { name: 'URL:', value: `${song.url}` },
            { name: 'id', value: `${random}` }
        )
        .setColor(getHex())
        .setThumbnail(song.thumbnail);

    firstIteration ? embed.setTitle(':robot: | Vamo\' a tocar una milonga che') : embed.setTitle(':robot: | Vamo\' a tocar la que viene');

    await message.channel.send({ embeds: [embed] });
    const connection = getVoiceConnection(voiceChannel.guild.id);
    connection.subscribe(player);

    player.on('stateChange', (oldState, newState) => {
        console.log(`State change: ${oldState.status} -> ${newState.status}`);
    }
    );
    player.on('error', (error) => {
        console.error(`Error: ${error.message} with track ${musicUrls[random]}`);
    }
    );
    player.on('finish', () => {
        musicUrls.splice(random, 1);
        if (musicUrls.length === 0) {
            voiceChannel.leave();
        } else {
            setTimeout(() => {
                playSong(messageChannel, voiceConnection, voiceChannel, false);
            }, 1000);
        }
    }
    )

    // const dispacher = player.play(stream, streamOptions);
    // console.log(dispacher.volume);
    // dispacher.on('finish', () => {
    //     musicUrls.splice(random, 1);
    //     if (musicUrls.length === 0) {
    //         voiceChannel.leave();
    //     } else {
    //         setTimeout(() => {
    //             playSong(messageChannel, voiceConnection, voiceChannel, false);
    //         }, 1000);
    //     }

    // }
    // )

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
    const embed = new EmbedBuilder()
        .setTitle(':robot: | `Bueno, dejo de tocar`')
        .setColor(getHex());
        await message.channel.send({ embeds: [embed] });
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
        const embed = new EmbedBuilder()
            .setTitle(':robot: | `Mute`')
            .setColor(getHex());
            await message.channel.send({ embeds: [embed] });
            dispacher.setVolume(0)
        return vol = 0;


    } else {
        const embed = new EmbedBuilder()
            .setTitle(':robot: | `Unmute`')
            .setColor(getHex());
            await message.channel.send({ embeds: [embed] });
            dispacher.setVolume(1)
        return vol = 1;
    }

    //const dispacher = voiceConnection.play(stream, streamOptions);
    //dispacher.on('finish', () => {playSong(messageChannel, voiceConnection, voiceChannel)});
};

const deleteMessages = async (message, number) => {
    try {
      let deleted = new Collection();
      let toDelete = number;
  
      while (toDelete > 0) {
        const fetched = await message.channel.messages.fetch({ limit: Math.min(toDelete, 100) }); // Fetch max 100 messages at once
  
        // Filter messages to delete within the 14-day limit
        const deletable = fetched.filter(msg => Date.now() - msg.createdTimestamp < 1209600000); // 14 days in milliseconds
  
        deleted = deleted.concat(deletable);
        toDelete -= deletable.size;
  
        if (deletable.size > 0) {
          await message.channel.bulkDelete(deletable);
        } else {
          // No more messages within the 14-day limit are found
          break;
        }
      }
  
      if (deleted.size > 0) {
        console.log(`Successfully deleted ${deleted.size} messages.`); // Informational message
      } else {
        console.log('No messages found within the 14-day limit for deletion.');
      }
    } catch (error) {
      console.error('Error deleting messages:', error);
    }
  };

const ping = async (message) => {
    const embed = new EmbedBuilder()
        .setTitle(':robot: | `Pinging...`')
        .setColor(getHex());
    const msg = await message.channel.send({ embeds: [embed] });
    const latency = msg.createdTimestamp - message.createdTimestamp;
    embed.setTitle(':robot: | `Pong`🏓');
    embed.addFields(
        { name: '`Latency is:`', value: `${latency} ms` },
        { name: '`API Latency is: `', value: `${Math.round(client.ws.ping)} ms` })
    await msg.edit({ embeds: [embed] });
};

const beep = async (message) => {
    const embed = new EmbedBuilder()
        .setTitle(':robot: | `Boop` | :gear:')
        .setColor(getHex());
    await message.channel.send({ embeds: [embed] });
};
const server = async (message) => {
    const embed = new EmbedBuilder()
        .setTitle(':robot: | `Acá tenés la info`')
        .addFields(
            { name: '`Server name:`', value: `${message.guild.name}` },
            { name: '`Total members:`', value: `${message.guild.memberCount}` }
        )
        .setColor(getHex());
    await message.channel.send({ embeds: [embed] });
    };

const user = async (message) => {
    let avatarEmbed = new EmbedBuilder()
        .setTitle(':robot: | `Acá tenés la info`')
        .addFields(
            { name: '`Your username:`', value: `${message.author.username}` },
            { name: '`Your ID:`', value: `${message.author.id}` }
        )
        .setImage(message.author.avatarURL())
        .setColor(getHex());
        await message.channel.send({ embeds: [avatarEmbed] });
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