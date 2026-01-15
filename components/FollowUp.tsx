import Link from 'next/link';

import { Button } from './ui/button';

type Props = { meta: PostMeta };

export const FollowUp = (props: Props) => {
  return (
    <div className="gap-2 flex flex-wrap mt-4 justify-center">
      <Link href="https://twitter.com/xiaokedada" passHref>
        <Button className="w-56">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg">
            <path d="m19 4-5.93 6.93M5 20l5.93-6.93m0 0 5.795 6.587c.19.216.483.343.794.343h1.474c.836 0 1.307-.85.793-1.435L13.07 10.93m-2.14 2.14L4.214 5.435C3.7 4.85 4.17 4 5.007 4h1.474c.31 0 .604.127.794.343l5.795 6.587" />
          </svg>
          <span className="inline-block ml-2">Find me on Twitter</span>
        </Button>
      </Link>

      <Button
        className="w-56"
        variant={'outline'}
        onClick={() =>
          navigator.share({
            url: window.location.href,
            title: props.meta?.title,
            text: props.meta?.description
          })
        }>
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0m5-5.5-5 3.5m5 7.5-5-3.5m10 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0m0-13a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
        </svg>
        <span className="inline-block ml-2">Share this post</span>
      </Button>
    </div>
  );
};
