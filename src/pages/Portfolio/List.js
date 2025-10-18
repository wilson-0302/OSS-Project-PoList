import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase";



export default function PortfolioList() {
    const navigate = useNavigate();
    const location = useLocation();

    const [projects, setProjects] = useState([]);
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState("");

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
//   useEffect(() => {
//     if (user) fetchProjects();
//   }, [user]);
useEffect(() => {
  if (!user) return;

  fetchProjects(); // 최초 로드

  // ✅ 실시간 변경 감지
  const channel = supabase
    .channel('projects-list')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'projects' },
      payload => {
        console.log("리스트 감지됨:", payload);
        fetchProjects(); // 변경 시 다시 불러오기
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user]);



    return (
        <div className="page">
            <h1>나의 Porest</h1>
            <p>당신의 포트폴리오 나무를 관리하세요 🌳</p>

            {/* ✅ location을 state로 함께 전달 */}
            <button
                onClick={() =>
                    navigate("add", { state: { background: location } })
                }
            >
                ➕ 새 포트폴리오 추가
            </button>

            {/* ✅ 상세 페이지도 동일하게 */}
            <button
                onClick={() => navigate("detail")} // ✅ state 제거
                style={{ marginLeft: "10px" }}
            >
                🔍 포트폴리오 상세보기
            </button>


            <ul>
                {projects.map((p) => (
                    <li key={p.id}>
                        <b>{p.title}</b> ({p.state})
                        <button onClick={() => updateProject(p.id, p.title + " (수정됨)")}>
                            ✏️ 수정
                        </button>
                        <button onClick={() => deleteProject(p.id)}>🗑️ 삭제</button>
                    </li>
                ))}
            </ul>



        </div>
    );
}