import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel 네이티브 Next.js 배포 (output: 'export' 제거)
  // 정적 이미지 최적화 비활성화 (Amap 아이콘 등 외부 이미지)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
