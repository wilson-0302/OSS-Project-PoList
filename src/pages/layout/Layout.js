import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";

import Sidebar from "./components/Sidebar";
import Modal from "../components/Modal";
import "./Layout.css";

const Home = lazy(() => import("../home/Home"));
const Dashboard = lazy(() => import("../dashboard/Dashboard"));
const PortfolioList = lazy(() => import("../portfolio/List"));
const PortfolioAdd = lazy(() => import("../portfolio/Add"));
const PortfolioDetail = lazy(() => import("../portfolio/Detail"));
const EditPage = lazy(() => import("../portfolio/Edit"));
const TreeSandbox = lazy(() => import("../portfolio/TreeSandbox"));

function Board() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  const location = useLocation();
  const state = location.state;
  const background = state && state.background;

  return (
    <div className="app-container">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="main-content">
        <header className="main-header"> {/* CSS 스타일링 필요 */}
          {/* 햄버거 메뉴 버튼 (항상 보임, 특히 모바일에서 중요) */}
          <button
            className="mobile-menu-button" /* CSS 스타일링 필요 */
            onClick={toggleSidebar}
            aria-label="Toggle sidebar" /* 접근성 */
          >
            <Menu size={24} /> {/* Menu 아이콘 사용 */}
          </button>
          {/* (선택) 여기에 현재 페이지 제목 등을 추가할 수 있습니다 */}
        </header>
        <Suspense fallback={<div>로딩중...</div>}>
          <Routes location={background || location}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="portfolio" element={<PortfolioList />} />
            <Route path="portfolio/detail/:id" element={<PortfolioDetail />} />
            <Route path="portfolio/add" element={<PortfolioAdd />} />
            <Route path="portfolio/edit/:id" element={<EditPage />} />
            <Route path="sandbox" element={<TreeSandbox />} />
          </Routes>

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
