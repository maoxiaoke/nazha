/* eslint-disable @next/next/no-css-tags */
import Head from 'next/head';
import { NextSeo } from 'next-seo';

import { formateDateFull, validDate } from '@/utils/formatDate';

import { FollowUp } from './FollowUp';
import Subscribe from './Subscribe';

type Props = { meta: PostMeta; children: React.ReactNode };

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
      <article className="max-w-[85ch] mx-auto pt-10 pb-5 px-5 prose dark:prose-invert">
        <div>
          <h1 className="mb-1 text-3xl font-black capitalize md:text-4xl">{meta.title}</h1>
          <div className="flex flex-col	pt-4 pb-4 text-sm font-thin uppercase text-warmGray-500 dark:text-warmGray-400">
            <time dateTime={validDate(meta.date)}>{formateDateFull(meta.date)}</time>
            {/* {meta.lastUpdateDate ? (
              <time dateTime={validDate(meta.lastUpdateDate)}>
                Last updated on {formateDateFull(meta.lastUpdateDate)}
              </time>
            ) : null} */}
          </div>

          <div className="pb-8">
            {meta.aiProportion === 0 || meta.aiProportion === undefined
              ? 'This post was created without the involvement of AI.'
              : `This post was created with ${meta.aiProportion * 100}% of AI.`}
          </div>

          <div className="flex justify-center mb-10 sm:mb-12">
            <div className="hr dark:hr-dark w-64"></div>
          </div>

          {meta.description ? (
            <>
              <p className="italic">{meta.description}</p>
            </>
          ) : null}
        </div>

        {children}

        <div className="flex justify-center mt-10 sm:mb-12">
          <div className="hr dark:hr-dark w-64"></div>
        </div>
        {/*  FIXME： empty div is needed. why? */}
      </article>

      <FollowUp meta={meta} />

      <div className="mt-10">
        {/* <Subscribe /> */}
        <iframe
          src="https://quaily.com/nazha/widget.external?theme=light&list_slug=nazha&layout=subscribe_form&lang=zh"
          data-theme="light"
          width="100%"
          height="350px"
          title="Quail Widget"
          frameBorder="0"
          allow="web-share"
          allowFullScreen></iframe>
      </div>
    </>
  );
};
