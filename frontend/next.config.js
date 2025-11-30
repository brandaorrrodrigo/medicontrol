/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    }
    return config
  },
  async redirects() {
    return [
      // Redirects de rotas em inglês para português - Paciente
      {
        source: '/patient/:path*',
        destination: '/paciente/:path*',
        permanent: true,
      },
      // Redirects de rotas em inglês para português - Cuidador
      {
        source: '/caregiver/:path*',
        destination: '/cuidador/:path*',
        permanent: true,
      },
      // Redirects de rotas em inglês para português - Profissional
      {
        source: '/professional/:path*',
        destination: '/profissional/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
