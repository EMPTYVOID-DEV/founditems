// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/shared/types').SessionValidationResult['user'];
			session: import('$lib/shared/types').SessionValidationResult['session'];
		}
		interface Env {
			DATABASE_URL: string;
		}
	}
}

export {};
