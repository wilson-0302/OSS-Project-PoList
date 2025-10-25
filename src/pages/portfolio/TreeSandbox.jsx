// src/portfolio/TreeSandbox.jsx

import { TreeVisualization } from "../components/TreeVisualization"; // 경로 확인!
import { GitHubContributions } from "../components/GitHubContributions"; // 경로 확인!

// 1. 테스트용 가짜 데이터 (이게 DB에서 가져올 데이터의 흉내입니다)
const mockCommits = [
  { date: "2025-10-25", count: 23 },
  { date: "2025-10-24", count: 8 },
  { date: "2025-10-22", count: 3 },
  { date: "2025-10-21", count: 12 },
  { date: "2025-10-19", count: 2 },
];

const mockStartDate = "2025-09-01"; // 프로젝트 시작일
const mockLastCommit = "2025-10-25"; // 마지막 커밋 날짜

export default function TreeSandbox() {
  return (
    <div className="page p-8 space-y-12">
      <h1 className="text-2xl font-bold">🌳 UI 컴포넌트 샌드박스 🎨</h1>

      <div>
        <h2 className="text-xl font-semibold mb-4">TreeVisualization 테스트</h2>
        <div className="p-10 border rounded-lg max-w-md mx-auto bg-card">
          <TreeVisualization
            commits={mockCommits}
            season={"autumn"} // 'spring', 'summer', 'winter'로 바꿔보세요.
            lastCommitDate={mockLastCommit}
            size="lg"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">GitHubContributions 테스트</h2>
        <div className="p-6 border rounded-lg max-w-xl mx-auto bg-card">
          <GitHubContributions
            commits={mockCommits}
            startDate={mockStartDate}
          />
        </div>
      </div>
    </div>
  );
}