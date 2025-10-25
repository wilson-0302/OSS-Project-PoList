import { useNavigate, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../supabase";
import "./List.css";

export default function PortfolioList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);

  // 정렬 기준 상태
  const [sortOption, setSortOption] = useState("latest");

  // 사용자 불러오기
  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    }
    fetchUser();
  }, []);

  // 정렬 조건별 쿼리 처리
  const fetchProjects = useCallback(async () => {
    if (!user) return;

    let query = supabase.from("projects").select("*").eq("user_id", user.id);

    switch (sortOption) {
      case "title":
        query = query.order("title", { ascending: true });
        break;
      case "start_at":
        query = query.order("start_at", { ascending: true });
        break;
      case "end_at":
        query = query.order("end_at", { ascending: true });
        break;
      case "latest":
      default:
        query = query.order("updated_at", { ascending: false });
        break;
    }

    const { data, error } = await query;

    if (error) console.error(error);
    else setProjects(data);
  }, [user, sortOption]);

  // 삭제 기능
  async function deleteProject(id) {
    if (!window.confirm("정말 이 프로젝트를 삭제하시겠습니까?")) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      alert("삭제 실패");
    } else {
      alert("삭제 완료되었습니다");
      fetchProjects();
    }
  }

  // Supabase 실시간 구독
  useEffect(() => {
    if (!user) return;
    fetchProjects();

    const channel = supabase
      .channel("projects-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () =>
        fetchProjects()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user, fetchProjects]);

  return (
    <div className="page">
      <h1>나의 Porest</h1>
      <p>당신의 포트폴리오 나무를 관리하세요 🌳</p>

      {/* 정렬 옵션 UI */}
      <div className="actions">
        <button onClick={() => navigate("add", { state: { background: location } })}>
          ➕ 새 포트폴리오 추가
        </button>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{
            marginLeft: "10px",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: "#fafaf7",
            color: "#4b6043",
          }}
        >
          <option value="latest">최신순</option>
          <option value="title">이름순</option>
          <option value="start_at">시작일순</option>
          <option value="end_at">종료일순</option>
        </select>
      </div>

      {/* 프로젝트 리스트 */}
      <div className="project-grid">
        {projects.length === 0 ? (
          <p style={{ marginTop: "20px", color: "#777" }}>등록된 프로젝트가 없습니다.</p>
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              className="project-card"
              onClick={() => navigate(`detail/${p.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="project-thumb">
                {p.img ? (
                  <img src={p.img} alt={p.title} />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "240px",
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                    }}
                  ></div>
                )}
              </div>

              <div className="project-info">
                <h3>{p.title}</h3>
                <div className="project-meta">
                  <span className={`state ${p.state === "완료" ? "done" : "progress"}`}>
                    {p.state}
                  </span>
                  <span className="tech">{p.tech_stack}</span>
                </div>
              </div>

              <div className="project-buttons">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`edit/${p.id}`);
                  }}
                >
                  ✏️ 수정
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProject(p.id);
                  }}
                >
                  🗑️ 삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
