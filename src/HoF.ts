import { MessageReaction, RichEmbed, TextChannel, User } from 'discord.js';
import config from './config';

export default async (messageReaction: MessageReaction) => {
	const msg = messageReaction.message;

	const channel = msg.guild.channels.find(c => c.name === config.hallOfFame.channel) as TextChannel;
	if (!channel) {
		return;
	}

	const emoji = msg.guild.emojis.find(e => e.name === config.hallOfFame.emoji);
	if (!emoji) {
		return;
	}

	if (config.hallOfFame.reactionLimit === 0) {
		return;
	}
	if (messageReaction.me) {
		return;
	}

	if (messageReaction.emoji.id === emoji.id && messageReaction.count >= config.hallOfFame.reactionLimit) {
		await msg.react(emoji);

		const embed = new RichEmbed()
			.setColor(msg.member.displayColor)
			.setFooter('Hall of Fame')
			.setTimestamp()
			.addField('User', msg.member.nickname || msg.author.username, true)
			.addField('Channel', (msg.channel as TextChannel).name, true);

		if (msg.content.length !== 0) {
			embed.addField('Message', msg.content);
		}
		if (msg.attachments.size !== 0) {
			embed.setImage(msg.attachments.array()[0].url);
		}

		await channel.send(embed);
	}
};
