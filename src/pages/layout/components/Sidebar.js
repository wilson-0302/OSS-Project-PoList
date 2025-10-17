import { NavLink } from "react-router-dom";
import { TreePine, PanelsTopLeft, Home as HomeIcon, BarChart3, Folder, Menu } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar({ sidebarOpen, toggleSidebar }) {
  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      {/* 열림 상태 */}
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
        /* 닫힘 상태 (아이콘만) */
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
  );
}
