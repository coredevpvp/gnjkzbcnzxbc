
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))

module.exports = {
    name: "verifypanel",
    description: "Sent verifypanel to specify channel.",
    type: 'CHAT_INPUT',
    options: [

        {
            name: 'canal',
            description: 'Channel to sent a panel.',
            type: 'CHANNEL',
            required: true,
            channelTypes: ['GUILD_TEXT']
        }
        
        
      ],


    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

      if(!interaction.member.permissions.has("ADMINISTRATOR")) {
        return interaction.reply({content: `${messages.NO_PERMSUSER}`, ephemeral: true})
    }

    const c = interaction.options.getChannel('canal');



    const embed = new Discord.MessageEmbed()
    .setColor(`${config.EMBEDCOLOR}`)
    .setTitle(config.VERIFY_SYSTEM.EMBED_CONFIG.TITLE)
    .setDescription(config.VERIFY_SYSTEM.EMBED_CONFIG.DESCRIPTION)
    .setFooter(config.VERIFY_SYSTEM.EMBED_CONFIG.FOOTER)
    .setImage(config.VERIFY_SYSTEM.EMBED_CONFIG.BANNER)


      const row = new Discord.MessageActionRow()
      .addComponents(
        [
          new Discord.MessageButton()
          .setCustomId('verify')
          .setStyle(`${config.VERIFY_SYSTEM.BUTTON.STYLE}`)
          .setEmoji(`${config.VERIFY_SYSTEM.BUTTON.EMOJI}`)
          .setLabel(`${config.VERIFY_SYSTEM.BUTTON.LABEL}`)
        ],

      )

      const enviado = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setDescription(`${messages.VERIFY.PANEL_SENT}`.replace('<channel>', `${c}`))

      interaction.reply({ embeds: [enviado], ephemeral: true})

      c.send({
          embeds: [embed],
          components: [row]
      })



    },
};