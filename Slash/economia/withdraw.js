const {asegurar_todo} = require(`../../handler/funciones.js`);
const ecoSchema = require('../../Models/economia');

module.exports = {
    name: "withdraw",
    description: "Withdraw money from the bank.",
    category: "Economia",
    options: [
    {
      name: "cantidad",
      description: "Amount of money to withdraw.",
      type: "STRING",
      required: "true"
    },
    ],
    run: async (client, interaction, args) => {

        let data = await ecoSchema.findOne({userID: interaction.user.id});
        let cantidad = interaction.options.getString("cantidad")

        if(["todo", "all-in", "all"].includes(args[0])) {
            cantidad = data.banco
        } else {
            if(isNaN(cantidad) || cantidad <= 0 || cantidad % 1 != 0) return interaction.reply({content: "❌ **You have not specified a valid amount to withdraw!**"});
            if(cantidad > data.banco) return interaction.reply({content: "❌ **You don't have that much money to take out!**"});
        }
       await ecoSchema.findOneAndUpdate({userID: interaction.user.id}, {
           $inc: {
               banco: -cantidad,
               dinero: cantidad,
           }
       });
       return interaction.reply({content: `✅ **You have withdrawn \`${cantidad} coins\` from your bank!**`});
    }
}