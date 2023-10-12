const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { Discord } = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))

module.exports = {
    name: "play",
    description: "Play music in a voice channel.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'song',
            description: 'Song do you want to listening',
            type: 'STRING',
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

        const cancion = interaction.options.getString('song')

    if(!interaction.member.voice.channel) return interaction.reply({ content: 'You must be on a voice channel.', ephemeral: true})
    if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ content: 'You must be on the same channel as i am.', ephemeral: true})

  interaction.client.distube.play(
    interaction.member.voice.channel,
    cancion,
    {
      textChannel: interaction.channel,
      member: interaction.member,
    }
  );
  const buscando = new MessageEmbed()
  .setColor('YELLOW')
  .setDescription('<a:Yellow:927693296367697920> | Buscando la canción...')
  interaction.reply({ embeds: [buscando], ephemeral: true})
    

     




    },
};