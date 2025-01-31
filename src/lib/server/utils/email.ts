import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { db } from '@server/db';
import { otpTable } from '@server/db/schema';
import { eq } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';
import { createTransport } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export async function sendVerificationEmail(email: string, text: string) {
	let settings: SMTPTransport.Options = {
		host: env.SMTP_HOST,
		port: parseInt(env.SMTP_PORT),
		secure: !dev
	};

	if (env.SMTP_REQUIRE_AUTH == 'true')
		settings = { ...settings, auth: { pass: env.SMTP_PASSWORD, user: env.SMTP_USER } };

	const transport = createTransport(settings);

	const mailOptions: SMTPTransport.MailOptions = {
		from: env.SMTP_EMAIL,
		subject: 'Email verification',
		to: email,
		text
	};
	return transport.sendMail(mailOptions);
}

export async function setupOtp(email: string) {
	const code = customAlphabet('0123456789')(6);
	const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
	await db.delete(otpTable).where(eq(otpTable.email, email));
	await db.insert(otpTable).values({ email, code, expiresAt });
	await sendVerificationEmail(email, code);
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
