
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))

module.exports = {
    name: "poll",
    description: "Create a poll.",
    type: 'CHAT_INPUT',
    options: [

        {
            name: 'question',
            description: 'question',
            type: "STRING",
            required: "true"
        },
        {
            name: 'option1',
            description: 'option 1',
            type: "STRING",
            required: "true"
        },
        {
            name: 'option2',
            description: 'option 2',
            type: "STRING",
            required: "true"
        },
        {
            name: 'option3',
            description: 'option 3',
            type: "STRING"
        },
        {
            name: 'option4',
            description: 'option 4',
            type: "STRING"
        },
        {
            name: 'option5',
            description: 'option 5',
            type: "STRING"
        },

    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(!interaction.member.permissions.has("MANAGE_MESSAGES")) {
            return interaction.reply({content: `${messages.NO_PERMSUSER}`, ephemeral: true})
        }
        
        
        const question = interaction.options.getString('question')
        const option1 = interaction.options.getString('option1')
        const option2 = interaction.options.getString('option2')
        const option3 = interaction.options.getString('option3')
        const option4 = interaction.options.getString('option4')
        const option5 = interaction.options.getString('option5')

        const correct = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setDescription('Encuesta enviada correctamente!')

        const embed1 = new Discord.MessageEmbed()
        .setColor(`${config.EMBEDCOLOR}`)
        .setTitle(`${config.BOTNAME} | Poll`)
        .setDescription(`**${question}**\n\n:one: | ${option1}\n\n:two: | ${option2}`)

        const embed2 = new Discord.MessageEmbed()
        .setColor(`${config.EMBEDCOLOR}`)
        .setTitle(`${config.BOTNAME} | Poll`)
        .setDescription(`**${question}**\n\n:one: | ${option1}\n\n:two: | ${option2}\n\n:three: | ${option3}`)

        const embed3 = new Discord.MessageEmbed()
        .setColor(`${config.EMBEDCOLOR}`)
        .setTitle(`${config.BOTNAME} | Poll`)
        .setDescription(`**${question}**\n\n:one: | ${option1}\n\n:two: | ${option2}\n\n:three: | ${option3}\n\n:four: | ${option4}`)

        const embed4 = new Discord.MessageEmbed()
        .setColor(`${config.EMBEDCOLOR}`)
        .setTitle(`${config.BOTNAME} | Poll`)
        .setDescription(`**${question}**\n\n:one: | ${option1}\n\n:two: | ${option2}\n\n:three: | ${option3}\n\n:four: | ${option4}\n\n:five: | ${option5}`)

        if(!option3) {
            interaction.reply({ embeds: [correct], ephemeral: true})
            return interaction.channel.send({ embeds: [embed1]}).then(msg => {
                msg.react('1️⃣')
                msg.react('2️⃣')
            })
        }

        if(!option4) {
            interaction.reply({ embeds: [correct], ephemeral: true})
            return interaction.channel.send({ embeds: [embed2]}).then(msg => {
                msg.react('1️⃣')
                msg.react('2️⃣')
                msg.react('3️⃣')
            })
            
        } 

        if(!option5) {
            interaction.reply({ embeds: [correct], ephemeral: true})
            return interaction.channel.send({ embeds: [embed3]}).then(msg => {
                msg.react('1️⃣')
                msg.react('2️⃣')
                msg.react('3️⃣')
                msg.react('4️⃣')
            })
        } 

        if(option5) {
            interaction.reply({ embeds: [correct], ephemeral: true})
            return interaction.channel.send({ embeds: [embed4]}) .then(msg => {
                msg.react('1️⃣')
                msg.react('2️⃣')
                msg.react('3️⃣')
                msg.react('4️⃣')
                msg.react('5️⃣')
            })
        }
  


 

    },
};