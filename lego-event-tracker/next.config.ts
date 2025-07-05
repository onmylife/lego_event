import type { NextConfig } from "next";

// GitHub Pages 배포를 위한 저장소 이름입니다.
// 실제 사용 시에는 본인의 GitHub 저장소 이름으로 변경해야 합니다.
// 예: const REPO_NAME = 'my-lego-events-repo';
const REPO_NAME = 'lego-event-tracker'; // <<-- 실제 저장소 이름으로 변경하세요!

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // GitHub Pages 배포 시 repository 이름으로 basePath를 설정합니다.
  // 로컬 개발 시에는 basePath가 없도록 하여 경로 문제를 방지합니다.
  basePath: process.env.NODE_ENV === 'production' ? `/${REPO_NAME}` : '',

  // 환경 변수를 통해 클라이언트 사이드에서도 basePath를 사용할 수 있도록 설정 (선택 사항)
  // 예: process.env.NEXT_PUBLIC_BASE_PATH를 코드에서 사용 가능
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NODE_ENV === 'production' ? `/${REPO_NAME}` : '',
  },
};

export default nextConfig;
