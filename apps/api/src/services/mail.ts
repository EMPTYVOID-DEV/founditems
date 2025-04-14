import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import { createTransport } from 'nodemailer';
import { zodEnv } from '../shared/env.js';

export async function sendEmail(email: string, subject: string, html: string) {
	let settings: SMTPTransport.Options = {
		host: zodEnv.SMTP_HOST,
		port: zodEnv.SMTP_PORT,
		secure: false
	};

	if (zodEnv.SMTP_REQUIRE_AUTH)
		settings = {
			...settings,
			auth: { pass: zodEnv.SMTP_PASSWORD, user: zodEnv.SMTP_USER }
		};

	const transport = createTransport(settings);

	const mailOptions: SMTPTransport.MailOptions = {
		from: zodEnv.SMTP_EMAIL,
		to: email,
		subject,
		html
	};
	return transport.sendMail(mailOptions);
}
