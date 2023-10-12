
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
module.exports = {
    name: "happy",
    description: "User happy",
    type: 'CHAT_INPUT',

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        const star = require('star-labs');
 
  const aA = interaction.user
  const aB = new Discord.MessageEmbed()
  .setColor(`${config.EMBEDCOLOR}`)
    .setDescription(aA.tag+' is very happy!')
    .setImage(star.happy())
    .setTimestamp();
  interaction.reply({ embeds: [aB] })


    },
};