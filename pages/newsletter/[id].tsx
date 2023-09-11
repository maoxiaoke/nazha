import { useMemo } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import { components } from '@/components/MDXComponents';

import { PostPage } from '@/components/PostPage';

import { loadMDX } from '@/utils/loadMDX';

export async function getServerSideProps({ params }) {
  const { id } = params;
  const revRes = await fetch(
    `https://api.quail.ink/lists/${process.env.QUAIL_API_LISTID}/posts/${id}`,
    {
      method: 'GET',
      // @ts-ignore custom header
      headers: {
        Authorization: `Bearer ${process.env.QUAIL_API_TOKEN}`,
        'X-QUAIL-Key': process.env.QUAIL_API_KEY
      }
    }
  );

  const resObj = await revRes.json();

  if (resObj.msg) {
    return { props: { issue: {} } };
  }

  const { code } = await loadMDX(resObj?.data?.content);

  return {
    props: {
      issue: {
        ...resObj?.data,
        code
      }
    }
  };
}

export const Newsletter = ({ issue }) => {
  const Component = useMemo(() => getMDXComponent(issue?.code), [issue?.code]);
  return (
    <PostPage
      meta={{
        title: issue?.title,
        published: issue?.first_published_at,
        listed: true,
        date: issue?.published_at,
        lastUpdateDate: issue?.published_at,
        description: issue?.summary,
        tags: issue?.tags,
        slug: issue?.slug,
        language: 'Chinese'
      }}>
      <Component components={{ ...components }} />
    </PostPage>
  );
};

export default Newsletter;
