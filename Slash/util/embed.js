const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { Discord } = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
const { Modal, TextInputComponent, MessageActionRow } = require('discord.js')
module.exports = {
    name: "embed",
    description: "Embed Command",
    type: 'CHAT_INPUT',

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

      if(!interaction.member.permissions.has("MANAGE_MESSAGES")) {
        return interaction.reply({content: `${messages.NO_PERMSUSER}`, ephemeral: true})
    }

    
      const modal = new Modal()
        .setTitle('Make your embed!')
        .setCustomId("embed")

        const title = new TextInputComponent()
        .setCustomId('embed-title')
        .setLabel("What's is the embed title?")
        .setStyle('SHORT')
        .setRequired(false);
        
        const description = new TextInputComponent()
        .setCustomId('embed-description')
        .setLabel("What's is the embed description?")
        .setPlaceholder('Embed Description.')
        .setStyle('PARAGRAPH')
        .setRequired(true);

        const color = new TextInputComponent()
        .setCustomId('embed-color')
        .setLabel("What's is the embed color?")
        .setPlaceholder('RED, GREEN, WHITE, ETC.')
        .setStyle('SHORT')
        .setRequired(true);

        const row1 = new MessageActionRow()
        .addComponents(title);

        const row2 = new MessageActionRow()
        .addComponents(description);

        const row3 = new MessageActionRow()
        .addComponents(color);
        modal.addComponents(row1, row2, row3);

        await interaction.showModal(modal);
        
  

    },
};