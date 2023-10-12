const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { Discord } = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
const db = require('../../Models/channels')


module.exports = {
    name: "checkchannels",
    description: "Check config channels.",
    type: 'CHAT_INPUT',


    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        const noperms = new MessageEmbed()
        .setColor('RED')
        .setDescription(`${messages.NO_PERMSUSER}`)
    

      if(!interaction.member.permissions.has("MANAGE_CHANNELS")) {
        return interaction.reply({ embeds: [noperms], ephemeral: true})
      }

            


                const data = await db.findOne({Guild: interaction.guildId})
                if (!data) return interaction.reply({embeds: [new MessageEmbed({color: `${config.EMBEDCOLOR}`, description: 'I did not find any channel configured, configure them using /setchannels.'})], ephemeral: true})
                const welcome = interaction.guild.channels.cache.get(data.WelcomeChannel)
                const leave = interaction.guild.channels.cache.get(data.LeaveChannel)
                const logs = interaction.guild.channels.cache.get(data.LogsChannel)
                const ticketlogs = interaction.guild.channels.cache.get(data.TicketLogs)
                const tickettranscript = interaction.guild.channels.cache.get(data.TranscriptChannel)

                const channels = new MessageEmbed()
                .setColor(`${config.EMBEDCOLOR}`)
                .setTitle(`${config.BOTNAME} | Configuration`)
                .setDescription(`Hey <@${interaction.user.id}>, these are all the channels you have configured.\n\nWelcome Channel: ${welcome}\nLeave Channel: ${leave}\nLogs channel: ${logs}\nTicket Logs: ${ticketlogs}\nTicket Transcript: ${tickettranscript}`)
                interaction.reply({
                    embeds: [channels]
                })


    },
};