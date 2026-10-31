import React, { useState } from 'react';
import {
  ArrowRight,
  Moon,
  Sun,
  User
} from 'lucide-react';
import type { PipelineStepInfo, PipelineTrack, ServiceDomain, StepId } from '../mockData';
import { CreateProjectModal } from './CreateProjectModal';
import { AuthModal } from './AuthModal';

interface LandingViewProps {
  projectIdea: string;
  setProjectIdea: (val: string) => void;
  pipelineSteps: PipelineStepInfo[];
  currentTrack: PipelineTrack;
  enabledSteps: Record<StepId, boolean>;
  serviceDomain: ServiceDomain;
  onEnterWorkspace: (
    idea: string,
    nextTrack: PipelineTrack,
    nextEnabledSteps: Record<StepId, boolean>,
    nextDomain?: ServiceDomain
  ) => void;
  onLoginSuccess?: (email: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  projectIdea,
  setProjectIdea,
  pipelineSteps,
  currentTrack,
  enabledSteps,
  serviceDomain,
  onEnterWorkspace,
  onLoginSuccess,
  theme,
  onToggleTheme
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthComplete = (email: string) => {
    if (onLoginSuccess) {
      onLoginSuccess(email);
    } else {
      onEnterWorkspace(projectIdea || '새 엔지니어링 프로젝트', currentTrack, enabledSteps, serviceDomain);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col justify-between bg-paper text-ink overflow-hidden select-none">
      {/* 1. Header */}
      <header className="h-14 bg-surface border-b border-line shrink-0 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo-full.png" alt="Groom" className="h-8 w-auto object-contain" />
            <span className="text-[10px] font-semibold text-muted px-1.5 py-0.5 rounded bg-well border border-line">
              v1.5
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
              className="p-2 rounded-lg bg-well hover:bg-control text-ink-2 transition-colors cursor-pointer"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-muted" />
              ) : (
                <Sun className="w-4 h-4 text-warn" />
              )}
            </button>

            {/* Combined Single Login/Signup Button */}
            <button
              type="button"
              onClick={() => handleOpenAuth('login')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-ink hover:bg-well border border-line transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-muted" />
              <span>로그인 / 회원가입</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Clean & Ultra-Simple Single View) */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 max-w-3xl mx-auto w-full text-center">
        {/* Brand Symbol Icon */}
        <div className="mb-4">
          <img
            src="/logo-symbol.png"
            alt="Groom"
            className="w-14 h-14 object-contain mx-auto drop-shadow-xs"
          />
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink leading-[1.25] max-w-xl">
          아이디어에서 시작하는
          <br />
          완결형 소프트웨어 설계.
        </h1>

        {/* Concise Subtext */}
        <p className="mt-4 text-xs sm:text-sm text-ink-2 max-w-md leading-relaxed">
          서비스 기획서, 화면 동선, 데이터베이스 모델링, 인프라 토폴로지까지
          모든 개발 설계를 한곳에서 빠르게 완성하세요.
        </p>

        {/* Action Button Row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-ink hover:opacity-90 text-paper text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-opacity cursor-pointer shadow-xs shrink-0"
          >
            <span>새 프로젝트 시작하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleOpenAuth('login')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-well hover:bg-control text-ink text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-line shrink-0"
          >
            <User className="w-3.5 h-3.5 text-muted" />
            <span>로그인 / 회원가입</span>
          </button>
        </div>

        <p className="mt-4 text-[11px] text-muted">
          로그인 없이 게스트 세션으로 즉시 설계를 시작할 수 있습니다.
        </p>
      </main>

      {/* 3. Footer */}
      <footer className="h-11 border-t border-line px-4 sm:px-6 flex items-center justify-between text-[11px] text-muted shrink-0 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <img src="/logo-symbol.png" alt="Groom" className="w-3.5 h-3.5 object-contain opacity-80" />
          <span>© 2026 Groom Workspace</span>
        </div>
        <span>Dynamic Software Architecture Platform</span>
      </footer>

      {/* Step-by-Step Project Creation Wizard Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialIdea={projectIdea}
        initialDomain={serviceDomain}
        initialTrack={currentTrack}
        initialEnabledSteps={enabledSteps}
        pipelineSteps={pipelineSteps}
        onComplete={(config) => {
          setIsCreateModalOpen(false);
          setProjectIdea(config.idea);
          onEnterWorkspace(config.idea, config.track, config.enabledSteps, config.domain);
        }}
      />

      {/* Login & Signup Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onAuthSuccess={handleAuthComplete}
      />
    </div>
  );
};
