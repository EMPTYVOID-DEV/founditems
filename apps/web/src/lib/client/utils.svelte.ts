import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import cookies from 'browser-cookies';
import { toast } from 'svelte-sonner';
import Sonner from '@components/custom/other/sonner.svelte';
import type { ComponentType } from 'svelte';
import { detectLocaleDirection } from '@shared/utils';
import type { Locales } from '@assets/i18n/i18n-types';
import { setLL } from '@assets/i18n/i18n';
import { setSvelteLL } from '@assets/i18n/i18n-svelte';
import type { SubmitFunction } from '@sveltejs/kit';
import type { SubmitFunctionAfter, SubmitFunctionBefore } from './types';
import type { DateValue } from '@internationalized/date';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export function setClientLocale(locale: Locales) {
	const direction = detectLocaleDirection(locale);
	document.documentElement.setAttribute('dir', direction);
	document.documentElement.setAttribute('lang', locale);
	const expirationDate = Date.now() + 1000 * 60 * 60 * 24 * 7;
	cookies.set('lang', locale, { expires: new Date(expirationDate), samesite: 'Lax' });
	setLL(locale);
	setSvelteLL(locale);
}

export function showToast(title: string, message: string, state: 'error' | 'info' | 'success') {
	toast.custom(Sonner as unknown as ComponentType, {
		componentProps: {
			title,
			message,
			state
		}
	});
}

export function actionLoadingWrapper(handlers: {
	before?: SubmitFunctionBefore;
	after?: SubmitFunctionAfter;
}) {
	const loading = $state({ value: false });
	const action: SubmitFunction = async (beforeParams) => {
		loading.value = true;
		if (handlers.before) handlers.before(beforeParams);
		return (afterParams) => {
			if (handlers.after) handlers.after(afterParams);
			loading.value = false;
		};
	};
	return {
		action,
		loading
	};
}

export function getObjectProperty<A>(obj: Record<string, A>, target: string) {
	for (const key in obj) {
		if (target == key) return structuredClone(obj[key]);
	}
	return null;
}

export function formatDate(date: DateValue) {
	return `${date.day}/${date.month}/${date.year}`;
}
