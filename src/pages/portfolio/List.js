import { useNavigate, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../supabase";
import "./List.css";

export default function PortfolioList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    }
    fetchUser();
  }, []);

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setProjects(data);
  }, [user]);

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

  useEffect(() => {
    if (!user) return;
    fetchProjects();
    const channel = supabase
      .channel("projects-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => fetchProjects())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user, fetchProjects]);

  return (
    <div className="page">
      <h1>나의 Porest</h1>
      <p>당신의 포트폴리오 나무를 관리하세요 🌳</p>

      <div className="actions">
        <button onClick={() => navigate("add", { state: { background: location } })}>
          ➕ 새 포트폴리오 추가
        </button>
      </div>

      <div className="project-grid">
        {projects.map((p) => (
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
              {/* 카드 클릭 이벤트 방지 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`edit/${p.id}`); // 수정 페이지로 이동
                }}
              >
                ✏️ 수정
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProject(p.id); // 삭제 시 confirm 띄움
                }}
              >
                🗑️ 삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
