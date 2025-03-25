import type { RawAddress, TransportAddress } from 'utils';
import { zodEnv } from '../shared/env.js';
import { extractJson, handleFetchError } from '../utils/fetch.js';
import { right } from 'fp-ts/lib/Either.js';
import type { AvailableLocales } from 'utils';
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

	match() {
		return this.dateMatcher() && this.addressMatcher() && this.metaDataMatching();
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

	// items with same category will have the same metaData structure
	private metaDataMatching() {
		return this.foundItem.metadata.every((item) => {
			const counterPartItem = this.lostItem.metadata.find((el) => el.name === item.name)!;

			switch (item.type) {
				case 'select':
					return item.value === counterPartItem.value;
				case 'date':
					return Matcher.dateMetaDataMatcher(item.value, counterPartItem.value);
				case 'text':
					return this.textMatching(
						item.value,
						counterPartItem.value,
						this.foundItem.lang,
						this.lostItem.lang
					);
			}
		});
	}

	private async textMatching(
		valA: string,
		valB: string,
		langA: AvailableLocales,
		langB: AvailableLocales
	) {
		if (valA === '' || valB === '') return true;

		const translatedA = await Matcher.translateText(valA, langA);
		const translatedB = await Matcher.translateText(valB, langB);

		if (translatedA._tag === 'Left' || translatedB._tag === 'Left') return false;
		valA = translatedA.right.translatedText;
		valB = translatedB.right.translatedText;

		const similarity = await this.textSimilarity.getSimilarity(valA, valB);
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

	private static async translateText(text: string, sourceLang: AvailableLocales) {
		const body = {
			q: text,
			source: sourceLang,
			target: 'en',
			format: 'text'
		};
		const call = fetch(zodEnv.LIBRE_TRANSLATION_ENDPOINT, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const response = await handleFetchError(call);
		if (response._tag == 'Left') return response;
		const data = await extractJson<{ translatedText: string }>(response.right);
		return right(data);
	}
}
