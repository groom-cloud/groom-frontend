import React, { useState } from 'react';
import {
  X,
  Sun,
  Moon,
  SlidersHorizontal,
  ShieldCheck,
  Clock,
  Users,
  RotateCcw,
  LayoutGrid,
  Check,
  Copy,
  Globe,
  Smartphone,
  Cpu,
  Gamepad2,
  FileText
} from 'lucide-react';
import {
  PIPELINE_PHASES,
  type PipelineTrack,
  type StepId,
  type ProjectMember,
  type PipelineStepInfo,
  type ServiceDomain
} from '../mockData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Project Info
  projectIdea: string;
  onUpdateProjectName: (nextName: string) => void;
  // Theme
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  // Workspace Layout
  isLeftCollapsed: boolean;
  toggleLeftPane: () => void;
  isChatCollapsed: boolean;
  toggleChatPane: () => void;
  isArtifactCollapsed: boolean;
  toggleArtifactPane: () => void;
  isLayoutCustomized: boolean;
  resetWorkspaceLayout: () => void;
  // Pipeline & Track
  pipelineTrack: PipelineTrack;
  setPipelineTrack: (track: PipelineTrack) => void;
  enabledSteps: Record<StepId, boolean>;
  pipelineSteps?: PipelineStepInfo[];
  serviceDomain?: ServiceDomain;
  setServiceDomain?: (domain: ServiceDomain) => void;
  onToggleStep?: (stepId: StepId) => void;
  // Account & Storage
  guestTimer: { hours: number; minutes: number; seconds: number };
  isAccountClaimed: boolean;
  claimedEmail: string;
  onOpenClaimModal: () => void;
  // Team
  members: ProjectMember[];
  onOpenInviteModal: () => void;
}

type SettingsTab = 'general' | 'pipeline' | 'appearance' | 'account' | 'team';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  projectIdea,
  onUpdateProjectName,
  theme,
  onToggleTheme,
  isLeftCollapsed,
  toggleLeftPane,
  isChatCollapsed,
  toggleChatPane,
  isArtifactCollapsed,
  toggleArtifactPane,
  isLayoutCustomized,
  resetWorkspaceLayout,
  pipelineTrack,
  setPipelineTrack,
  enabledSteps,
  pipelineSteps = [],
  serviceDomain = 'web',
  setServiceDomain,
  onToggleStep,
  guestTimer,
  isAccountClaimed,
  claimedEmail,
  onOpenClaimModal,
  members,
  onOpenInviteModal
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [draftProjectName, setDraftProjectName] = useState(projectIdea);
  const [nameSaveFeedback, setNameSaveFeedback] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setDraftProjectName(projectIdea);
      setNameSaveFeedback(false);
    }
  }, [isOpen, projectIdea]);

  const handleSaveProjectName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = draftProjectName.trim();
    if (!trimmed) return;
    onUpdateProjectName(trimmed);
    setNameSaveFeedback(true);
    setTimeout(() => setNameSaveFeedback(false), 2000);
  };

  if (!isOpen) return null;

  const enabledCount = Object.values(enabledSteps).filter(Boolean).length;

  const handleCopyInviteCode = () => {
    navigator.clipboard?.writeText('grm_invite_9a8b7c').catch(() => {});
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1600);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'general', label: '프로젝트 정보', icon: FileText },
    { id: 'pipeline', label: '파이프라인 트랙', icon: SlidersHorizontal },
    { id: 'appearance', label: '화면 및 테마', icon: LayoutGrid },
    { id: 'account', label: '계정 및 영구 저장', icon: ShieldCheck },
    { id: 'team', label: '팀원 및 협업', icon: Users }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-surface border border-line rounded-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-line flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-well flex items-center justify-center border border-line shrink-0">
              <img src="/logo-symbol.png" alt="Groom" className="w-5 h-5 object-contain" />
            </div>
            <div>
              <h2 id="settings-modal-title" className="text-sm font-semibold text-ink">
                워크스페이스 설정
              </h2>
              <p className="text-xs text-muted">
                화면 구성, 파이프라인 라이프사이클, 세션 보관 및 팀 권한을 관리합니다
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="설정 닫기"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Left Tab Navigation + Right Content Pane */}
        <div className="flex-1 flex flex-col sm:flex-row min-h-0 overflow-hidden">
          {/* Left Tabs */}
          <nav
            aria-label="설정 분류"
            className="w-full sm:w-48 bg-well/50 sm:border-r border-b sm:border-b-0 border-line p-2 sm:p-3 flex sm:flex-col gap-1 shrink-0 overflow-x-auto"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-surface text-ink font-semibold shadow-xs border border-line'
                      : 'text-muted hover:text-ink hover:bg-well'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-accent' : 'text-muted'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Content */}
          <div className="flex-1 p-5 overflow-y-auto space-y-6">
            {/* 0. GENERAL / PROJECT INFO */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-ink mb-1">프로젝트 기본 정보</h3>
                  <p className="text-xs text-muted mb-4">
                    워크스페이스 프로젝트명과 비즈니스 아이디어를 수정합니다.
                  </p>

                  <form onSubmit={handleSaveProjectName} className="space-y-3 p-4 rounded-xl border border-line bg-surface">
                    <div>
                      <label htmlFor="settings-project-name" className="text-xs font-medium text-ink block mb-1.5">
                        프로젝트명 / 서비스 아이디어
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="settings-project-name"
                          type="text"
                          value={draftProjectName}
                          onChange={(e) => setDraftProjectName(e.target.value)}
                          placeholder="예: 동네 빵집 마감 할인 서비스"
                          className="flex-1 bg-well border border-line rounded-lg px-3 py-2 text-xs font-semibold text-ink focus:outline-none focus:border-ink/40"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-lg bg-ink text-paper text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shrink-0 flex items-center gap-1.5"
                        >
                          {nameSaveFeedback && <Check className="w-3.5 h-3.5 text-ok" />}
                          <span>{nameSaveFeedback ? '저장됨' : '변경 저장'}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-muted mt-2">
                        수정된 프로젝트명은 상단 헤더, Step 1 BM / Step 2 PRD 기획서 문서, 파일 내보내기(Word/PDF/MD)에 즉시 연동됩니다.
                      </p>
                    </div>
                  </form>
                </div>

                <div className="pt-4 border-t border-line space-y-3">
                  <h3 className="text-xs font-semibold text-ink">워크스페이스 현황</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl border border-line bg-well/40">
                      <span className="text-[11px] text-muted block">서비스 도메인</span>
                      <div className="font-semibold text-ink mt-0.5">
                        {serviceDomain === 'web'
                          ? '웹 서비스 (풀스택)'
                          : serviceDomain === 'mobile'
                          ? '모바일 앱 서비스'
                          : serviceDomain === 'ai'
                          ? 'AI 에이전트 & 데이터'
                          : '게임 클라이언트 & 백엔드'}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-line bg-well/40">
                      <span className="text-[11px] text-muted block">파이프라인 활성 단계</span>
                      <div className="font-semibold text-ink mt-0.5">{enabledCount} / 8 단계 활성화</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 1. APPEARANCE & LAYOUT */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-ink mb-1">인터페이스 테마</h3>
                  <p className="text-xs text-muted mb-3">
                    작업 환경에 맞는 밝기 모드를 선택합니다
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (theme !== 'light') onToggleTheme();
                      }}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between ${
                        theme === 'light'
                          ? 'border-accent bg-accent-soft text-ink'
                          : 'border-line bg-surface text-muted hover:text-ink'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-well text-ink">
                          <Sun className="w-4 h-4 text-warn" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-ink">라이트 모드</div>
                          <div className="text-[11px] text-muted">선명하고 깔끔한 주간 모드</div>
                        </div>
                      </div>
                      {theme === 'light' && <Check className="w-4 h-4 text-accent shrink-0" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (theme !== 'dark') onToggleTheme();
                      }}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between ${
                        theme === 'dark'
                          ? 'border-accent bg-accent-soft text-ink'
                          : 'border-line bg-surface text-muted hover:text-ink'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-well text-ink">
                          <Moon className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-ink">다크 모드</div>
                          <div className="text-[11px] text-muted">눈의 피로를 줄이는 야간 모드</div>
                        </div>
                      </div>
                      {theme === 'dark' && <Check className="w-4 h-4 text-accent shrink-0" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-line">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-semibold text-ink">워크스페이스 영역 가시성</h3>
                    {isLayoutCustomized && (
                      <button
                        type="button"
                        onClick={resetWorkspaceLayout}
                        className="text-[11px] text-accent hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>기본 배치로 초기화</span>
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted mb-3">
                    작업 집중에 맞게 3개 영역(패널)을 개별적으로 접거나 펼칠 수 있습니다
                  </p>

                  <div className="space-y-2">
                    <div className="p-3 rounded-xl border border-line bg-surface flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-ink">좌측 파이프라인 네비게이션</div>
                        <div className="text-[11px] text-muted">01~08단계 라이프사이클 및 트랙 정보</div>
                      </div>
                      <button
                        type="button"
                        onClick={toggleLeftPane}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                          !isLeftCollapsed
                            ? 'bg-ink text-paper'
                            : 'bg-well text-muted hover:text-ink'
                        }`}
                      >
                        {!isLeftCollapsed ? '표시 중' : '접힘'}
                      </button>
                    </div>

                    <div className="p-3 rounded-xl border border-line bg-surface flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-ink">중앙 AI 어시스턴트 대화창</div>
                        <div className="text-[11px] text-muted">실시간 기획 조언, 프롬프트 입력 및 반영</div>
                      </div>
                      <button
                        type="button"
                        onClick={toggleChatPane}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                          !isChatCollapsed
                            ? 'bg-ink text-paper'
                            : 'bg-well text-muted hover:text-ink'
                        }`}
                      >
                        {!isChatCollapsed ? '표시 중' : '접힘'}
                      </button>
                    </div>

                    <div className="p-3 rounded-xl border border-line bg-surface flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-ink">우측 산출물 뷰어</div>
                        <div className="text-[11px] text-muted">기획서, ERD, 아키텍처 캔버스 및 칸반 보드</div>
                      </div>
                      <button
                        type="button"
                        onClick={toggleArtifactPane}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                          !isArtifactCollapsed
                            ? 'bg-ink text-paper'
                            : 'bg-well text-muted hover:text-ink'
                        }`}
                      >
                        {!isArtifactCollapsed ? '표시 중' : '접힘'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PIPELINE & TRACK */}
            {activeTab === 'pipeline' && (
              <div className="space-y-6">
                {/* 1. SERVICE DOMAIN SELECTION */}
                <div>
                  <h3 className="text-xs font-semibold text-ink mb-1">1. 서비스 도메인 선택</h3>
                  <p className="text-xs text-muted mb-3">
                    프로젝트 성격에 맞는 기술 스택과 아키텍처 기본형을 선택합니다
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      {
                        id: 'web' as ServiceDomain,
                        title: '웹 서비스 (풀스택)',
                        subtitle: 'React 18 · Spring Boot 3 · PostgreSQL · Redis',
                        badge: '추천 기본값',
                        icon: Globe
                      },
                      {
                        id: 'mobile' as ServiceDomain,
                        title: '모바일 앱 서비스',
                        subtitle: 'Flutter / React Native · Spring · Supabase',
                        badge: '앱 스택',
                        icon: Smartphone
                      },
                      {
                        id: 'ai' as ServiceDomain,
                        title: 'AI 에이전트 & 데이터',
                        subtitle: 'FastAPI · LangChain · Vector DB · Redis',
                        badge: 'AI 최적화',
                        icon: Cpu
                      },
                      {
                        id: 'game' as ServiceDomain,
                        title: '게임 클라이언트 & 백엔드',
                        subtitle: 'Unity / Unreal · Go Game Server · Redis',
                        badge: '게임 스택',
                        icon: Gamepad2
                      }
                    ].map((domain) => {
                      const Icon = domain.icon;
                      const isSelected = serviceDomain === domain.id;
                      return (
                        <div
                          key={domain.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setServiceDomain?.(domain.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') setServiceDomain?.(domain.id);
                          }}
                          className={`p-3 rounded-xl border transition-colors cursor-pointer text-left ${
                            isSelected
                              ? 'border-accent bg-accent-soft'
                              : 'border-line bg-surface hover:border-line-strong'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div
                                className={`p-1.5 rounded-lg ${
                                  isSelected ? 'bg-accent text-accent-ink' : 'bg-well text-muted'
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5 shrink-0" />
                              </div>
                              <span className="text-xs font-semibold text-ink">{domain.title}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
                          </div>
                          <div className="text-[11px] text-muted font-mono truncate mt-1">
                            {domain.subtitle}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. LIFECYCLE TRACK & STEP ACTIVATION MATRIX */}
                <div className="pt-4 border-t border-line">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-semibold text-ink">
                      2. 라이프사이클 트랙 & 단계별 활성화 구성
                    </h3>
                    <span className="text-accent font-medium text-xs">
                      {enabledCount} / 8 단계 활성
                    </span>
                  </div>
                  <p className="text-xs text-muted mb-3">
                    트랙 프리셋을 선택하거나 아래 단계를 직접 토글하여 프로젝트 파이프라인을 완성합니다
                  </p>

                  <div className="space-y-2 mb-3">
                    {[
                      {
                        id: 'fullstack' as PipelineTrack,
                        title: '풀스택 전문가 트랙 (16개 전체 활성 - 기본값)',
                        desc: '01 기획부터 16 트러블슈팅까지 5대 Phase 전체 산출물 활성화',
                        count: '16개 모듈 전체'
                      },
                      {
                        id: 'startup' as PipelineTrack,
                        title: '비개발자 / 창업가 트랙 (8개 활성)',
                        desc: '기획, BM, 예산, PRD, 브랜딩, 화면흐름, 칸반, QA 집중 (복잡한 DB/아키텍처/API 제외)',
                        count: '8개 모듈 활성'
                      },
                      {
                        id: 'backend' as PipelineTrack,
                        title: '백엔드 포트폴리오 트랙 (11개 활성)',
                        desc: 'PRD, 기술선정(ADR), ERD, 아키텍처, 컨벤션, API명세, WBS, QA, 배포, 트러블슈팅 엔지니어링 집중',
                        count: '11개 모듈 활성'
                      },
                      {
                        id: 'custom' as PipelineTrack,
                        title: '커스텀 트랙 (Custom Pipeline)',
                        desc: '아래 5대 Phase의 16개 독립 모듈을 사용자 요구에 맞게 직접 ON/OFF',
                        count: '자유 설정'
                      }
                    ].map((track) => {
                      const isSelected = pipelineTrack === track.id;
                      return (
                        <div
                          key={track.id}
                          onClick={() => setPipelineTrack(track.id)}
                          className={`p-3 rounded-xl border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'border-accent bg-accent-soft'
                              : 'border-line bg-surface hover:border-line-strong'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-semibold text-ink flex items-center gap-1.5">
                              <span>{track.title}</span>
                              {isSelected && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-accent text-accent-ink font-medium">
                                  적용 중
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-muted mt-0.5">{track.desc}</div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-accent bg-accent text-accent-ink'
                                : 'border-line bg-surface'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-surface" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 5-Phase / 16-Step Modular Switches */}
                  {pipelineSteps.length > 0 && (
                    <div className="space-y-3 mb-3">
                      {PIPELINE_PHASES.map((phase) => {
                        const phaseSteps = pipelineSteps.filter((s) => phase.stepIds.includes(s.id));
                        const activeCountInPhase = phaseSteps.filter((s) => enabledSteps[s.id]).length;
                        return (
                          <div
                            key={phase.id}
                            className="border border-line rounded-xl overflow-hidden bg-surface"
                          >
                            <div className="px-3.5 py-2 bg-well/60 border-b border-line flex items-center justify-between">
                              <div>
                                <span className="text-xs font-bold text-ink">{phase.title}</span>
                                <span className="text-[10px] text-muted ml-2">{phase.titleEn}</span>
                              </div>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-surface border border-line text-muted">
                                {activeCountInPhase}/{phaseSteps.length} ON
                              </span>
                            </div>
                            <div className="divide-y divide-line">
                              {phaseSteps.map((step) => {
                                const isOn = enabledSteps[step.id];
                                const stepNumStr = String(step.number).padStart(2, '0');
                                return (
                                  <div
                                    key={step.id}
                                    onClick={() => onToggleStep?.(step.id)}
                                    className={`px-3 py-2 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                                      isOn
                                        ? 'bg-surface hover:bg-well/50'
                                        : 'bg-well/50 opacity-60 hover:opacity-85'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <code className="font-mono text-muted text-xs shrink-0">
                                        {stepNumStr}
                                      </code>
                                      <span
                                        className={`text-xs font-medium truncate ${
                                          isOn ? 'text-ink' : 'line-through text-muted'
                                        }`}
                                      >
                                        {step.title.replace(/^Step \d+\.\s*/, '')}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <span
                                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                          isOn
                                            ? 'bg-ok-soft text-ok'
                                            : 'bg-well text-muted border border-line'
                                        }`}
                                      >
                                        {isOn ? 'ON' : 'SKIPPED'}
                                      </span>
                                      <div
                                        role="switch"
                                        aria-checked={isOn}
                                        className={`w-8 h-4 rounded-full p-0.5 flex items-center transition-colors ${
                                          isOn ? 'bg-accent justify-end' : 'bg-control justify-start'
                                        }`}
                                      >
                                        <span className="w-3 h-3 rounded-full bg-surface block" />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-1">
                    <span className="text-[11px] text-muted">
                      단계별 스위치 조작 시 커스텀 트랙으로 자동 연동됩니다
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ACCOUNT & STORAGE */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-ink mb-1">세션 및 저장 상태</h3>
                  <p className="text-xs text-muted mb-3">
                    프로젝트 데이터 보관 현황 및 계정 귀속 설정을 확인합니다
                  </p>

                  <div className="p-4 rounded-xl border border-line bg-surface space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-ink">현재 보관 상태</span>
                      {isAccountClaimed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-ok-soft text-ok">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>영구 보관 계정 귀속 완료</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-warn-soft text-warn">
                          <Clock className="w-3.5 h-3.5" />
                          <span>임시 게스트 세션</span>
                        </span>
                      )}
                    </div>

                    {!isAccountClaimed ? (
                      <div className="p-3 rounded-lg bg-well text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted">임시 세션 만료까지:</span>
                          <code className="font-mono text-ink font-semibold tabular-nums">
                            {String(guestTimer.hours).padStart(2, '0')}:
                            {String(guestTimer.minutes).padStart(2, '0')}:
                            {String(guestTimer.seconds).padStart(2, '0')}
                          </code>
                        </div>
                        <p className="text-[11px] text-muted leading-relaxed">
                          임시 세션은 브라우저 닫힘 또는 시간 만료 시 작업 내용이 유실될 수 있습니다. 이메일 계정을 연동하여 평생 영구 보관하세요.
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-well text-xs space-y-1">
                        <div className="text-muted">연동된 계정:</div>
                        <div className="font-semibold text-ink">{claimedEmail}</div>
                        <div className="text-[11px] text-ok mt-1">
                          모든 단계 산출물, ERD/아키텍처 토폴로지, WBS 칸반 보드가 클라우드에 실시간 동기화됩니다.
                        </div>
                      </div>
                    )}

                    {!isAccountClaimed && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenClaimModal();
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-ink hover:opacity-90 text-paper text-xs font-semibold flex items-center justify-center gap-1.5 transition-opacity cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-ok" />
                        <span>지금 계정 연동하고 영구 보관하기</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. TEAM & COLLABORATION */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-semibold text-ink">
                      프로젝트 참여 멤버 ({members.length}/3명)
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenInviteModal();
                      }}
                      className="text-xs text-accent hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Users className="w-3 h-3" />
                      <span>멤버 관리 & 초대 모달</span>
                    </button>
                  </div>
                  <p className="text-xs text-muted mb-3">
                    함께 파이프라인을 검토하고 산출물을 생성할 팀원들입니다
                  </p>

                  <div className="space-y-2">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="p-3 rounded-xl border border-line bg-surface flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-well text-ink font-semibold text-xs flex items-center justify-center border border-line">
                            {member.initials}
                          </div>
                          <div>
                            <div className="text-xs font-medium text-ink flex items-center gap-1.5">
                              <span>{member.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-well text-muted">
                                {member.role}
                              </span>
                            </div>
                            <div className="text-[11px] text-muted">{member.email}</div>
                          </div>
                        </div>
                        <span className="text-[11px] text-subtle">{member.joinedAt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-line bg-well/60 space-y-2">
                  <div className="text-xs font-medium text-ink">프로젝트 초대 링크 코드</div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs font-mono text-ink">
                      grm_invite_9a8b7c
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyInviteCode}
                      className="px-3 py-1.5 rounded-lg bg-surface hover:bg-well border border-line text-xs font-medium text-ink flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-ok" />
                          <span>복사 완료</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-muted" />
                          <span>초대코드 복사</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-line bg-well/40 flex items-center justify-between shrink-0 text-xs">
          <span className="text-muted">설정 변경사항은 실시간으로 저장됩니다</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-ink text-paper font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
