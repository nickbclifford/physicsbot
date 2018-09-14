import { Client, Message } from 'discord.js';

export interface Command {
	run(client: Client, message: Message, args: string[]): Promise<void>;
	help: {
		usage: string;
		description: string;
	};
}
