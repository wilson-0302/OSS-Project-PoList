import { useNavigate, useLocation } from "react-router-dom";

export default function PortfolioAdd() {
  const navigate = useNavigate();
  const location = useLocation();

  // state가 있으면 모달 모드, 없으면 전체화면 모드
  const isModal = !!location.state;

  return (
    <div>
      <h1>새 포트폴리오 추가</h1>
      <p>이 영역에 입력폼이나 내용을 넣을 수 있습니다.</p>

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
