export class Logger {
	static error(message: string, location: string) {
		console.error(`Error-${location}:${message}`);
	}
	static info(message: string) {
		console.info(`Info:${message}`);
	}
	static success(message: string) {
		console.log(`Success:${message}`);
	}
}
