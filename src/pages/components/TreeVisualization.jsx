import { useMemo } from "react";

export function TreeVisualization({ commits, season, size = "md", lastCommitDate }) {
  const sizeConfig = {
    sm: { trunk: 60, width: 120, leafSize: 4, branchOffset: 15 },
    md: { trunk: 100, width: 200, leafSize: 6, branchOffset: 25 },
    lg: { trunk: 140, width: 280, leafSize: 8, branchOffset: 35 },
  };

  const config = sizeConfig[size];
  const totalCommits = commits.reduce((sum, c) => sum + c.count, 0);

  // 마지막 커밋으로부터 경과된 날짜 계산
  const daysSinceLastCommit = useMemo(() => {
    if (!lastCommitDate) return 0;
    const last = new Date(lastCommitDate);
    const now = new Date();
    return Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  }, [lastCommitDate]);

  // 계절별 나뭇잎 색상 및 스타일
  const getSeasonalLeafStyle = (season, daysSince) => {
    // 건강도: 최근 활동이 있으면 밝게, 없으면 시들게
    const isHealthy = daysSince <= 30;
    
    switch (season) {
      case 'spring':
        return {
          colors: ['var(--spring-bud)', 'var(--spring-light)', 'var(--spring-blossom)'],
          opacity: isHealthy ? 1 : 0.6,
          shape: 'small', // 작은 새싹
        };
      case 'summer':
        return {
          colors: ['var(--summer-green)', 'var(--summer-bright)', 'var(--summer-deep)'],
          opacity: isHealthy ? 1 : 0.7,
          shape: 'full', // 무성한 잎
        };
      case 'autumn':
        return {
          colors: ['var(--autumn-red)', 'var(--autumn-orange)', 'var(--autumn-yellow)', 'var(--autumn-brown)'],
          opacity: isHealthy ? 0.95 : 0.5,
          shape: 'medium', // 단풍잎
        };
      case 'winter':
        return {
          colors: ['var(--winter-bark)', 'var(--winter-frost)'],
          opacity: 0.4,
          shape: 'minimal', // 거의 없는 잎
        };
    }
  };

  const seasonStyle = getSeasonalLeafStyle(season, daysSinceLastCommit);

  // 나뭇잎 개수 계산 (계절과 커밋 수에 따라)
  const getLeafCount = () => {
    const baseCount = Math.min(Math.max(totalCommits, 5), 200);
    switch (season) {
      case 'spring':
        return Math.floor(baseCount * 0.4); // 40% (새싹)
      case 'summer':
        return baseCount; // 100% (무성함)
      case 'autumn':
        return Math.floor(baseCount * 0.7); // 70% (떨어지는 중)
      case 'winter':
        return Math.floor(baseCount * 0.1); // 10% (거의 없음)
      default:
        return baseCount;
    }
  };

  // 나뭇잎 생성
  const leaves = useMemo(() => {
    const leafCount = getLeafCount();
    const generatedLeaves = [];
    const yShift = 20;

    for (let i = 0; i < leafCount; i++) {
      // 나무 상단에 나뭇잎 배치
      const angle = Math.random() * Math.PI;
      const distance = Math.random() * (config.width / 3.5);
      const x = config.width / 2 + Math.cos(angle) * distance;
      const y = config.branchOffset - Math.sin(angle) * distance + yShift;
      
      generatedLeaves.push({
        x,
        y,
        size: config.leafSize * (season === 'spring' ? 0.6 : season === 'winter' ? 0.4 : 0.8) * (0.7 + Math.random() * 0.6),
        rotation: Math.random() * 360,
        colorIndex: Math.floor(Math.random() * seasonStyle.colors.length),
      });
    }
    
    return generatedLeaves;
  }, [totalCommits, season, config, seasonStyle.colors.length]);

  // 낙엽 생성 (가을, 겨울)
  const fallenLeaves = useMemo(() => {
    if (season !== 'autumn' && season !== 'winter') return [];
    
    const fallenCount = season === 'autumn' ? 8 : 3;
    const fallen = [];
    
    for (let i = 0; i < fallenCount; i++) {
      fallen.push({
        x: Math.random() * config.width,
        size: config.leafSize * (0.5 + Math.random() * 0.5),
        rotation: Math.random() * 360,
        colorIndex: Math.floor(Math.random() * seasonStyle.colors.length),
      });
    }
    
    return fallen;
  }, [season, config, seasonStyle.colors.length]);

  // 눈송이 생성 (겨울)
  const snowflakes = useMemo(() => {
    if (season !== 'winter') return [];
    
    const snowCount = 12;
    const flakes = [];
    
    for (let i = 0; i < snowCount; i++) {
      flakes.push({
        x: Math.random() * config.width,
        y: Math.random() * (config.trunk + config.branchOffset),
        size: 2 + Math.random() * 3,
      });
    }
    
    return flakes;
  }, [season, config]);

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width={config.width}
        height={config.trunk + config.branchOffset + 50}
        className="overflow-visible"
      >
        {/* 눈송이 (겨울) */}
        {snowflakes.map((flake, index) => (
          <circle
            key={`snow-${index}`}
            cx={flake.x}
            cy={flake.y}
            r={flake.size}
            fill="var(--winter-snow)"
            opacity={0.8}
          />
        ))}

        {/* 나무 줄기 */}
        <rect
          x={config.width / 2 - 8}
          y={config.branchOffset + 40}
          width={16}
          height={config.trunk}
          fill="var(--forest-brown)"
          rx={4}
        />
        
        {/* 나무 기둥 질감 */}
        <rect
          x={config.width / 2 - 6}
          y={config.branchOffset + 45}
          width={3}
          height={config.trunk - 10}
          fill="var(--forest-soil)"
          opacity={0.3}
          rx={2}
        />

        {/* 주요 가지들 */}
        <g>
          <path
            d={`M ${config.width / 2} ${config.branchOffset + 50} Q ${config.width / 2 - 30} ${config.branchOffset + 35} ${config.width / 2 - 40} ${config.branchOffset + 30}`}
            stroke="var(--forest-brown)"
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M ${config.width / 2} ${config.branchOffset + 50} Q ${config.width / 2 + 30} ${config.branchOffset + 35} ${config.width / 2 + 40} ${config.branchOffset + 30}`}
            stroke="var(--forest-brown)"
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M ${config.width / 2} ${config.branchOffset + 45} L ${config.width / 2} ${config.branchOffset + 15}`}
            stroke="var(--forest-brown)"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* 나뭇잎들 */}
        {leaves.map((leaf, index) => (
          <g key={`leaf-${index}`}>
            <ellipse
              cx={leaf.x + 1}
              cy={leaf.y + 1}
              rx={leaf.size}
              ry={leaf.size * 1.3}
              fill="rgba(0,0,0,0.15)"
              transform={`rotate(${leaf.rotation} ${leaf.x + 1} ${leaf.y + 1})`}
            />
            <ellipse
              cx={leaf.x}
              cy={leaf.y}
              rx={leaf.size}
              ry={leaf.size * 1.3}
              fill={seasonStyle.colors[leaf.colorIndex]}
              opacity={seasonStyle.opacity}
              transform={`rotate(${leaf.rotation} ${leaf.x} ${leaf.y})`}
              className="transition-all duration-1000"
            />
          </g>
        ))}

        {/* 낙엽 (땅 위) */}
        {fallenLeaves.map((leaf, index) => (
          <ellipse
            key={`fallen-${index}`}
            cx={leaf.x}
            cy={config.trunk + config.branchOffset + 42}
            rx={leaf.size}
            ry={leaf.size * 1.3}
            fill={seasonStyle.colors[leaf.colorIndex]}
            opacity={0.6}
            transform={`rotate(${leaf.rotation} ${leaf.x} ${config.trunk + config.branchOffset + 42})`}
          />
        ))}
      </svg>

      {/* 잔디/땅 */}
      <div 
        className="w-full h-2 rounded-full transition-colors duration-500" 
        style={{ 
          background: season === 'winter' 
            ? 'linear-gradient(to bottom, var(--winter-snow), var(--winter-frost))' 
            : season === 'spring'
            ? 'var(--spring-light)'
            : 'var(--forest-green-dark)' 
        }} 
      />
      
      {/* 정보 표시 */}
      <div className="text-center mt-2">
        <p className="text-xs text-muted-foreground">
          {totalCommits}개의 커밋
        </p>
        {daysSinceLastCommit > 0 && (
          <p className="text-xs text-muted-foreground">
            마지막 커밋: {daysSinceLastCommit}일 전
          </p>
        )}
      </div>
    </div>
  );
}
