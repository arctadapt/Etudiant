/** @type {import('next').NextConfig} */
export default {
  images: { remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }] },
  experimental: { serverActions: { bodySizeLimit: '4mb' } }, // upload gambar menu
};
