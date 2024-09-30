/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  cssModules: true,
  // webpack5: true,
   webpack: (config) => {
     config.resolve.fallback = { fs: false };
     return config;
   },
  typescript: {
    ignoreBuildErrors: true
},
eslint: {
  // Warning: This allows production builds to successfully complete even if
  // your project has ESLint errors.
  ignoreDuringBuilds: true,
},

};

module.exports = nextConfig;


