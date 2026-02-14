/* eslint-disable @next/next/no-css-tags */
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { useEffect, useState } from 'react';

import { formateDateFull, validDate } from '@/utils/formatDate';

import { FollowUp } from './FollowUp';
import Subscribe from './Subscribe';

type Props = { meta: PostMeta };

export const PostPage: React.FC<Props> = ({ meta, children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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
      <article className="max-w-[85ch] mx-auto pt-10 pb-5 px-5 prose dark:prose-invert">
        <div>
          <h1 className="mb-1 font-moderat text-[1.75rem] font-semibold capitalize">{meta.title}</h1>
          <div className="flex flex-col pt-6 pb-4 font-moderat text-[0.75rem] font-normal text-black dark:text-white">
            <time dateTime={validDate(meta.date)}>{formateDateFull(meta.date)}</time>
            {/* {meta.lastUpdateDate ? (
              <time dateTime={validDate(meta.lastUpdateDate)}>
                Last updated on {formateDateFull(meta.lastUpdateDate)}
              </time>
            ) : null} */}
          </div>

          <div className="flex justify-center mb-10 sm:mb-12" aria-hidden="true">
            <div className="hr dark:hr-dark w-64"></div>
          </div>

          {meta.description ? (
            <p className="font-ashbury text-[1.125rem] font-normal leading-[1.625] italic">{meta.description}</p>
          ) : null}
        </div>

        <div className="font-ashbury text-[1.125rem] font-normal leading-[1.625] prose-headings:font-moderat prose-headings:font-semibold">
          {children}
        </div>

        <div className="flex justify-center mt-10 sm:mb-12" aria-hidden="true">
          <div className="hr dark:hr-dark w-64"></div>
        </div>
        {/*  FIXME： empty div is needed. why? */}
      </article>

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
    </>
  );
};
