import { useNavigate, useLocation } from "react-router-dom";

export default function PortfolioList() {
    const navigate = useNavigate();
    const location = useLocation();
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
        </div>
    );
}