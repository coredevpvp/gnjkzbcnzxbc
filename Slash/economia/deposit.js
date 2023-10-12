const {asegurar_todo} = require(`../../handler/funciones.js`);
const ecoSchema = require('../../Models/economia');
module.exports = {
    name: "deposit",
    description: "Deposit money in the bank",
    category: "Economia",
    options: [
    {
      name: "cantidad",
      description: "Amount to deposit",
      type: "STRING",
      required: "true"
    },
    ],
    run: async (client, interaction, args) => {

        let data = await ecoSchema.findOne({userID: interaction.user.id});
        let cantidad = interaction.options.getString("cantidad")

        if(["todo", "all-in", "all"].includes(cantidad)) {
            cantidad = data.dinero
        } else {
            if(isNaN(cantidad) || cantidad <= 0 || cantidad % 1 != 0) return interaction.reply({content: "❌ **You have not specified a valid amount to deposit!**"});
            if(cantidad > data.dinero) return interaction.reply({content: "❌ **You don't have that much money to deposit!**"});
        }
       await ecoSchema.findOneAndUpdate({userID: interaction.user.id}, {
           $inc: {
               dinero: -cantidad,
               banco: cantidad
           }
       });
       return interaction.reply({content: `✅ **You have deposited  \`${cantidad} coins\` in your bank!**`});
    }
}