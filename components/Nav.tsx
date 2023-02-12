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
  { route: '/about', title: 'About Me' },
  { route: '/subscribe', title: 'Newsletter' }
];

const Nav: React.FC = () => {
  const router = useRouter();

  const isActive = (pathname: string) => {
    return router.asPath.includes(pathname);
  };
  const { resetTags } = useTags();

  return (
    <header className="relative w-full h-16">
      <div className="fixed h-20 z-40 w-full flex justify-between backdrop-blur-[20px] backdrop-saturate-150 bg-white/50 dark:bg-[#0D0D1050]">
        <nav className="w-full sm:max-w-[75ch] m-auto sm:grid md:flex px-5 justify-between items-center ">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="hover:bg-black hover:cursor-pointer hover:text-white px-2 py-1 flex items-center dark:hover:bg-white dark:hover:text-black">
            <Link href="/" passHref>
              <div className="flex items-center">
                <Image
                  className="w-8 h-8 rounded-full overflow-hidden"
                  src="/portrait/logo.jpg"
                  alt="portrait"
                  width="32px"
                  height="32px"
                />
                <h6 className="ml-2 text-xl font-bold">nazha</h6>
              </div>
            </Link>
          </motion.div>
          <div className="flex items-center gap-5">
            {routes.map(({ route, title }) => (
              <Link key={route} href={route}>
                <a
                  className={`capitalize ${isActive(route) ? '' : 'opacity-50'}`}
                  onClick={resetTags}>
                  {title}
                </a>
              </Link>
            ))}
            <ThemeSwitch />
            <RSSIcon />

            <Link href="https://twitter.com/xiaokedada" passHref>
              <span className="ml-2 bg-black text-white p-1 dark:bg-white dark:text-black cursor-pointer">
                Follow Me
              </span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Nav;
