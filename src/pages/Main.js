// import { supabase } from "../supabase";

// export default function Landing({ session }) {
//   const handleLogin = async () => {
//     if (session) {
//       // 이미 로그인 상태라면 바로 /porest/so 이동
//       window.location.href = "/porest/so";
//       return;
//     }

//     // 로그인 안 된 상태라면 구글 로그인 창 열기
//     await supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: {
//         redirectTo: `${window.location.origin}/porest/so`,
//       },
//     });
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "10vh" }}>
//       {/* 상단 네비게이션 */}
//       <header
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           padding: "20px 40px",
//         }}
//       >
//         <h2>🌳 Porest</h2>
//         <button
//           onClick={handleLogin}
//           style={{
//             background: "#4285F4",
//             color: "white",
//             border: "none",
//             borderRadius: "8px",
//             padding: "8px 16px",
//             cursor: "pointer",
//           }}
//         >
//           Google 로그인
//         </button>
//       </header>

//       {/* 메인 내용 */}
//       <main style={{ marginTop: "15vh" }}>
//         <h1>나의 포트폴리오를 한눈에 🌿</h1>
//         <p>프로젝트와 팀을 한 곳에서 관리하세요.</p>
//       </main>
//     </div>
//   );
// }



import { supabase } from "../supabase";
import "./Main.css";
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
