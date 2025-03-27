import chalk from 'chalk';

export class Logger {
	static error(message: string, location: string) {
		console.error(chalk.red(`Error-${location}:${message}`));
	}
	static info(message: string) {
		console.info(chalk.blue(`Info:${message}`));
	}
	static success(message: string) {
		console.log(chalk.green(`Success:${message}`));
	}
}
