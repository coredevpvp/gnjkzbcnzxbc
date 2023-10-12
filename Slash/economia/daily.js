const {asegurar_todo} = require(`../../handler/funciones.js`);
const ecoSchema =require('../../Models/economia');
const duration = require('humanize-duration');

module.exports = {
    name: "daily",
    description: "Claim a daily reward.",
    run: async (client, interaction, args) => {

        let data = await ecoSchema.findOne({userID: interaction.user.id});

        let tiempo_ms = 24 * 60 * 60 * 1000
        let recompensa = 350;

        if(tiempo_ms - (Date.now() - data.daily) > 0) {
            let tiempo_restante = duration(Date.now() - data.daily - tiempo_ms,
            {
                language: "es",
                units: ["h", "m", "s"],
                round: true,
            })
            return interaction.reply({content: `🕑 **You have to wait \`${tiempo_restante}\` to reclaim your daily reward!**`})
        }
        await ecoSchema.findOneAndUpdate({userID: interaction.user.id}, {
            $inc: {
                dinero: recompensa
            },
            daily: Date.now()
        })
        return interaction.reply({content: `✅ **You have claimed your daily reward of \`${recompensa} coins\`!**`})
    }
}