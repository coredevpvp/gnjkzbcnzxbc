const { MessageEmbed } = require('discord.js');
const client = require("../../index");
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))

client.on("messageUpdate", async (oldMessage, newMessage) => {
    if(oldMessage.author.bot) return;
    if(oldMessage == newMessage) return;
    client.edits = new Map();
    let edits = client.edits.get(oldMessage.channel.id) || [];
    if(edits.length > 5) edits = edits.slice(0, 4);
    
    edits.unshift({
        msg1: oldMessage,
        msg2: newMessage,
        image: newMessage.attachments.first()?.proxyURL || null,
    });
    client.edits.set(oldMessage.channel.id, edits);

    if(!config.LOGS_SYSTEM.LOG_ENABLED) return;
    if(config.LOGS_SYSTEM.ENABLED.includes("MessageEdited")) {
        const db = require('../../Models/channels')
        const data = await db.findOne({Guild: oldMessage.guildId})
        if (!data) return console.log('Configure the channels using /setchannels')
        const logs = oldMessage.guild.channels.cache.get(data.LogsChannel)

        const embed = new MessageEmbed()
            .setTitle("Message Edited")
            .addField("Author:", `<@${oldMessage.author.id}>   ||${oldMessage.author.id}||`)
            .addField("Channel:", `<#${oldMessage.channel.id}>`)
            .addField("Old Message:", oldMessage.content)
            .addField("New Message:", newMessage.content)
            .setImage(newMessage.attachments.first()?.proxyURL || oldMessage.attachments.first()?.proxyURL || null)
            .setColor("YELLOW")
            .setTimestamp();
        try {
            await logs.send({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }

    }
});