// @ts-ignore
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  images: {
    domains: ['pbs.twimg.com']
  },
  transpilePackages: ['flowbite-datepicker'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'geoip-lite'];
    }
    return config;
  }
};
