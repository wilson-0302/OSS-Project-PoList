import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom"; // useNavigate 추가

// shadcn/ui 컴포넌트들을 import 합니다.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Calendar, Code, Pencil, Trash2 } from "lucide-react";

// ✅ NOTE: SEASONS 정의가 필요합니다. 임시로 여기에 정의하거나, 별도 types/portfolio에서 가져와야 합니다.
const SEASONS = {
  '봄 (개발 중)': { emoji: '🌱', label: '봄 (개발 중)', season: 'spring' },
  '여름 (배포 초기)': { emoji: '🌳', label: '여름 (배포 초기)', season: 'summer' },
  '가을 (유지보수 중)': { emoji: '🍁', label: '가을 (유지보수 중)', season: 'autumn' },
  '겨울 (배포 종료)': { emoji: '❄️', label: '겨울 (배포 종료)', season: 'winter' },
};


// DashboardPage 컴포넌트를 Dashboard로 변경하고, onEdit/onDelete를 props로 받습니다.
export default function Dashboard({ onEdit, onDelete }) { // onEdit, onDelete props 추가
  const navigate = useNavigate(); // 페이지 이동을 위해 추가
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);

  // ✅ 프로젝트 데이터를 가져오는 함수 (useCallback으로 최적화)
  const fetchProjects = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("projects")
      .select("*, project_members(id, name, role)") // 멤버 정보도 함께 가져오도록 수정
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) console.error(error);
    else setProjects(data);
  }, [user]);

  // 로그인 사용자 정보 가져오기
  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    }
    fetchUser();
  }, []);

  // 사용자 로그인 시 데이터 불러오기
  useEffect(() => {
    if (user) fetchProjects();
  }, [user, fetchProjects]);


  // 💡 데이터 통계 계산 (useMemo 사용)
  const stats = useMemo(() => {
    // 1. 최근 업데이트된 포트폴리오 (최대 5개)
    const recentPortfolios = [...projects]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()) // DB 컬럼명에 맞춰 updated_at 사용
      .slice(0, 5);

    // 2. 카테고리별 분포 (DB 컬럼명: tech_stack 또는 state를 카테고리처럼 활용)
    const categoryCounts = projects.reduce((acc, p) => {
      // 여기서는 tech_stack을 카테고리처럼 사용 (쉼표로 구분되어 있다면 분리해야 함)
      const categories = (p.tech_stack || '기타').split(',').map(s => s.trim()).filter(s => s);
      categories.forEach(cat => {
          acc[cat] = (acc[cat] || 0) + 1;
      });
      return acc;
    }, {});
    
    // 3. 계절(상태)별 분포 (DB 컬럼명: state)
    const seasonCounts = projects.reduce((acc, p) => {
      const stateKey = p.state || 'N/A'; // DB state 컬럼을 key로 사용
      acc[stateKey] = (acc[stateKey] || 0) + 1;
      return acc;
    }, {});

    return { recentPortfolios, categoryCounts, seasonCounts };
  }, [projects]);


  // 삭제 기능 (List.js에서 옮겨와서 사용)
  async function deleteProject(id) {
    if (!window.confirm("정말 이 프로젝트를 삭제하시겠습니까?")) return;
    
    // onDelete prop이 있으면 그것을 사용 (상위 컴포넌트에 위임)
    if (onDelete) {
        onDelete(id);
    } else {
        // prop이 없으면 직접 DB 삭제 로직 실행
        const { error } = await supabase.from("projects").delete().eq("id", id).eq("user_id", user.id);
        if (error) {
            console.error(error);
            alert("삭제 실패");
        } else {
            alert("삭제 완료되었습니다");
            fetchProjects(); // 목록 새로고침
        }
    }
  }


  // 수정 기능 (Edit 페이지로 이동)
  function handleEdit(id) {
      if (onEdit) {
          // prop이 있으면 그것을 사용
          onEdit(id);
      } else {
          // prop이 없으면 직접 라우팅
          navigate(`/porest/so/portfolio/detail/${id}`); // Edit 경로는 따로 없을 수 있으니 Detail로 임시 이동
      }
  }


  if (!user) return <div className="page p-8">로그인 정보가 필요합니다.</div>;


  return (
    <div className="page p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1>대시보드 📊</h1>
          <p className="text-muted-foreground mt-2">
            당신의 숲 현황을 한눈에 확인하세요
          </p>
        </div>

        {/* --- 통계 카드 섹션 --- */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          
          {/* 1. 카테고리별 분포 */}
          <Card>
            <CardHeader>
              <CardTitle>기술/카테고리 분포</CardTitle>
              <CardDescription>가장 많이 사용한 기술/분야</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(stats.categoryCounts).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(stats.categoryCounts).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between border-b pb-1 last:border-b-0">
                      <span className="text-sm">{category}</span>
                      <Badge variant="secondary">{count}개</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">등록된 프로젝트가 없습니다</p>
              )}
            </CardContent>
          </Card>

          {/* 2. 계절별 프로젝트 분포 */}
          <Card>
            <CardHeader>
              <CardTitle>나무 상태 분포 (계절)</CardTitle>
              <CardDescription>프로젝트의 현재 진행 상태</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(stats.seasonCounts).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(stats.seasonCounts).map(([state, count]) => {
                    const seasonInfo = SEASONS[state] || { emoji: '❓', label: state };
                    return (
                      <div key={state} className="flex items-center justify-between border-b pb-1 last:border-b-0">
                        <span className="flex items-center gap-2 text-sm">
                          <span>{seasonInfo.emoji}</span>
                          <span>{seasonInfo.label}</span>
                        </span>
                        <Badge variant="secondary">{count}개</Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">등록된 프로젝트가 없습니다</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* --- 최근 업데이트 리스트 섹션 --- */}
        <Card>
          <CardHeader>
            <CardTitle>최근 업데이트</CardTitle>
            <CardDescription>최근 수정된 포트폴리오 5개</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentPortfolios.length > 0 ? (
              <div className="space-y-4">
                {stats.recentPortfolios.map((portfolio) => {
                  const techArray = (portfolio.tech_stack || '').split(',').map(s => s.trim()).filter(s => s);
                  const seasonInfo = SEASONS[portfolio.state] || { emoji: '❓', label: portfolio.state };
                  return (
                    <div
                      key={portfolio.id}
                      className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      onClick={() => navigate(`/porest/so/portfolio/detail/${portfolio.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="mb-1 font-semibold">{portfolio.title}</h4>
                        <p className="text-muted-foreground line-clamp-2 text-sm mb-2">
                          {portfolio.content} {/* content 컬럼 사용 */}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary" className="gap-1">
                            {seasonInfo.emoji} {seasonInfo.label}
                          </Badge>
                          <Badge variant="outline">{portfolio.depo}</Badge> {/* 담당 역할 사용 */}
                          {techArray.slice(0, 2).map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              <Code className="h-3 w-3 mr-1" />
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {portfolio.start_at} ~ {portfolio.end_at || '진행중'}
                          </span>
                        </div>
                      </div>
                      
                      {/* 버튼 그룹 */}
                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); handleEdit(portfolio.id); }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); deleteProject(portfolio.id); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">등록된 포트폴리오가 없습니다</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
