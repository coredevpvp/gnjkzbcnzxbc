
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))

module.exports = {
    name: "kiss",
    description: "Kiss a user.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'User do you want to kiss.',
            type: 'USER',
            required: true
        },
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {


        const aB = interaction.options.getUser('user');

const star = require('star-labs');
 
  let aA = interaction.user
  const aC = new Discord.MessageEmbed()
    .setColor(`${config.EMBEDCOLOR}`)
    .setDescription(aA.tag+' Kissed '+aB.tag)
    .setImage(star.kiss())
    .setTimestamp();
  interaction.reply({ embeds: [aC]})


    },
};