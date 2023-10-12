const { Client, CommandInteraction, MessageEmbed, WelcomeChannel } = require("discord.js");
const { Discord } = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
const db = require("../../Models/channels")

module.exports = {
    name: "setchannels",
    description: "Configure Channels.",
    permissions: "KICK_MEMBERS",
    options: [
                {
                    name: "welcomechannel",
                    description: "Select a welcome channel",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true
                },
                {
                    name: "leavechannel",
                    description: "Select a leave channel.",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true
                },
                {
                    name: "logschannel",
                    description: "Select a logs channel.",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true
                },
                {
                    name: "ticketlogschannel",
                    description: "Select a ticket logs channel (Open, Closed, Deleted).",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true

        },
                {
                    name: "transcriptchannel",
                    description: "Select a Ticket Transcript Channel (AutoTranscript).",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true
                },
    ],
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     run: async (client, interaction, args) => {

        if(!interaction.member.permissions.has("MANAGE_MESSAGES")) {
            return interaction.reply({content: `${messages.NO_PERMSUSER}`, ephemeral: true})
        }
        

        const { options } = interaction;

        const welcome = options.getChannel("welcomechannel");
        const leave = options.getChannel("leavechannel");
        const logs = options.getChannel("logschannel");
        const ticketlogs = options.getChannel("ticketlogschannel");
        const tickettranscript = options.getChannel("transcriptchannel");
  

            const data = await db.findOne({Guild: interaction.guild.id})
            

            if (!data) {
                await db.create({
                   Guild: interaction.guild.id,
                   WelcomeChannel: welcome.id,
                   LeaveChannel: leave.id,
                   TicketLogs: ticketlogs.id,
                   LogsChannel: logs.id,
                   TranscriptChannel: tickettranscript.id,
                    
                }) 
                const seteado = new MessageEmbed()
                .setColor(`${config.EMBEDCOLOR}`)
                .setTitle(`${config.BOTNAME} | Configuration`)
                .setDescription(`Hey <@${interaction.user.id}>, channels were successfully established.\n\nWelcome Channel: ${welcome.toString()}\nLeave Channel: ${leave.toString()}\nLogs Channel: ${logs.toString()}\nTicket Logs Channel: ${ticketlogs.toString()} \nTicket Transcript Channel: ${tickettranscript.toString()}`)
                return interaction.reply({
                    embeds: [seteado]
                    
                })
            } else {
                await db.findOneAndUpdate({
                    Guild: interaction.guild.id, 
                    WelcomeChannel: welcome.id,
                     LeaveChannel: leave.id,
                      TicketLogs: ticketlogs.id, 
                      LogsChannel: logs.id, 
                      TranscriptChannel: tickettranscript.id}
                      ) 

                      const changed = new MessageEmbed()
                      .setColor(`${config.EMBEDCOLOR}`)
                      .setTitle(`${config.BOTNAME} | Configuration`)
                      .setDescription(`Hey <@${interaction.user.id}>, channels were successfully esstablished.\n\nWelcome Channel: ${welcome.toString()}\nLeave Channel: ${leave.toString()}\nLogs Channel: ${logs.toString()}\nTicket Logs Channel: ${ticketlogs.toString()} \nTicket Transcript Channel: ${tickettranscript.toString()}`)
                     return interaction.reply({
                    embeds: [changed]
                })

        } 

    }
}