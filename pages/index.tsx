import { InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import { ResetTagsButton, TagList } from '@/components/tags/Tag';
import { useTags } from '@/components/tags/TagsContext';
import { formateDatePreview, validDate } from '@/utils/formatDate';
import { getAllDocsMeta, PostPath } from '@/utils/loadMDX';

export const getStaticProps = async () => {
  const posts = await getAllDocsMeta(PostPath);
  return { props: { posts } };
};

export const formatTags = (tags: string) => {
  const formattedTagsArr: string[] = [];
  for (const tagStr of tags.split(',')) {
    formattedTagsArr.push(`#${tagStr}`);
  }
  return formattedTagsArr;
};

export const PostPreview: React.FC<PostMeta> = ({ slug, title, date, language }) => {
  const router = useRouter();

  return (
    <li className="my-1">
      <Link href={`${router.asPath}posts/${slug}`}>
        <a className="flex items-center p-1 capitalize transition-colors duration-200 rounded outline-none opacity-70 hover:opacity-100">
          <p className="text-sm mr-8 min-w-[50px]">
            <time dateTime={validDate(date)}>{formateDatePreview(date)}</time>
          </p>
          <h3 className="font-light">{title}</h3>
          <p className="ml-2 text-xs bg-black opacity-100 text-white dark:bg-white dark:text-black pl-1 pr-1">
            {language}
          </p>
        </a>
      </Link>
    </li>
  );
};

export const PostPreviewList: React.FC<{ posts: PostMeta[] }> = ({ posts }) => {
  const { tags: selectedTags } = useTags();
  const showAllPosts = selectedTags.size === 0;
  const postTagCountMap = posts.reduce((tagCountMap, post) => {
    formatTags(post.tags).forEach((tag) => tagCountMap.set(tag, (tagCountMap.get(tag) ?? 0) + 1));
    return tagCountMap;
  }, new Map());

  const fileredPosts = showAllPosts
    ? posts
    : posts.filter((post) => {
        const postTagSet = new Set(formatTags(post.tags));
        return Array.from(selectedTags).every((selectedTag) => postTagSet.has(selectedTag));
      });

  if (!showAllPosts && fileredPosts.length === 0) {
    return (
      <>
        <TagList postTagCountMap={postTagCountMap} />
        <ResetTagsButton />
      </>
    );
  }

  const postsByYear: Record<string, PostMeta[]> = {};

  fileredPosts.forEach((post) => {
    const year = new Date(post.date).getFullYear();
    const knownPosts = postsByYear[year] || [];
    postsByYear[year] = [...knownPosts, post];
  });

  return (
    <>
      {Object.entries(postsByYear)
        .reverse()
        .map(([year, posts]) => {
          return (
            <div key={year} className="w-full">
              <h2 className="pl-1 text-lg font-semibold">{year}</h2>
              <ul>
                {posts.map((post) => {
                  return <PostPreview key={post.slug} {...post} />;
                })}
              </ul>
            </div>
          );
        })}
    </>
  );
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Posts: React.FC<Props> = ({ posts }) => {
  return (
    <>
      <NextSeo
        title="Posts"
        canonical="https://www.nazha.co/posts"
        openGraph={{ url: 'https://www.nazha.co/posts' }}
      />
      <div className="w-full sm:max-w-[75ch] m-auto px-5 py-16 flex flex-col justify-center items-center">
        <PostPreviewList posts={posts} />
      </div>
    </>
  );
};

export default Posts;
