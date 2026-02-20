/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import Link from 'next/link';

import { Footnote } from './Footnote';
import { SideNote } from './SideNote';

const linkClass =
  'font-normal underline decoration-2 underline-offset-2 decoration-gray-300 hover:decoration-current dark:decoration-gray-600 dark:hover:decoration-current transition-colors duration-200 ease-out';

export const components = {
  a: ({ href = '', ...props }) => {
    if (href.match(/http|https|mailto/)) {
      return (
        <a
          href={href}
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={props.children ? `${props.children} (opens in new tab)` : undefined}
          {...props}
        />
      );
    }
    return <Link href={href} passHref {...props} className={linkClass} />;
  },
  img: ({ alt = '', ...props }: { alt?: string; src?: string; children?: React.ReactNode }) => (
    <figure className="my-10">
      <img alt={alt} {...(props as any)} className="block w-full" />
      {alt && (
        <figcaption className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3 font-moderat not-italic">
          {alt}
        </figcaption>
      )}
    </figure>
  ),
  SideNote,
  Footnote,
};
