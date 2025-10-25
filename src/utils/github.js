/**
 * GitHub URL에서 owner와 repo를 추출합니다
 * 예: https://github.com/owner/repo -> { owner: 'owner', repo: 'repo' }
 */
export function parseGitHubUrl(url) {
  try {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;
    
    let repo = match[2];
    // .git 확장자 제거
    if (repo.endsWith('.git')) {
      repo = repo.slice(0, -4);
    }
    
    return {
      owner: match[1],
      repo: repo,
    };
  } catch (error) {
    return null;
  }
}

/**
 * GitHub API를 통해 커밋 데이터를 가져옵니다
 */
export async function fetchGitHubCommits(githubUrl) {
  const parsed = parseGitHubUrl(githubUrl);
  if (!parsed) {
    throw new Error('유효하지 않은 GitHub URL입니다');
  }

  const { owner, repo } = parsed;
  
  try {
    // GitHub API를 통해 최근 100개의 커밋 가져오기
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('레포지토리를 찾을 수 없습니다');
      }
      throw new Error(`GitHub API 오류: ${response.status}`);
    }

    const commits = await response.json();
    
    // 날짜별로 커밋 수를 그룹화
    const commitsByDate = commits.reduce((acc, commit) => {
      const date = commit.commit.author.date.split('T')[0]; // YYYY-MM-DD 형식
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // CommitData 배열로 변환
    return Object.entries(commitsByDate).map(([date, count]) => ({
      date,
      count,
    }));
  } catch (error) {
    console.error('GitHub 커밋 데이터 가져오기 실패:', error);
    throw error;
  }
}

/**
 * 날짜 범위 내의 모든 날짜를 생성합니다
 */
export function generateDateRange(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

/**
 * 커밋 데이터를 주간 단위로 그룹화합니다 (잔디심기 표시용)
 */
export function groupCommitsByWeek(commits, startDate) {
  // 커밋이 없으면 빈 배열 반환
  if (commits.length === 0) return [];

  // 시작 날짜 계산 (최근 52주 또는 지정된 날짜)
  const end = new Date();
  const start = startDate 
    ? new Date(startDate)
    : new Date(end.getTime() - 52 * 7 * 24 * 60 * 60 * 1000);

  // 시작일을 일요일로 조정
  const dayOfWeek = start.getDay();
  start.setDate(start.getDate() - dayOfWeek);

  // 모든 날짜 생성
  const allDates = generateDateRange(start, end);
  
  // 커밋 데이터를 Map으로 변환하여 빠른 조회
  const commitMap = new Map(commits.map(c => [c.date, c.count]));
  
  // 날짜를 주 단위로 그룹화 (일요일부터 토요일까지)
  const weeks = [];
  let currentWeek = [];
  
  allDates.forEach((date, index) => {
    currentWeek.push({
      date,
      count: commitMap.get(date) || 0,
    });
    
    // 토요일이거나 마지막 날짜인 경우 새로운 주 시작
    if (currentWeek.length === 7 || index === allDates.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  return weeks;
}
