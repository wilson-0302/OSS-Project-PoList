import { Link, useLocation  } from "react-router-dom";

export default function PortfolioList() {
    const location = useLocation();
    return (
        <div className="page">
            <h1>나의 Porest</h1>
            <p>당신의 포트폴리오 나무를 관리하세요 🌳</p>

            <div style={{ marginTop: "20px" }}>
                {/* <Link to="/portfolio/add" style={{ marginRight: "12px" }}>
                    ➕ 새 포트폴리오 추가
                </Link> */}
                {/* ✅ 현재 페이지를 background로 전달 */}
                <Link
                    to="/portfolio/add"
                    state={{ background: location }}
                    style={{ marginRight: "12px" }}
                >
                    ➕ 새 포트폴리오 추가
                </Link>
                <Link to="/portfolio/detail">
                    🔍 포트폴리오 상세보기
                </Link>
            </div>
        </div>
    );
}