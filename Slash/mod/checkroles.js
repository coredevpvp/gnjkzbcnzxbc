const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { Discord } = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
const db = require('../../Models/rolesdata')

module.exports = {
    name: "checkroles",
    description: "Check config roles.",
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
                if (!data) return interaction.reply({embeds: [new MessageEmbed({color: `${config.EMBEDCOLOR}`, description: 'I did not find any role configured, configure them using /setroles.'})], ephemeral: true})
                const rolesupport = interaction.guild.roles.cache.get(data.RoleSupport)
                const roleadmin = interaction.guild.roles.cache.get(data.RoleAdmin)
                const roles = new MessageEmbed()
                .setColor(`${config.EMBEDCOLOR}`)
                .setTitle(`${config.BOTNAME} | Configuration`)
                .setDescription(`Hey <@${interaction.user.id}>, these are all the channels you have configured.\n\nSupport Role: ${rolesupport}\nAdmin Role: ${roleadmin}`)
                interaction.reply({
                    embeds: [roles]
                })


    },
};