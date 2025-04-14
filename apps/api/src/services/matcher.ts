import type { RawAddress, TransportAddress } from 'utils';
import { zodEnv } from '../shared/env.js';
import type { Item } from 'db';
import type { TextSimilarity } from './textSimilarity.js';
import { earthRadius } from '../shared/consts.js';

export class Matcher {
	foundItem: Item;
	lostItem: Item;
	textSimilarity: TextSimilarity;

	constructor(foundItem: Item, lostItem: Item, textSimilarity: TextSimilarity) {
		this.foundItem = foundItem;
		this.lostItem = lostItem;
		this.textSimilarity = textSimilarity;
	}

	async match() {
		return this.dateMatcher() && this.addressMatcher() && (await this.metaDataMatching());
	}

	private dateMatcher() {
		const timeDiff = Math.abs(this.foundItem.date.getTime() - this.lostItem.date.getTime());
		const hoursDiff = timeDiff / (1000 * 60 * 60);
		return hoursDiff <= zodEnv.DATE_MATCHING_THRESHOLD;
	}

	private addressMatcher() {
		const foundEntry = this.foundItem.address.at(0)!;

		return this.lostItem.address.some((item) => {
			let match = false;
			if (item.type === 'general' && foundEntry.type === 'general')
				match = Matcher.matchRawAddress(item.address, foundEntry.address);
			else if (item.type === 'transport' && foundEntry.type === 'transport')
				match = Matcher.matchTransport(item, foundEntry);
			return match;
		});
	}

	private async metaDataMatching() {
		const results = await Promise.all(
			this.foundItem.metadata.map(async (item) => {
				const counterPartItem = this.lostItem.metadata.find((el) => el.name === item.name)!;

				switch (item.type) {
					case 'select':
						return item.value === counterPartItem.value;
					case 'date':
						return Matcher.dateMetaDataMatcher(item.value, counterPartItem.value);
					case 'text':
						return Matcher.textMatching(item.value, counterPartItem.value, this.textSimilarity);
				}
			})
		);

		return results.every(Boolean);
	}

	private static async textMatching(valA: string, valB: string, textSimilarity: TextSimilarity) {
		if (valA === '' || valB === '') return true;
		const similarity = await textSimilarity.getSimilarity(valA, valB);
		return similarity >= zodEnv.TEXT_SIMILARITY_THRESHOLD;
	}

	private static matchTransport(a: TransportAddress, b: TransportAddress) {
		return (
			a.method === b.method &&
			Matcher.matchRawAddress(a.startAddress, b.startAddress) &&
			Matcher.matchRawAddress(a.endAddress, b.endAddress)
		);
	}

	private static matchRawAddress(a: RawAddress, b: RawAddress) {
		const latA = parseFloat(a.latitude);
		const latB = parseFloat(b.latitude);
		const lonA = parseFloat(a.longtitude);
		const lonB = parseFloat(b.longtitude);
		const distance = Matcher.getDistanceInMeters(latA, lonA, latB, lonB);
		return distance <= zodEnv.ADDRESS_MATCHING_THRESHOLD;
	}

	private static dateMetaDataMatcher(valA: string, valB: string) {
		return valA === '' || valB === '' || valA === valB;
	}

	private static getDistanceInMeters(
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number
	): number {
		const toRadians = (deg: number) => (deg * Math.PI) / 180;

		const R = earthRadius;

		const dLat = toRadians(lat2 - lat1);
		const dLon = toRadians(lon2 - lon1);

		const a =
			Math.sin(dLat / 2) ** 2 +
			Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return R * c;
	}
}
