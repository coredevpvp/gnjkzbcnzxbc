
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))

module.exports = {
    name: "nuke",
    description: "Nuke a chat.",
    type: 'CHAT_INPUT',


    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        const noperms = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`${messages.NO_PERMSUSER}`)
    
    
      if (!interaction.guild.me.permissions.has('MANAGE_CHANNELS')) {
            return interaction.reply(messages.NO_PERMSBOT + `**MANAGE_CHANNELS**`)
        }
      if(!interaction.member.permissions.has("MANAGE_CHANNELS")) {
        return interaction.reply({ embeds: [noperms], ephemeral: true})
      }
    
        let positionn = interaction.channel.position
      
        interaction.channel.clone().then((canal) => {
      
        interaction.channel.delete()
      
        canal.setPosition(positionn)
    
        const embed = new Discord.MessageEmbed()
        .setTitle(`:warning: | CHAT NUKED `)
        .setImage("https://media.discordapp.net/attachments/901716135274246204/904578405599686656/explosion.gif")
        .setFooter(`Chat nuked by: ${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor('RED')
        canal.send({
          embeds: [embed]
        })
      
        });


    },
};