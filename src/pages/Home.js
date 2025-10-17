import { useState } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Home as HomeIcon, BarChart3, Folder, TreePine, PanelsTopLeft, Menu } from "lucide-react";

import "./Home.css";
import Modal from "../components/Modal";

const Home = lazy(() => import("./HomeLayout"));
const Dashboard = lazy(() => import("./Dashboard"));
const PortfolioList = lazy(() => import("./Portfolio/List"));
const PortfolioAdd = lazy(() => import("./Portfolio/Add"));
const PortfolioDetail = lazy(() => import("./Portfolio/Datail"));

function Board() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  const location = useLocation();
  const state = location.state;
  const background = state && state.background;

  return (
    <div className="app-container">
      {/* === 사이드바 === */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        {sidebarOpen ? (
          <div className="sidebar-header">
            <div className="logo">
              <TreePine className="logo-icon" />
              <span className="logo-text">Porest</span>
            </div>
            <button className="toggle-btn" onClick={toggleSidebar}>
              <Menu />
            </button>
          </div>
        ) : (
          <button className="collapsed-trigger" onClick={toggleSidebar} title="사이드바 열기">
            <TreePine className="icon-base icon-tree" />
            <PanelsTopLeft className="icon-base icon-menu" />
          </button>
        )}

        <ul className="nav">
          <li>
            <NavLink to="/porest/so" end className="nav-link">
              <HomeIcon className="icon" />
              <span className="menu-text">홈</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/porest/so/dashboard" end className="nav-link">
              <BarChart3 className="icon" />
              <span className="menu-text">대시보드</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/porest/so/portfolio" end className="nav-link">
              <Folder className="icon" />
              <span className="menu-text">나의 Porest</span>
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* === 메인 === */}
      <main className="main-content">
        <Suspense fallback={<div>로딩중...</div>}>
          {/* ✅ 여기 핵심: “상대경로”로 변경 */}
          <Routes location={background || location}>
            <Route index element={<Home />} /> {/* 기본 /porest/so */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="portfolio" element={<PortfolioList />} />
            <Route path="portfolio/detail" element={<PortfolioDetail />} />
            <Route path="portfolio/add" element={<PortfolioAdd />} />
            <Route path="*" element={<div>페이지를 찾을 수 없습니다 (404)</div>} />
          </Routes>

          {/* 모달 라우트 */}
          {background && (
            <Routes>
              <Route
                path="portfolio/add"
                element={
                  <Modal onClose={() => window.history.back()}>
                    <PortfolioAdd />
                  </Modal>
                }
              />
              
            </Routes>

          )}
        </Suspense>
      </main>
    </div>
  );
}

export default Board;
