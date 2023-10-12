module.exports = {
    name: "volume",
    description: "Set the volume for the music.",
    category: 'Musica',
    options: [{
        name: "volumen",
        description: "Volume",
        type: "INTEGER",
        required: true
    }],
    run: async (client, interaction, args) => {

    const vol = interaction.options.getInteger("volumen")

    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply({content: `There no songs in the queue!`, ephemeral: true})
    const volume = parseInt(vol)
    if (isNaN(volume)) return interaction.reply({content: `Please put a valid numer!`, ephemeral: true})
    queue.setVolume(volume)
    interaction.reply({content: `Volume set to \`${volume}\``})

  }
}
