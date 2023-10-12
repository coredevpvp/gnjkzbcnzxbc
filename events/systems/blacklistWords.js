const client = require("../../index.js");
const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js')
const schema = require("../../Models/blacklistWords");
const db = require("../../Models/roleWhitelist.js");

client.on("messageCreate", async (message) => {

    if(message.author.bot){
        return;
    }
    if (message.webhookId) return;

    const Data = await db.findOne({guildID: message.guild.id})
    const bypassrole = message.guild.roles.cache.get(Data.Role)

    const embed = new MessageEmbed()
    .setColor('RED')
    .setDescription(`Hey <@${message.author.id}>, That word is forbidden on this server, don't use it or you will be penalized!`)



    let data;
    try{
        data = await schema.findOne({ guildId: message.guild.id })
        if(!data) {
            data = await schema.create({ guildId: message.guild.id})
        }
    } catch (error) {
        console.log(error)
    }
    if(message.member.roles.cache.has(bypassrole.id)){
        return
    } else if(message.member.permissions.has('ADMINISTRATOR')){
        return
    }
    if(data.BLW.some(word => message.content.toLowerCase().includes(word))) {
        message.delete()
        message.channel.send({ embeds: [embed]})
    }


});

client.on("messageUpdate", async (oldMessage, newMessage) => {
    if(oldMessage.author.bot){
        return;
    }
    if (oldMessage.webhookId) return;

    const Data = await db.findOne({guildID: oldMessage.guild.id})
    const bypassrole = oldMessage.guild.roles.cache.get(Data.Role)

    const embed = new MessageEmbed()
    .setColor('RED')
    .setDescription(`Hey <@${oldMessage.author.id}>, That word is forbidden on this server, don't use it or you will be penalized!`)



    let data;
    try{
        data = await schema.findOne({ guildId: oldMessage.guild.id })
        if(!data) {
            data = await schema.create({ guildId: oldMessage.guild.id})
        }
    } catch (error) {
        console.log(error)
    }
    if(oldMessage.member.roles.cache.has(bypassrole.id)){
        return
    } else if(oldMessage.member.permissions.has('ADMINISTRATOR')){
        return
    }
    if(data.BLW.some(word => newMessage.content.toLowerCase().includes(word))) {
        newMessage.delete()
        newMessage.channel.send({ embeds: [embed]})
    }
});