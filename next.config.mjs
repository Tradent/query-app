/** @type {import('next').NextConfig} */
const nextConfig = {
  // Re-enable the App Router
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Handle the pino-pretty dependency issue
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'pino-pretty'];
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig;
