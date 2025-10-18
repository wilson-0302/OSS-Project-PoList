import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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

  async function fetchProjects() {
    if (!user) return;
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setProjects(data);
  }

  async function updateProject(id, newTitle) {
    const { error } = await supabase
      .from("projects")
      .update({ title: newTitle, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) console.error(error);
    else fetchProjects();
  }

  async function deleteProject(id) {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) console.error(error);
    else fetchProjects();
  }

  useEffect(() => {
    if (!user) return;
    fetchProjects();
    const channel = supabase
      .channel("projects-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => fetchProjects())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user]);

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
            onClick={() => navigate(`detail/${p.id}`)} // 상세페이지로 이동
            style={{ cursor: "pointer" }}
          >
            <div className="project-thumb">
              {/* 이미지가 있으면 표시, 없으면 흰색 박스 */}
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
              <button onClick={() => updateProject(p.id, p.title + " (수정됨)")}>✏️ 수정</button>
              <button onClick={() => deleteProject(p.id)}>🗑️ 삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
