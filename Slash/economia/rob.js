const {asegurar_todo} = require(`../../handler/funciones.js`);
const ecoSchema = require('../../Models/economia');
const duration = require('humanize-duration');

module.exports = {
    name: "rob",
    description: "Steal coins from a user.",
    category: "Economia",
    options: [
    {
        name: "usuario",
        description: "User to steal.",
        type: "USER",
        required: "true"
    },
    ],
    run: async (client, interaction, args) => {

        const usuario = interaction.options.getUser("usuario")

        await asegurar_todo(null, usuario.id);

        let data = await ecoSchema.findOne({ userID: interaction.user.id });

        let tiempo_ms = 5 * 60 * 1000;

        if (tiempo_ms - (Date.now() - data.rob) > 0) {
            let tiempo_restante = duration(Date.now() - data.rob - tiempo_ms,
                {
                    language: "es",
                    units: ["h", "m", "s"],
                    round: true,
                })
            return interaction.reply({content: `🕑 **You have to wait \`${tiempo_restante}\` to steal a user!**`})
        }
        let data_usuario = await ecoSchema.findOne({ userID: usuario.id });
        if (data_usuario.dinero < 500) return interaction.reply({content: "❌ **You can't steal from the user since they have less than \`500 coins\`**"})
        let cantidad = Math.floor(Math.random() * 400) + 100

        if (cantidad > data_usuario.dinero) return interaction.reply({content: "❌ **The user does not have enough money to be robbed!**"})
       
        await ecoSchema.findOneAndUpdate({ userID: interaction.user.id }, {
            $inc: {
                dinero: cantidad
            },
            rob: Date.now()
        })

        await ecoSchema.findOneAndUpdate({ userID: usuario.id }, {
            $inc: {
                dinero: -cantidad
            },
        })
        return interaction.reply({content: `✅ **You have stolen \`${cantidad} coins\` to \`${usuario.tag}\`**`})
    }
}