import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    
    // Remove any existing rules for PDF files
    config.module.rules = config.module.rules.filter(rule => 
      !rule.test?.test?.('.pdf')
    );
    
    return config;
  },
  // Add these to handle worker files
  experimental: {
    optimizePackageImports: ['@react-pdf']
  },
  // Add this to allow loading resources from CDN
  images: {
    domains: ['unpkg.com', 'cdnjs.cloudflare.com'],
  }
}

export default nextConfig;
