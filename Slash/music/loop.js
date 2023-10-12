module.exports = {
  name: "loop",
  description: "Loop the music.",
  category: 'Musica',
  options: [
      {
          name: "modo",
          description: "Modo del Loop",
          type: "STRING",
          choices: [
              {
                  name: "Off",
                  value: "off"
              },
              {
                  name: "Song",
                  value: "song"
              },
              {
                  name: "Queue",
                  value: "queue"
              }
          ],
          required: true
      }
  ],
  run: async (client, interaction, args) => {

      const opcion = interaction.options.getString("modo")

    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(`There no songs in the queue!`)
    let mode = null
    switch (opcion) {
      case 'off':
        mode = 0
        break
      case 'song':
        mode = 1
        break
      case 'queue':
        mode = 2
        break
    }
    mode = queue.setRepeatMode(mode)
    mode = mode ? (mode === 2 ? 'Repeat queue' : 'Repeat song') : 'Off'
    interaction.reply({content: `Loop has been set to: \`${mode}\``}).catch(err => {
        return interaction.reply({content: `An error has ocurred: \`${err}\``})
    })
  }
}
