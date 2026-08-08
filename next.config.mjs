/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // We use plain <img> tags across the app (not next/image) because product
    // and category images live in Supabase Storage / arbitrary URLs entered
    // by you in the Table Editor, and their domain isn't known ahead of time.
    // If you'd rather use next/image for optimization, add your Supabase
    // project's storage hostname here, e.g.:
    // remotePatterns: [{ protocol: 'https', hostname: 'xxxxx.supabase.co' }],
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
