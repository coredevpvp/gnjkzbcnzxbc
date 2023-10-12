
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
const Discord = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))

module.exports = {
    name: "avatar",
    description: "User avatar.",
    type: 'CHAT_INPUT',
    options: [
        {
          name: "user",
          description: "User avatar.",
          type: "USER",
          required: false,
        },
      ],


    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(!interaction.guild.me.permissions.has(['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS']))return interaction.reply(`${messages.NO_PERMSBOT}`)

        let miembro = interaction.options.getUser('user') || interaction.user
        
        const emb = new Discord.MessageEmbed()
            .setDescription(`**Download the avatar of ${miembro.tag}**`)
        .setImage(`${miembro.displayAvatarURL({dynamic: true, size : 1024 })}`)
            .setColor(`${config.EMBEDCOLOR}`)
        
        const row = new Discord.MessageActionRow()
    .addComponents(
      [
      new Discord.MessageButton()
      .setLabel("PNG")
      .setEmoji("<:Enlace:915425891281149952>")
      .setStyle("LINK")
      .setURL(`${miembro.displayAvatarURL({ format: 'png', dynamic: true, size : 1024 })}`)
      ],
      [
        new Discord.MessageButton()
        .setLabel("JPG")
        .setEmoji("<:Enlace:915425891281149952>")
       .setStyle("LINK")
       .setURL(`${miembro.displayAvatarURL({ format: 'jpg', dynamic: true, size : 1024 })}`)
      ],
      [
       new Discord.MessageButton()
      .setLabel("JPEG")
      .setEmoji("<:Enlace:915425891281149952>")
      .setStyle("LINK")
       .setURL(`${miembro.displayAvatarURL({ format: 'jpeg', dynamic: true, size : 1024 })}`)
      ]
    )

    interaction.reply({ 
    embeds: [emb],
    components: [row]})

   }
}