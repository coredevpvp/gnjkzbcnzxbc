const {asegurar_todo} = require(`../../handler/funciones.js`);
const ecoSchema = require('../../Models/economia');
const duration = require('humanize-duration');
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
var trabajos = config.ECONOMY.JOBS;

module.exports = {
    name: "work",
    description: "Work and get money.",
    category: "Economia",
    run: async (client, interaction, args) => {

        let data = await ecoSchema.findOne({userID: interaction.user.id});

        let tiempo_ms = 3 * 60 * 1000

        let recompensa = Math.floor(Math.random() * 800) + 200;

        let trabajo = trabajos[Math.floor(Math.random() * trabajos.length)];

        if(tiempo_ms - (Date.now() - data.work) > 0) {
            let tiempo_restante = duration(Date.now() - data.work - tiempo_ms,
            {
                language: "en",
                units: ["h", "m", "s"],
                round: true,
            })
            return interaction.reply({content: `🕑 **You have to wait \`${tiempo_restante}\` to go back to work!**`})
        }
        await ecoSchema.findOneAndUpdate({userID: interaction.user.id}, {
            $inc: {
                dinero: recompensa
            },
            work: Date.now()
        })
        return interaction.reply({content: `✅ **You have worked as \`${trabajo}\` and you have received a reward from \`${recompensa} coins\`!**`})
    }
}
