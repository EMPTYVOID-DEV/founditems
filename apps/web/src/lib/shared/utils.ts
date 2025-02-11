export function detectLocaleDirection(locale: string): 'ltr' | 'rtl' {
	if (locale == 'ar') return 'rtl';
	return 'ltr';
}
