
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { Discord } = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))

module.exports = {
    name: "dick",
    description: "Dick Size.",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
     
        if (!interaction.guild.me.permissions.has('EMBED_LINKS')) {
            return interaction.reply({ content: mensajes["NO-PERMSBOT"], ephemeral: true})
        }
    
   

    
        let dick = [
            "No dick.",  
            "8=D",
            "8==D",
            "8===D",
            "8====D",
            "8=====D",
            "8======D",
            "8=======D",
            "8========D",
            "8===========D",
            ]

            const dickfinal = dick[Math.floor(Math.random() * dick.length)];

            const dickembed = new MessageEmbed()
                 .setDescription(`${interaction.user.username}'s dick\n${dickfinal}`)
                 .setColor(`${client.config.EMBEDCOLOR}`)
                 interaction.reply({
                     embeds: [dickembed]
            })

    },
};