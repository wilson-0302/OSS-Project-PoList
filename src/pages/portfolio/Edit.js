import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabase";
import { fetchGitHubCommits } from "../../utils/github";
import { toast } from "sonner"; // npm install sonner 필요
import { Loader2 } from "lucide-react"; // npm install lucide-react 필요
import "./Edit.css";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [newImg, setNewImg] = useState(null);
  const [members, setMembers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    start_at: "",
    end_at: "",
    state: "",
    tech_stack: "",
    content: "",
    depo: "",
    depo_content: "",
    github_url: "",
    img: "",
  });

  const [commit_data, setCommit_data] = useState(null); 
  const [isLoadingCommits, setIsLoadingCommits] = useState(false);

  const SEASON_OPTIONS = [
    { value: "봄 (개발 중)", label: "🌱 봄 (개발 중)" },
    { value: "여름 (배포 초기)", label: "🌿 여름 (배포 초기)" },
    { value: "가을 (유지보수 중)", label: "🍂 가을 (유지보수 중)" },
    { value: "겨울 (배포 종료)", label: "❄️ 겨울 (배포 종료)" },
  ];

  // 프로젝트 + 멤버 불러오기
  useEffect(() => {
    async function fetchProject() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else {
        setProject(data);
        setForm({
          title: data.title || "",
          start_at: data.start_at || "",
          end_at: data.end_at || "",
          state: data.state || "",
          tech_stack: data.tech_stack || "",
          content: data.content || "",
          depo: data.depo || "",
          depo_content: data.depo_content || "",
          github_url: data.github_url || "",
          img: data.img || "",
        });
        setCommit_data(data.commit_data || null);
      }
    }

    async function fetchMembers() {
      const { data, error } = await supabase
        .from("project_members")
        .select("id, name, role")
        .eq("project_id", id);

      if (error) console.error(error);
      else setMembers(data || []);
    }

    fetchProject();
    fetchMembers();
  }, [id]);

  // ✅ 커밋 가져오기 함수
  async function handleFetchCommits() {
    const githubUrl = form.github_url;
    if (!githubUrl) {
      toast.error("GitHub 링크를 먼저 입력해주세요");
      return;
    }

    setIsLoadingCommits(true);
    try {
      const commits = await fetchGitHubCommits(githubUrl);
      setCommit_data(commits); // ✅ 가져온 데이터를 상태에 저장
      toast.success(`${commits.length}일의 커밋 데이터를 가져왔습니다`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "커밋 데이터를 가져오는데 실패했습니다");
    } finally {
      setIsLoadingCommits(false);
    }
  }

  // 이미지 및 프로젝트 저장
  async function handleSave() {
    let imgUrl = form.img;

    if (newImg) {
      const fileExt = newImg.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(fileName, newImg);

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

    const { error } = await supabase
      .from("projects")
      .update({
        ...form,
        img: imgUrl,
        updated_at: new Date().toISOString(),
        commit_data: commit_data,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("프로젝트 수정 실패");
      return;
    }

    // 멤버 수정 저장 (삭제 후 재등록)
    await supabase.from("project_members").delete().eq("project_id", id);

    for (const m of members) {
      if (!m.name.trim()) continue;
      await supabase.from("project_members").insert([
        {
          project_id: id,
          name: m.name,
          role: m.role || "Member",
        },
      ]);
    }

    alert("수정 완료!");
    navigate("/porest/so/portfolio");
  }

  // 멤버 입력 관리
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

  if (!project) return <div className="detail-page">로딩 중...</div>;

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ 돌아가기
      </button>

      <h1 className="detail-title">프로젝트 수정</h1>

      <div className="edit-form">
        <label>프로젝트 제목</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="예: 개인 포트폴리오 웹"
        />

        <label>깃허브 링크</label>
        <div className="github-link-group"> {/* ✅ 클래스 이름으로 감싸서 CSS 적용 */}
          <input
            value={form.github_url}
            onChange={(e) => setForm({ ...form, github_url: e.target.value })}
            placeholder="예: https://github.com/..."
            style={{ flexGrow: 1 }}
          />
          <button
            type="button"
            onClick={handleFetchCommits}
            disabled={isLoadingCommits || !form.github_url}
            className="commit-fetch-btn"
          >
            {isLoadingCommits ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              '🌳'
            )}
            커밋 가져오기
          </button>
        </div>

        {commit_data && (
            <p className="commit-success-msg">
                ✅ 현재 {commit_data.length}일치 커밋 데이터가 저장 대기 중입니다.
            </p>
        )}

        <label>진행 상태</label>
        <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
          {/* 기존 데이터가 로드되면 해당 값이 기본으로 선택됩니다. */}
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
        <input
          type="date"
          value={form.start_at}
          onChange={(e) => setForm({ ...form, start_at: e.target.value })}
        />

        <label>종료일</label>
        <input
          type="date"
          value={form.end_at}
          onChange={(e) => setForm({ ...form, end_at: e.target.value })}
        />

        <label>기술 스택</label>
        <input
          value={form.tech_stack}
          onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
          placeholder="React, Node.js 등"
        />

        {/* 이미지 업로드 */}
        <div className="image-upload-section">
          <label>대표 이미지</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImg(e.target.files[0])}
          />
          {(newImg || form.img) && (
            <img
              src={newImg ? URL.createObjectURL(newImg) : form.img}
              alt="미리보기"
              className="file-preview"
            />
          )}
        </div>

        <label>프로젝트 내용</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="프로젝트에 대한 설명을 입력하세요."
        />

        <label>담당 역할</label>
        <input
          value={form.depo}
          onChange={(e) => setForm({ ...form, depo: e.target.value })}
          placeholder="예: 프론트엔드 개발"
        />

        <label>역할 상세 내용</label>
        <textarea
          value={form.depo_content}
          onChange={(e) =>
            setForm({ ...form, depo_content: e.target.value })
          }
          placeholder="담당한 역할에 대해 자세히 적어주세요."
        />

        {/* 멤버 수정 섹션 */}
        <label>프로젝트 멤버 수정</label>
        {members.map((m, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "10px",
            }}
          >
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
      </div>

      <div className="edit-btn-group">
        <button className="save-btn" onClick={handleSave}>
          💾 저장하기
        </button>
        <button className="cancel-btn" onClick={() => navigate(-1)}>
          ❌ 취소
        </button>
      </div>
    </div>
  );
}
