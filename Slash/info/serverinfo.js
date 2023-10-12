
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))

module.exports = {
    name: "serverinfo",
    description: "Informacion acerca del servidor.",
    type: 'CHAT_INPUT',


    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        const ownerserver = interaction.guild.ownerId;
        const ServerLogo = interaction.guild.iconURL();

        const invite = new Discord.MessageEmbed()
                    .setColor(`${config.EMBEDCOLOR}`)
                    .setTitle("Server Information")
                    .setImage(ServerLogo)
                    .setDescription(`About **${interaction.guild}**`)
                    .addField("**Created**", `The server was created on **${interaction.guild.createdAt.toLocaleString()}**`)
                    .addField("**Owner**", `The server owner is <@${ownerserver}>`)
                    .addField("**Members**", "This server has ` " + `${interaction.guild.memberCount}` + " ` **Members**")
                    .addField("**Emojis**", "This server has ` " + `${interaction.guild.emojis.cache.size}` + " ` **Emojis**")
                    .addField("**Roles**", "This server has ` " + `${interaction.guild.roles.cache.size}` + " ` **Roles**")
                    .addField("**Channels**", "This server has ` " + `${interaction.guild.channels.cache.size}` + " ` **Channels**")
     interaction.reply({
       embeds:[invite]
     })

    },
};