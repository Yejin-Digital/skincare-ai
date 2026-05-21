import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Turbopack workspace root 명시 — 상위 디렉터리에 다른 lockfile이
  // 있어도 이 프로젝트 루트를 정확히 인식하도록 설정
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
