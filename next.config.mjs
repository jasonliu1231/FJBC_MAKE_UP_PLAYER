/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // NEXT_PUBLIC_API_URL_8100: "http://172.16.150.31:8100/test_api",
    // NEXT_PUBLIC_API_URL_8101: "http://172.16.150.31:8101/test_api",
    // NEXT_PUBLIC_API_URL_8102: "http://172.16.150.31:8102/test_api",
    // NEXT_PUBLIC_API_URL_8102: "http://172.16.161.159:8102/test_api",
    NEXT_PUBLIC_API_URL_VIDEO: "http://172.16.150.39:8200",
    NEXT_PUBLIC_API_URL_8100: "http://172.16.150.26:8100",
    NEXT_PUBLIC_API_URL_8101: "http://172.16.150.26:8101",
    NEXT_PUBLIC_API_URL_8102: "http://172.16.150.26:8102"
  }
};

export default nextConfig;
