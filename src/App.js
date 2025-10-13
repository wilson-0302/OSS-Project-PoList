import React, { useState } from "react";
import { Home, BarChart3, Folder, TreePine, PanelsTopLeft, Menu } from "lucide-react";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [page, setPage] = useState("home");

  const toggleSidebar = () => setSidebarOpen((v) => !v);

  return (
    <div className="app-container">
      {/* 사이드바 */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        {/* 헤더 */}
        {sidebarOpen ? (
          <div className="sidebar-header">
            <div className="logo">
              <TreePine className="logo-icon" />
              <span className="logo-text">Porest</span>
            </div>
            <button className="toggle-btn" onClick={toggleSidebar} aria-label="사이드바 접기">
              <Menu />
            </button>
          </div>
        ) : (
          // 닫힘 상태: 나무 아이콘만 보이고 hover 시 사이드바 아이콘으로 전환
          <button
            className="collapsed-trigger"
            onClick={toggleSidebar}
            aria-label="사이드바 열기"
            title="사이드바 열기"
          >
            <TreePine className="icon-base icon-tree" />
            <PanelsTopLeft className="icon-base icon-menu" />
          </button>
        )}

        {/* 네비게이션 (닫힘 상태에선 숨김) */}
        <ul className="nav">
          <li onClick={() => setPage("home")}>
            <Home className="icon" />
            <span className="menu-text">홈</span>
          </li>
          <li onClick={() => setPage("dashboard")}>
            <BarChart3 className="icon" />
            <span className="menu-text">대시보드</span>
          </li>
          <li onClick={() => setPage("projects")}>
            <Folder className="icon" />
            <span className="menu-text">나의 Porest</span>
          </li>
        </ul>
      </aside>

      {/* 메인 */}
      <main className="main-content">
        {page === "home" && (
          <div className="page">
            <TreePine className="main-icon" />
            <h1>Porest에 오신 것을 환영합니다</h1>
            <p>Portfolio + Rest: 당신의 프로젝트를 나무로 키워보세요 🌿</p>
          </div>
        )}
        {page === "dashboard" && (
          <div className="page">
            <h1>대시보드</h1>
          </div>
        )}
        {page === "projects" && (
          <div className="page">
            <h2>나의 Porest</h2>
            <p>이곳에서 프로젝트 나무를 관리하세요 🌳</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
