import fs from 'fs';
import { getMDXComponent } from 'mdx-bundler/client';
import { InferGetStaticPropsType } from 'next';
import path from 'path';
import { useMemo } from 'react';

import { components } from '@/components/MDXComponents';
import { loadMDX } from '@/utils/loadMDX';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  const file = path.resolve(process.cwd(), 'cts', 'archive.mdx');

  const source = fs.readFileSync(file, 'utf-8');

  const { code } = await loadMDX(source);

  return { props: { code } };
};

const Archive = ({ code }: Props) => {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return (
    <article className="max-w-[75ch] mx-auto pt-12 pb-28 px-5">
      <Component components={components} />
    </article>
  );
};

export default Archive;
