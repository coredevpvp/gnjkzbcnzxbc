const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
const db = require('../../Models/muterol')
const Client = require('../../index');

module.exports = {
    name: 'set-muterole',
    description: 'Set the role for mutes.',
    options: [
        {
            name: 'role',
            description: 'The role to set as the mute role.',
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

        
        const role = interaction.options.getRole('role')
        const data = await db.findOne({Guild: interaction.guild.id})
        if (!data) {
            await db.create({
                Guild: interaction.guild.id,
                Role: role.id
            })
            return interaction.reply({content: `Set the mute role to ${role.toString()}`})
        } else {
            await db.findOneAndUpdate({Guild: interaction.guild.id}, {Role: role.id})
            return interaction.reply({content: `Changed the mute role to ${role.toString()}`})
        }
    }
}
