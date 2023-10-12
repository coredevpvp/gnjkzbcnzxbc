
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))

module.exports = {
    name: "help",
    description: "Help  command.",
    type: 'CHAT_INPUT',


    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        const row = new Discord.MessageActionRow()
.addComponents(
	new Discord.MessageSelectMenu()
	.setCustomId("menu_prueba")
	.setMinValues(1)
	.setMaxValues(1)
	.addOptions([
		{
		label:"Fun",
		description: "Fun Category",
		value:"1",
		emoji: "🎉"
		},

		{
		label:"Util",
		description: "Util Category",
		value:"2",
		emoji: "🛠️"
		},
        {
            label:"Information",
            description: "Information Category",
            value: "3",
            emoji: "📚"
        },

    {
		label:"Moderation",
		description: "Mod Category",
		value:"4",
		emoji: "🔨"
		},
    {
		label:"Music",
		description: "Music Category",
		value:"5",
		emoji: "🎵"
		},


		])


	)

  const principal = new Discord.MessageEmbed()
      .setColor(`${config.EMBEDCOLOR}`)
      .setTitle("Select a option to view a commands")
      .setDescription(`🎉 Fun Commands\n\n🛠️ Utility Commands\n\n📚 Info Commands\n\n🔨 Moderation Commands\n\n🎵 Music Commands`)



const fun = new Discord.MessageEmbed()
      .setTitle("🎉 Fun Commands 🎉")
      .setDescription("`dick` `8ball` `cry` `happy` `hug` `kiss` `meme`")
      .setColor(`${config.EMBEDCOLOR}`)

      const util = new Discord.MessageEmbed()
      .setTitle("🛠️ Utility Commands 🛠️")
      .setDescription("`setsuggest` `suggest` `ping` `botinfo` `say` `embed` `poll` `gstart` `gend` `gpause` `gunpause` `greroll`")
      .setColor(`${config.EMBEDCOLOR}`)

      const info = new Discord.MessageEmbed()
      .setTitle("📚 Info Commands 📚")
      .setDescription("`avatar` `ping` `serverinfo` `userinfo`")
      .setColor(`${config.EMBEDCOLOR}`)
      

      const mod = new Discord.MessageEmbed()
      .setTitle("🔨 Moderation Commands 🔨")
      .setDescription("`nuke` `warnings` `punish` `set-muterol`")
      .setColor(`${config.EMBEDCOLOR}`)
      

      const music = new Discord.MessageEmbed()
      .setTitle("🎵 Music Commands 🎵")
      .setDescription("`play` `pause` `continue` `skip` `queue`")
      .setColor(`${config.EMBEDCOLOR}`)

const m = await interaction.reply({ embeds: [principal], components: [row], fetchReply: true })

const filter = (i) => i.user.id === interaction.user.id

const collector = m.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 60000 });

collector.on("collect", async (i) => {
	if(i.values[0] === "1"){

	i.update({ embeds: [fun], components: [row]})
	
	
	}if(i.values[0] === "2"){

	i.update({ embeds: [util], components: [row]})
    
    }if(i.values[0] === "3"){
        i.update({ embeds: [info], components: [row]})
        
    }if(i.values[0] === "4"){

	  i.update({ embeds: [mod], components: [row]})
	
	
	}if(i.values[0] === "5"){

	i.update({ embeds: [music], components: [row]})
	
	
	}

    const timedout = new Discord.MessageEmbed()
    .setColor(client.config.EMBEDCOLOR)
    .setDescription(`:x: Timed Out`)
    collector.on('end', () => {
        interaction.editReply({embeds: [timedout], components: []})
    })
	})
      

      

 
        
  


 

    },
};