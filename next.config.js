const VERCEL_BLOB_STORE_ID = process.env.BLOB_READ_WRITE_TOKEN?.match(
  /^vercel_blob_rw_([a-z0-9]+)_[a-z0-9]+$/i,
)?.[1].toLowerCase();

const HOSTNAME_VERCEL_BLOB = VERCEL_BLOB_STORE_ID
  ? `${VERCEL_BLOB_STORE_ID}.public.blob.vercel-storage.com`
  : undefined;

const HOSTNAME_CLOUDFLARE_R2 =
  process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN;

// #Ark-modified Remote Pattern Logic 

const HOSTNAME_AWS_S3 = "localhost";

const createRemotePattern = (hostname, port) => hostname
  ? {
    protocol: 'http',
    hostname,
    port: port || '',
    pathname: '/**',
  }
  : [];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    imageSizes: [200],
    remotePatterns: []
      .concat(createRemotePattern(HOSTNAME_VERCEL_BLOB))
      .concat(createRemotePattern(HOSTNAME_CLOUDFLARE_R2))
      .concat(createRemotePattern(HOSTNAME_AWS_S3, '9000')),
    minimumCacheTTL: 31536000,
  },
};

module.exports = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')()(nextConfig)
  : nextConfig;