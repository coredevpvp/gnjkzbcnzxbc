const {asegurar_todo} = require(`../../handler/funciones.js`);
const ecoSchema = require('../../Models/economia');
module.exports = {
    name: "bet",
    description: "Bet an amount of money.",
    options: [
    {
       name: "cantidad",
       description: "Amount of money to bet.",
       type: "STRING",
       required: "true"
    },
    ],
    run: async (client, interaction, args) => {

        let data = await ecoSchema.findOne({ userID: interaction.user.id });
        let cantidad = interaction.options.getString("cantidad")

        if (["todo", "all-in", "all"].includes(cantidad)) {
            cantidad = data.dinero
        } else {
            if (isNaN(cantidad) || cantidad <= 0 || cantidad % 1 != 0) return interaction.reply({content: "❌ **You have not specified a valid amount to bet!**"});
            if (cantidad > data.dinero) return interaction.reply({content: "❌ **You don't have that much money to bet!**"});
        }

        let posibildades = ["ganar", "perder"];

        let resultado = posibildades[Math.floor(Math.random() * posibildades.length)];

        if (resultado === "ganar") {
            await ecoSchema.findOneAndUpdate({ userID: interaction.user.id }, {
                $inc: {
                    dinero: cantidad
                }
            })
            return interaction.reply({content: `**You have earned \`${cantidad} coins\`**`})
        } else {
            await ecoSchema.findOneAndUpdate({ userID: interaction.user.id }, {
                $inc: {
                    dinero: -cantidad
                }
            })
            return interaction.reply({content: `**You have lost \`${cantidad} coins\`**`})
        }
    }
}