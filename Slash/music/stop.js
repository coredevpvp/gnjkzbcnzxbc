const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { Discord } = require('discord.js');
const distube = require("distube");

module.exports = {
    name: "stop",
    description: "Stop the music and clear the queue.",
    category: 'Musica',
    run: async (client, interaction, args) => {

const queue = client.distube.getQueue(interaction)
if (!queue) return interaction.reply({content: `There no songs in the queue.`})
queue.stop()
interaction.reply({content: `The music has been stopped and the queue has been cleared.`})

    }
}