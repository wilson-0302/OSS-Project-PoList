import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { fetchGitHubCommits } from "../../utils/github"; // ✅ 1. github 유틸리티 import
import { toast } from "sonner"; // ✅ 2. 알림 라이브러리 import (설치 필요: npm install sonner)
import { Loader2 } from "lucide-react"; // ✅ 3. 로딩 아이콘 import (설치 필요: npm install lucide-react)
import "./Add.css";

export default function PortfolioAdd() {
  const navigate = useNavigate();
  const location = useLocation();

  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);

  // 기본 필드
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

  // 멤버 리스트 (이름 / 역할)
  const [members, setMembers] = useState([{ name: "", role: "" }]);

  // ✅ 4. 커밋 데이터와 로딩 상태 추가
  const [commit_data, setCommit_data] = useState(null); // 커밋 데이터 저장 (jsonb)
  const [isLoadingCommits, setIsLoadingCommits] = useState(false); // 커밋 로딩 상태

  const isModal = !!location.state;

  const SEASON_OPTIONS = [
    { value: "🌱 봄 (개발 중)", label: "봄 (개발 중)" },
    { value: "🌿 여름 (배포 초기)", label: "여름 (배포 초기)" },
    { value: "🍂 가을 (유지보수 중)", label: "가을 (유지보수 중)" },
    { value: "❄️ 겨울 (배포 종료)", label: "겨울 (배포 종료)" },
  ];

  // 로그인 사용자 불러오기
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

  // ✅ 5. 커밋 가져오기 함수
  async function handleFetchCommits() {
    if (!github_url) {
      toast.error("GitHub 링크를 먼저 입력해주세요");
      return;
    }

    setIsLoadingCommits(true);
    setCommit_data(null); // 새로 가져오기 전에 이전 데이터 초기화

    try {
      const commits = await fetchGitHubCommits(github_url); // utils 함수 호출
      setCommit_data(commits); // 가져온 데이터를 상태에 저장
      toast.success(`${commits.length}일치의 커밋 데이터를 가져왔습니다!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "커밋 데이터를 가져오는데 실패했습니다");
      console.error(error);
    } finally {
      setIsLoadingCommits(false);
    }
  }

  // 프로젝트 생성 함수
  async function addProject() {
    if (!user) return alert("로그인 필요!");
    if (!title) return alert("제목을 입력하세요!");

    let imgUrl = null;

    // 이미지 업로드
    if (img) {
      const fileExt = img.name.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(fileName, img);

      if (uploadError) {
        console.error(uploadError);
        alert("이미지 업로드 실패");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(fileName);

      imgUrl = publicUrlData.publicUrl;
    }

    // projects 테이블에 추가
    const { data: newProject, error } = await supabase
      .from("projects")
      .insert([
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
          commit_data: commit_data,
        },
      ])
      .select()
      .single();

    if (error || !newProject) {
      console.error(error);
      alert("프로젝트 추가 실패");
      return;
    }

    // 멤버들만 추가 (Owner 자동 추가 제거)
    for (const m of members) {
      if (!m.name.trim()) continue;
      await supabase.from("project_members").insert([
        {
          project_id: newProject.id,
          name: m.name,
          role: m.role || "Member",
        },
      ]);
    }

    alert("프로젝트 및 멤버 추가 완료!");

    // 폼 초기화
    setTitle("");
    setGithub_url("");
    setStateText("진행중");
    setStart_at("2025-01-01");
    setEnd_at("2025-03-01");
    setTech_stack("React, Node.js");
    setContent("간단한 포트폴리오 프로젝트입니다.");
    setDepo("없음");
    setDepo_content("없음");
    setMembers([{ name: "", role: "" }]);
    setCommit_data(null);

    await fetchProjects();

    if (isModal) navigate(-1);
    else navigate("/porest/so/portfolio");
  }

  // 멤버 입력창 관리
  function addMemberField() {
    setMembers([...members, { name: "", role: "" }]);
  }

  function updateMember(index, field, value) {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  }

  function removeMemberField(index) {
    setMembers(members.filter((_, i) => i !== index));
  }

  return (
    <div className="add-container">
      <h1 className="add-title">새 포트폴리오 추가</h1>
      <p className="add-desc">아래 항목을 입력해주세요.</p>

      <div className="form-wrapper">
        <label>프로젝트 제목</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 개인 포트폴리오 웹" />
  
        <label>github 링크</label>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}> {/* ✅ 8. div로 감싸기 */}
          <input
            value={github_url}
            onChange={(e) => setGithub_url(e.target.value)}
            placeholder="예: https://github.com/..."
            style={{ flexGrow: 1 }} // ✅ input이 남는 공간 차지하도록
          />
          {/* ✅ 9. 커밋 가져오기 버튼 추가 */}
          <button
            type="button"
            onClick={handleFetchCommits}
            disabled={isLoadingCommits || !github_url}
            className="commit-fetch-btn" // CSS 스타일링 필요
            style={{ flexShrink: 0, padding: '8px 12px', whiteSpace: 'nowrap' }} // 줄바꿈 방지 등
          >
            {isLoadingCommits ? (
              <Loader2 className="animate-spin" size={16} style={{ marginRight: '4px' }} />
            ) : (
              '🌳 '
            )}
            커밋 가져오기
          </button>
        </div>
        {/* ✅ 10. 커밋 가져오기 성공 시 메시지 (선택 사항) */}
        {commit_data && (
          <p style={{ fontSize: '0.8rem', color: 'green', marginTop: '4px' }}>
            ✅ {commit_data.length}일치 커밋 데이터를 성공적으로 가져왔습니다.
          </p>
        )}
        <label>진행 상태</label>
        <select value={stateText} onChange={(e) => setStateText(e.target.value)}>
          {/* 기본값 (선택을 유도) */}
          <option value="" disabled>
            -- 진행 상태를 선택해 주세요 --
          </option>
          {/* 옵션 렌더링 */}
          {SEASON_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label>시작일</label>
        <input type="date" value={start_at} onChange={(e) => setStart_at(e.target.value)} />

        <label>종료일</label>
        <input type="date" value={end_at} onChange={(e) => setEnd_at(e.target.value)} />

        <label>기술 스택</label>
        <input value={tech_stack} onChange={(e) => setTech_stack(e.target.value)} placeholder="React, Node.js 등" />

        <label>대표 이미지</label>
        <input type="file" accept="image/*" onChange={(e) => setImg(e.target.files[0])} />
        {img && (
          <img
            src={URL.createObjectURL(img)}
            alt="미리보기"
            style={{ width: "150px", borderRadius: "8px", marginTop: "8px" }}
          />
        )}

        <label>프로젝트 내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="프로젝트에 대한 설명을 입력하세요."
        />

        <label>담당 역할</label>
        <input value={depo} onChange={(e) => setDepo(e.target.value)} placeholder="예: 프론트엔드 개발" />

        <label>역할 상세 내용</label>
        <textarea
          value={depo_content}
          onChange={(e) => setDepo_content(e.target.value)}
          placeholder="담당한 역할에 대해 자세히 적어주세요."
        />

        {/* 멤버 추가 섹션 */}
        <label>프로젝트 멤버 추가</label>
        {members.map((m, index) => (
          <div key={index} style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="이름"
              value={m.name}
              onChange={(e) => updateMember(index, "name", e.target.value)}
              style={{ marginBottom: "6px" }}
            />
            <input
              type="text"
              placeholder="역할 (예: 프론트엔드, 백엔드 등)"
              value={m.role}
              onChange={(e) => updateMember(index, "role", e.target.value)}
            />
            {members.length > 1 && (
              <button
                type="button"
                onClick={() => removeMemberField(index)}
                style={{
                  marginTop: "6px",
                  alignSelf: "flex-start",
                  background: "#f5f0f0",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  padding: "6px 8px",
                }}
              >
                ❌ 삭제
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addMemberField}
          style={{
            background: "#e7e8e0",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            padding: "8px 12px",
            marginBottom: "12px",
          }}
        >
          ➕ 멤버 추가
        </button>
        <br />

        <button className="add-btn" onClick={addProject}>
          프로젝트 추가
        </button>
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
