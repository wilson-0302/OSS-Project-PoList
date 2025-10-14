import React, { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { lazy, Suspense } from "react";

import { Home as HomeIcon, BarChart3, Folder, TreePine, PanelsTopLeft, Menu } from "lucide-react";
import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PortfolioList = lazy(() => import("./pages/PortfolioList"));
const PortfolioAdd = lazy(() => import("./pages/PortfolioAdd"));
const PortfolioDetail = lazy(() => import("./pages/PortfolioDetail"));

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [page, setPage] = useState("home");

  const toggleSidebar = () => setSidebarOpen((v) => !v);

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* === 사이드바 === */}
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
            <li>
              <NavLink to="/" end className="nav-link">
                <HomeIcon className="icon" />
                <span className="menu-text">홈</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard" end className="nav-link">
                <BarChart3 className="icon" />
                <span className="menu-text">대시보드</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/portfolio" end className="nav-link">
                <Folder className="icon" />
                <span className="menu-text">나의 Porest</span>
              </NavLink>
            </li>

          </ul>
        </aside>

        {/* === 메인 === */}
        <main className="main-content">
          <Suspense fallback={<div>로딩중...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/portfolio" element={<PortfolioList />} />
              <Route path="/portfolio/add" element={<PortfolioAdd />} />
              <Route path="/portfolio/detail" element={<PortfolioDetail />} />
              <Route
                path="*"
                element={<div>페이지를 찾을 수 없습니다 (404)</div>}
              />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;