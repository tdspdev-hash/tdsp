import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components (and partial prefetching), enabled by the create-next-app
  // scaffold, are deliberately OFF. With them on, Next keeps previously visited
  // routes alive in hidden DOM, which duplicated the header and element ids
  // when switching language. Revisit only if there is a measured need.
  cacheComponents: false,
};

export default nextConfig;
