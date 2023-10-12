const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))

module.exports = {
    giveaway: (config.everyoneMention ? "@everyone\n\n" : "")+"🎉**GIVEAWAY**🎉",
    giveawayEnded: (config.everyoneMention ? "@everyone\n\n" : "")+"🎉**GIVEAWAY**🎉",
    inviteToParticipate: "React with 🎉 to participate!",
    dropMessage: "Be the first person to react 🎉!",
    drawing: 'Duration: {timestamp}',
    winMessage: "Congratulations {winners}, you won **{this.prize}**!",
    noWinner: "The giveaway was canceled, no one participated.",
    hostedBy: "Hosted by: {this.hostedBy}",
    winners: "Giveaway Winner(s)",
    endedAt: "Giveaway Ended"
};