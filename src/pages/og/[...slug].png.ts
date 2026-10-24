import type { APIRoute, GetStaticPaths } from 'astro';
import { getPosts } from '../../lib/posts';
import { ogPng } from '../../lib/og';
import { site } from '../../data/site';

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  return [
    { params: { slug: 'default' }, props: { title: site.name, kicker: 'Privacy and robustness in ML' } },
    ...posts.map((p) => ({ params: { slug: `writing/${p.id}` }, props: { title: p.data.title, kicker: 'Writing' } })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await ogPng(props as { title: string; kicker: string });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
