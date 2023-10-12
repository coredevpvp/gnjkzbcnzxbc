
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))

module.exports = {
    name: "meme",
    description: "Send a random meme.",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        const spanishmemes = require('spanish.memes');
        const meme = spanishmemes.Meme()
        interaction.reply({files: [meme]})

    },
};