
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))

module.exports = {
    name: "8ball",
    description: "Ask the bot a question..",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'question',
            description: 'Question',
            type: 'STRING',
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
        
        const mensaje = interaction.options.getString('question');

    
 // OPCIONES (Lo que el bot respondera aleatoriamente)
 let respuestas = config.BALL.CONFIG;

 const ball = new Discord.MessageEmbed()
 .setColor(`${config.EMBEDCOLOR}`)
 .setTitle('**:8ball: 8BALL**')
 .setFooter(`Executed by: ${interaction.user.username}`, interaction.user.displayAvatarURL({ dynamic: true }))
 .addField(`**» Question:**`,` ${mensaje}`, false)
 .addField(`**» Answer:**`,` ${respuestas[( Math.floor(Math.random() * respuestas.length))]}.`, false)
 interaction.reply({ embeds : [ball] })
     


    },
};