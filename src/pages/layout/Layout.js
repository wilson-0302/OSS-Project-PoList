import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";

import Sidebar from "./components/Sidebar";
import Modal from "../components/Modal";
import "./Layout.css";

const Home = lazy(() => import("../home/Home"));
const Dashboard = lazy(() => import("../dashboard/Dashboard"));
const PortfolioList = lazy(() => import("../Portfolio_temp/List"));
const PortfolioAdd = lazy(() => import("../Portfolio_temp/Add"));
const PortfolioDetail = lazy(() => import("../Portfolio_temp/Detail"));

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
        <Suspense fallback={<div>로딩중...</div>}>
          <Routes location={background || location}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="portfolio" element={<PortfolioList />} />
            <Route path="portfolio/detail" element={<PortfolioDetail />} />
            <Route path="portfolio/add" element={<PortfolioAdd />} />
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
