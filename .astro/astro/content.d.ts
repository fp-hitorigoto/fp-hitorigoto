declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"articles": {
"2026-03-05-6a4459a9ba24.md": {
	id: "2026-03-05-6a4459a9ba24.md";
  slug: "2026-03-05-6a4459a9ba24";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-03-15-3eb29ac2392e.md": {
	id: "2026-03-15-3eb29ac2392e.md";
  slug: "2026-03-15-3eb29ac2392e";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-03-15-741a57fd8d9f-edbcd4.md": {
	id: "2026-03-15-741a57fd8d9f-edbcd4.md";
  slug: "2026-03-15-741a57fd8d9f-edbcd4";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-03-15-741a57fd8d9f.md": {
	id: "2026-03-15-741a57fd8d9f.md";
  slug: "2026-03-15-741a57fd8d9f";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-03-19-dc3bca73d70d.md": {
	id: "2026-03-19-dc3bca73d70d.md";
  slug: "2026-03-19-dc3bca73d70d";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-03-23-1f87d9875ed7.md": {
	id: "2026-03-23-1f87d9875ed7.md";
  slug: "2026-03-23-1f87d9875ed7";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-03-23-54c108af0c74.md": {
	id: "2026-03-23-54c108af0c74.md";
  slug: "2026-03-23-54c108af0c74";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-03-27-182aa9be6355.md": {
	id: "2026-03-27-182aa9be6355.md";
  slug: "2026-03-27-182aa9be6355";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-03-27-1a8c265580b4.md": {
	id: "2026-03-27-1a8c265580b4.md";
  slug: "2026-03-27-1a8c265580b4";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-03-27-265c6acedca4.md": {
	id: "2026-03-27-265c6acedca4.md";
  slug: "2026-03-27-265c6acedca4";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-03-27-7cc15bf8cf1e.md": {
	id: "2026-03-27-7cc15bf8cf1e.md";
  slug: "2026-03-27-7cc15bf8cf1e";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-03-31-1dbe025458a3.md": {
	id: "2026-03-31-1dbe025458a3.md";
  slug: "2026-03-31-1dbe025458a3";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-01-6ff01a1acdbd.md": {
	id: "2026-04-01-6ff01a1acdbd.md";
  slug: "2026-04-01-6ff01a1acdbd";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-01-cc0a4bdc6c10.md": {
	id: "2026-04-01-cc0a4bdc6c10.md";
  slug: "2026-04-01-cc0a4bdc6c10";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-02-ad89f3acdc62.md": {
	id: "2026-04-02-ad89f3acdc62.md";
  slug: "2026-04-02-ad89f3acdc62";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-02-c9ee5df77c71.md": {
	id: "2026-04-02-c9ee5df77c71.md";
  slug: "2026-04-02-c9ee5df77c71";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-07-3a94b10c4588.md": {
	id: "2026-04-07-3a94b10c4588.md";
  slug: "2026-04-07-3a94b10c4588";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-08-0f4c5cef3dab-7b6102.md": {
	id: "2026-04-08-0f4c5cef3dab-7b6102.md";
  slug: "2026-04-08-0f4c5cef3dab-7b6102";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-08-0f4c5cef3dab.md": {
	id: "2026-04-08-0f4c5cef3dab.md";
  slug: "2026-04-08-0f4c5cef3dab";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-09-138d0f5e42bd.md": {
	id: "2026-04-09-138d0f5e42bd.md";
  slug: "2026-04-09-138d0f5e42bd";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-09-4ce30ebbd9aa.md": {
	id: "2026-04-09-4ce30ebbd9aa.md";
  slug: "2026-04-09-4ce30ebbd9aa";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-13-3371a5626fe5.md": {
	id: "2026-04-13-3371a5626fe5.md";
  slug: "2026-04-13-3371a5626fe5";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-16-83d8e92bff6d.md": {
	id: "2026-04-16-83d8e92bff6d.md";
  slug: "2026-04-16-83d8e92bff6d";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-17-0fe57837e39e.md": {
	id: "2026-04-17-0fe57837e39e.md";
  slug: "2026-04-17-0fe57837e39e";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-17-23f2a2e14747.md": {
	id: "2026-04-17-23f2a2e14747.md";
  slug: "2026-04-17-23f2a2e14747";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-17-335dfa311b0a.md": {
	id: "2026-04-17-335dfa311b0a.md";
  slug: "2026-04-17-335dfa311b0a";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-17-421e5644b7e5.md": {
	id: "2026-04-17-421e5644b7e5.md";
  slug: "2026-04-17-421e5644b7e5";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-17-6dd0e6e7d818.md": {
	id: "2026-04-17-6dd0e6e7d818.md";
  slug: "2026-04-17-6dd0e6e7d818";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-17-98a2aa0308ce.md": {
	id: "2026-04-17-98a2aa0308ce.md";
  slug: "2026-04-17-98a2aa0308ce";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-17-e5da32ba45f5.md": {
	id: "2026-04-17-e5da32ba45f5.md";
  slug: "2026-04-17-e5da32ba45f5";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-17-e92b4f86c0d5.md": {
	id: "2026-04-17-e92b4f86c0d5.md";
  slug: "2026-04-17-e92b4f86c0d5";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-19-3231e3bbd0b1.md": {
	id: "2026-04-19-3231e3bbd0b1.md";
  slug: "2026-04-19-3231e3bbd0b1";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-19-5f8c089a4b61.md": {
	id: "2026-04-19-5f8c089a4b61.md";
  slug: "2026-04-19-5f8c089a4b61";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-19-b0d8a2ac1219.md": {
	id: "2026-04-19-b0d8a2ac1219.md";
  slug: "2026-04-19-b0d8a2ac1219";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-19-e6df7132150e.md": {
	id: "2026-04-19-e6df7132150e.md";
  slug: "2026-04-19-e6df7132150e";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-20-37b4d4a6b4c6.md": {
	id: "2026-04-20-37b4d4a6b4c6.md";
  slug: "2026-04-20-37b4d4a6b4c6";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-20-791eebfb5bb7.md": {
	id: "2026-04-20-791eebfb5bb7.md";
  slug: "2026-04-20-791eebfb5bb7";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-20-8bd17c7a27ac.md": {
	id: "2026-04-20-8bd17c7a27ac.md";
  slug: "2026-04-20-8bd17c7a27ac";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-20-941cd1807c69.md": {
	id: "2026-04-20-941cd1807c69.md";
  slug: "2026-04-20-941cd1807c69";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-20-ad3b26ee73c3.md": {
	id: "2026-04-20-ad3b26ee73c3.md";
  slug: "2026-04-20-ad3b26ee73c3";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-20-af0af2b2122c.md": {
	id: "2026-04-20-af0af2b2122c.md";
  slug: "2026-04-20-af0af2b2122c";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-20-f1f32eeff1f2.md": {
	id: "2026-04-20-f1f32eeff1f2.md";
  slug: "2026-04-20-f1f32eeff1f2";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-21-13408d31a24c.md": {
	id: "2026-04-21-13408d31a24c.md";
  slug: "2026-04-21-13408d31a24c";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-21-6282081c0ae0.md": {
	id: "2026-04-21-6282081c0ae0.md";
  slug: "2026-04-21-6282081c0ae0";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-21-9bf7ff9cd919.md": {
	id: "2026-04-21-9bf7ff9cd919.md";
  slug: "2026-04-21-9bf7ff9cd919";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-21-a93488e2171d.md": {
	id: "2026-04-21-a93488e2171d.md";
  slug: "2026-04-21-a93488e2171d";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-21-ba68653bee13.md": {
	id: "2026-04-21-ba68653bee13.md";
  slug: "2026-04-21-ba68653bee13";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-21-f99a31aa61cf.md": {
	id: "2026-04-21-f99a31aa61cf.md";
  slug: "2026-04-21-f99a31aa61cf";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-21-ff2a87ec2872.md": {
	id: "2026-04-21-ff2a87ec2872.md";
  slug: "2026-04-21-ff2a87ec2872";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-22-4e7fb4c21ac0.md": {
	id: "2026-04-22-4e7fb4c21ac0.md";
  slug: "2026-04-22-4e7fb4c21ac0";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-22-6ab7506cc036.md": {
	id: "2026-04-22-6ab7506cc036.md";
  slug: "2026-04-22-6ab7506cc036";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-22-98577e171804.md": {
	id: "2026-04-22-98577e171804.md";
  slug: "2026-04-22-98577e171804";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-22-c3a7fd4f6003.md": {
	id: "2026-04-22-c3a7fd4f6003.md";
  slug: "2026-04-22-c3a7fd4f6003";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-23-1f3d4931510b.md": {
	id: "2026-04-23-1f3d4931510b.md";
  slug: "2026-04-23-1f3d4931510b";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-23-48364433fcb8.md": {
	id: "2026-04-23-48364433fcb8.md";
  slug: "2026-04-23-48364433fcb8";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-23-5af0de49bfa2.md": {
	id: "2026-04-23-5af0de49bfa2.md";
  slug: "2026-04-23-5af0de49bfa2";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-23-6dc4456bd972.md": {
	id: "2026-04-23-6dc4456bd972.md";
  slug: "2026-04-23-6dc4456bd972";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-23-b1f9f06f124a.md": {
	id: "2026-04-23-b1f9f06f124a.md";
  slug: "2026-04-23-b1f9f06f124a";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-23-b4ca86fa0695.md": {
	id: "2026-04-23-b4ca86fa0695.md";
  slug: "2026-04-23-b4ca86fa0695";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-23-b79c17406c8c.md": {
	id: "2026-04-23-b79c17406c8c.md";
  slug: "2026-04-23-b79c17406c8c";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-24-0557a1d712c9.md": {
	id: "2026-04-24-0557a1d712c9.md";
  slug: "2026-04-24-0557a1d712c9";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-24-57bf284a5892.md": {
	id: "2026-04-24-57bf284a5892.md";
  slug: "2026-04-24-57bf284a5892";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-24-7e1319226ba6.md": {
	id: "2026-04-24-7e1319226ba6.md";
  slug: "2026-04-24-7e1319226ba6";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-24-ddef2eb04fb5.md": {
	id: "2026-04-24-ddef2eb04fb5.md";
  slug: "2026-04-24-ddef2eb04fb5";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-24-f395057723bc.md": {
	id: "2026-04-24-f395057723bc.md";
  slug: "2026-04-24-f395057723bc";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-27-4c2943dd6d9d.md": {
	id: "2026-04-27-4c2943dd6d9d.md";
  slug: "2026-04-27-4c2943dd6d9d";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-27-93d3eae14a12.md": {
	id: "2026-04-27-93d3eae14a12.md";
  slug: "2026-04-27-93d3eae14a12";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-27-b551e0099e49.md": {
	id: "2026-04-27-b551e0099e49.md";
  slug: "2026-04-27-b551e0099e49";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-27-cd61e0ccadad.md": {
	id: "2026-04-27-cd61e0ccadad.md";
  slug: "2026-04-27-cd61e0ccadad";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-28-1f25abc2fdb4.md": {
	id: "2026-04-28-1f25abc2fdb4.md";
  slug: "2026-04-28-1f25abc2fdb4";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-28-5a2499d0bb11.md": {
	id: "2026-04-28-5a2499d0bb11.md";
  slug: "2026-04-28-5a2499d0bb11";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-28-785fa441e5ad.md": {
	id: "2026-04-28-785fa441e5ad.md";
  slug: "2026-04-28-785fa441e5ad";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-28-b9fc8a7f3e27.md": {
	id: "2026-04-28-b9fc8a7f3e27.md";
  slug: "2026-04-28-b9fc8a7f3e27";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-28-cb49202fd893.md": {
	id: "2026-04-28-cb49202fd893.md";
  slug: "2026-04-28-cb49202fd893";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-28-e3272fd647e6.md": {
	id: "2026-04-28-e3272fd647e6.md";
  slug: "2026-04-28-e3272fd647e6";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-28-ea6002d3077e.md": {
	id: "2026-04-28-ea6002d3077e.md";
  slug: "2026-04-28-ea6002d3077e";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-29-045921a2dfac.md": {
	id: "2026-04-29-045921a2dfac.md";
  slug: "2026-04-29-045921a2dfac";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-30-0edc5658abc4.md": {
	id: "2026-04-30-0edc5658abc4.md";
  slug: "2026-04-30-0edc5658abc4";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-30-0ffd8808243e.md": {
	id: "2026-04-30-0ffd8808243e.md";
  slug: "2026-04-30-0ffd8808243e";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-30-3cdefeaba9c2.md": {
	id: "2026-04-30-3cdefeaba9c2.md";
  slug: "2026-04-30-3cdefeaba9c2";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-30-49547e00f945.md": {
	id: "2026-04-30-49547e00f945.md";
  slug: "2026-04-30-49547e00f945";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-30-552cc82d6a43.md": {
	id: "2026-04-30-552cc82d6a43.md";
  slug: "2026-04-30-552cc82d6a43";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-30-69958e18eb85.md": {
	id: "2026-04-30-69958e18eb85.md";
  slug: "2026-04-30-69958e18eb85";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-30-8fe55d237e96.md": {
	id: "2026-04-30-8fe55d237e96.md";
  slug: "2026-04-30-8fe55d237e96";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-30-ba7e9d21a639.md": {
	id: "2026-04-30-ba7e9d21a639.md";
  slug: "2026-04-30-ba7e9d21a639";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-30-bd46e9c6c4b9.md": {
	id: "2026-04-30-bd46e9c6c4b9.md";
  slug: "2026-04-30-bd46e9c6c4b9";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-30-ccab14a3db8b.md": {
	id: "2026-04-30-ccab14a3db8b.md";
  slug: "2026-04-30-ccab14a3db8b";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-30-d7364686bf66.md": {
	id: "2026-04-30-d7364686bf66.md";
  slug: "2026-04-30-d7364686bf66";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-30-dde08e8d2868.md": {
	id: "2026-04-30-dde08e8d2868.md";
  slug: "2026-04-30-dde08e8d2868";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-30-e69d498379db.md": {
	id: "2026-04-30-e69d498379db.md";
  slug: "2026-04-30-e69d498379db";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-04-30-f949cd0e0e0a.md": {
	id: "2026-04-30-f949cd0e0e0a.md";
  slug: "2026-04-30-f949cd0e0e0a";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-01-11b04b3a5c61.md": {
	id: "2026-05-01-11b04b3a5c61.md";
  slug: "2026-05-01-11b04b3a5c61";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-01-1b509e7d56f7.md": {
	id: "2026-05-01-1b509e7d56f7.md";
  slug: "2026-05-01-1b509e7d56f7";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-01-4e584c7011a0.md": {
	id: "2026-05-01-4e584c7011a0.md";
  slug: "2026-05-01-4e584c7011a0";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-01-51e213dda5aa.md": {
	id: "2026-05-01-51e213dda5aa.md";
  slug: "2026-05-01-51e213dda5aa";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-01-6382eb127770.md": {
	id: "2026-05-01-6382eb127770.md";
  slug: "2026-05-01-6382eb127770";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-01-77be45acb166.md": {
	id: "2026-05-01-77be45acb166.md";
  slug: "2026-05-01-77be45acb166";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-01-882d5496054b.md": {
	id: "2026-05-01-882d5496054b.md";
  slug: "2026-05-01-882d5496054b";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-01-8849382eaa4e.md": {
	id: "2026-05-01-8849382eaa4e.md";
  slug: "2026-05-01-8849382eaa4e";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-01-8a61f26b3fe8.md": {
	id: "2026-05-01-8a61f26b3fe8.md";
  slug: "2026-05-01-8a61f26b3fe8";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-06-85fdb4f332ce.md": {
	id: "2026-05-06-85fdb4f332ce.md";
  slug: "2026-05-06-85fdb4f332ce";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-07-5c56a92c14e4.md": {
	id: "2026-05-07-5c56a92c14e4.md";
  slug: "2026-05-07-5c56a92c14e4";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-07-5d92629aec57.md": {
	id: "2026-05-07-5d92629aec57.md";
  slug: "2026-05-07-5d92629aec57";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-07-98577e171804.md": {
	id: "2026-05-07-98577e171804.md";
  slug: "2026-05-07-98577e171804";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-08-118c9418d1be.md": {
	id: "2026-05-08-118c9418d1be.md";
  slug: "2026-05-08-118c9418d1be";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-08-5525d131bf0c.md": {
	id: "2026-05-08-5525d131bf0c.md";
  slug: "2026-05-08-5525d131bf0c";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-09-d0174d82851e.md": {
	id: "2026-05-09-d0174d82851e.md";
  slug: "2026-05-09-d0174d82851e";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-24-dd0f4f19422f.md": {
	id: "2026-05-24-dd0f4f19422f.md";
  slug: "2026-05-24-dd0f4f19422f";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-25-d8d838bf3775.md": {
	id: "2026-05-25-d8d838bf3775.md";
  slug: "2026-05-25-d8d838bf3775";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-05-26-f72942f83cfc.md": {
	id: "2026-05-26-f72942f83cfc.md";
  slug: "2026-05-26-f72942f83cfc";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-06-16-7166810349f3.md": {
	id: "2026-06-16-7166810349f3.md";
  slug: "2026-06-16-7166810349f3";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-06-17-a9977479d61e.md": {
	id: "2026-06-17-a9977479d61e.md";
  slug: "2026-06-17-a9977479d61e";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-06-18-736d8aafad35.md": {
	id: "2026-06-18-736d8aafad35.md";
  slug: "2026-06-18-736d8aafad35";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-06-25-eeaabcdf6823.md": {
	id: "2026-06-25-eeaabcdf6823.md";
  slug: "2026-06-25-eeaabcdf6823";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-06-27-trends-33fb110ec0.md": {
	id: "2026-06-27-trends-33fb110ec0.md";
  slug: "2026-06-27-trends-33fb110ec0";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-06-27-trends-9f6d0da82e.md": {
	id: "2026-06-27-trends-9f6d0da82e.md";
  slug: "2026-06-27-trends-9f6d0da82e";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-06-28-trends-60271a1467.md": {
	id: "2026-06-28-trends-60271a1467.md";
  slug: "2026-06-28-trends-60271a1467";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-06-28-trends-9c0d7b2ad5.md": {
	id: "2026-06-28-trends-9c0d7b2ad5.md";
  slug: "2026-06-28-trends-9c0d7b2ad5";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-06-30-trends-45bfef4b36.md": {
	id: "2026-06-30-trends-45bfef4b36.md";
  slug: "2026-06-30-trends-45bfef4b36";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-01-trends-71d510491d.md": {
	id: "2026-07-01-trends-71d510491d.md";
  slug: "2026-07-01-trends-71d510491d";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-02-trends-9b76e2db17.md": {
	id: "2026-07-02-trends-9b76e2db17.md";
  slug: "2026-07-02-trends-9b76e2db17";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-02-trends-b85e3c798e.md": {
	id: "2026-07-02-trends-b85e3c798e.md";
  slug: "2026-07-02-trends-b85e3c798e";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-02-trends-f392f38d4c.md": {
	id: "2026-07-02-trends-f392f38d4c.md";
  slug: "2026-07-02-trends-f392f38d4c";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-03-04f75c395c96.md": {
	id: "2026-07-03-04f75c395c96.md";
  slug: "2026-07-03-04f75c395c96";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-03-trends-0616a58894.md": {
	id: "2026-07-03-trends-0616a58894.md";
  slug: "2026-07-03-trends-0616a58894";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-03-trends-fb2899303b.md": {
	id: "2026-07-03-trends-fb2899303b.md";
  slug: "2026-07-03-trends-fb2899303b";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-04-trends-38ec8e5e42.md": {
	id: "2026-07-04-trends-38ec8e5e42.md";
  slug: "2026-07-04-trends-38ec8e5e42";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-04-trends-e7b979a877.md": {
	id: "2026-07-04-trends-e7b979a877.md";
  slug: "2026-07-04-trends-e7b979a877";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-05-trends-4a3b6487c0.md": {
	id: "2026-07-05-trends-4a3b6487c0.md";
  slug: "2026-07-05-trends-4a3b6487c0";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-05-trends-e461d3c793.md": {
	id: "2026-07-05-trends-e461d3c793.md";
  slug: "2026-07-05-trends-e461d3c793";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-06-trends-b7ce7cdb28.md": {
	id: "2026-07-06-trends-b7ce7cdb28.md";
  slug: "2026-07-06-trends-b7ce7cdb28";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-07-trends-523ed9ded7.md": {
	id: "2026-07-07-trends-523ed9ded7.md";
  slug: "2026-07-07-trends-523ed9ded7";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-08-trends-c38f914e0a.md": {
	id: "2026-07-08-trends-c38f914e0a.md";
  slug: "2026-07-08-trends-c38f914e0a";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-10-trends-bcd1d1030b.md": {
	id: "2026-07-10-trends-bcd1d1030b.md";
  slug: "2026-07-10-trends-bcd1d1030b";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-13-trends-0989591ed8.md": {
	id: "2026-07-13-trends-0989591ed8.md";
  slug: "2026-07-13-trends-0989591ed8";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-13-trends-2cac54235d.md": {
	id: "2026-07-13-trends-2cac54235d.md";
  slug: "2026-07-13-trends-2cac54235d";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-14-trends-ca5fd54855.md": {
	id: "2026-07-14-trends-ca5fd54855.md";
  slug: "2026-07-14-trends-ca5fd54855";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-16-trends-b5e4549307.md": {
	id: "2026-07-16-trends-b5e4549307.md";
  slug: "2026-07-16-trends-b5e4549307";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-17-trends-0be69c9bbd.md": {
	id: "2026-07-17-trends-0be69c9bbd.md";
  slug: "2026-07-17-trends-0be69c9bbd";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-17-trends-a0ce3cde37.md": {
	id: "2026-07-17-trends-a0ce3cde37.md";
  slug: "2026-07-17-trends-a0ce3cde37";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-21-trends-b613b33f6e.md": {
	id: "2026-07-21-trends-b613b33f6e.md";
  slug: "2026-07-21-trends-b613b33f6e";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-23-trends-854a7df4c3.md": {
	id: "2026-07-23-trends-854a7df4c3.md";
  slug: "2026-07-23-trends-854a7df4c3";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-25-trends-5d5aebd4b2.md": {
	id: "2026-07-25-trends-5d5aebd4b2.md";
  slug: "2026-07-25-trends-5d5aebd4b2";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-26-trends-fd1b49e77a.md": {
	id: "2026-07-26-trends-fd1b49e77a.md";
  slug: "2026-07-26-trends-fd1b49e77a";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-27-trends-8242666827.md": {
	id: "2026-07-27-trends-8242666827.md";
  slug: "2026-07-27-trends-8242666827";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-29-trends-bd7df9d35e.md": {
	id: "2026-07-29-trends-bd7df9d35e.md";
  slug: "2026-07-29-trends-bd7df9d35e";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-07-30-trends-860f50f815.md": {
	id: "2026-07-30-trends-860f50f815.md";
  slug: "2026-07-30-trends-860f50f815";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-01-46b31f030cbc.md": {
	id: "2026-08-01-46b31f030cbc.md";
  slug: "2026-08-01-46b31f030cbc";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-01-trends-0afc9a4c0c.md": {
	id: "2026-08-01-trends-0afc9a4c0c.md";
  slug: "2026-08-01-trends-0afc9a4c0c";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-02-trends-0cb00a4f6b.md": {
	id: "2026-08-02-trends-0cb00a4f6b.md";
  slug: "2026-08-02-trends-0cb00a4f6b";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-03-trends-9b72ae10c3.md": {
	id: "2026-08-03-trends-9b72ae10c3.md";
  slug: "2026-08-03-trends-9b72ae10c3";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-05-trends-175eb510a8.md": {
	id: "2026-08-05-trends-175eb510a8.md";
  slug: "2026-08-05-trends-175eb510a8";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-07-e5fbe4a419ae.md": {
	id: "2026-08-07-e5fbe4a419ae.md";
  slug: "2026-08-07-e5fbe4a419ae";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-07-trends-1fb3718882.md": {
	id: "2026-08-07-trends-1fb3718882.md";
  slug: "2026-08-07-trends-1fb3718882";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-07-trends-9779f50263.md": {
	id: "2026-08-07-trends-9779f50263.md";
  slug: "2026-08-07-trends-9779f50263";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-08-trends-55527216f2.md": {
	id: "2026-08-08-trends-55527216f2.md";
  slug: "2026-08-08-trends-55527216f2";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-09-trends-f2cdce0067.md": {
	id: "2026-08-09-trends-f2cdce0067.md";
  slug: "2026-08-09-trends-f2cdce0067";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-12-trends-159e97f50f.md": {
	id: "2026-08-12-trends-159e97f50f.md";
  slug: "2026-08-12-trends-159e97f50f";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-13-trends-51232cfce1.md": {
	id: "2026-08-13-trends-51232cfce1.md";
  slug: "2026-08-13-trends-51232cfce1";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-14-9f5728e61317.md": {
	id: "2026-08-14-9f5728e61317.md";
  slug: "2026-08-14-9f5728e61317";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-14-trends-b5aa1f7543.md": {
	id: "2026-08-14-trends-b5aa1f7543.md";
  slug: "2026-08-14-trends-b5aa1f7543";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-16-trends-7f67f624b4.md": {
	id: "2026-08-16-trends-7f67f624b4.md";
  slug: "2026-08-16-trends-7f67f624b4";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-17-trends-83ba3ddf89.md": {
	id: "2026-08-17-trends-83ba3ddf89.md";
  slug: "2026-08-17-trends-83ba3ddf89";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-22-trends-0fe977267a.md": {
	id: "2026-08-22-trends-0fe977267a.md";
  slug: "2026-08-22-trends-0fe977267a";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-23-trends-a4822393e3.md": {
	id: "2026-08-23-trends-a4822393e3.md";
  slug: "2026-08-23-trends-a4822393e3";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-24-trends-1e7e657cab.md": {
	id: "2026-08-24-trends-1e7e657cab.md";
  slug: "2026-08-24-trends-1e7e657cab";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-25-4a9da9d321.md": {
	id: "2026-08-25-4a9da9d321.md";
  slug: "2026-08-25-4a9da9d321";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-25-trends-98c560a70d.md": {
	id: "2026-08-25-trends-98c560a70d.md";
  slug: "2026-08-25-trends-98c560a70d";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-27-trends-f547e413c5.md": {
	id: "2026-08-27-trends-f547e413c5.md";
  slug: "2026-08-27-trends-f547e413c5";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-28-trends-2fafa2c6dd.md": {
	id: "2026-08-28-trends-2fafa2c6dd.md";
  slug: "2026-08-28-trends-2fafa2c6dd";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-29-trends-b1a4204828.md": {
	id: "2026-08-29-trends-b1a4204828.md";
  slug: "2026-08-29-trends-b1a4204828";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-30-trends-1a83400b0d.md": {
	id: "2026-08-30-trends-1a83400b0d.md";
  slug: "2026-08-30-trends-1a83400b0d";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-08-31-trends-d2809ffb21.md": {
	id: "2026-08-31-trends-d2809ffb21.md";
  slug: "2026-08-31-trends-d2809ffb21";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-01-trends-431039bca6.md": {
	id: "2026-09-01-trends-431039bca6.md";
  slug: "2026-09-01-trends-431039bca6";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-03-a0f859b92961.md": {
	id: "2026-09-03-a0f859b92961.md";
  slug: "2026-09-03-a0f859b92961";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-05-trends-dcbc4857e1.md": {
	id: "2026-09-05-trends-dcbc4857e1.md";
  slug: "2026-09-05-trends-dcbc4857e1";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-07-trends-0a1a2ee27b.md": {
	id: "2026-09-07-trends-0a1a2ee27b.md";
  slug: "2026-09-07-trends-0a1a2ee27b";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-08-trends-1a9f4d13e1.md": {
	id: "2026-09-08-trends-1a9f4d13e1.md";
  slug: "2026-09-08-trends-1a9f4d13e1";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-09-trends-2dd9f17a01.md": {
	id: "2026-09-09-trends-2dd9f17a01.md";
  slug: "2026-09-09-trends-2dd9f17a01";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-10-1acc8f894f78.md": {
	id: "2026-09-10-1acc8f894f78.md";
  slug: "2026-09-10-1acc8f894f78";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-10-trends-b49b230168.md": {
	id: "2026-09-10-trends-b49b230168.md";
  slug: "2026-09-10-trends-b49b230168";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-11-trends-3e09aae1e0.md": {
	id: "2026-09-11-trends-3e09aae1e0.md";
  slug: "2026-09-11-trends-3e09aae1e0";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-12-trends-03a4478486.md": {
	id: "2026-09-12-trends-03a4478486.md";
  slug: "2026-09-12-trends-03a4478486";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-13-trends-56572f0bfd.md": {
	id: "2026-09-13-trends-56572f0bfd.md";
  slug: "2026-09-13-trends-56572f0bfd";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-14-trends-b96c3f907c.md": {
	id: "2026-09-14-trends-b96c3f907c.md";
  slug: "2026-09-14-trends-b96c3f907c";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-15-4464d56b27a6.md": {
	id: "2026-09-15-4464d56b27a6.md";
  slug: "2026-09-15-4464d56b27a6";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-15-trends-62ad448987.md": {
	id: "2026-09-15-trends-62ad448987.md";
  slug: "2026-09-15-trends-62ad448987";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-16-trends-7ed0f510b1.md": {
	id: "2026-09-16-trends-7ed0f510b1.md";
  slug: "2026-09-16-trends-7ed0f510b1";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-20-trends-9151f2ba9d.md": {
	id: "2026-09-20-trends-9151f2ba9d.md";
  slug: "2026-09-20-trends-9151f2ba9d";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-21-trends-f7ce8d12d4.md": {
	id: "2026-09-21-trends-f7ce8d12d4.md";
  slug: "2026-09-21-trends-f7ce8d12d4";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-23-trends-b4bbaac9d7.md": {
	id: "2026-09-23-trends-b4bbaac9d7.md";
  slug: "2026-09-23-trends-b4bbaac9d7";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-25-trends-fe8f0826cf.md": {
	id: "2026-09-25-trends-fe8f0826cf.md";
  slug: "2026-09-25-trends-fe8f0826cf";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-27-trends-19b0dc6f48.md": {
	id: "2026-09-27-trends-19b0dc6f48.md";
  slug: "2026-09-27-trends-19b0dc6f48";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-28-trends-b708d2c562.md": {
	id: "2026-09-28-trends-b708d2c562.md";
  slug: "2026-09-28-trends-b708d2c562";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-29-trends-1695a931d9.md": {
	id: "2026-09-29-trends-1695a931d9.md";
  slug: "2026-09-29-trends-1695a931d9";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-09-30-trends-bce5bd481b.md": {
	id: "2026-09-30-trends-bce5bd481b.md";
  slug: "2026-09-30-trends-bce5bd481b";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-10-01-trends-0b586c36a1.md": {
	id: "2026-10-01-trends-0b586c36a1.md";
  slug: "2026-10-01-trends-0b586c36a1";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-10-03-trends-3879bf01ea.md": {
	id: "2026-10-03-trends-3879bf01ea.md";
  slug: "2026-10-03-trends-3879bf01ea";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-10-04-trends-c140d35ea5.md": {
	id: "2026-10-04-trends-c140d35ea5.md";
  slug: "2026-10-04-trends-c140d35ea5";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-10-05-trends-3c0941eb5c.md": {
	id: "2026-10-05-trends-3c0941eb5c.md";
  slug: "2026-10-05-trends-3c0941eb5c";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-10-06-trends-9aac8ad9bb.md": {
	id: "2026-10-06-trends-9aac8ad9bb.md";
  slug: "2026-10-06-trends-9aac8ad9bb";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-10-08-trends-7d563bc673.md": {
	id: "2026-10-08-trends-7d563bc673.md";
  slug: "2026-10-08-trends-7d563bc673";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-10-11-trends-7865a757f6.md": {
	id: "2026-10-11-trends-7865a757f6.md";
  slug: "2026-10-11-trends-7865a757f6";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-10-12-trends-32a3c14b9f.md": {
	id: "2026-10-12-trends-32a3c14b9f.md";
  slug: "2026-10-12-trends-32a3c14b9f";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-10-18-trends-12339ad1f7.md": {
	id: "2026-10-18-trends-12339ad1f7.md";
  slug: "2026-10-18-trends-12339ad1f7";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-10-20-kouki-kinyushotoku.md": {
	id: "2026-10-20-kouki-kinyushotoku.md";
  slug: "2026-10-20-kouki-kinyushotoku";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-10-22-trends-62e409f7b7.md": {
	id: "2026-10-22-trends-62e409f7b7.md";
  slug: "2026-10-22-trends-62e409f7b7";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-10-23-trends-664733166b.md": {
	id: "2026-10-23-trends-664733166b.md";
  slug: "2026-10-23-trends-664733166b";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-10-27-70dai-toushi.md": {
	id: "2026-10-27-70dai-toushi.md";
  slug: "2026-10-27-70dai-toushi";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-10-27-kyufukin-fusei.md": {
	id: "2026-10-27-kyufukin-fusei.md";
  slug: "2026-10-27-kyufukin-fusei";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"2026-10-28-trends-409909fbc9.md": {
	id: "2026-10-28-trends-409909fbc9.md";
  slug: "2026-10-28-trends-409909fbc9";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"boj-rate-hike-mortgage-2026.md": {
	id: "boj-rate-hike-mortgage-2026.md";
  slug: "boj-rate-hike-mortgage-2026";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"forex-intervention-2026.md": {
	id: "forex-intervention-2026.md";
  slug: "forex-intervention-2026";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"fp-cbt-exam-2026.md": {
	id: "fp-cbt-exam-2026.md";
  slug: "fp-cbt-exam-2026";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"fp2-quiz-challenge.md": {
	id: "fp2-quiz-challenge.md";
  slug: "fp2-quiz-challenge";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"fp2-tango-app.md": {
	id: "fp2-tango-app.md";
  slug: "fp2-tango-app";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"fp3-learning-songs-youtube.md": {
	id: "fp3-learning-songs-youtube.md";
  slug: "fp3-learning-songs-youtube";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"fp3-quiz-challenge.md": {
	id: "fp3-quiz-challenge.md";
  slug: "fp3-quiz-challenge";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"fp3-tango-app.md": {
	id: "fp3-tango-app.md";
  slug: "fp3-tango-app";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"furusato-rakuten-2025.md": {
	id: "furusato-rakuten-2025.md";
  slug: "furusato-rakuten-2025";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gambling-dependence-awareness-2026.md": {
	id: "gambling-dependence-awareness-2026.md";
  slug: "gambling-dependence-awareness-2026";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"ideco-reform-2026.md": {
	id: "ideco-reform-2026.md";
  slug: "ideco-reform-2026";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"kojin-kokusai.md": {
	id: "kojin-kokusai.md";
  slug: "kojin-kokusai";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"leaseback-regulation-2026.md": {
	id: "leaseback-regulation-2026.md";
  slug: "leaseback-regulation-2026";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"moneyforward-security-2026.md": {
	id: "moneyforward-security-2026.md";
  slug: "moneyforward-security-2026";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"nenkin-3go-minaoshi-2026.md": {
	id: "nenkin-3go-minaoshi-2026.md";
  slug: "nenkin-3go-minaoshi-2026";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"nisa-2026.md": {
	id: "nisa-2026.md";
  slug: "nisa-2026";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"otc-insurance-reform-2027.md": {
	id: "otc-insurance-reform-2027.md";
  slug: "otc-insurance-reform-2027";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"seinen-koken-2026.md": {
	id: "seinen-koken-2026.md";
  slug: "seinen-koken-2026";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"tokyo-chika-2026.md": {
	id: "tokyo-chika-2026.md";
  slug: "tokyo-chika-2026";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
