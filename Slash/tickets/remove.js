const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
const ticketSchema = require("../../Models/ticketDB");
module.exports = {
    name: "remove",
    description: "remove a user of a ticket",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'user to remove',
            type: 'USER',
            required: true
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */


    run: async (client, interaction, args) => {        


        const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})
        if(!guildData) return interaction.reply({content: 'NO data found.', ephemeral: true})
        const dataRole = require("../../Models/roles.js")
        
        const roleData = await dataRole.findOne({ Guild: interaction.guild.id })


        if(!roleData) return interaction.reply({ 
            content: 'No roles found, configure using /setroles',
            ephemeral: true
        })
        


        const rolesupport = interaction.guild.roles.cache.get(roleData.RoleSupport)
        if(!interaction.member.roles.cache.get(rolesupport.id)) return interaction.reply({content: `${messages.NO_PERMSUSER}`, ephemeral: true})




        if(!guildData.tickets || guildData.tickets.length === 0) return interaction.reply({content: 'No panel found.', ephemeral: true})
        const ticketData = guildData.tickets.map(z  => { return { customBID: z.customBID, ticketName: z.ticketName, ticketDescription: z.ticketDescription, ticketCategory: z.ticketCategory, ticketEmoji: z.ticketEmoji,}})
        const categoryID = ticketData.map(x => {return x.ticketCategory})
        if(!categoryID.includes(interaction.channel.parentId)) return interaction.reply({content: 'You can only use this command on a ticket.', ephemeral: true})

        let si = interaction.options.getUser('user');
        let removido = si.id;

        interaction.channel.permissionOverwrites.edit(removido, {
          VIEW_CHANNEL: false
        })


        const embed = new MessageEmbed()
        .setTitle(`${config.BOTNAME} | User Removed`)
        .setDescription(`Staff:\n <@!${interaction.user.id}>\nMember Removed:\n<@!${(await client.users.fetch(removido)).id}>`)
        .setColor("RED")
        .setTimestamp()
        interaction.reply({
            embeds: [embed]
        })



        const datachannel = require("../../Models/channels.js");
        if(!datachannel) return interaction.reply({ 
            content: 'No channels found, configure using /setchannels'})
        const channelData = await datachannel.findOne({ Guild: interaction.guild.id })



        let logcanal = channelData.TicketLogs;
        if(config.TICKET["LOGS-SYSTEM"] == true) {
          client.channels.cache.get(logcanal).send({
            embeds: [new MessageEmbed()
                .setTitle(`${config.BOTNAME} | User Removed`)
                .setColor("RED")
                .setDescription(`
                **User**: <@!${interaction.member.user.id}>
                **Action**: Remove a Member
                **Member Removed**: <@!${removido}>
                **Ticket Name**: ${interaction.channel.name}
                **Ticket Owner**: <@!${interaction.channel.topic}>`)]}
        )
        }
        if(config.TICKET["LOGS-SYSTEM"] == false) {
        return;
        }
    },
};
