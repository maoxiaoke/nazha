import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { setLocalStorage } from '../utils/localStorage';

const DarkModeSwitch = dynamic(
  () => import('react-toggle-dark-mode').then((mod) => mod.DarkModeSwitch),
  { loading: () => <div className="w-5 h-5" aria-busy="true" aria-label="Loading theme toggle"></div> }
);

type ColorTheme = 'light' | 'dark';

const ThemeSwitch: React.FC = () => {
  const COLOR_THEME = 'theme';

  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<ColorTheme>('dark');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const currentTheme = (document.body.getAttribute('class') as ColorTheme) || 'dark';
    setTheme(currentTheme);
    setMounted(true);

    if (!audioRef.current) {
      const audio = new Audio('/audios/switch.wav');
      audioRef.current = audio;
    }
  }, []);

  const switchTheme = () => {
    const bodyClass = document.body.classList;

    audioRef.current?.play();

    if (theme === 'dark') {
      setTheme('light');
      setLocalStorage<ColorTheme>(COLOR_THEME, 'light');

      bodyClass.add('light');
      bodyClass.remove('dark');
    } else {
      setTheme('dark');
      setLocalStorage<ColorTheme>(COLOR_THEME, 'dark');

      bodyClass.add('dark');
      bodyClass.remove('light');
    }
  };

  if (!mounted) {
    return <div className="w-11 h-11 flex items-center justify-center" aria-busy="true" aria-label="Loading theme toggle" />;
  }

  return (
    <div className="flex items-center justify-center w-11 h-11 bg-transparent cursor-pointer">
      <DarkModeSwitch
        checked={theme === 'dark'}
        onChange={switchTheme}
        moonColor="white"
        sunColor="black"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      />
    </div>
  );
};

export default ThemeSwitch;
