// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Locales } from '@shared/i18n/i18n-types';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/shared/types').SessionValidationResult['user'];
			session: import('$lib/shared/types').SessionValidationResult['session'];
			locale: Locales;
		}
		interface Env {
			DATABASE_URL: string;
		}
	}
}

export {};
