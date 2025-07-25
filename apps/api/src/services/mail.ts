import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import { createTransport } from 'nodemailer';
import { zodEnv } from '../shared/env.js';

export function sendEmail(email: string, subject: string, html: string) {
	let settings: SMTPTransport.Options = {
		host: zodEnv.SMTP_HOST,
		port: zodEnv.SMTP_PORT,
		secure: zodEnv.NODE_ENV != 'dev'
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

export function sendNotification(email: string) {
	const subject = 'Match Found!';
	const html = `
 <html lang="fr">
 <body
  style="font-family: sans-serif; background-color: #FAF9F6; color: #2E3338; margin: 0; padding: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh;">
  <div
   style="background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 32px; width: 80%; max-width: 600px; text-align: center;">
   <h1 style="color: #3882F6;">Bonne nouvelle ! Nous avons trouvé une
    correspondance</h1>
   <div style="margin-top: 20px; color: #6B7280;">
    <p style="line-height: 1.6;">Notre système a identifié une correspondance
     potentielle pour votre objet.</p>
    <p style="line-height: 1.6;">Veuillez vous connecter à votre compte
     FoundItems pour voir les détails et coordonner avec l'autre partie.</p>
  </div>
   <div style="margin-top: 30px; font-size: 0.8em; color: #6B7280;">
    <p>Merci d'utiliser FoundItems !</p>
   </div>
  </div>
 </body>
 </html>
`;
	return sendEmail(email, subject, html);
}
