import fs from 'fs';
import matter from 'gray-matter';
import { bundleMDX } from 'mdx-bundler';
import path from 'path';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkPrism from 'remark-prism';
import glob from 'tiny-glob';
import { SKIP, visit } from 'unist-util-visit';

import remarkHighlightSyntax from './hightlight';

// Unwrap standalone images from their auto-generated <p> wrapper.
// Without this, our <figure> MDX component renders as <p><figure>…</figure></p>
// which is invalid HTML — the browser moves <figure> out of <p>, causing a
// React hydration mismatch.
function rehypeUnwrapImages() {
  return (tree: any) => {
    visit(tree, 'element', (node: any, index: number | undefined, parent: any) => {
      if (
        !parent ||
        typeof index !== 'number' ||
        node.tagName !== 'p' ||
        !node.children.some((c: any) => c.tagName === 'img')
      ) return;

      const imgs = node.children.filter((c: any) => c.tagName === 'img');
      parent.children.splice(index, 1, ...imgs);
      return [SKIP, index];
    });
  };
}

export const RootPath = process.cwd();
export const PostPath = path.join(RootPath, 'posts');
export const ExercisesPath = path.join(RootPath, 'exercises');

export async function loadMDX(source: string) {
  const bundle = await bundleMDX({
    source,
    xdmOptions: (options) => {
      options.remarkPlugins = [
        ...(options?.remarkPlugins ?? []),
        remarkGfm,
        remarkPrism,
        remarkHighlightSyntax
      ];
      options.rehypePlugins = [
        ...(options?.rehypePlugins ?? []),
        rehypeSlug,
        rehypeUnwrapImages
      ];
      return options;
    }
  });

  return bundle;
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
