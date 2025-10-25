import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { FileText, Plus, TrendingUp } from "lucide-react";
import { useEffect, useState, useMemo } from "react"; 
import { supabase } from "../../supabase"; 
import "./Home.css"; // CSS 파일 import 유지

export default function Home({ }) {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const today = useMemo(() => new Date(), []);
  const currentMonthStart = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth(), 1);
    return d.toISOString();
  }, [today]);
  
  useEffect(() => {
    async function fetchUserData() {
      setIsLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setIsLoading(false);
        return;
      }
      setUser(userData.user);

      // 프로젝트 데이터 가져오기
      const { data: projectData, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userData.user.id);

      if (error) {
        console.error("프로젝트 로딩 에러:", error);
      } else {
        setProjects(projectData || []);
      }
      setIsLoading(false);
    }
    fetchUserData();
  }, []);

  // 로딩 중 처리 (화면 렌더링 시작)
  if (isLoading) {
    return (
      <div className="page flex items-center justify-center h-screen">
        <p className="text-xl text-muted-foreground">데이터 로딩 중...</p>
      </div>
    );
  }

  // 통계 계산
  const totalProjects = projects.length;
  const newProjectsThisMonth = projects.filter(p => p.created_at >= currentMonthStart).length;

  return (
    // .page 클래스는 Home.css의 중앙 정렬 스타일을 적용하기 위해 유지
    <div className="page p-8"> 
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <div className="text-6xl mb-4">🌲</div>
          <h1>Porest에 오신 것을 환영합니다</h1>
          <p className="text-muted-foreground mt-2">
            Portfolio + Rest: 당신의 프로젝트를 나무로 키워 나만의 숲을 만들어보세요
          </p>
        </div>

        {/* === 통계 카드 섹션 === */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* 1. 나의 숲 통계 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">나의 숲</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}그루</div>
              <p className="text-xs text-muted-foreground mt-1">
                자라고 있는 나무
              </p>
            </CardContent>
          </Card>

          {/* 2. 이번 달 통계 (임시 데이터) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{today.getMonth() + 1}월</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{newProjectsThisMonth}</div> 
              <p className="text-xs text-muted-foreground mt-1">
                새로 심은 프로젝트
              </p>
            </CardContent>
          </Card>

          {/* 3. 빠른 작업 버튼 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">빠른 작업</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full mt-2" 
                // onNavigate('portfolios') 대신, router 기반으로 직접 이동하도록 수정
                onClick={() => window.location.href = "/porest/so/portfolio"}
              >
                새 나무 심기 🌱
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* === 시작 가이드 섹션 === */}
        <Card>
          <CardHeader className="text-left">
            <CardTitle>Porest 시작하기</CardTitle>
            <CardDescription>
              나만의 프로젝트 숲을 키우는 방법
            </CardDescription>
          </CardHeader>
          <CardContent className="text-left space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                🌱
              </div>
              <div>
                <h4 className="font-semibold">새로운 나무 심기</h4>
                <p className="text-muted-foreground text-sm">
                  '나의 Porest'에서 새 프로젝트를 추가하고 GitHub 링크로 커밋 데이터를 가져오세요
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                🍃
              </div>
              <div>
                <h4 className="font-semibold">나무 성장 관찰</h4>
                <p className="text-muted-foreground text-sm">
                  커밋할수록 나뭇잎이 늘어나고, 오래된 프로젝트는 단풍처럼 색이 변합니다
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                🌲
              </div>
              <div>
                <h4 className="font-semibold">숲 보기로 전체 감상</h4>
                <p className="text-muted-foreground text-sm">
                  모든 프로젝트를 나무로 표현한 숲 뷰에서 한눈에 확인하세요
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}