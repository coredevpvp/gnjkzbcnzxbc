const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
const db = require('../../Models/mcdata')
const Client = require('../../index');

module.exports = {
    name: 'set-mcdata',
    description: 'Set Minecraft Info.',
    options: [
        {
            name: 'ip',
            description: 'Server IP.',
            type: 'STRING',
            required: true
        },
        {
            name: 'store',
            description: 'Server Store.',
            type: 'STRING',
            required: true
        },
        {
            name: 'teamspeak',
            description: 'Server TeamSpeak.',
            type: 'STRING',
            required: true
        },
        {
            name: 'status',
            description: 'Server Status (online, offline, etc).',
            type: 'STRING',
            required: true
        }
    ],
    permis: 'MANAGE_ROLES',
    botPerms: 'MANAGE_ROLES',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {string[]} args
     */
    run: async (client, interaction, args) => {

        if(!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply({content: `${messages.NO-PERMSUSER}`, ephemeral: true})
        }

        
        const ip = interaction.options.getString('ip')
        const store = interaction.options.getString('store')
        const ts = interaction.options.getString('teamspeak')
        const status = interaction.options.getString('status')


        const data = await db.findOne({Guild: interaction.guild.id})
        if (!data) {
            await db.create({
                Guild: interaction.guild.id,
                Ip: ip,
                Store: store,
                Teamspeak: ts,
                Status: status
            })
            const changed = new MessageEmbed()
            .setColor(config.EMBEDCOLOR)
            .setTitle(`${config.BOTNAME} Network Info`)
            .setDescription(`Hey <@${interaction.user.id}>, you successfully established the information about the network: \n\n » IP: **${ip}**\n » Store: **${store}**\n » TeamSpeak: **${ts}**\n » Status: **${status}**`)
            return interaction.reply({
                embeds: [
                    changed
                ]
            })
        } else {
            await db.findOneAndUpdate(
                {Guild: interaction.guild.id, Ip: ip,
                 Store: store,
                  Teamspeak: ts, 
                  Status: status})
            const changed = new MessageEmbed()
            .setColor(config.EMBEDCOLOR)
            .setTitle(`${config.BOTNAME} Network Info`)
            .setDescription(`Hey <@${interaction.user.id}>, you successfully changed the information about the network: \n\n » IP: **${ip}**\n » Store: **${store}**\n » TeamSpeak: **${ts}**\n » Status: **${status}**`)
            return interaction.reply({
                embeds: [
                    changed
                ]
            })
        }
    }
}
