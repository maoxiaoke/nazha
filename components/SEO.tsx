import { DefaultSeo } from 'next-seo';

export const SEO: React.FC = () => {
  return (
    <DefaultSeo
      openGraph={{
        site_name: 'https://www.nazha.co/'
      }}
      twitter={{
        handle: '@xiaokedada',
        site: '@xiaokedada',
        cardType: 'summary_large_image'
      }}
    />
  );
};
