import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase";

import Landing from "./pages/landing/Landing";
import Board from "./pages/layout/Layout";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isKakaoInApp = userAgent.includes('kakaotalk');

    if (isKakaoInApp) {
      const currentUrl = window.location.href;
      const isAndroid = /android/i.test(userAgent);
      const isIOS = /iphone|ipad|ipod/i.test(userAgent);

      // 사용자에게 먼저 알림 (선택 사항)
      // alert("카카오톡 인앱 브라우저에서는 기능이 제한될 수 있습니다. 외부 브라우저로 이동합니다.");

      if (isAndroid) {
        // 안드로이드: Chrome으로 열기 시도
        const intentUrl = `intent:${currentUrl}#Intent;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.android.chrome;end;`;
        window.location.href = intentUrl;
      } else if (isIOS) {
        // iOS: Safari로 열기 시도 (직접적인 방법은 없으므로 URL 스킴을 활용)
        // 1. 현재 URL을 googlechrome:// 또는 safari:// 스킴으로 변환 시도
        //    (주의: 이 방법은 항상 성공하지 않으며, 사용자 경험이 좋지 않을 수 있음)
        // const safariUrl = currentUrl.replace(/^https?:\/\//, 'safari://'); 
        // window.location.href = safariUrl; 
        
        // 2. 더 현실적인 방법: 사용자에게 직접 안내 후 현재 URL로 리다이렉션
        alert("원활한 이용을 위해 Safari에서 열어주세요.");
        // 또는 특정 UI를 보여주고 Safari 열기 버튼 제공
        window.location.href = currentUrl; // 인앱 브라우저를 벗어나지 못할 수 있음
      }
    }
  }, []); // 앱 로드
  
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
        {/* porest로 접근 -> porest/ko */}
        <Route path="/porest" element={<Navigate to="/porest/ko" replace />} />
        
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
