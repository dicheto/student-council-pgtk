/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable strict mode to avoid double mounting in dev (helps with Supabase locks)
  // reactStrictMode: false, // Uncomment if AbortError persists
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dyjthzvdsfcdumavuwmb.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    // Improve error handling
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config, { isServer }) => {
    // Discord.js и неговите зависимости трябва да се използват само на сървъра
    if (isServer) {
      config.externals = config.externals || []
      // Добавяме discord.js като external за да не се bundle-ва
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
        'discord.js': 'commonjs discord.js',
      })
    } else {
      // На клиента, маркирай всички Node.js модули като false
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        'discord.js': false,
      }
    }
    return config
  },
}

module.exports = nextConfig
