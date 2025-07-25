import VerificationEmail from '@components/custom/other/verificationEmail.svelte';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { createTransport } from 'nodemailer';
import { env } from '$env/dynamic/private';
import { render } from 'svelte/server';
import { otpCodeLength, otpExpirationMinutes } from 'utils';
import { eq, db, otpTable } from 'db';
import { customAlphabet } from 'nanoid';

async function sendEmail(email: string, subject: string, html: string) {
	let settings: SMTPTransport.Options = {
		host: env.SMTP_HOST,
		port: parseInt(env.SMTP_PORT),
		secure: env.MODE != 'dev'
	};

	if (env.SMTP_REQUIRE_AUTH == 'true')
		settings = {
			...settings,
			auth: { pass: env.SMTP_PASSWORD, user: env.SMTP_USER }
		};

	const transport = createTransport(settings);

	const mailOptions: SMTPTransport.MailOptions = {
		from: env.SMTP_EMAIL,
		to: email,
		subject,
		html
	};
	return transport.sendMail(mailOptions);
}

function generateVerificationEmail(code: string, expiryMinutes: number) {
	const rendered = render(VerificationEmail, { props: { code, expiryMinutes } });
	return rendered.body;
}

export async function createOtp(email: string) {
	const code = customAlphabet('0123456789')(otpCodeLength);
	const expiresAt = new Date(Date.now() + 1000 * 60 * otpExpirationMinutes);
	const emailHtml = generateVerificationEmail(code, otpExpirationMinutes);
	await db.delete(otpTable).where(eq(otpTable.email, email));
	await db.insert(otpTable).values({ email, code, expiresAt });
	return sendEmail(email, "Verification d'email", emailHtml);
}

export async function verifyOtp(email: string, code: string) {
	const otp = await db
		.select()
		.from(otpTable)
		.where(eq(otpTable.email, email))
		.limit(1)
		.then((v) => v.at(0));

	if (!otp) return 'invalid';
	if (otp.code != code) return 'invalid';
	if (new Date() >= otp.expiresAt) return 'expired';
	return 'valid';
}
