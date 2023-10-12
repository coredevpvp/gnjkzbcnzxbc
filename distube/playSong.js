const Discord = require('discord.js')

module.exports = (client, queue, song) => {

    const embed = new Discord.MessageEmbed()
  .setColor('GREEN')
  .setDescription(`Song added to the playlist: **${song.name}**`)

  queue.textChannel.send({ embeds: [embed]})
}