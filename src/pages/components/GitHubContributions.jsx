import { useMemo } from "react";
import { groupCommitsByWeek } from "../../utils/github";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function GitHubContributions({ commits, startDate }) {
  const weeks = useMemo(() => groupCommitsByWeek(commits, startDate), [commits, startDate]);

  // 커밋 수에 따른 색상 강도 결정
  const getIntensityColor = (count) => {
    if (count === 0) return "bg-muted";
    if (count <= 2) return "bg-green-200 dark:bg-green-900";
    if (count <= 5) return "bg-green-400 dark:bg-green-700";
    if (count <= 10) return "bg-green-600 dark:bg-green-500";
    return "bg-green-800 dark:bg-green-400";
  };

  // 날짜 포맷팅
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (weeks.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
        커밋 데이터가 없습니다
      </div>
    );
  }

  const totalCommits = commits.reduce((sum, commit) => sum + commit.count, 0);
  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          총 {totalCommits}개의 커밋
        </span>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">적음</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
            <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
            <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
            <div className="w-3 h-3 rounded-sm bg-green-800 dark:bg-green-400" />
          </div>
          <span className="text-muted-foreground">많음</span>
        </div>
      </div>

      <TooltipProvider>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {/* 요일 레이블 */}
          <div className="flex flex-col gap-1 pr-2 text-xs text-muted-foreground">
            <div className="h-3" /> {/* 상단 여백 */}
            {dayLabels.map((day, index) => (
              <div key={index} className="h-3 flex items-center">
                {index % 2 === 1 && day}
              </div>
            ))}
          </div>

          {/* 주별 커밋 그리드 */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {/* 월 레이블 (매월 첫 주에만 표시) */}
                <div className="h-3 text-xs text-muted-foreground">
                  {weekIndex === 0 || new Date(week[0].date).getDate() <= 7
                    ? new Date(week[0].date).toLocaleDateString('ko-KR', { month: 'short' })
                    : ''}
                </div>

                {week.map((day, dayIndex) => (
                  <Tooltip key={dayIndex} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-3 h-3 rounded-sm ${getIntensityColor(
                          day.count
                        )} transition-colors cursor-pointer hover:ring-2 hover:ring-ring hover:ring-offset-1`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {formatDate(day.date)}: {day.count}개의 커밋
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
