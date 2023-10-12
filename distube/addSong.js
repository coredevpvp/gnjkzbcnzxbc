const Discord = require('discord.js')

module.exports = (client, queue, song) => {
  const embed = new Discord.MessageEmbed()
  .setColor('GREEN')
  .setDescription(`Playing now: **${song.name}**`)
  queue.textChannel.send({ embeds: [embed]})
}