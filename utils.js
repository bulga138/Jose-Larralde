const { EmbedBuilder } = require('discord.js');

// Function to get random hex color code
function getHex() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padEnd(6, '0');
}

// Function to simulate playing a sound
function play(sound) {
    // Code to play the sound
    console.log(`Playing ${sound}`);
}

// Function to stop playing a sound
function stop(sound) {
    // Code to stop playing the sound
    console.log(`Stopping ${sound}`);
}

async function writeMsg(message, title, fields = [], edit = false) {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(getHex());
    if (fields.length > 0) {
        fields.forEach(field => {
            Object.entries(field).forEach(([name, value]) => {
                embed.addFields({ name, value });
            });
        });
    }
    if (edit) {
        return await message.edit({ embeds: [embed] });
    }
    return await message.channel.send({ embeds: [embed] });
}

module.exports = {
    getHex,
    play,
    stop,
    writeMsg
};