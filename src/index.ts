import { Client } from 'discord.js';
import * as fs from 'fs';
import { promisify } from 'util';
import config from './config';
import { Command } from './types';

declare module 'discord.js' {
	interface Client {
		commands: Map<string, Command>;
	}
}

const client = new Client();
client.commands = new Map<string, Command>();

async function init() {
	const files = await promisify(fs.readdir)('./src/commands');

	await Promise.all(files.map(async file => {
		const name = file.replace('.ts', '');
		console.log(`loading command ${config.prefix}${name}`);
		const command: Command = await import(`./commands/${file}`).then(i => i.default);

		client.commands.set(name, command);
	}));

	try {
		await client.login(config.token);
	} catch (e) {
		console.error('physicsbot could not log in', e);
	}
}

client.on('ready', async () => {
	console.log(`physicsbot ready on @${client.user.tag}`);
	await client.user.setActivity('doing the MP for tomorrow');
}).on('message', async message => {
	if (message.author.bot) { return; }
	if (!message.content.startsWith(config.prefix)) { return; }

	const args = message.content.trim().substring(config.prefix.length).split(/\s+/);
	const commandName = args.shift();

	if (typeof commandName === 'undefined' || !client.commands.has(commandName)) {
		await message.channel.send(
			`Command \`${config.prefix}${commandName}\` not found. See \`${config.prefix}help\` for available commands.`
		);
		return;
	}

	await client.commands.get(commandName!)!.run(client, message, args);
});

init();
