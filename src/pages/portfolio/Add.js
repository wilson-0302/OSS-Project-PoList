import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import "./Add.css";

export default function PortfolioAdd() {
  const navigate = useNavigate();
  const location = useLocation();

  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState("");
  const [github_url, setGithub_url] = useState("");
  const [stateText, setStateText] = useState("진행중");
  const [start_at, setStart_at] = useState("2025-01-01");
  const [end_at, setEnd_at] = useState("2025-03-01");
  const [tech_stack, setTech_stack] = useState("React, Node.js");
  const [img, setImg] = useState(null);
  const [content, setContent] = useState("간단한 포트폴리오 프로젝트입니다.");
  const [depo, setDepo] = useState("없음");
  const [depo_content, setDepo_content] = useState("없음");

  const isModal = !!location.state;

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

  async function addProject() {
    if (!user) return alert("로그인 필요!");
    if (!title) return alert("제목을 입력하세요!");

    let imgUrl = null;


    // 이미지 업로드 (Supabase Storage)
    if (img) {
      const fileExt = img.name.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;

      // 파일 업로드
      const { error: uploadError } = await supabase.storage
        .from("project-images") // 버킷 이름 (미리 생성해야 함)
        .upload(fileName, img);

      if (uploadError) {
        console.error(uploadError);
        alert("이미지 업로드 실패");
        return;
      }

      // Public URL 가져오기
      const { data: publicUrlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(fileName);

      imgUrl = publicUrlData.publicUrl; // URL 저장
    }

    const { error } = await supabase.from("projects").insert([
      {
        title,
        user_id: user.id,
        state: stateText,
        start_at,
        end_at,
        tech_stack,
        content,
        depo,
        depo_content,
        github_url,
        img: imgUrl,
      },
    ]);

    if (error) {
      console.error(error);
      const { data: userData } = await supabase.auth.getUser();
      console.log("현재 로그인 사용자:", userData);
      alert("프로젝트 추가 실패");
    } else {
      setTitle("");
      setGithub_url("");
      setStateText("진행중");
      setStart_at("2025-01-01");
      setEnd_at("2025-03-01");
      setTech_stack("React, Node.js");
      setContent("간단한 포트폴리오 프로젝트입니다.");
      setDepo("없음");
      setDepo_content("없음");

      await fetchProjects();

      if (isModal) navigate(-1);
      else navigate("/porest/so/portfolio");
    }
  }

  return (
    <div className="add-container">
      <h1 className="add-title">새 포트폴리오 추가</h1>
      <p className="add-desc">아래 항목을 입력해주세요.</p>

      <div className="form-wrapper">
        <label className="add-label">프로젝트 제목</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 개인 포트폴리오 웹" />

        <label>깃허브 링크</label>
        <input value={github_url} onChange={(e) => setGithub_url(e.target.value)} placeholder="예: https://github.com/..." />

        <label>진행 상태</label>
        <input value={stateText} onChange={(e) => setStateText(e.target.value)} placeholder="진행중 / 완료 등" />

        <label>시작일</label>
        <input type="date" value={start_at} onChange={(e) => setStart_at(e.target.value)} />

        <label>종료일</label>
        <input type="date" value={end_at} onChange={(e) => setEnd_at(e.target.value)} />

        <label>기술 스택</label>
        <input value={tech_stack} onChange={(e) => setTech_stack(e.target.value)} placeholder="React, Node.js 등" />

        <label>대표 이미지</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImg(e.target.files[0])}
        />
        {img && (
          <img
            src={URL.createObjectURL(img)}
            alt="미리보기"
            style={{ width: "150px", borderRadius: "8px", marginTop: "8px" }}
          />
        )}

        <label>프로젝트 내용</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="프로젝트에 대한 설명을 입력하세요." />

        <label>담당 역할</label>
        <input value={depo} onChange={(e) => setDepo(e.target.value)} placeholder="예: 프론트엔드 개발" />

        <label>역할 상세 내용</label>
        <textarea
          value={depo_content}
          onChange={(e) => setDepo_content(e.target.value)}
          placeholder="담당한 역할에 대해 자세히 적어주세요."
        />

        <button className="add-btn" onClick={addProject}>프로젝트 추가</button>
      </div>

      {isModal ? (
        <div className="modal-footer">
          <button className="close-btn" onClick={() => navigate(-1)}>❌ 닫기</button>
          <button
            className="full-btn"
            onClick={() => navigate("/porest/so/portfolio/add", { replace: true })}
          >
            🔲 전체화면으로 보기
          </button>
        </div>
      ) : (
        <button className="back-btn" onClick={() => navigate(-1)}>⬅ 돌아가기</button>
      )}
    </div>
  );
}
