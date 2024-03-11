const { EmbedBuilder,Collection } = require('discord.js');
const { getHex } = require('./utils');


class Message {
    constructor({ message, title,img,thumbnail = '', fields = [], edit = false}) {
        this.message = message;
        this.title = title;
        this.fields = fields;
        this.edit = edit;
        this.img = img;
        this.thumbnail = thumbnail;
    }

    setTitle(title) {
        this.title = title;
    }

    async writeMsg() {
        const embed = new EmbedBuilder()
            .setTitle(this.title)
            .setColor(getHex());
        if (this.fields.length > 0) {
            this.fields.forEach(field => {
                Object.entries(field).forEach(([name, value]) => {
                    embed.addFields({ name, value });
                });
            });
        }
        if (this.img) {
            embed.setImage(this.img);
        }
        if (this.thumbnail) {
            embed.setThumbnail(this.thumbnail);
        }
        if (this.channel) {
            return await this.channel.send({ embeds: [embed] });
        }
        if (this.edit && !this.channel) {
            return await this.message.edit({ embeds: [embed] });
        // } else if (this.edit && this.channel) {
        //     return await this.channel.edit({ embeds: [embed] });
        }
        return await this.message.channel.send({ embeds: [embed] });
    }
    async deleteMessages(number) {
        try {
            let deleted = new Collection();
            let toDelete = number;

            while (toDelete > 0) {
                const fetched = await this.message.channel.messages.fetch({ limit: Math.min(toDelete, 100) }); // Fetch max 100 messages at once

                // Filter messages to delete within the 14-day limit
                const deletable = fetched.filter(msg => Date.now() - msg.createdTimestamp < 1209600000); // 14 days in milliseconds

                deleted = deleted.concat(deletable);
                toDelete -= deletable.size;

                if (deletable.size > 0) {
                    await this.message.channel.bulkDelete(deletable);
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
    }
}

module.exports = Message;