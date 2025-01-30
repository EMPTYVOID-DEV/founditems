export const checkPath = (
	pathname: string,
	options: string[],
	type: 'startWith' | 'endWith' | 'included'
) => {
	for (const option of options) {
		if (type == 'startWith' && pathname.startsWith(option)) return true;
		if (type == 'endWith' && pathname.endsWith(option)) return true;
		if (type == 'included' && pathname.includes(option)) return true;
	}
	return false;
};
