/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import Link from 'next/link';

export const components = {
  a: ({ href = '', ...props }) => {
    if (href.match(/http|https|mailto/)) {
      return (
        <a
          href={href}
          style={{ color: '#0070F3' }}
          className="hover:underline hover:opacity-80"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        />
      );
    }
    return (
      <Link href={href} passHref {...props} style={{ color: '#0070F3' }}>
        {/* <a {...props} style={{ color: '#0070F3' }} /> */}
      </Link>
    );
  },
  img: ({ ...props }: { children: React.ReactNode }) => (
    <div className="my-10">
      <img {...(props as any)} layout="fill" />
    </div>
  )
};
