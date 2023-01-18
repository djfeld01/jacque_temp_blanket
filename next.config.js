/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/temps',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
