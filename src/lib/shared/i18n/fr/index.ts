import type { Translation } from '../i18n-types';

const fr: Translation = {
	general: {
		confirm: 'Confirmer',
		cancel: 'Annuler',
		success: 'Succès',
		error: 'Erreur',
		info: 'Information',
		select: 'Sélectionner',
		language: 'Langue'
	},
	errors: {
		forbidden: 'Interdit',
		notFound: 'Non trouvé',
		internalServerError: 'Erreur interne du serveur',
		badRequest: 'Mauvaise demande',
		serviceUnavailable: 'Service indisponible'
	},
	validation: {
		fullname: 'Le nom complet doit comporter au moins 6 caractères',
		email: "L'adresse e-mail n'est pas valide",
		passwordLength: 'Le mot de passe doit comporter au moins 8 caractères',
		passwordSpecialChar: 'Le mot de passe doit contenir au moins un caractère spécial',
		passwordNumber: 'Le mot de passe doit contenir au moins un chiffre',
		passwordUppercase: 'Le mot de passe doit contenir au moins une lettre majuscule',
		passwordLowercase: 'Le mot de passe doit contenir au moins une lettre minuscule'
	},
	auth: {
		login: 'Connexion',
		signup: "S'inscrire",
		fullname: 'Nom complet',
		email: 'Email',
		password: 'Mot de passe',
		alreadyHaveAccount: 'Vous avez déjà un compte?',
		dontHaveAccount: "Vous n'avez pas de compte?",
		forgetPassword: 'Mot de passe oublié?',
		resendEmail: "Renvoyer l'email",
		sendTheCode: 'Envoyer le code',
		verifyCode: 'Vérifier le code',
		resendSuccess: 'Email renvoyé avec succès',
		sendSuccess: 'Code envoyé avec succès',
		resetPasswordSuccess: 'Mot de passe réinitialisé avec succès',
		lostPasswordEmail:
			"Saisissez l'adresse e-mail pour laquelle vous avez oublié votre mot de passe.",
		resetPassword:
			'Nous vous avons envoyé un mot de passe unique ; vérifiez votre boîte de réception. Ensuite, saisissez votre nouveau mot de passe.',
		confirmNewPassword: 'Confirmer le nouveau mot de passe',
		verificationEmail:
			"Nous vous avons envoyé un code pour vérifier votre e-mail. Vérifiez votre boîte de réception ; s'il n'est pas présent, vérifiez le dossier spam",
		acounntAlreadyExist: 'Il semble que ce compte existe déjà',
		accountDoesNotExist: 'Il semble que ce compte n’existe pas',
		passwordIncorrect: 'Mot de passe incorrect',
		incorrectCode: 'Code incorrect',
		expiredCode: 'Le code a expiré, essayez de le renvoyer'
	},
	navbar: {
		selectLanguage: 'Choisissez la langue',
		claims: 'Les revendications',
		posts: 'Les postes',
		search: 'Chercher'
	},
	home: {
		title: 'Trouvez vos objets perdus sans effort',
		description:
			'Une plateforme innovante pour connecter les objets perdus à leurs propriétaires avec un système de gestion des réclamations sécurisé et anti-fraude',
		findYourThings: 'Trouvez vos objets'
	}
};

export default fr;
