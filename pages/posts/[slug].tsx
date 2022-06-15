import { Feed } from 'feed';
import { writeFileSync } from 'fs';
import { getMDXComponent } from 'mdx-bundler/client';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { useMemo } from 'react';

import { components } from '@/components/MDXComponents';
import { PostPage } from '@/components/PostPage';
// import Tweet from '@/components/Tweet';
import { getAllDocsMeta, getDocs, PostPath } from '@/utils/loadMDX';
import { getTweets } from '@/utils/twitter';

const generateRSSFeed = (posts: PostMeta[]) => {
  const date = new Date();

  const baseUrl = 'https://www.nazha.co/';
  const author = {
    name: 'nazha',
    email: 'maoxiaoke@outlook.com',
    link: 'https://twitter.com/xiaokedada'
  };

  // Construct a new Feed object
  const feed = new Feed({
    title: "nazha's blog",
    description:
      'You can find me talking about topics related to JavaScript, TypeScript, React, Web development and technical/coding interviews',
    id: baseUrl,
    link: baseUrl,
    language: 'en',
    feedLinks: {
      rss2: `${baseUrl}/rss.xml`
    },
    updated: date,
    author,
    copyright: `All rights reserved ${new Date().getFullYear()}, nazha`
  });

  posts.forEach((post) => {
    const { slug, title, date, description, tags } = post;
    const url = `${baseUrl}/posts/${slug}`;

    feed.addItem({
      title,
      id: url,
      link: url,
      description,
      content: description,
      author: [author],
      date: new Date(date),
      category: tags.split(',').map((name) => ({ name }))
    });
  });

  // Write the RSS output to a public file, making it
  // accessible at ashleemboyer.com/rss.xml
  writeFileSync('public/rss.xml', feed.rss2());
};

export const getStaticPaths = async () => {
  const posts = await getAllDocsMeta(PostPath);
  const paths = posts.map(({ slug }) => ({ params: { slug } }));
  generateRSSFeed(posts);

  return {
    paths,
    fallback: false // 404
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const slug = context.params?.slug as string;
  const post = await getDocs(slug, PostPath);

  const tweets = await getTweets(post.tweetIDs);

  return { props: { ...post, tweets } };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const Post: React.FC<Props> = ({ meta, code }) => {
  // const StaticTweet = ({ id }) => {
  //   const tweet = tweets.find((tweet) => tweet.id === id);

  //   return <Tweet {...tweet} />;
  // };

  const Component = useMemo(() => getMDXComponent(code), [code]);
  return (
    <PostPage meta={meta}>
      <Component components={{ ...components }} />
    </PostPage>
  );
};

export default Post;
