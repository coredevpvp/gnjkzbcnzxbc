const {asegurar_todo} = require(`../../handler/funciones.js`);
const ecoSchema = require('../../Models/economia')
const Discord = require('discord.js');

module.exports = {
    name: "balance",
    description: "See all the money you got.",
    category: 'Economia',
    options: [
    {
       name: "user",
       description: "View user balance.",
       type: "USER",
       required: "true"
    },
    ],
    run: async (client, interaction, args) => {

        const user = interaction.options.getUser("user")
        if(user.bot) return interaction.reply({content: "❌ | **Bots can't have money!**"});
        await asegurar_todo(null, user.id);
        let data = await ecoSchema.findOne({userID: user.id});
        interaction.reply({
            embeds: [new Discord.MessageEmbed()
            .setAuthor({name: `${user.tag} Balance`, iconURL: user.displayAvatarURL({dynamic: true})})
            .setDescription(`💵 **Money:** \`${data.dinero} coins\`\n🏦 **Bank:** \`${data.banco} coins\``)
            .setColor(client.config.EMBEDCOLOR)
            ]
        }).catch(err => {
          return interaction.reply({content: "This user is not registered in the bank."})
        })
    }
}