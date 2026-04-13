import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const articles = await getCollection('articles');
  const sorted = articles.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'FPのひとりごと',
    description: 'FP1級ファイナンシャルプランナーが税務・年金・NISA・不動産の最新情報をわかりやすく解説',
    site: context.site,
    items: sorted.map((article) => ({
      title: article.data.title,
      pubDate: article.data.pubDate,
      description: article.data.excerpt,
      link: `/articles/${article.slug}/`,
    })),
  });
}
