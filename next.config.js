// @ts-ignore
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  images: {
    domains: ['pbs.twimg.com']
  },
  transpilePackages: ['flowbite-datepicker'],
  webpack: (config, { isServer }) => {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: 'node_modules/geoip-lite/data/geoip-country.dat',
              to: 'data/geoip-country.dat'
            },
            {
              from: 'node_modules/geoip-lite/data/geoip-country6.dat',
              to: 'data/geoip-country6.dat'
            }
          ]
        })
      );
    return config;
  }
};
