import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

export default function PortfolioAdd() {
  const navigate = useNavigate();
  const location = useLocation();

  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [github_url, setGithub_url] = useState("");

  // state가 있으면 모달 모드, 없으면 전체화면 모드
  const isModal = !!location.state;

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

  // ✅ Create: 새 프로젝트 추가
  async function addProject() {
    if (!user) return alert("로그인 필요!");
    if (!title) return alert("제목을 입력하세요!");

    const { error } = await supabase.from("projects").insert([
      {
        title,
        user_id: user.id, // 👈 로그인 사용자 연결
        state: "진행중",
        start_at: "2025-01-01",
        end_at: "2025-03-01",
        tech_stack: "React, Node.js",
        content: "간단한 포트폴리오 프로젝트입니다.",
        depo: "없음",
        depo_content: "없음",
        // github_url: "https://github.com/example",
        github_url,
      },
    ]);

    if (error) console.error(error);
    else {
      setTitle("");
      setGithub_url("");
      fetchProjects();
    }
  }

  // ✅ Update: 프로젝트 제목 수정
  async function updateProject(id, newTitle) {
    const { error } = await supabase
      .from("projects")
      .update({ title: newTitle, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id); // 본인 것만 수정

    if (error) console.error(error);
    else fetchProjects();
  }

  // ✅ Delete: 프로젝트 삭제
  async function deleteProject(id) {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) console.error(error);
    else fetchProjects();
  }

  // 첫 렌더링 시 데이터 불러오기
  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);


  return (
    <div>
      <h1>새 포트폴리오 추가</h1>
      <p>이 영역에 입력폼이나 내용을 넣을 수 있습니다.</p>

      {/* Create */}
      <div style={{ marginBottom: "12px" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="새 프로젝트 제목"
        />
        <input
          value={github_url}
          onChange={(e) => setGithub_url(e.target.value)}
          placeholder="깃허브 링크"
        />
        <button onClick={addProject}>추가</button>
      </div>

      {/* Read */}
      {/* <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <b>{p.title}</b> ({p.state})
            <button onClick={() => updateProject(p.id, p.title + " (수정됨)")}>
              ✏️ 수정
            </button>
            <button onClick={() => deleteProject(p.id)}>🗑️ 삭제</button>
          </li>
        ))}
      </ul> */}

      {isModal ? (
        <div style={{ marginTop: "16px" }}>
          <button onClick={() => navigate(-1)}>❌ 닫기</button>
          <button
            style={{ marginLeft: "8px" }}
            onClick={() => navigate("/porest/so/portfolio/add", { replace: true })}
          >
            🔲 전체화면으로 보기
          </button>
        </div>
      ) : (
        <button onClick={() => navigate(-1)}>⬅ 돌아가기</button>
      )}
    </div>
  );
}


// export default function MyProjects() {



//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>📁 내 프로젝트 목록</h2>

//       {/* Create */}
//       <div style={{ marginBottom: "12px" }}>
//         <input
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="새 프로젝트 제목"
//         />
//         <button onClick={addProject}>추가</button>
//       </div>

//       {/* Read */}
//       <ul>
//         {projects.map((p) => (
//           <li key={p.id}>
//             <b>{p.title}</b> ({p.state})
//             <button onClick={() => updateProject(p.id, p.title + " (수정됨)")}>
//               ✏️ 수정
//             </button>
//             <button onClick={() => deleteProject(p.id)}>🗑️ 삭제</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
