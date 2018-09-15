import { RichEmbed } from 'discord.js';
import { inspect } from 'util';
import config from '../config';
import { Command } from '../types';

export default {
	async run(client, message, args) {
		if (message.author.id !== config.botOwnerID) {
			await message.channel.send('You do not have permission to run this command.');
			return;
		}

		const code = args.join(' ');

		const embed = new RichEmbed()
			.setTitle('Evaluated JavaScript')
			.setFooter('Eval')
			.setTimestamp()
			.addField('Input', '```javascript\n' + code + '\n```');

		function clean(input: any): string {
			if (typeof input !== 'string') { input = inspect(input, { depth: 0 }); }
			let cleaned = (input as string)
				.replace(/`/, '`\u200B')
				.replace(/@/g, '@\u200B')
				.replace(config.token, '{{TOKEN}}');

			if (cleaned.length > 1000) {
				cleaned = cleaned.substring(0, 1000) + ' [truncated]';
			}

			return '```' + cleaned + '```';
		}

		try {
			// tslint:disable-next-line:no-eval
			let result = eval(code);
			if (result instanceof Promise) { result = await result; }

			embed.setColor('#28a745').addField('Output', clean(result));
		} catch (e) {
			embed.setColor('#dc3545').addField('Error', clean(e.message));
		}

		await message.channel.send(embed);
	},
	help: {
		usage: 'eval <command>',
		description: 'Evaluates an arbitrary JavaScript expression. (Only usable by bot owner.)'
	}
} as Command;
