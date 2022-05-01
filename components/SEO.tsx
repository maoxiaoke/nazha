import { DefaultSeo } from 'next-seo';

export const SEO: React.FC = () => {
  return (
    <DefaultSeo
      openGraph={{
        site_name: 'https://nazha.vercel.app/'
      }}
      twitter={{
        handle: '@xiaokedada',
        site: '@xiaokedada',
        cardType: 'summary_large_image'
      }}
    />
  );
};
