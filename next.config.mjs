/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        timers: false,
      }
    }
    return config
  },
}

export default nextConfig
