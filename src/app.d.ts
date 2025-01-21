// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/types.server').SessionValidationResult['user'];
			session: import('$lib/server/types.server').SessionValidationResult['session'];
		}
		interface Env {
			DATABASE_URL: string;
		}
	}
}

export {};
