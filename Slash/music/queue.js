const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js');
const distube = require("distube");

module.exports = {
    name: "queue",
    description: "View the queue of the music.",
    category: 'Musica',
    run: async (client, interaction, args) => {

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.reply({content: `There's no song playing!`});
        if (!interaction.member.voice?.channel) return interaction.reply({content: `You have to be on a voice channel to run this command!`});
        if (interaction.guild.me.voice?.channel && interaction.member.voice?.channel.id != interaction.guild.me.voice?.channel.id) return interaction.reply({content: `You have to be on the same voice channel as me to run this command!`});

        let listaqueue = [];
        var maximascanciones = 30; 
        
        for (let i = 0; i < queue.songs.length; i += maximascanciones) {
            let canciones = queue.songs.slice(i, i + maximascanciones);
            listaqueue.push(canciones.map((cancion, index) => `**\`${i + ++index}\`** - [\`${cancion.name}\`](${cancion.url})`).join("\n "));
        }

        var limite = listaqueue.length;
        var embeds = [];
        
        for (let i = 0; i < limite; i++) {
            let desc = String(listaqueue[i]).substring(0, 4096);
            
            let embed = new Discord.MessageEmbed()
                .setTitle(`Queue of the music - \`[${queue.songs.length} ${queue.songs.length > 1 ? "Songs" : "Song"}]\``)
                .setColor("#8400ff")
                .setDescription(desc)
            
            if (queue.songs.length > 1) embed.addField(`💿 Current Song`, `**[\`${queue.songs[0].name}\`](${queue.songs[0].url})**`)
            await embeds.push(embed)
        }
        return paginacion();

        async function paginacion() {
            let paginaActual = 0;
            
            if (embeds.length === 1) return interaction.channel.send({ embeds: [embeds[0]] }).catch(() => { });
            
            let boton_atras = new Discord.MessageButton().setStyle('SUCCESS').setCustomId('Atras').setEmoji('◀️')
            let boton_inicio = new Discord.MessageButton().setStyle('DANGER').setCustomId('Inicio').setEmoji('🏠')
            let boton_avanzar = new Discord.MessageButton().setStyle('SUCCESS').setCustomId('Avanzar').setEmoji('▶️')
            
            let embedpaginas = await interaction.channel.send({
                content: `**Click on the __Buttons__ to change the page**`,
                embeds: [embeds[0].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })],
                components: [new Discord.MessageActionRow().addComponents([boton_atras, boton_inicio, boton_avanzar])]
            });
            
            const collector = embedpaginas.createMessageComponentCollector({ filter: i => i?.isButton() && i?.user && i?.user.id == interaction.user.id, time: 180e3 });
            
            collector.on("collect", async b => {
                
                if (b?.user.id !== interaction.user.id) return b?.reply({ content: `Only the person who has executed the command can move the pages!` });

                switch (b?.customId) {
                    case "Atras": {
                        
                        collector.resetTimer();
                        
                        if (paginaActual !== 0) {
                            
                            paginaActual -= 1
                            
                            await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                            await b?.deferUpdate();
                        } else {
                            
                            paginaActual = embeds.length - 1
                            
                            await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                            await b?.deferUpdate();
                        }
                    }
                        break;

                    case "Inicio": {
                        
                        collector.resetTimer();
                        
                        paginaActual = 0;
                        await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                        await b?.deferUpdate();
                    }
                        break;

                    case "Avanzar": {
                        
                        collector.resetTimer();
                        
                        if (paginaActual < embeds.length - 1) {
                            
                            paginaActual++
                            
                            await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                            await b?.deferUpdate();
                            
                        } else {
                            
                            paginaActual = 0
                            
                            await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                            await b?.deferUpdate();
                        }
                    }
                        break;

                    default:
                        break;
                }
            });
            collector.on("end", () => {
                
                embedpaginas.components[0].components.map(boton => boton.disabled = true)
                embedpaginas.edit({content: `**The time has expired, execute again the command to view the queue of the music.**`, embeds: [embeds[paginaActual].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
            });
        }
    }
}