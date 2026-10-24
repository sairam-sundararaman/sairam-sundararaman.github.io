import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeCitation from 'rehype-citation';
import { unified } from '@astrojs/markdown-remark';

// https://astro.build/config
export default defineConfig({
  site: 'https://sairam-sundararaman.github.io',
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        rehypeKatex,
        [
          rehypeCitation,
          {
            bibliography: 'src/content/references.bib',
            path: process.cwd(),
            csl: 'apa',
            linkCitations: true,
          },
        ],
      ],
    }),
    // Token colours come from CSS variables in global.css, so code follows the theme.
    shikiConfig: { theme: 'css-variables', wrap: false },
  },
});
