/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { RSSIcon } from './RssIcon';
import { useTags } from './tags/TagsContext';
import ThemeSwitch from './ThemeSwitch';

const routes = [
  { route: 'https://garden.nazha.co', title: 'Garden' },
  { route: '/subscribe', title: 'Newsletter' }
];

const Nav: React.FC = () => {
  const router = useRouter();

  const isActive = (pathname: string) => {
    return router.asPath.includes(pathname);
  };
  const { resetTags } = useTags();

  return (
    <header className="relative w-full h-40 sm:h-20">
      <div className="md:fixed sm:h-20 h-40 z-40 w-full flex justify-between backdrop-blur-[20px] backdrop-saturate-150 bg-white/50 dark:bg-[#0D0D1050]">
        <nav className="w-full sm:max-w-[75ch] m-auto sm:grid md:flex px-5 justify-between items-center ">
          <motion.div
            whileHover={{ scale: 1.3 }}
            className="hover:cursor-pointer px-2 py-1 flex items-center">
            <Link href="/" passHref>
              <div className="flex items-center">
                <Image
                  className="w-8 h-8 rounded-full overflow-hidden"
                  src="/portrait/logo.jpg"
                  alt="portrait"
                  width="32"
                  height="32"
                />
                <h6 className="ml-2 text-lg font-catamaran">nazha</h6>
              </div>
            </Link>
          </motion.div>
          <div className="flex items-center flex-wrap gap-5">
            {routes.map(({ route, title }) => (
              <Link
                key={route}
                href={route}
                className={`capitalize ${
                  isActive(route) ? '' : 'opacity-60'
                } font-gothamsm tracking-[2px] text-sm`}
                onClick={resetTags}>
                {/* <a
                  className={`capitalize ${isActive(route) ? '' : 'opacity-50'}`}
                  onClick={resetTags}>
                  {title}
                </a> */}
                {title}
              </Link>
            ))}
            <ThemeSwitch />
            <RSSIcon />

            <Link href="https://twitter.com/xiaokedada" passHref>
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                xmlns="http://www.w3.org/2000/svg">
                <path d="m19 4-5.93 6.93M5 20l5.93-6.93m0 0 5.795 6.587c.19.216.483.343.794.343h1.474c.836 0 1.307-.85.793-1.435L13.07 10.93m-2.14 2.14L4.214 5.435C3.7 4.85 4.17 4 5.007 4h1.474c.31 0 .604.127.794.343l5.795 6.587" />
              </svg>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Nav;
