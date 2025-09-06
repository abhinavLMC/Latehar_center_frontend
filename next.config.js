/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true
}

module.exports = nextConfig
module.exports = {
  images: {
    domains: [
      "cdn-icons-png.flaticon.com",
      "mediaandfiles.s3.ap-south-1.amazonaws.com",
    ],
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/settings',
  //       destination: '/settings/company',
  //       permanent: true,
  //     },
  //   ]
  // },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
};