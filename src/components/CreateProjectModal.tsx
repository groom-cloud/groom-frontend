import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Globe,
  Smartphone,
  Cpu,
  Gamepad2
} from 'lucide-react';
import {
  PIPELINE_PHASES,
  TRACK_PRESET_STEPS,
  type PipelineStepInfo,
  type PipelineTrack,
  type ServiceDomain,
  type StepId
} from '../mockData';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIdea: string;
  initialDomain: ServiceDomain;
  initialTrack: PipelineTrack;
  initialEnabledSteps: Record<StepId, boolean>;
  pipelineSteps: PipelineStepInfo[];
  onComplete: (config: {
    idea: string;
    track: PipelineTrack;
    enabledSteps: Record<StepId, boolean>;
    domain: ServiceDomain;
  }) => void;
}

type WizardStep = 1 | 2 | 3;

const DOMAIN_OPTIONS: Array<{
  id: ServiceDomain;
  title: string;
  subtitle: string;
  techStack: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: 'web',
    title: '웹 서비스 (풀스택)',
    subtitle: '반응형 웹 어플리케이션 및 SaaS 플랫폼',
    techStack: 'React 18 · TypeScript · Spring Boot 3 · PostgreSQL · Redis',
    badge: '추천 기본값',
    icon: Globe
  },
  {
    id: 'mobile',
    title: '모바일 앱 서비스',
    subtitle: 'iOS / Android 크로스플랫폼 모바일 서비스',
    techStack: 'Flutter / React Native · Spring Boot · Supabase / Firebase',
    badge: '앱 스택',
    icon: Smartphone
  },
  {
    id: 'ai',
    title: 'AI 에이전트 & 데이터',
    subtitle: 'LLM 기반 지능형 에이전트 및 데이터 파이프라인',
    techStack: 'FastAPI · Python · LangChain · Vector DB · Redis',
    badge: 'AI 최적화',
    icon: Cpu
  },
  {
    id: 'game',
    title: '게임 클라이언트 & 백엔드',
    subtitle: '실시간 멀티플레이어 및 인터랙티브 인터페이스',
    techStack: 'Unity / Unreal · Go Game Server · Redis · WebSocket',
    badge: '게임 스택',
    icon: Gamepad2
  }
];

const SAMPLE_IDEA_PRESETS: string[] = [
  '동네 빵집 마감 할인 서비스',
  '사내 AI 회의록 요약 및 액션아이템 트래커',
  '프리랜서 개발자 에스크로 계약 및 정산 플랫폼',
  '반려견 산책 메이트 매칭 및 안전 케어'
];

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  initialIdea,
  initialDomain,
  initialTrack,
  initialEnabledSteps,
  pipelineSteps,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [selectedDomain, setSelectedDomain] = useState<ServiceDomain>(initialDomain);
  const [selectedTrack, setSelectedTrack] = useState<PipelineTrack>(initialTrack);
  const [draftSteps, setDraftSteps] = useState<Record<StepId, boolean>>(initialEnabledSteps);
  const [draftIdea, setDraftIdea] = useState<string>(initialIdea);

  // Synchronize state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedDomain(initialDomain || 'web');
      setSelectedTrack(initialTrack || 'fullstack');
      setDraftSteps({ ...initialEnabledSteps });
      setDraftIdea(initialIdea || '');
    }
  }, [isOpen, initialDomain, initialTrack, initialEnabledSteps, initialIdea]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const enabledCount = Object.values(draftSteps).filter(Boolean).length;

  const handleTrackChange = (track: PipelineTrack) => {
    setSelectedTrack(track);
    if (track === 'startup') {
      setDraftSteps({ ...TRACK_PRESET_STEPS.startup });
    } else if (track === 'backend') {
      setDraftSteps({ ...TRACK_PRESET_STEPS.backend });
    } else if (track === 'fullstack') {
      setDraftSteps({ ...TRACK_PRESET_STEPS.fullstack });
    }
  };

  const handleToggleStep = (stepId: StepId) => {
    const nextVal = !draftSteps[stepId];
    if (!nextVal && enabledCount <= 1) {
      return; // 최소 1개는 활성화 유지
    }
    setDraftSteps((prev) => ({
      ...prev,
      [stepId]: nextVal
    }));
    setSelectedTrack('custom');
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  const handleFinish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalIdea = draftIdea.trim() || SAMPLE_IDEA_PRESETS[0];
    onComplete({
      idea: finalIdea,
      track: selectedTrack,
      enabledSteps: draftSteps,
      domain: selectedDomain
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-project-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border border-line rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-line flex items-center justify-between shrink-0 bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-well flex items-center justify-center border border-line shrink-0">
              <img src="/logo-symbol.png" alt="Groom" className="w-5 h-5 object-contain" />
            </div>
            <div>
              <h2 id="create-project-title" className="text-sm font-bold text-ink">
                새 프로젝트 설계 생성
              </h2>
              <p className="text-xs text-muted mt-0.5">
                도메인과 파이프라인 단계를 정의한 뒤 바로 설계를 시작합니다
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Step Progress Indicator */}
        <div className="px-6 py-3 bg-well/60 border-b border-line shrink-0">
          <div className="flex items-center justify-between max-w-md mx-auto text-xs">
            {/* Step 1 Indicator */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2 cursor-pointer font-medium transition-colors ${
                currentStep === 1
                  ? 'text-ink font-bold'
                  : currentStep > 1
                  ? 'text-accent'
                  : 'text-muted'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  currentStep === 1
                    ? 'bg-ink text-paper'
                    : currentStep > 1
                    ? 'bg-accent text-accent-ink'
                    : 'bg-control text-muted'
                }`}
              >
                {currentStep > 1 ? <Check className="w-3 h-3" /> : '1'}
              </span>
              <span>도메인 선택</span>
            </button>

            <span className="h-px w-8 bg-line" />

            {/* Step 2 Indicator */}
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`flex items-center gap-2 cursor-pointer font-medium transition-colors ${
                currentStep === 2
                  ? 'text-ink font-bold'
                  : currentStep > 2
                  ? 'text-accent'
                  : 'text-muted'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  currentStep === 2
                    ? 'bg-ink text-paper'
                    : currentStep > 2
                    ? 'bg-accent text-accent-ink'
                    : 'bg-control text-muted'
                }`}
              >
                {currentStep > 2 ? <Check className="w-3 h-3" /> : '2'}
              </span>
              <span>라이프사이클 구성</span>
            </button>

            <span className="h-px w-8 bg-line" />

            {/* Step 3 Indicator */}
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className={`flex items-center gap-2 cursor-pointer font-medium transition-colors ${
                currentStep === 3 ? 'text-ink font-bold' : 'text-muted'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  currentStep === 3 ? 'bg-ink text-paper' : 'bg-control text-muted'
                }`}
              >
                3
              </span>
              <span>프로젝트명 입력</span>
            </button>
          </div>
        </div>

        {/* Step Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* ============================================================== */}
          {/* STEP 1: SERVICE DOMAIN SELECTION */}
          {/* ============================================================== */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-accent block">STEP 1</span>
                <h3 className="text-base font-bold text-ink mt-0.5">
                  어떤 유형의 서비스를 만드시나요?
                </h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  선택하신 도메인에 따라 기획 템플릿, ERD 스키마 규격, 인프라 토폴로지 구성이 최적화됩니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {DOMAIN_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedDomain === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedDomain(opt.id)}
                      className={`p-4 rounded-xl border text-left transition-colors cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-accent bg-accent-soft shadow-xs'
                          : 'border-line bg-surface hover:border-line-strong hover:bg-well/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-2 rounded-lg ${
                                isSelected ? 'bg-accent text-accent-ink' : 'bg-well text-ink'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-ink">{opt.title}</span>
                          </div>
                          {isSelected ? (
                            <span className="w-5 h-5 rounded-full bg-accent text-accent-ink flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted px-2 py-0.5 rounded bg-well">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-ink-2 leading-relaxed mb-2.5">
                          {opt.subtitle}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-line/60">
                        <span className="text-[10px] text-muted block mb-0.5">기본 권장 기술 스택</span>
                        <span className="text-[11px] font-mono text-ink font-medium leading-snug">
                          {opt.techStack}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 2: LIFECYCLE TRACK & STEP MATRIX */}
          {/* ============================================================== */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-accent block">STEP 2</span>
                  <h3 className="text-base font-bold text-ink mt-0.5">
                    라이프사이클 트랙 & 단계 활성화 구성
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    프로젝트 규모에 맞는 트랙을 선택하거나 필요한 단계를 자유롭게 토글하세요.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-well text-xs font-semibold text-ink">
                    <span className="text-accent">{enabledCount}</span> / 8 단계 활성
                  </span>
                </div>
              </div>

              {/* Track Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  {
                    id: 'fullstack' as PipelineTrack,
                    title: '풀스택 전문가',
                    badge: '15개 전체 · 추천',
                    desc: '기획부터 배포·트러블슈팅까지 15개 완결형 모듈'
                  },
                  {
                    id: 'startup' as PipelineTrack,
                    title: '창업가 / 비개발자',
                    badge: '8개 집중',
                    desc: '기획, BM, 예산, PRD, 브랜딩, 화면흐름, 칸반, QA'
                  },
                  {
                    id: 'backend' as PipelineTrack,
                    title: '백엔드 포트폴리오',
                    badge: '11개 엔지니어링',
                    desc: 'PRD, ADR, ERD, 아키텍처, 컨벤션, API, WBS, Ops'
                  },
                  {
                    id: 'custom' as PipelineTrack,
                    title: '커스텀 트랙',
                    badge: '자유 구성',
                    desc: '요구에 맞춰 15개 모듈을 직접 토글 조합'
                  }
                ].map((track) => {
                  const isSelected = selectedTrack === track.id;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => handleTrackChange(track.id)}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-accent bg-accent-soft'
                          : 'border-line bg-surface hover:border-line-strong'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-ink">{track.title}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
                      </div>
                      <span className="inline-block text-[10px] text-muted mb-1 font-medium">
                        {track.badge}
                      </span>
                      <p className="text-[11px] text-muted leading-tight">{track.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* 5-Phase / 15-Step Matrix Grid */}
              <div className="pt-2 space-y-3">
                <span className="text-xs font-bold text-ink block">
                  5대 Phase / 15개 모듈 활성화 여부 선택
                </span>
                <div className="space-y-2.5">
                  {PIPELINE_PHASES.map((phase) => {
                    const phaseSteps = pipelineSteps.filter((s) => phase.stepIds.includes(s.id));
                    return (
                      <div key={phase.id} className="border border-line rounded-xl overflow-hidden bg-surface">
                        <div className="px-3 py-1.5 bg-well/50 border-b border-line flex items-center justify-between">
                          <span className="text-xs font-bold text-ink">{phase.title}</span>
                          <span className="text-[10px] font-mono text-muted">{phase.titleEn}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-line p-1">
                          {phaseSteps.map((step) => {
                            const isChecked = !!draftSteps[step.id];
                            return (
                              <div
                                key={step.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => handleToggleStep(step.id)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') handleToggleStep(step.id);
                                }}
                                className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer flex items-center justify-between m-1 ${
                                  isChecked
                                    ? 'border-line-strong bg-surface text-ink'
                                    : 'border-line bg-well/30 text-muted opacity-60'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="font-mono text-[11px] font-bold text-accent shrink-0">
                                    {String(step.number).padStart(2, '0')}
                                  </span>
                                  <div className="min-w-0">
                                    <span className="text-xs font-semibold block truncate">
                                      {step.title.replace(/^(\d+[\.\s\-]+|Step \d+[\.\s\-]*)/, '')}
                                    </span>
                                  </div>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleStep(step.id)}
                                  aria-label={`${step.title} 활성화`}
                                  className="w-4 h-4 rounded text-accent cursor-pointer shrink-0"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 3: PROJECT NAME & IDEA INPUT */}
          {/* ============================================================== */}
          {currentStep === 3 && (
            <form onSubmit={handleFinish} className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-accent block">STEP 3</span>
                <h3 className="text-base font-bold text-ink mt-0.5">
                  프로젝트의 이름이나 아이디어를 입력하세요
                </h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  작성된 이름은 8단계 문서와 아티팩트의 서비스 타이틀로 자동 반영됩니다.
                </p>
              </div>

              <div>
                <label
                  htmlFor="create-project-idea-input"
                  className="text-xs font-semibold text-ink block mb-1.5"
                >
                  프로젝트명 / 한 줄 아이디어
                </label>
                <input
                  id="create-project-idea-input"
                  type="text"
                  value={draftIdea}
                  onChange={(e) => setDraftIdea(e.target.value)}
                  placeholder="예: 동네 빵집 마감 할인 서비스"
                  autoFocus
                  className="w-full bg-well border border-line-strong rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent transition-colors font-medium"
                />
              </div>

              {/* Recommended Presets */}
              <div className="pt-1">
                <span className="text-xs font-semibold text-ink block mb-2">
                  빠른 선택 아이디어 예시
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_IDEA_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDraftIdea(preset)}
                      className="px-3 py-1.5 rounded-lg bg-well hover:bg-control text-xs text-ink-2 hover:text-ink border border-line transition-colors cursor-pointer text-left"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-xl border border-line bg-well/50 space-y-2 mt-4">
                <span className="text-xs font-bold text-ink block">설정 요약</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-muted block">선택 도메인</span>
                    <span className="font-semibold text-ink">
                      {DOMAIN_OPTIONS.find((d) => d.id === selectedDomain)?.title}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted block">파이프라인 트랙</span>
                    <span className="font-semibold text-ink">
                      {selectedTrack === 'fullstack'
                        ? '풀스택 전문가 (15개 전체)'
                        : selectedTrack === 'startup'
                        ? '창업가 / 비개발자 (8개)'
                        : selectedTrack === 'backend'
                        ? '백엔드 포트폴리오 (11개)'
                        : '커스텀 트랙'}
                      {' · '}
                      <span className="text-accent">{enabledCount}개 모듈 활성</span>
                    </span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-6 py-4 bg-surface border-t border-line flex items-center justify-between shrink-0">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 rounded-xl bg-well hover:bg-control text-ink text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>이전 단계</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-well hover:bg-control text-muted hover:text-ink text-xs font-medium transition-colors cursor-pointer"
              >
                취소
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-ink text-paper text-xs font-bold hover:opacity-90 flex items-center gap-1.5 transition-opacity cursor-pointer"
              >
                <span>다음 단계</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleFinish()}
                className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-strong text-accent-ink text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>워크스페이스 설계 시작</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
