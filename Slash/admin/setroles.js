const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { Discord } = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
const db = require('../../Models/rolesdata')
const Client = require('../../index');

module.exports = {
    name: 'setroles',
    description: 'Set Admin and Staff Roles.',
    options: [
        {
            name: 'support',
            description: 'Set role Support',
            type: 'ROLE',
            required: true
        },
        {
            name: 'admin',
            description: 'Set role Admin',
            type: 'ROLE',
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
            return interaction.reply({content: `${messages.NO_PERMSUSER}`, ephemeral: true})
        }

        
        
        const rolesupport = interaction.options.getRole('support')
        const roleadmin = interaction.options.getRole('admin')
        const data = await db.findOne({Guild: interaction.guild.id})
        if (!data) {
            await db.create({
                Guild: interaction.guild.id,
                RoleSupport: rolesupport.id,
                RoleAdmin: roleadmin.id 
            }) 
            const seteado = new MessageEmbed()
            .setColor(`${config.EMBEDCOLOR}`)
            .setTitle(`${config.BOTNAME} | Configuration`)
            .setDescription(`Hey <@${interaction.user.id}>, the roles were set successfully.\n\nSupport Role: ${rolesupport.toString()}\nAdmin Role: ${roleadmin.toString()}`)
            return interaction.reply({
                embeds: [seteado]
            })
        } else {
            const changed = new MessageEmbed()
            .setColor(`${config.EMBEDCOLOR}`)
            .setTitle(`${config.BOTNAME} | Configuration`)
            .setDescription(`Hey <@${interaction.user.id}>, roles changed successfully.\n\nSupport Role: ${rolesupport.toString()}\nAdmin Role: ${roleadmin.toString()}`)
       
            await db.findOneAndUpdate({
                Guild: interaction.guild.id, 
                RoleSupport: rolesupport.id,
                 RoleAdmin: roleadmin.id,
               })
            return interaction.reply({
                embeds: [changed]
            })
        }
    }
}
