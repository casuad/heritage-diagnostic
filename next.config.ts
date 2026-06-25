import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    // Turbopack's on-disk dev cache (enabled by default since 16.1) hit
    // "Unable to write SST file" / "write batch already active" errors on
    // this machine, leaving `next dev` permanently 500ing. Disabling it
    // trades slightly slower rebuilds for a dev server that actually starts.
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
