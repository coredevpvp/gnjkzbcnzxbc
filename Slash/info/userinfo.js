
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Discord = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))


module.exports = {
    name: "userinfo",
    description: "Ver informacion de un usuario.",
    type: "CHAT_INPUT",
    options: [
      {
        name: "usuario",
        description: "Selecciona a un usuario.",
        type: "USER",
        required: false,
      },
    ],
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     */
     run: async (client, interaction, args) => {
      const Target = interaction.options.getUser('usuario') || interaction.user
  
      var main = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel(`User Info`)
          .setEmoji(`ℹ`)
          .setCustomId(`main`)
          .setDisabled(true)
          .setStyle(`SECONDARY`),
        new MessageButton()
          .setLabel(`Roles info`)
          .setStyle(`DANGER`)
          .setEmoji(`ℹ`)
          .setCustomId(`roles`),
        new MessageButton()
          .setLabel(`Permissions`)
          .setStyle(`SECONDARY`)
          .setEmoji(`ℹ`)
          .setCustomId(`permissions`)
  
      );
  
      const Response = new MessageEmbed()
        .setAuthor({ name: `${Target.tag}`, iconURL: `${Target.displayAvatarURL({ dynamic: true })}` })
        .setThumbnail(`${Target.displayAvatarURL({ dynamic: true })}`)
        .setColor("WHITE")
        .addField("UserID", `${Target.id}`, false)
        .addField("Server Member Since", `<t:${parseInt(Target.joinedTimestamp / 1000)}:R>`, false)
        .addField("Discord User Since", `<t:${parseInt(Target.createdTimestamp / 1000)}:R>`, false)
        .addField(`Nickname : `, `**${Target.nickname || `Default`}**`, true)
        .addField(`Presence : `, `**${Target.presence?.status || `offline`}**`, false)
      await interaction.reply({ embeds: [Response], components: [main] });
  
      const collector = interaction.channel.createMessageComponentCollector();
  
      collector.on('collect', async i => {
        if (i.user.id === interaction.user.id) {
          if (i.customId === 'main') {
            await i.update({ embeds: [Response], components: [main] })
          }
          if (i.customId === 'roles') {
            var role = new MessageActionRow().addComponents(
              new MessageButton()
                .setLabel(`User info`)
                .setEmoji(`ℹ`)
                .setCustomId(`main`)
                .setStyle(`SECONDARY`),
              new MessageButton()
                .setLabel(`Roles info`)
                .setStyle(`DANGER`)
                .setDisabled(true)
                .setEmoji(`ℹ`)
                .setCustomId(`roles`),
              new MessageButton()
                .setLabel(`Permissions`)
                .setStyle(`SECONDARY`)
                .setEmoji(`ℹ`)
                .setCustomId(`permissions`)
  
            );
            const rolee = new MessageEmbed()
              .setAuthor({ name: `${Target.tag}`, iconURL: `${Target.displayAvatarURL({ dynamic: true })}` })
              .addField(`Roles : `, `${Target.roles.cache.map(r => r).sort((first, second) => second.position - first.position).join(` | `)}`, true)
              .addField(`Highest role : `, `${Target.roles.highest}`, false)
              .setColor(`RANDOM`)
              .setThumbnail(`${Target.displayAvatarURL({ size: 1024, dynamic: true })}`)
            await i.update({ embeds: [rolee], components: [role] })
          }
          if (i.customId === `permissions`) {
            var perms = new MessageActionRow().addComponents(
              new MessageButton()
                .setLabel(`Main info`)
                .setEmoji(`ℹ`)
                .setCustomId(`main`)
                .setStyle(`SECONDARY`),
              new MessageButton()
                .setLabel(`Roles info`)
                .setStyle(`DANGER`)
                .setEmoji(`ℹ`)
                .setCustomId(`roles`),
              new MessageButton()
                .setLabel(`Permissions`)
                .setStyle(`SECONDARY`)
                .setDisabled(true)
                .setEmoji(`ℹ`)
                .setCustomId(`permissions`)
  
            );
            var eee2 = new MessageEmbed()
              .setAuthor({ name: `${Target.tag}`, iconURL: `${Target.displayAvatarURL({ dynamic: true })}` })
              .addField(`Permissions : `, `\`\`\`${Target.permissions.toArray().join(` | `)}\`\`\``, true)
              .setColor(`RANDOM`)
              .setThumbnail(`${Target.displayAvatarURL({ size: 1024, dynamic: true })}`)
            await i.update({ embeds: [eee2], components: [perms] })
          }
        }
      })
    }
  }