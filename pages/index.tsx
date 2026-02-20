import { useState } from 'react';

import { motion, useReducedMotion } from 'framer-motion';
import { format } from 'light-date';
import { InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

import { RSSIcon } from '@/components/RssIcon';
import ThemeSwitch from '@/components/ThemeSwitch';
import { getAllDocsMeta, PostPath } from '@/utils/loadMDX';

export const getStaticProps = async () => {
  const posts = await getAllDocsMeta(PostPath);
  return { props: { posts } };
};

const formatDateShort = (d: string): string => {
  const date = new Date(d);
  return `${format(date, '{dd}')}/${format(date, '{MM}')}`;
};

const isRecentPost = (d: string): boolean => {
  const diffMs = Date.now() - new Date(d).getTime();
  return diffMs < 30 * 24 * 60 * 60 * 1000;
};

const NewBadge = () => {
  const prefersReduced = useReducedMotion();
  return (
    <span
      className="ml-2 relative inline-flex items-center justify-center flex-shrink-0"
      style={{ width: 46, height: 22, transform: 'rotate(-2deg)', verticalAlign: 'middle' }}>
      <svg className="absolute inset-0" width="46" height="22" viewBox="0 0 46 22" fill="none">
        <motion.path
          d="M5 11C5.5 5 12 1.5 23 2C34 2.5 41.5 5.5 41 11C40.5 16.5 33 20.5 22 20C11 19.5 4.5 17 5 11Z"
          stroke="#ec4899"
          strokeWidth="1.3"
          strokeLinecap="round"
          initial={{ pathLength: prefersReduced ? 1 : 0, opacity: prefersReduced ? 1 : 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 0.65, ease: 'easeOut', delay: 0.3 },
            opacity: { duration: 0.01, delay: 0.3 },
          }}
        />
      </svg>
      <motion.span
        className="relative text-xs text-pink-500 leading-none font-normal"
        initial={{ opacity: prefersReduced ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, delay: prefersReduced ? 0 : 0.75 }}>
        New
      </motion.span>
    </span>
  );
};

type PostRowProps = {
  post: PostMeta;
  showYear: boolean;
  index: number;
  anyHovered: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
};

const PostRow: React.FC<PostRowProps> = ({
  post,
  showYear,
  index,
  anyHovered,
  isHovered,
  onMouseEnter,
}) => {
  const year = new Date(post.date).getFullYear();
  const showBadge = isRecentPost(post.date);
  const prefersReduced = useReducedMotion();
  const dim = anyHovered && !isHovered;

  return (
    <div className="relative" onMouseEnter={onMouseEnter}>
      {/* Border lives outside the animated element so it never dims on hover.
          Full-width when the year label shows, indented otherwise. */}
      <div
        className={`absolute top-0 right-0 h-px bg-gray-200/70 dark:bg-gray-700/40 ${
          showYear ? 'left-0' : 'left-14'
        }`}
      />
      <motion.div
        className="flex items-center py-2.5"
        initial={prefersReduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: dim ? 0.3 : 1, y: 0 }}
        transition={{
          opacity: { duration: 0.2, ease: 'easeOut' },
          y: {
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
            delay: prefersReduced ? 0 : index * 0.045,
          },
        }}>
        <span
          className="w-14 text-sm text-gray-400 dark:text-gray-500 flex-shrink-0 tabular-nums font-moderat"
          style={{ letterSpacing: '1px' }}>
          {showYear ? year : ''}
        </span>
        <Link href={`/posts/${post.slug}`} className="flex-1 flex items-center min-w-0 text-sm">
          <span className="truncate font-moderat">{post.title}</span>
          {showBadge && <NewBadge />}
        </Link>
        <span
          className="text-sm text-gray-400 dark:text-gray-500 tabular-nums ml-4 flex-shrink-0 font-moderat"
          style={{ letterSpacing: '1px' }}>
          {formatDateShort(post.date)}
        </span>
      </motion.div>
    </div>
  );
};

const PostList: React.FC<{ posts: PostMeta[] }> = ({ posts }) => {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const postsByYear: Record<string, PostMeta[]> = {};
  posts.forEach((post) => {
    const year = new Date(post.date).getFullYear().toString();
    postsByYear[year] = [...(postsByYear[year] || []), post];
  });

  const flatPosts = Object.entries(postsByYear)
    .sort(([a], [b]) => Number(b) - Number(a))
    .flatMap(([, yearPosts]) =>
      yearPosts.map((post, yearIdx) => ({ post, showYear: yearIdx === 0 }))
    );

  return (
    <div className="w-full" onMouseLeave={() => setHoveredSlug(null)}>
      {flatPosts.map(({ post, showYear }, absoluteIdx) => (
        <PostRow
          key={post.slug}
          post={post}
          showYear={showYear}
          index={absoluteIdx}
          anyHovered={hoveredSlug !== null}
          isHovered={hoveredSlug === post.slug}
          onMouseEnter={() => setHoveredSlug(post.slug)}
        />
      ))}
    </div>
  );
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Home: React.FC<Props> = ({ posts }) => {
  const prefersReduced = useReducedMotion();

  return (
    <>
      <NextSeo
        title="nazha"
        canonical="https://www.nazha.co"
        openGraph={{ url: 'https://www.nazha.co' }}
      />
      <div className="w-full sm:max-w-[600px] mx-auto px-6 pt-16 pb-24">
        {/* Header */}
        <motion.div
          className="mb-10 flex items-start justify-between"
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
          <div className="flex items-center gap-3">
            <Image
              src="/portrait/logo.jpg"
              alt="nazha"
              width={36}
              height={36}
              className="rounded-full"
            />
            <div>
              <p className="text-lg font-gaegu font-bold text-gray-600 dark:text-gray-300">
                nazha
              </p>
              <p
                className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-moderat"
                style={{ letterSpacing: '1px' }}>
                Updated Feb 19, 2026
              </p>
            </div>
          </div>
          {/* Controls preserved from nav */}
          <div className="flex items-center gap-1">
            <ThemeSwitch />
            <RSSIcon />
            <Link
              href="https://twitter.com/xiaokedada"
              aria-label="Twitter / X profile"
              className="opacity-70 hover:opacity-100 transition-opacity duration-150 p-2">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true">
                <path d="m19 4-5.93 6.93M5 20l5.93-6.93m0 0 5.795 6.587c.19.216.483.343.794.343h1.474c.836 0 1.307-.85.793-1.435L13.07 10.93m-2.14 2.14L4.214 5.435C3.7 4.85 4.17 4 5.007 4h1.474c.31 0 .604.127.794.343l5.795 6.587" />
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div
          className="mb-16 space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}>
          <p>Mostly building software and writing about it on the internet.</p>
          <p>
            Made{' '}
            <Link
              href="https://github.com/maoxiaoke/r2Uploader"
              className="underline underline-offset-2 transition-opacity duration-150 hover:opacity-60">
              R2Uploader
            </Link>
            , a desktop client for Cloudflare R2 storage, and{' '}
            <Link
              href="https://github.com/maoxiaoke/BaiJi-releases"
              className="underline underline-offset-2 transition-opacity duration-150 hover:opacity-60">
              BaiJi
            </Link>
            , a macOS app. Also keeping{' '}
            <Link
              href="https://hnta.nazha.co"
              className="underline underline-offset-2 transition-opacity duration-150 hover:opacity-60">
              Hacker News Top Archive
            </Link>{' '}
            going. More on{' '}
            <Link
              href="https://anotherme.lemonsqueezy.com/"
              className="underline underline-offset-2 transition-opacity duration-150 hover:opacity-60">
              Lemon Squeezy
            </Link>
            .
          </p>
          <p>
            I also write a{' '}
            <Link
              href="https://quaily.com/nazha"
              className="underline underline-offset-2 transition-opacity duration-150 hover:opacity-60">
              newsletter
            </Link>{' '}
            and tend a{' '}
            <Link
              href="https://garden.nazha.co"
              className="underline underline-offset-2 transition-opacity duration-150 hover:opacity-60">
              digital garden
            </Link>
            .
          </p>
          <p>
            Feel free to reach me at{' '}
            <Link
              href="https://twitter.com/xiaokedada"
              className="underline underline-offset-2 transition-opacity duration-150 hover:opacity-60">
              @xiaokedada
            </Link>
            . If you can speak Chinese, you can add my WeChat (id: nazha_m).
          </p>
        </motion.div>

        {/* Writing */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">Writing</p>
          <PostList posts={posts} />
        </motion.div>
      </div>
    </>
  );
};

export default Home;
