import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import "./Detail.css";

export default function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  // 프로젝트 데이터 불러오기
  useEffect(() => {
    async function fetchProject() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else setProject(data);
    }
    fetchProject();
  }, [id]);

  if (!project) return <div className="detail-page">로딩 중...</div>;

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>⬅ 돌아가기</button>

      <h1 className="detail-title">{project.title}</h1>
      <p className="detail-period">
        {project.start_at} ~ {project.end_at} | {project.state}
      </p>

      {project.img && (
        <img src={project.img} alt={project.title} className="detail-image" />
      )}

      <div className="detail-content">
        <h3>프로젝트 내용</h3>
        <p>{project.content}</p>

        <h3>기술 스택</h3>
        <p>{project.tech_stack}</p>

        <h3>담당 역할</h3>
        <p>{project.depo}</p>

        <h3>상세 역할 내용</h3>
        <p>{project.depo_content}</p>

        {project.github_url && (
          <p>
            🔗 <a href={project.github_url} target="_blank" rel="noreferrer">
              깃허브 링크
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
