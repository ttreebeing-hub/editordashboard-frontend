import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../shared/config/supabase';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    // Supabase tự parse token từ URL hash khi detectSessionInUrl: true
    // Lắng nghe event SIGNED_IN sau khi parse xong
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/pool', { replace: true });
      } else if (event === 'SIGNED_OUT') {
        navigate('/login', { replace: true });
      }
    });

    // Fallback: nếu session đã có sẵn (đã parse trước đó)
    supabase.auth.getSession().then(({ data: { session }, error: err }) => {
      if (err) {
        setError(err.message);
        return;
      }
      if (session) {
        navigate('/pool', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-[#f4f4f5] font-bold text-lg mb-2">Xác thực thất bại</h2>
          <p className="text-[#a1a1aa] text-sm mb-6">{error}</p>
          <a
            href="/login"
            className="inline-block bg-[#0ea5e9] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0284c7] transition-colors"
          >
            Quay lại đăng nhập
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#0ea5e9] flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">EO</span>
        </div>
        <div className="flex items-center gap-2 text-[#a1a1aa] text-sm">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Đang xác thực...
        </div>
      </div>
    </div>
  );
}
