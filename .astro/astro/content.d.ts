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
"kojin-kokusai.md": {
	id: "kojin-kokusai.md";
  slug: "kojin-kokusai";
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
