import { Message, MessageReaction, RichEmbed, TextChannel, User } from 'discord.js';
import config from './config';

export async function addToHallOfFame(message: Message) {
	const channel = message.guild.channels.find(c => c.name === config.hallOfFame.channel) as TextChannel;
	if (!channel) {
		return;
	}

	const emoji = message.guild.emojis.find(e => e.name === config.hallOfFame.emoji);
	if (!emoji) {
		return;
	}

	await message.react(emoji);

	const embed = new RichEmbed()
		.setColor(message.member.displayColor)
		.setFooter('Hall of Fame')
		.setTimestamp()
		.addField('User', message.member.nickname || message.author.username, true)
		.addField('Channel', (message.channel as TextChannel).name, true);

	if (message.content.length !== 0) {
		embed.addField('Message', message.content);
	}
	if (message.attachments.size !== 0) {
		embed.setImage(message.attachments.array()[0].url);
	}

	await channel.send(embed);
}

export default async (messageReaction: MessageReaction) => {
	const msg = messageReaction.message;

	if (config.hallOfFame.reactionLimit === 0) {
		return;
	}
	if (messageReaction.me) {
		return;
	}

	const emoji = msg.guild.emojis.find(e => e.name === config.hallOfFame.emoji);
	if (!emoji) {
		return;
	}

	if (messageReaction.emoji.id === emoji.id && messageReaction.count >= config.hallOfFame.reactionLimit) {
		await addToHallOfFame(msg);
	}
};
