import type { ItemMetaData, MetaDataDesc, MetaDataDescOptions } from 'utils';
import categoriesJson from '@assets/json/itemCategories.json';
import selectOptionsJson from '@assets/json/selectOptions.json';
import imagesMap from '@assets/json/imagesMap.json';
import { getObjectProperty } from '@client/utils.svelte';
import { defaultMetaDataOption } from '@shared/const';
import { pipe } from 'fp-ts/lib/function';

export class PostData {
	category: string[] = $state([]);
	metaDataDescOptions: MetaDataDescOptions = $state([]);
	metaData: ItemMetaData = $state([]);

	pushToCategory(lvl: string) {
		this.category.push(lvl);
	}

	setMetaDataDesc(secondLvl: string) {
		const jsonLvl2 = categoriesJson.level2 as Record<string, MetaDataDesc>;
		const metaDataDesc = getObjectProperty<MetaDataDesc>(jsonLvl2, secondLvl)!;

		this.metaDataDescOptions = metaDataDesc.map((val) => {
			if (val.options)
				return {
					name: val.name,
					type: val.type,
					options: pipe(
						getObjectProperty<string[]>(selectOptionsJson, val.options)!,
						PostData.addDefaultOption
					)
				};
			return { name: val.name, type: val.type };
		});
		this.addingBaseDesc();
		this.orderMetaDataDesc();
		this.initMetaData();
	}

	initMetaData() {
		this.metaData = this.metaDataDescOptions.map((val) => {
			const tmp = { name: val.name, type: val.type, value: '' };
			if (val.options) {
				tmp.value = defaultMetaDataOption;
			}
			return tmp;
		});
	}

	addingBaseDesc() {
		const colors = getObjectProperty<string[]>(selectOptionsJson, 'colors')!;
		const itemConditions = getObjectProperty<string[]>(selectOptionsJson, 'conditions')!;
		PostData.addDefaultOption(colors);
		PostData.addDefaultOption(itemConditions);
		this.metaDataDescOptions.push(
			{ name: 'color', type: 'select', options: colors },
			{ name: 'condition', type: 'select', options: itemConditions }
		);
	}

	resetPostData() {
		this.category = [];
		this.metaDataDescOptions = [];
		this.metaData = [];
	}

	orderMetaDataDesc() {
		const typeOrder = {
			select: 1,
			date: 2,
			text: 3
		};

		this.metaDataDescOptions.sort((a, b) => {
			return typeOrder[a.type] - typeOrder[b.type];
		});
	}

	setMetaData(name: string, value: string) {
		const rightMetaData = this.metaData.find((val) => val.name === name);
		if (rightMetaData) rightMetaData.value = value;
	}

	getMetaData(name: string) {
		return this.metaData.find((el) => el.name === name)?.value;
	}

	static addDefaultOption(options: string[]) {
		options.push(defaultMetaDataOption);
		return options;
	}

	static getImageName(lvl: string) {
		return getObjectProperty<string>(imagesMap, lvl);
	}

	static getSecondLvl(lvl1: string) {
		return getObjectProperty<string[]>(categoriesJson.level1, lvl1)!;
	}

	static getLvl1Keys() {
		return Object.keys(categoriesJson.level1);
	}
}

export const PostDataInstance = new PostData();
