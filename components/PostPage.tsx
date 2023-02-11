/* eslint-disable @next/next/no-css-tags */
import Head from 'next/head';
import { NextSeo } from 'next-seo';

import { formateDateFull, validDate } from '@/utils/formatDate';

import Subscribe from './Subscribe';

type Props = { meta: PostMeta };

export const PostPage: React.FC<Props> = ({ meta, children }) => {
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
      <article className="max-w-[85ch] mx-auto pt-10 pb-28 px-5 prose dark:prose-invert">
        <div>
          <h1 className="mb-1 text-3xl font-black capitalize md:text-4xl">{meta.title}</h1>
          <div className="flex flex-col	pt-4 pb-8 text-sm font-thin uppercase text-warmGray-500 dark:text-warmGray-400">
            <time dateTime={validDate(meta.date)}>Published on {formateDateFull(meta.date)}</time>
            {meta.lastUpdateDate ? (
              <time dateTime={validDate(meta.lastUpdateDate)}>
                Last updated on {formateDateFull(meta.lastUpdateDate)}
              </time>
            ) : null}
          </div>

          <p className="italic">{meta.description}</p>
        </div>

        {children}

        {/*  FIXME： empty div is needed. why? */}
        <div>
          <Subscribe />
        </div>
      </article>
    </>
  );
};
