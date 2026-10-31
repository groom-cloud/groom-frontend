import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
  onAuthSuccess: (email: string, mode: 'login' | 'signup') => void;
}

type SocialProvider = 'kakao' | 'naver' | 'google' | 'github';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode,
  onAuthSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setEmail('');
      setPassword('');
      setName('');
      setShowPassword(false);
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmail = email.trim() || (mode === 'login' ? 'engineer@groom.dev' : 'member@groom.dev');
    onAuthSuccess(finalEmail, mode);
    onClose();
  };

  const handleSocialLogin = (provider: SocialProvider) => {
    const providerEmailMap: Record<SocialProvider, string> = {
      kakao: 'kakao_user@kakao.com',
      naver: 'naver_user@naver.com',
      google: 'user@gmail.com',
      github: 'github_developer@github.com'
    };
    onAuthSuccess(providerEmailMap[provider], mode);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border border-line rounded-3xl w-full max-w-[400px] overflow-hidden flex flex-col relative shadow-lg"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="모달 닫기"
          className="absolute top-4 right-4 p-2 rounded-full text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Container */}
        <div className="p-7 sm:p-8 flex flex-col">
          {/* Brand & Heading */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-well flex items-center justify-center mx-auto mb-3.5 border border-line shadow-xs">
              <img src="/logo-symbol.png" alt="Groom" className="w-7 h-7 object-contain" />
            </div>
            <h2 id="auth-modal-title" className="text-lg font-bold text-ink tracking-tight">
              {mode === 'login' ? 'Groom에 오신 것을 환영합니다' : '새로운 계정 만들기'}
            </h2>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              {mode === 'login'
                ? '아이디어에서 배포까지 이어지는 설계를 시작하세요'
                : '무료로 계정을 생성하고 모든 설계를 안전하게 보관하세요'}
            </p>
          </div>

          {/* Social Logins - 4 Rounded Icon Buttons */}
          <div className="mb-6">
            <span className="text-[11px] font-medium text-muted block text-center mb-3">
              간편 소셜 로그인
            </span>
            <div className="flex items-center justify-center gap-3.5">
              {/* Kakao */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('kakao')}
                  aria-label="카카오로 로그인"
                  className="w-11 h-11 rounded-2xl bg-brand-kakao text-brand-kakao-ink flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.864 1.868 5.38 4.7 6.742l-1.192 4.414c-.105.39.34.707.68.484l5.228-3.468c.19.019.385.028.584.028 5.523 0 10-3.582 10-8s-4.477-8-10-8z" />
                  </svg>
                </button>
                <span className="text-[10px] text-muted font-medium">카카오</span>
              </div>

              {/* Naver */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('naver')}
                  aria-label="네이버로 로그인"
                  className="w-11 h-11 rounded-2xl bg-brand-naver text-brand-naver-ink flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" />
                  </svg>
                </button>
                <span className="text-[10px] text-muted font-medium">네이버</span>
              </div>

              {/* Google */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  aria-label="Google 계정으로 로그인"
                  className="w-11 h-11 rounded-2xl bg-brand-google text-brand-google-ink border border-brand-google-border flex items-center justify-center hover:bg-neutral-50 transition-colors cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </button>
                <span className="text-[10px] text-muted font-medium">Google</span>
              </div>

              {/* GitHub */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  aria-label="GitHub으로 로그인"
                  className="w-11 h-11 rounded-2xl bg-brand-github text-brand-github-ink flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </button>
                <span className="text-[10px] text-muted font-medium">GitHub</span>
              </div>
            </div>
          </div>

          {/* Clean Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="bg-surface px-3 text-muted">또는 이메일로 계속하기</span>
            </div>
          </div>

          {/* Email & Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <div>
                <label htmlFor="auth-name-input" className="text-xs font-semibold text-ink block mb-1.5">
                  이름 / 닉네임
                </label>
                <input
                  id="auth-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 홍길동"
                  className="w-full bg-well/70 border border-line rounded-xl px-3.5 py-2.5 text-xs text-ink placeholder:text-muted focus:bg-surface focus:outline-none focus:border-ink transition-colors"
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-email-input" className="text-xs font-semibold text-ink block mb-1.5">
                이메일 주소
              </label>
              <input
                id="auth-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full bg-well/70 border border-line rounded-xl px-3.5 py-2.5 text-xs text-ink placeholder:text-muted focus:bg-surface focus:outline-none focus:border-ink transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="auth-password-input" className="text-xs font-semibold text-ink block">
                  비밀번호
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {}}
                    className="text-[11px] text-muted hover:text-ink transition-colors cursor-pointer"
                  >
                    비밀번호 재설정
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="auth-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-well/70 border border-line rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-ink placeholder:text-muted focus:bg-surface focus:outline-none focus:border-ink transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-ink text-paper text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{mode === 'login' ? '로그인하고 시작하기' : '무료 계정 생성 완료'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Mode Switch Footer */}
          <div className="mt-5 pt-4 border-t border-line text-center text-xs text-muted">
            {mode === 'login' ? (
              <p>
                아직 계정이 없으신가요?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-accent font-bold hover:underline cursor-pointer ml-1 inline-flex items-center"
                >
                  회원가입하기
                </button>
              </p>
            ) : (
              <p>
                이미 계정이 있으신가요?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-accent font-bold hover:underline cursor-pointer ml-1 inline-flex items-center"
                >
                  로그인하기
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};