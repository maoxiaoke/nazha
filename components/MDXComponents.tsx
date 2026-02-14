/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import Link from 'next/link';

export const components = {
  a: ({ href = '', ...props }) => {
    if (href.match(/http|https|mailto/)) {
      return (
        <a
          href={href}
          className="text-[#0070F3] hover:underline hover:opacity-80"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={props.children ? `${props.children} (opens in new tab)` : undefined}
          {...props}
        />
      );
    }
    return (
      <Link href={href} passHref {...props} className="text-[#0070F3]">
        {/* <a {...props} style={{ color: '#0070F3' }} /> */}
      </Link>
    );
  },
  img: ({ alt = '', ...props }: { alt?: string; children?: React.ReactNode }) => (
    <img alt={alt} {...(props as any)} className="my-10 block" />
  )
};
