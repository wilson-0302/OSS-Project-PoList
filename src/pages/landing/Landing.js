import { supabase } from "../../supabase";
import "./Landing.css";
import { TreePine } from "lucide-react";

export default function Main({ session }) {
  const handleLogin = async () => {
    if (session) {
      window.location.href = "/porest/so";
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/porest/so`,
      },
    });
  };

  return (
    <div className="main-container">
      {/* 상단 네비게이션 */}
      <header className="main-header">
        <div className="main-logo">
          <TreePine className="main-logo-icon" />
          Porest
        </div>
        <button className="main-login-btn" onClick={handleLogin}>
          로그인
        </button>
      </header>

      {/* 메인 내용 */}
      <main className="main-content">
        <h1 className="main-title">나의 포트폴리오를 한눈에 🌿</h1>
        <p className="main-subtitle">
          프로젝트, 팀, 성장 기록을 한 공간에서 관리하세요.
        </p>
      </main>
    </div>
  );
}
