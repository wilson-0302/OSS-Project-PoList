import { useState, useEffect } from "react";
import { supabase } from "../../supabase";


export default function Dashboard() {

  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);

  // ✅ 로그인된 사용자 정보 가져오기
  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    }
    fetchUser();
  }, []);

  // ✅ Read: 내 프로젝트 목록 가져오기
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

  // 첫 렌더링 시 데이터 불러오기
  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  return (
    <div className="page">
      <h1>대시보드</h1>
      <p>프로젝트의 성장과 현황을 확인할 수 있습니다 📊</p>

      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <b>{p.title}</b> ({p.state})
            <b>{p.github_url}</b> ({p.state})
            {/* <button onClick={() => updateProject(p.id, p.title + " (수정됨)")}>
              ✏️ 수정
            </button>
            <button onClick={() => deleteProject(p.id)}>🗑️ 삭제</button> */}
          </li>
        ))}
      </ul>


    </div>
  );
}