import type { RawAddress, TransportAddress } from 'utils';
import { zodEnv } from '../shared/env.js';
import type { Item } from 'db';
import type { TextSimilarity } from './textSimilarity.js';

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
		const timeDiff = this.foundItem.date.getTime() - this.lostItem.date.getTime();
		const hoursDiff = timeDiff / (1000 * 60 * 60);
		return hoursDiff <= zodEnv.DATE_MATCHING_THRESHOLD;
	}

	private addressMatcher() {
		const foundEntry = this.foundItem.address.at(0)!;

		return this.lostItem.address.some((item) => {
			let match = false;
			if (item.type === 'general' && foundEntry.type === 'general')
				match = Matcher.matchRawAddress(item.address, item.address);
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
		return a.id === b.id;
	}

	private static dateMetaDataMatcher(valA: string, valB: string) {
		return valA === '' || valB === '' || valA === valB;
	}
}
