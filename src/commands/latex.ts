import { RichEmbed } from 'discord.js';
import { Command } from '../types';

export default {
	async run(client, message, args) {
		const latexStr = args.join('&space;').replace('+', '&plus;');

		const embed = new RichEmbed()
			.setTitle('LaTeX Output')
			.setImage('http://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;' + latexStr);
		await message.channel.send(embed);
	},
	help: {
		usage: 'latex <equation>',
		description: 'Renders a LaTeX equation into an image.'
	}
} as Command;
