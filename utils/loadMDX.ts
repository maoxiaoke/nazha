import fs from 'fs';
import matter from 'gray-matter';
import { bundleMDX } from 'mdx-bundler';
import path from 'path';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkPrism from 'remark-prism';
import glob from 'tiny-glob';
import { SKIP, visit } from 'unist-util-visit';

import remarkHighlightSyntax from './hightlight';

// Fix remark-gfm auto-linked URLs that include trailing non-ASCII characters
// (e.g. Chinese punctuation/text) by stripping them from the href and moving
// them out as a sibling text node.
function rehypeFixAutoLinks() {
  return (tree: any) => {
    visit(tree, 'element', (node: any, index: number | undefined, parent: any) => {
      if (node.tagName !== 'a' || typeof index !== 'number' || !parent) return;
      const href: string = node.properties?.href ?? '';
      if (!href.startsWith('http')) return;

      let decoded: string;
      try { decoded = decodeURIComponent(href); } catch { return; }

      // Extract only the ASCII-valid URL portion
      const validPart = decoded.match(/^(https?:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+)/)?.[1];
      if (!validPart || validPart === decoded) return;

      const trailing = decoded.slice(validPart.length);
      node.properties.href = validPart;
      node.children = [{ type: 'text', value: validPart }];
      parent.children.splice(index + 1, 0, { type: 'text', value: trailing });
      return [SKIP, index + 1];
    });
  };
}

// Convert remark-gfm footnotes ([^1]) into inline sidenotes.
// Pass 1 collects each footnote's inline content and removes the footnotes
// section from the tree. Pass 2 inserts a <span class="sidenote"> right
// after the corresponding <sup> reference.
function rehypeFootnotesToSidenotes() {
  return (tree: any) => {
    const footnoteContent: Record<string, any[]> = {};

    // Pass 1: harvest footnote definitions, then remove the section
    visit(tree, 'element', (node: any, index: number | undefined, parent: any) => {
      if (node.tagName !== 'section') return;
      const isFootnotes =
        node.properties?.dataFootnotes !== undefined ||
        (Array.isArray(node.properties?.className) &&
          node.properties.className.includes('footnotes'));
      if (!isFootnotes) return;

      const ol = node.children?.find((c: any) => c.tagName === 'ol');
      ol?.children?.forEach((li: any) => {
        if (li.tagName !== 'li' || !li.properties?.id) return;
        const id = String(li.properties.id); // "user-content-fn-1"
        const inline: any[] = [];
        li.children?.forEach((c: any) => {
          if (c.tagName !== 'p') return;
          c.children?.forEach((cc: any) => {
            // Drop the ↩ back-reference link
            if (cc.tagName === 'a' && cc.properties?.dataFootnoteBackref !== undefined) return;
            inline.push(cc);
          });
        });
        // Trim trailing whitespace text nodes
        while (inline.length && inline[inline.length - 1].type === 'text' &&
               !inline[inline.length - 1].value?.trim()) {
          inline.pop();
        }
        footnoteContent[id] = inline;
      });

      if (parent && typeof index === 'number') {
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
    });

    // Pass 2: insert <span class="sidenote"> after each <sup> ref
    visit(tree, 'element', (node: any, index: number | undefined, parent: any) => {
      if (node.tagName !== 'sup' || typeof index !== 'number' || !parent) return;
      const link = node.children?.find(
        (c: any) =>
          c.tagName === 'a' &&
          String(c.properties?.href ?? '').startsWith('#user-content-fn-'),
      );
      if (!link) return;

      const fnId = String(link.properties.href).slice(1);
      const content = footnoteContent[fnId];
      if (!content?.length) return;

      parent.children.splice(index + 1, 0, {
        type: 'element',
        tagName: 'span',
        properties: { className: ['sidenote'] },
        children: content,
      });
      return [SKIP, index + 1];
    });
  };
}

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
        remarkMath,
        remarkPrism,
        remarkHighlightSyntax
      ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options.rehypePlugins = [
        ...(options?.rehypePlugins ?? []),
        rehypeSlug,
        rehypeKatex,
        rehypeUnwrapImages,
        rehypeFootnotesToSidenotes,
        rehypeFixAutoLinks,
      ] as any;
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
