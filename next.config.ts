// This line is the security tripwire. It forces Zod to run immediately.
import "./src/utils/env"; 

const nextConfig = {
  output: "standalone",
  // Notice we deleted the 'eslint' block to fix that yellow warning!
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;