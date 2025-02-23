import { json, type RequestHandler } from '@sveltejs/kit';
import { MAPS_API } from '$env/static/private';
import { handleFetchError } from '@server/utils/general';
import type { NominatimResponse, RawAddress } from 'utils';

const SIGNIFICANT_DIGITS = 3;

const truncateCoordinate = (coord: string): number => {
	const num = parseFloat(coord);
	const multiplier = 10 ** SIGNIFICANT_DIGITS;
	return Math.trunc(num * multiplier) / multiplier;
};

export const GET: RequestHandler = async ({ fetch, params, locals }) => {
	const address = params.address || '';
	const locale = locals.locale;
	const limits = 5;
	const query = `${MAPS_API}/search?q=${address}&format=json&accept-language=${locale}&limit=${limits}`;
	const response = await handleFetchError(fetch(query));

	if (response._tag == 'Left') return json([]);

	const data = (await response.right.json()) as NominatimResponse;

	let rawAddresses: RawAddress[] = data
		.filter((el) => el.place_rank >= 16)
		.map((el) => ({
			id: el.osm_id,
			latitude: el.lat,
			longtitude: el.lon,
			name: el.display_name,
			rank: el.place_rank
		}));

	rawAddresses.sort((a, b) => a.id - b.id);

	const uniqueAddresses: RawAddress[] = [];
	const seenCoordinates = new Set<string>();

	for (const address of rawAddresses) {
		const truncatedLat = truncateCoordinate(address.latitude);
		const truncatedLon = truncateCoordinate(address.longtitude);
		const coordinateKey = `${truncatedLat},${truncatedLon}`;

		if (!seenCoordinates.has(coordinateKey)) {
			uniqueAddresses.push(address);
			seenCoordinates.add(coordinateKey);
		}
	}

	return json(uniqueAddresses);
};
