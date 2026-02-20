/* eslint-disable @next/next/no-css-tags */
import { motion, useReducedMotion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { useEffect, useRef, useState } from 'react';


import { formateDateFull, validDate } from '@/utils/formatDate';

import { FollowUp } from './FollowUp';
import { RSSIcon } from './RssIcon';
import Subscribe from './Subscribe';
import ThemeSwitch from './ThemeSwitch';

type Heading = { id: string; text: string; level: number };

const TableOfContents: React.FC<{ contentRef: React.RefObject<HTMLElement> }> = ({
  contentRef,
}) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState('');

  // Extract headings from the rendered article after mount
  useEffect(() => {
    if (!contentRef.current) return;
    const els = Array.from(contentRef.current.querySelectorAll('h2'));
    setHeadings(
      els.map((el) => ({
        id: el.id,
        // rehype-autolink-headings injects a "#" anchor inside each heading;
        // strip it so TOC labels are clean.
        text: (el.textContent ?? '').replace(/#\s*$/, '').trim(),
        level: 2,
      }))
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll spy: highlight the heading currently at the top of the viewport
  useEffect(() => {
    if (!headings.length) return;
    const handleScroll = () => {
      const scrollY = window.scrollY + 120;
      let current = '';
      headings.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      });
      setActiveId(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  return (
    <motion.aside
      className="fixed left-[5%] top-14 w-44 hidden xl:flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
      <Link
        href="/"
        className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:opacity-70 transition-opacity duration-150 mb-8 font-moderat">
        <span>↩</span>
        <span>Index</span>
      </Link>
      {headings.length > 0 && (
        <nav className="flex flex-col gap-1.5">
          {headings.map(({ id, text, level }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`text-sm leading-snug font-moderat transition-colors duration-150 ${
                level === 3 ? 'pl-3' : ''
              } ${
                activeId === id
                  ? 'text-gray-700 dark:text-gray-200'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}>
              {text}
            </a>
          ))}
        </nav>
      )}

      {/* Controls — same as home page header */}
      <div className="mt-10 pt-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center gap-1 -ml-1">
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
    </motion.aside>
  );
};

type Props = { meta: PostMeta };

export const PostPage: React.FC<Props> = ({ meta, children }) => {
  const prefersReduced = useReducedMotion();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const articleRef = useRef<HTMLElement>(null);

  // Inject copy buttons into remark-prism code blocks (raw HTML, not MDX components)
  useEffect(() => {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);

    const blocks = Array.from(document.querySelectorAll<HTMLElement>('.remark-highlight'));
    const cleanups = blocks.map((block) => {
      const btn = document.createElement('button');
      btn.textContent = 'Copy';
      btn.className = 'copy-btn';

      const handleClick = async () => {
        const code = block.querySelector('code')?.textContent ?? '';
        await navigator.clipboard.writeText(code);
        btn.textContent = 'Copied!';
        liveRegion.textContent = 'Code copied to clipboard';
        setTimeout(() => {
          btn.textContent = 'Copy';
          liveRegion.textContent = '';
        }, 2000);
      };

      btn.addEventListener('click', handleClick);
      block.appendChild(btn);

      return () => {
        btn.removeEventListener('click', handleClick);
        if (block.contains(btn)) block.removeChild(btn);
      };
    });
    return () => {
      cleanups.forEach((c) => c());
      if (document.body.contains(liveRegion)) document.body.removeChild(liveRegion);
    };
  }, []);

  useEffect(() => {
    const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    setTheme(currentTheme);

    const observer = new MutationObserver(() => {
      const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
      setTheme(newTheme);
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <NextSeo
        title={meta.title}
        description={meta.description}
        canonical={`https://www.nazha.co/posts/${meta.slug}`}
        openGraph={{ url: `https://www.nazha.co/posts/${meta.slug}` }}
        additionalMetaTags={[
          { name: 'twitter:title', content: meta.title },
          { name: 'twitter:description', content: meta.description }
        ]}
      />
      <Head>
        <link rel="stylesheet" href="/styles/prism.css" />
      </Head>

      <TableOfContents contentRef={articleRef} />

      {/* Mobile-only back link — sidebar is hidden below xl */}
      <div className="xl:hidden max-w-[85ch] mx-auto px-5 pt-8">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:opacity-70 transition-opacity duration-150 font-moderat w-fit">
          <span>↩</span>
          <span>Index</span>
        </Link>
      </div>

      <motion.article
        ref={articleRef}
        className="max-w-[85ch] mx-auto pt-10 pb-5 px-5 prose dark:prose-invert"
        initial={prefersReduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
        <div>
          <h1 className="mb-1 font-moderat text-[1.75rem] font-semibold capitalize">{meta.title}</h1>
          <div className="flex flex-col pt-6 pb-4 font-moderat text-[0.75rem] font-normal text-black dark:text-white">
            <time dateTime={validDate(meta.date)} className="tracking-[1px]">{formateDateFull(meta.date)}</time>
          </div>

          <div className="flex justify-center mb-10 sm:mb-12" aria-hidden="true">
            <div className="hr dark:hr-dark w-64"></div>
          </div>

          {meta.description ? (
            <p className="font-ashbury text-[1.125rem] font-normal leading-[1.625] italic">{meta.description}</p>
          ) : null}
        </div>

        <div className="text-base font-normal leading-[1.625] prose-headings:font-moderat prose-headings:font-semibold">
          {children}
        </div>

        <div className="flex justify-center mt-10 sm:mb-12" aria-hidden="true">
          <div className="hr dark:hr-dark w-64"></div>
        </div>
        {/*  FIXME： empty div is needed. why? */}
      </motion.article>

      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
        <FollowUp meta={meta} />

        <div className="mt-10">
          {/* <Subscribe /> */}
          <iframe
            src={`https://quaily.com/nazha/widget.external?theme=${theme}&list_slug=nazha&layout=subscribe_form&lang=zh`}
            data-theme={theme}
            width="100%"
            height="350px"
            title="Quail Widget"
            className="border-0"
            allow="web-share"
            allowFullScreen></iframe>
        </div>
      </motion.div>
    </>
  );
};
