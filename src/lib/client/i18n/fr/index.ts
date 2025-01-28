import type { Translation } from '../i18n-types';

const fr: Translation = {
	auth: {
		login: 'Connexion',
		signup: "S'inscrire",
		fullname: 'Nom complet',
		email: 'Email',
		password: 'Mot de passe',
		alreadyHaveAccount: 'Vous avez déjà un compte?',
		dontHaveAccount: "Vous n'avez pas de compte?",
		forgetPassword: 'Mot de passe oublié?'
	},
	navbar: {
		selectLanguage: 'Choisissez la langue',
		claims: 'Les revendications',
		posts: 'Les messages',
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
