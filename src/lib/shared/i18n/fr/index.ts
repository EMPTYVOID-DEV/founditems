import type { Translation } from '../i18n-types';

const fr: Translation = {
	general: {
		confirm: 'Confirmer',
		cancel: 'Annuler',
		success: 'Succès',
		error: 'Erreur',
		info: 'Information',
		select: 'Sélectionner',
		language: 'Langue',
		upload: 'Faites glisser et déposez des fichiers ici, ou cliquez pour sélectionner des fichiers'
	},
	errors: {
		forbidden: 'Interdit',
		notFound: 'Non trouvé',
		internalServerError: 'Erreur interne du serveur',
		badRequest: 'Mauvaise demande',
		serviceUnavailable: 'Service indisponible'
	},
	validation: {
		fullname: 'Le nom complet doit comporter au moins {0} caractères',
		email: "L'adresse e-mail n'est pas valide",
		address: 'Votre adresse doit comporter au moins {0} caractères',
		phoneNumber: 'Le numéro de téléphone doit comporter 10 chiffres',
		imageSize: "la taille de l'image ne peut pas dépasser {0} Mo",
		invalidImageUpload: 'Vous devez télécharger une image',
		maxFilesNumber: 'Vous pouvez télécharger jusqu’à {0} fichiers',
		passwordLength: 'Le mot de passe doit comporter au moins {0} caractères',
		passwordSpecialChar: 'Le mot de passe doit contenir au moins un caractère spécial',
		passwordNumber: 'Le mot de passe doit contenir au moins un chiffre',
		passwordUppercase: 'Le mot de passe doit contenir au moins une lettre majuscule',
		passwordLowercase: 'Le mot de passe doit contenir au moins une lettre minuscule'
	},
	schema: {
		fullname: 'Nom complet',
		email: 'Email',
		password: 'Mot de passe',
		address: 'Adresse physique',
		avatar: 'Avatar',
		phoneNumber: 'Numéro de téléphone'
	},
	auth: {
		login: 'Connexion',
		signup: "S'inscrire",
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
			"Saisissez l'adresse e-mail pour laquelle vous avez oublié votre mot de passe",
		resetPassword:
			'Nous vous avons envoyé un mot de passe unique ; vérifiez votre boîte de réception. Ensuite, saisissez votre nouveau mot de passe',
		confirmNewPassword: 'Confirmer le nouveau mot de passe',
		verificationEmail:
			"Nous vous avons envoyé un code pour vérifier votre e-mail. Vérifiez votre boîte de réception ; s'il n'est pas présent, vérifiez le dossier spam",
		acounntAlreadyExist: 'Il semble que ce compte existe déjà',
		accountDoesNotExist: 'Il semble que ce compte n’existe pas',
		passwordIncorrect: 'Mot de passe incorrect',
		incorrectCode: 'Code incorrect',
		expiredCode: 'Le code a expiré, essayez de le renvoyer',
		logout: 'Se déconnecter'
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
	},
	profile: {
		addressChange:
			"Vous devez définir votre adresse avant de créer une publication. Assurez-vous de spécifier l'adresse complète avec le code postal.",
		fullnameChange: 'Vous pouvez changer votre nom complet',
		fullnameChangeSuccess: 'Nom changé avec succès',
		addressChangeSuccess: 'Adresse changée avec succès',
		avatarChange: 'Vous pouvez changer votre avatar',
		avatarChangeSuccess: "L'avatar a été modifié avec succès",
		logout: 'Vous pouvez vous déconnecter. Cela mettra fin à votre session de navigation',
		phoneNumberChange:
			'Vous devez préciser votre numéro de téléphone avant de créer la publication',
		phoneNumberChangeSuccess: 'Le numéro de téléphone a été modifié avec succès'
	}
};

export default fr;
