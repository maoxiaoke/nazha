import { getMDXComponent } from 'mdx-bundler/client';
import { GetServerSidePropsContext } from 'next';
import { useMemo } from 'react';

import { components } from '@/components/MDXComponents';
import { PostPage } from '@/components/PostPage';
import { ExercisesPath, getAllDocsMeta, getDocs } from '@/utils/loadMDX';

export const getStaticPaths = async () => {
  const posts = await getAllDocsMeta(ExercisesPath);
  const paths = posts.map(({ slug }) => ({ params: { slug } }));

  return {
    paths,
    fallback: false // 404
  };
};

export const getStaticProps = async (context: GetServerSidePropsContext) => {
  const slug = context.params?.slug as string;

  const exercise = await getDocs(slug, ExercisesPath);

  return {
    props: exercise
  };
};

const Exercises = ({ code, meta }) => {
  const MDXComponent = useMemo(() => getMDXComponent(code), [code]);
  return (
    <PostPage meta={meta}>
      <MDXComponent components={{ ...components }} />
    </PostPage>
  );
};

export default Exercises;
