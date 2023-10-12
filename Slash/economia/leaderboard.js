const {paginacion} = require(`../../handler/funciones`);
const ecoSchema = require('../../Models/economia');

module.exports = {
    name: "leaderboard",
    description: "See users with more money",
    category: "Economia",
    run: async (client, interaction, args) => {

      var medallas = {
    1: "🥇",
    2: "🥈",
    3: "🥉",
}

        const total = await ecoSchema.find();
        await interaction.guild.members.fetch();
        const ordenado = total.filter(member => interaction.guild.members.cache.get(member.userID)).sort((a, b) => Number((b.dinero+b.banco) - (a.dinero+a.banco)));
        const texto = ordenado.map((miembro, index) => `${medallas[index+1] ?? ""} \`${index+1}\` - <@${miembro.userID}> *\`${interaction.guild.members.cache.get(miembro.userID).user.tag}\`*\n**Money:** \`${miembro.dinero}\`\n**Bank:** \`${miembro.banco}\`\n\n`)
        paginacion(client, interaction, texto, "💸 ECONOMY LEADERBOARD 💸")
    }
}