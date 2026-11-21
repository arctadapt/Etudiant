/** @type {import('next').NextConfig} */
export default {
  images: { remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }] },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
      allowedOrigins: ['workspace-e95uhsoz-497c2d1409cf3400.v0.build'],
    },
  }, // upload gambar menu
};
