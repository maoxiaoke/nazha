import { useMemo } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import { components } from '@/components/MDXComponents';

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

  if (resObj.status >= 400) {
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
    <div className="max-w-[75ch] mx-auto pt-12 pb-28 px-5">
      <Component components={{ ...components }} />
    </div>
  );
};

export default Newsletter;
