import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase";

import Landing from "./pages/Main";
import Board from "./pages/Home";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        {/* 누구나 접근 가능 (로그인 전/후 모두 가능) */}
        <Route path="/porest/ko" element={<Landing session={session} />} />

        {/* 로그인 필요 페이지 */}
        <Route
          path="/porest/so"
          element={session ? <Board /> : <Navigate to="/porest/ko" />}
        />

        {/* 로그인 후 Board와 하위 페이지들 */}
        <Route path="/porest/so/*" element={session ? <Board /> : <Navigate to="/porest/ko" />} />

        {/* 루트 접근 시 자동 분기 */}
        <Route
          path="/"
          element={<Navigate to={session ? "/porest/so" : "/porest/ko"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
