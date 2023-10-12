const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { Discord } = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))

module.exports = {
    name: "ping",
    description: "Ping bot.",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const ping = new MessageEmbed()
        .setColor(`${config.EMBEDCOLOR}`)
        .setFooter(`Ejecutado por: ${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true }))
               .setTitle('Ping')
               .setDescription(`:ping_pong: ${Date.now() - interaction.createdTimestamp}ms`)
        interaction.reply({
          embeds:[ping]
        })
    },
};