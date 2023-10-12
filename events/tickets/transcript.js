const { MessageButton, MessageEmbed, MessageActionRow} = require("discord.js");
const discordTranscripts = require('discord-html-transcripts');
const client = require("../../index");
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
const ticketSchema = require("../../Models/ticketDB");

client.on("interactionCreate", async (interaction) => {
	let idmiembro = interaction.channel.topic;
	if (interaction.isButton()) {
		if (interaction.customId == "Ticket-Transcript") {

			const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})
			if (!guildData) return interaction.reply({content: `NO data found.`,ephemeral: true})
            const dataRole = require("../../Models/rolesdata.js")
            const roleData = await dataRole.findOne({ Guild: interaction.guild.id })
            if(!roleData) return interaction.reply({ 
                content: 'No roles found, configure using /setroles',
                ephemeral: true
            })
            
            const staffRole = interaction.guild.roles.cache.get(roleData.RoleSupport)
			
			interaction.deferUpdate();
			const trow = new MessageActionRow().addComponents(new MessageButton().setCustomId("TR-YES").setLabel("Yes").setStyle("SUCCESS"),new MessageButton().setCustomId("TR-CN").setLabel("Cancel").setStyle("SECONDARY"),new MessageButton().setCustomId("TR-NO").setLabel("No").setStyle("DANGER"))
			interaction.channel.send({embeds: [new MessageEmbed().setDescription('Do you want to send the ticket to the user?').setColor(`${config.EMBEDCOLOR}`)],components: [trow]})
		}
	}
	if (interaction.isButton()) {


            const datachannel = require("../../Models/channels.js");
            if(!datachannel) return interaction.reply({ 
                content: 'No channels found, configure using /setchannels'})
            const channelData = await datachannel.findOne({ Guild: interaction.guild.id })

            let logcanal = channelData.TicketLogs;
            let transcriptcanal = channelData.TranscriptChannel;

                    const dataRole = require("../../Models/rolesdata.js")
        const roleData = await dataRole.findOne({ Guild: interaction.guild.id })
        if(!roleData) return interaction.reply({ 
            content: 'No roles found, configure using /setroles',
            ephemeral: true
        })
        
        const staffRole = interaction.guild.roles.cache.get(roleData.RoleSupport)

		if (interaction.customId == "TR-CN") {
			interaction.deferUpdate();
			interaction.message.delete();
		}
		if (interaction.customId == "TR-YES") {
			interaction.deferUpdate();

			interaction.message.delete();
			const saving = new MessageEmbed().setDescription(`Saving transcript...`).setColor("YELLOW")
			let savingMessage = interaction.channel.send({embeds: [saving]})

			const file = await discordTranscripts.createTranscript(interaction.channel, {limit: -1,returnBuffer: false,fileName: `transcript-${interaction.channel.name}.html`});

			const mensaje = new MessageEmbed().setAuthor(interaction.client.users.cache.get(idmiembro).tag, interaction.client.users.cache.get(idmiembro).avatarURL({dynamic: true})).addField("Ticket Owner", `<@!${idmiembro}>`, true).addField("Ticket Name", `${interaction.channel.name}`, true).setColor(`${config.EMBEDCOLOR}`)
			const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})
			await client.channels.cache.get(transcriptcanal).send({embeds: [mensaje],files: [file]}).then((a) => {
				const Data = guildData.tickets.find((x) => x.ticketCategory === interaction.channel.parentId);

				a.edit({embeds: [mensaje.addField("Panel Name", `${Data.ticketName}`, true).addField("Direct Transcript", `[Direct Transcript](${a.attachments.first().url})`, true).addField("Ticket Closed", `${interaction.member.user}`, true)]})
			})

			const trsend = new MessageEmbed().setDescription(`Transcript Saved To <#${transcriptcanal}>`).setColor("GREEN")
			;(await savingMessage).edit({embeds: [trsend]})

			let user = interaction.client.users.cache.get(idmiembro);
			try {await user.send({embeds: [mensaje],files: [file]})}
			catch (error) {;(await savingMessage).edit({embeds: [new MessageEmbed().setDescription(`This user has closed direct messages`).setColor("RED")]})}

			if (!guildData.channelLog) return;
			const log = new MessageEmbed().setTitle(`${config.BOTNAME} | Transcript Saved`).setColor("GREEN").setDescription(`**User**: <@!${interaction.member.user.id}>\n**Action**: Save a ticket transcript\n**Ticket**: ${interaction.channel.name}`)
			interaction.client.channels.cache.get(logcanal).send({embeds: [log]});
		}
		if (interaction.customId == "TR-NO") {
			interaction.deferUpdate();
			interaction.message.delete();		
				const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})

			const saving = new MessageEmbed().setDescription(`Saving transcript...`).setColor("YELLOW")
			let savingMessage = interaction.channel.send({embeds: [saving]})

			const file = await discordTranscripts.createTranscript(interaction.channel, {limit: -1,returnBuffer: false,fileName: `transcript-${interaction.channel.name}.html`});

			const mensaje = new MessageEmbed().setAuthor(interaction.client.users.cache.get(idmiembro).tag, interaction.client.users.cache.get(idmiembro).avatarURL({dynamic: true})).addField("Ticket Owner", `<@!${idmiembro}>`, true).addField("Ticket Name", `${interaction.channel.name}`, true).setColor(`${config.EMBEDCOLOR}`)
			await client.channels.cache.get(transcriptcanal).send({embeds: [mensaje],files: [file]}).then((a) => {
				const Data = guildData.tickets.find((x) => x.ticketCategory === interaction.channel.parentId);

				a.edit({embeds: [mensaje.addField("Panel Name", `${Data.ticketName}`, true).addField("Direct Transcript", `[Direct Transcript](${a.attachments.first().url})`, true).addField("Ticket Closed", `${interaction.member.user}`, true)]})
			})

			const trsend = new MessageEmbed().setDescription(`Transcript saved to <#${transcriptcanal}>`).setColor("GREEN")
			;(await savingMessage).edit({embeds: [trsend]})


			const log = new MessageEmbed().setTitle(`${config.BOTNAME} | Transcript Saved`).setColor("GREEN").setDescription(`**User**: <@!${interaction.member.user.id}>\n**Action**: Save a ticket transcript\n**Ticket**: ${interaction.channel.name}`)
			interaction.client.channels.cache.get(logcanal).send({embeds: [log]});
		};
	}
});