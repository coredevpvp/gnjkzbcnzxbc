const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
const db = require('../../Models/mcdata')
const Client = require('../../index');

module.exports = {
    name: 'store',
    description: 'Minecraft Server Store.',
    permis: 'MANAGE_ROLES',
    botPerms: 'MANAGE_ROLES',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {string[]} args
     */
    run: async (client, interaction, args) => {

        if(!config.MINECRAFT.ENABLED.STORE) {
            return;
        }


    
        const data = await db.findOne({Guild: interaction.guild.id})
        if (!data) {
           
            return interaction.reply({
                content: 'No data found, set this using /set-mcdata',
                ephemeral: true
            })
        } else {
            await db.findOne({Guild: interaction.guild.id})
            const embedip = new MessageEmbed()
            .setColor(config.EMBEDCOLOR)
            .setTitle(`${config.SERVERNAME}`)
            .setDescription(`Hey <@${interaction.user.id}>\n » Server IP: **${data.Ip}**\n » Store: **${data.Store}** \n » TeamSpeak: **${data.Teamspeak}**\n » Status: **${data.Status}**`)
            return interaction.reply({
                embeds: [embedip]
            })
        }
    }
}
