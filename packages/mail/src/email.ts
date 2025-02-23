import { db, otpTable, eq } from 'db';
import { customAlphabet } from 'nanoid';
import { createTransport } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import dotenv from 'dotenv';

dotenv.config();

export async function sendEmail(email: string, subject: string, text: string) {
	let settings: SMTPTransport.Options = {
		host: process.env['SMTP_HOST'],
		port: parseInt(process.env['SMTP_PORT']!),
		secure: false
	};

	if (process.env['SMTP_REQUIRE_AUTH'] == 'true')
		settings = {
			...settings,
			auth: { pass: process.env['SMTP_PASSWORD'], user: process.env['SMTP_USER'] }
		};

	const transport = createTransport(settings);

	const mailOptions: SMTPTransport.MailOptions = {
		from: process.env['SMTP_EMAIL'],
		to: email,
		subject,
		text
	};
	return transport.sendMail(mailOptions);
}

export async function setupOtp(email: string) {
	const code = customAlphabet('0123456789')(6);
	const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
	await db.delete(otpTable).where(eq(otpTable.email, email));
	await db.insert(otpTable).values({ email, code, expiresAt });
	await sendEmail(email, 'Email verification', code);
}

export async function isValidOtp(
	email: string,
	otp: string
): Promise<'valid' | 'invalid' | 'expired'> {
	const otpEntry = await db.query.otpTable.findFirst({ where: eq(otpTable.email, email) });
	if (!otpEntry) return 'invalid';
	if (otpEntry.code != otp) return 'invalid';
	if (new Date() >= otpEntry.expiresAt) return 'expired';
	return 'valid';
}
