import fs from 'fs';
import matter from 'gray-matter';
import { bundleMDX } from 'mdx-bundler';
import path from 'path';
import rehypeAutolink from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkPrism from 'remark-prism';
import glob from 'tiny-glob';

import { autoLinkHeadingsOptions } from './rehypeAutolinkPlugin';

export const RootPath = process.cwd();
export const PostPath = path.join(RootPath, 'posts');
export const ExercisesPath = path.join(RootPath, 'exercises');

export async function loadMDX(source: string) {
  try {
    const bundle = await bundleMDX({
      source,
      xdmOptions(options) {
        options.remarkPlugins = [...(options?.remarkPlugins ?? []), remarkGfm, remarkPrism];
        options.rehypePlugins = [
          ...(options?.rehypePlugins ?? []),
          rehypeSlug,
          [rehypeAutolink, autoLinkHeadingsOptions]
        ];
        return options;
      }
    });

    return bundle;
  } catch (error) {
    console.error(`Error while bundling MDX file: ${error.message}`);
    throw error;
  }
}

/**
 * Get meta data of all posts
 */
export const getAllDocsMeta = async (dir: string) => {
  const allDocsMeta = await glob(`${dir}/**/*.mdx`);

  return allDocsMeta
    .map((postPath): PostMeta => {
      const post = fs.readFileSync(path.join(RootPath, postPath), 'utf-8');

      const slug = path.basename(postPath).replace('.mdx', '');
      const meta = matter(post).data;

      return { ...meta, slug } as PostMeta;
    })
    .filter((meta) => meta.published)
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)));
};

const TWEET_RE = /<StaticTweet\sid="[0-9]+"\s\/>/g;

/**
 * Get a single post content by slug
 */

export const getDocs = async (slug: string, dir: string) => {
  const source = fs.readFileSync(path.join(dir, `${slug}.mdx`), 'utf-8');

  const { code, frontmatter, matter } = await loadMDX(source);

  const tweetMatch = matter.content.match(TWEET_RE);

  const tweetIDs = tweetMatch?.map((mdxTweet) => {
    const id = mdxTweet.match(/[0-9]+/g)![0];
    return id;
  });

  const meta = { ...frontmatter, slug } as PostMeta;
  return { meta, code, tweetIDs: tweetIDs ?? [] };
};