import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Clock,
  ShieldCheck,
  Bell,
  Check,
  Lock,
  Send,
  ChevronDown,
  ChevronRight,
  CornerDownLeft,
  ArrowUpRight,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightOpen,
  MessageSquare,
  FileText,
  Settings
} from 'lucide-react';
import {
  ALL_STEP_IDS,
  PIPELINE_PHASES,
  TRACK_PRESET_STEPS,
  INITIAL_PIPELINE_STEPS,
  INITIAL_PRD_REQUIREMENTS,
  INITIAL_UX_NODES,
  INITIAL_UX_EDGES,
  INITIAL_UX_ZONES,
  INITIAL_ERD_TABLES,
  INITIAL_ERD_RELATIONS,
  INITIAL_ERD_ZONES,
  INITIAL_ARCH_NODES,
  INITIAL_ARCH_EDGES,
  INITIAL_ARCH_ZONES,
  INITIAL_KANBAN_TASKS,
  INITIAL_API_ENDPOINTS,
  INITIAL_BUDGET_ITEMS,
  INITIAL_IDEA_BACKLOG,
  INITIAL_BRANDING_INFO,
  INITIAL_ADR_DECISIONS,
  INITIAL_DEV_CONVENTIONS,
  INITIAL_QA_TEST_CASES,
  INITIAL_LOAD_TEST_METRICS,
  INITIAL_RELEASE_HISTORY,
  INITIAL_TROUBLESHOOTING_ARCHIVE,
  INITIAL_CHAT_MESSAGES,
  INITIAL_PROJECT_MEMBERS,
  type StepId,
  type PhaseId,
  type PipelineTrack,
  type ViewMode,
  type ChatMessage,
  type BacklogIdeaItem,
  type ServiceDomain,
  type KanbanTask
} from './mockData';
import { LandingView } from './components/LandingView';
import { DocumentArtifactView } from './components/DocumentArtifactView';
import { TopologyCanvasView } from './components/TopologyCanvasView';
import { KanbanBoardView } from './components/KanbanBoardView';
import { BudgetEstimatorView } from './components/BudgetEstimatorView';
import { IdeaBacklogView } from './components/IdeaBacklogView';
import { BrandingDesignView } from './components/BrandingDesignView';
import { AdrDecisionView } from './components/AdrDecisionView';
import { ConventionDocView } from './components/ConventionDocView';
import { ApiSpecificationView } from './components/ApiSpecificationView';
import { QaTestingView } from './components/QaTestingView';
import { ReleaseHistoryView } from './components/ReleaseHistoryView';
import { TroubleshootingArchiveView } from './components/TroubleshootingArchiveView';
import { WorkspaceModals } from './components/WorkspaceModals';
import { SettingsModal } from './components/SettingsModal';

const LEFT_DEFAULT_WIDTH = 260;
const LEFT_MIN_WIDTH = 236;
const LEFT_MAX_WIDTH = 360;
const LEFT_RAIL_WIDTH = 48;

const CHAT_DEFAULT_WIDTH = 352;
const CHAT_MIN_WIDTH = 312;
const CHAT_MAX_WIDTH = 560;
const CHAT_RAIL_WIDTH = 44;

const ARTIFACT_MIN_WIDTH = 460;
const ARTIFACT_RAIL_WIDTH = 44;
const SPLITTER_WIDTH = 6;

function clampSafePaneWidths(
  containerWidth: number,
  rawLeft: number,
  rawChat: number,
  leftCollapsed: boolean,
  chatCollapsed: boolean,
  artifactCollapsed: boolean
): { left: number; chat: number } {
  let left = Math.max(LEFT_MIN_WIDTH, Math.min(LEFT_MAX_WIDTH, rawLeft));
  let chat = Math.max(CHAT_MIN_WIDTH, Math.min(CHAT_MAX_WIDTH, rawChat));

  if (containerWidth < 1024) {
    return { left, chat };
  }

  if (!chatCollapsed && !artifactCollapsed) {
    if (!leftCollapsed) {
      const fixedChrome = SPLITTER_WIDTH * 2 + ARTIFACT_MIN_WIDTH;
      const budget = Math.max(LEFT_MIN_WIDTH + CHAT_MIN_WIDTH, containerWidth - fixedChrome);
      if (left + chat > budget) {
        chat = Math.max(CHAT_MIN_WIDTH, budget - left);
        if (left + chat > budget) {
          left = Math.max(LEFT_MIN_WIDTH, budget - chat);
        }
      }
    } else {
      const fixedChrome = LEFT_RAIL_WIDTH + SPLITTER_WIDTH + ARTIFACT_MIN_WIDTH;
      const maxChat = Math.max(CHAT_MIN_WIDTH, containerWidth - fixedChrome);
      chat = Math.min(chat, maxChat);
    }
  } else if (chatCollapsed && !artifactCollapsed && !leftCollapsed) {
    const fixedChrome = SPLITTER_WIDTH + CHAT_RAIL_WIDTH + ARTIFACT_MIN_WIDTH;
    const maxLeft = Math.max(LEFT_MIN_WIDTH, containerWidth - fixedChrome);
    left = Math.min(left, maxLeft);
  } else if (!chatCollapsed && artifactCollapsed && !leftCollapsed) {
    const fixedChrome = SPLITTER_WIDTH + CHAT_MIN_WIDTH + ARTIFACT_RAIL_WIDTH;
    const maxLeft = Math.max(LEFT_MIN_WIDTH, containerWidth - fixedChrome);
    left = Math.min(left, maxLeft);
  }

  return { left: Math.round(left), chat: Math.round(chat) };
}

export default function App() {
  // Theme State (Light vs Dark)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Core Navigation & Dynamic Track State (Default: Fullstack Expert 16/16)
  const [viewMode, setViewMode] = useState<ViewMode>('workspace');
  const [currentStep, setCurrentStep] = useState<StepId>('step1');
  const [pipelineTrack, setPipelineTrack] = useState<PipelineTrack>('fullstack');
  const [enabledSteps, setEnabledSteps] = useState<Record<StepId, boolean>>({
    ...TRACK_PRESET_STEPS.fullstack
  });
  const [projectIdea, setProjectIdea] = useState('동네 빵집 마감 할인 서비스');
  const [serviceDomain, setServiceDomain] = useState<ServiceDomain>('web');

  // Responsive Mobile/Tablet Pane Switcher (< 1024px)
  const [mobilePane, setMobilePane] = useState<'steps' | 'chat' | 'artifact'>('artifact');

  // Desktop 3-Pane Collapsible & Safe-Clamped Resizable Layout States (>= 1024px)
  const workspaceBodyRef = useRef<HTMLDivElement | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [leftWidth, setLeftWidth] = useState<number>(LEFT_DEFAULT_WIDTH);
  const [chatWidth, setChatWidth] = useState<number>(CHAT_DEFAULT_WIDTH);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState<boolean>(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState<boolean>(false);
  const [isArtifactCollapsed, setIsArtifactCollapsed] = useState<boolean>(false);
  const [activeSplitter, setActiveSplitter] = useState<'left' | 'chat' | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  // Modals & Dropdowns State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isBellDropdownOpen, setIsBellDropdownOpen] = useState(false);
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);
  const [appToast, setAppToast] = useState<string | null>(null);

  // Guest Account & Timer State
  const [isAccountClaimed, setIsAccountClaimed] = useState(false);
  const [claimedEmail, setClaimedEmail] = useState('');
  const [unreadCount, setUnreadCount] = useState(2);
  const [guestTimer, setGuestTimer] = useState({ hours: 23, minutes: 45, seconds: 12 });

  // Domain Data States across all 16 Independent Modules
  const [pipelineSteps, setPipelineSteps] = useState(INITIAL_PIPELINE_STEPS);
  const [requirements, setRequirements] = useState(INITIAL_PRD_REQUIREMENTS);
  const [budgetItems, setBudgetItems] = useState(INITIAL_BUDGET_ITEMS);
  const [ideaBacklog, setIdeaBacklog] = useState(INITIAL_IDEA_BACKLOG);
  const [branding, setBranding] = useState(INITIAL_BRANDING_INFO);
  const [adrDecisions, setAdrDecisions] = useState(INITIAL_ADR_DECISIONS);
  const [devConventions, setDevConventions] = useState(INITIAL_DEV_CONVENTIONS);
  const [uxNodes, setUxNodes] = useState(INITIAL_UX_NODES);
  const [uxEdges, setUxEdges] = useState(INITIAL_UX_EDGES);
  const [uxZones, setUxZones] = useState(INITIAL_UX_ZONES);
  const [erdTables, setErdTables] = useState(INITIAL_ERD_TABLES);
  const [erdRelations, setErdRelations] = useState(INITIAL_ERD_RELATIONS);
  const [erdZones, setErdZones] = useState(INITIAL_ERD_ZONES);
  const [archNodes, setArchNodes] = useState(INITIAL_ARCH_NODES);
  const [archEdges, setArchEdges] = useState(INITIAL_ARCH_EDGES);
  const [archZones, setArchZones] = useState(INITIAL_ARCH_ZONES);
  const [kanbanTasks, setKanbanTasks] = useState(INITIAL_KANBAN_TASKS);
  const [apiEndpoints, setApiEndpoints] = useState(INITIAL_API_ENDPOINTS);
  const [qaTestCases, setQaTestCases] = useState(INITIAL_QA_TEST_CASES);
  const [loadTestMetrics] = useState(INITIAL_LOAD_TEST_METRICS);
  const [deployments, setDeployments] = useState(INITIAL_RELEASE_HISTORY);
  const [troubleshootings, setTroubleshootings] = useState(INITIAL_TROUBLESHOOTING_ARCHIVE);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [members, setMembers] = useState(INITIAL_PROJECT_MEMBERS);

  // 5 Phase Accordion Open/Collapsed States
  const [collapsedPhases, setCollapsedPhases] = useState<Record<PhaseId, boolean>>({
    planning: false,
    design_spec: false,
    architecture: false,
    development: false,
    ops_maint: false
  });

  const togglePhaseCollapse = (phaseId: PhaseId) => {
    setCollapsedPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const handleSendIdeaToKanban = (idea: BacklogIdeaItem) => {
    const newTask: KanbanTask = {
      id: `task_${Date.now()}`,
      ticketKey: `GRM-${Math.floor(200 + Math.random() * 800)}`,
      title: idea.title,
      description: idea.description,
      assignee: {
        name: '한정호',
        initials: 'JH',
        color: 'bg-accent',
        role: 'Fullstack'
      },
      category: 'Frontend',
      status: 'todo',
      priority: idea.priority,
      reqRef: 'REQ-BACKLOG',
      storyPoints: idea.effort && idea.effort.includes('High') ? 8 : 5,
      deadline: 'D-5',
      aiPromptSnippet: `// 🤖 Cursor / Copilot AI 개발 지시서 (${idea.title})
// [맥락: 04 아이디어 백로그에서 전환됨]
Implement backlog feature '${idea.title}':
- Category: ${idea.category}
- Impact: ${idea.impact || 'High'}
- Scope & Details: ${idea.description}`
    };

    setKanbanTasks((prev) => [newTask, ...prev]);
    showAppToast(`"${idea.title}" 아이디어가 [13. WBS 칸반] To-Do 열에 등록되었습니다.`);
  };

  // AI Copilot Input & Filter State
  const [promptInput, setPromptInput] = useState('');
  const [chatFilterMode, setChatFilterMode] = useState<'step' | 'all'>('step');
  const [selectedModel, setSelectedModel] = useState<'sonnet' | 'gpt4o' | 'flash_lite'>('sonnet');
  const [thinkingEffort, setThinkingEffort] = useState<'low' | 'medium' | 'high'>('medium');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const showAppToast = (msg: string) => {
    setAppToast(msg);
    setTimeout(() => setAppToast(null), 2400);
  };

  // Re-clamp pane widths whenever workspace container resizes or collapse state changes
  const syncSafeWidths = useCallback(
    (
      nextLeftCollapsed = isLeftCollapsed,
      nextChatCollapsed = isChatCollapsed,
      nextArtifactCollapsed = isArtifactCollapsed
    ) => {
      const containerW = workspaceBodyRef.current?.clientWidth || window.innerWidth;
      if (containerW < 1024) return;
      const clamped = clampSafePaneWidths(
        containerW,
        leftWidth,
        chatWidth,
        nextLeftCollapsed,
        nextChatCollapsed,
        nextArtifactCollapsed
      );
      if (clamped.left !== leftWidth) setLeftWidth(clamped.left);
      if (clamped.chat !== chatWidth) setChatWidth(clamped.chat);
    },
    [leftWidth, chatWidth, isLeftCollapsed, isChatCollapsed, isArtifactCollapsed]
  );

  useEffect(() => {
    const handleViewportResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      syncSafeWidths();
    };
    window.addEventListener('resize', handleViewportResize);

    const el = workspaceBodyRef.current;
    let observer: ResizeObserver | null = null;
    if (el && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        setIsDesktop(window.innerWidth >= 1024);
        syncSafeWidths();
      });
      observer.observe(el);
    }

    return () => {
      window.removeEventListener('resize', handleViewportResize);
      observer?.disconnect();
    };
  }, [syncSafeWidths, viewMode]);

  // Interactive Drag-Resize Handler with Strict Safe Bounds
  useEffect(() => {
    if (!activeSplitter) return;

    const prevCursor = document.body.style.cursor;
    const prevSelect = document.body.style.userSelect;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      const container = workspaceBodyRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const containerW = rect.width;
      if (containerW < 1024) return;

      const relX = e.clientX - rect.left;

      if (activeSplitter === 'left') {
        const clamped = clampSafePaneWidths(
          containerW,
          relX,
          chatWidth,
          false,
          isChatCollapsed,
          isArtifactCollapsed
        );
        setLeftWidth(clamped.left);
      } else if (activeSplitter === 'chat') {
        const leftOccupied = isLeftCollapsed ? LEFT_RAIL_WIDTH : leftWidth + SPLITTER_WIDTH;
        const desiredChat = relX - leftOccupied;
        const clamped = clampSafePaneWidths(
          containerW,
          leftWidth,
          desiredChat,
          isLeftCollapsed,
          false,
          false
        );
        setChatWidth(clamped.chat);
      }
    };

    const handleMouseUp = () => {
      setActiveSplitter(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevSelect;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeSplitter, leftWidth, chatWidth, isLeftCollapsed, isChatCollapsed, isArtifactCollapsed]);

  const toggleLeftPane = () => {
    const next = !isLeftCollapsed;
    setIsLeftCollapsed(next);
    syncSafeWidths(next, isChatCollapsed, isArtifactCollapsed);
  };

  const toggleChatPane = () => {
    if (!isChatCollapsed) {
      // Folding AI Chat: ensure Right Artifact stays open so main workspace is never blank
      const nextArtifactCollapsed = false;
      if (isArtifactCollapsed) {
        setIsArtifactCollapsed(false);
        showAppToast('AI 채팅을 접고 산출물 문서 영역을 펼쳤습니다');
      }
      setIsChatCollapsed(true);
      syncSafeWidths(isLeftCollapsed, true, nextArtifactCollapsed);
    } else {
      setIsChatCollapsed(false);
      syncSafeWidths(isLeftCollapsed, false, isArtifactCollapsed);
    }
  };

  const toggleArtifactPane = () => {
    if (!isArtifactCollapsed) {
      // Folding Right Artifact: ensure AI Chat is open to fill workspace cleanly
      const nextChatCollapsed = false;
      if (isChatCollapsed) {
        setIsChatCollapsed(false);
        showAppToast('산출물 영역을 접고 AI 채팅 영역을 펼쳤습니다');
      }
      setIsArtifactCollapsed(true);
      syncSafeWidths(isLeftCollapsed, nextChatCollapsed, true);
    } else {
      setIsArtifactCollapsed(false);
      syncSafeWidths(isLeftCollapsed, isChatCollapsed, false);
    }
  };

  const isLayoutCustomized =
    isLeftCollapsed ||
    isChatCollapsed ||
    isArtifactCollapsed ||
    leftWidth !== LEFT_DEFAULT_WIDTH ||
    chatWidth !== CHAT_DEFAULT_WIDTH;

  const resetWorkspaceLayout = () => {
    const containerW = workspaceBodyRef.current?.clientWidth || window.innerWidth;
    const clamped = clampSafePaneWidths(
      containerW,
      LEFT_DEFAULT_WIDTH,
      CHAT_DEFAULT_WIDTH,
      false,
      false,
      false
    );
    setIsLeftCollapsed(false);
    setIsChatCollapsed(false);
    setIsArtifactCollapsed(false);
    setLeftWidth(clamped.left);
    setChatWidth(clamped.chat);
    showAppToast('3단 워크스페이스 영역 크기가 기본값으로 초기화되었습니다');
  };

  // Countdown Effect for Guest Session TTL
  useEffect(() => {
    const interval = setInterval(() => {
      setGuestTimer((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll chat to bottom when messages or step changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length, currentStep, chatFilterMode]);

  const activeStepInfo =
    pipelineSteps.find((s) => s.id === currentStep) || pipelineSteps[0];

  const activeStepIds = ALL_STEP_IDS.filter((id) => enabledSteps[id]);
  const activeStepCount = activeStepIds.length;
  const completedActiveCount = pipelineSteps.filter(
    (s) => enabledSteps[s.id] && s.status === 'COMPLETED'
  ).length;
  const progressPercentage =
    activeStepCount > 0 ? Math.round((completedActiveCount / activeStepCount) * 100) : 0;

  const handleToggleStep = (stepId: StepId) => {
    const nextVal = !enabledSteps[stepId];
    const nextMap = { ...enabledSteps, [stepId]: nextVal };
    const nextCount = ALL_STEP_IDS.filter((id) => nextMap[id]).length;
    if (nextCount === 0) {
      showAppToast('최소 1개 이상의 파이프라인 단계가 활성화되어야 합니다');
      return;
    }
    setEnabledSteps(nextMap);
    setPipelineTrack('custom');
    showAppToast(`${stepId} 단계가 ${nextVal ? '활성화' : '스킵'}되었습니다`);
  };

  const handleEnterWorkspace = (
    idea: string,
    nextTrack: PipelineTrack,
    nextEnabledSteps: Record<StepId, boolean>,
    nextDomain?: ServiceDomain
  ) => {
    if (idea.trim()) setProjectIdea(idea.trim());
    if (nextDomain) setServiceDomain(nextDomain);
    setPipelineTrack(nextTrack);
    setEnabledSteps(nextEnabledSteps);
    const firstActive = ALL_STEP_IDS.find((id) => nextEnabledSteps[id]) || 'step1';
    setCurrentStep(firstActive);
    setViewMode('workspace');
    setMobilePane('artifact');
  };

  const handleSelectStep = (step: StepId) => {
    if (!enabledSteps[step]) {
      setIsSettingsModalOpen(true);
      showAppToast('스킵된 단계입니다. 설정의 파이프라인 탭에서 활성화할 수 있습니다.');
      return;
    }
    setCurrentStep(step);
    setMobilePane('artifact');
  };

  const handleForceNavigateStep = (step: StepId) => {
    if (!enabledSteps[step]) {
      setEnabledSteps((prev) => ({ ...prev, [step]: true }));
      setPipelineTrack('custom');
    }
    setCurrentStep(step);
    setMobilePane('artifact');
  };

  const handleConfirmStep = (step: StepId) => {
    const targetStep = pipelineSteps.find((s) => s.id === step);
    const isAlreadyConfirmed = targetStep?.status === 'COMPLETED';

    setPipelineSteps((prev) =>
      prev.map((s) => {
        if (s.id !== step) return s;
        if (isAlreadyConfirmed) {
          return { ...s, status: 'IN_PROGRESS', lastUpdated: '확정 취소됨' };
        }
        return { ...s, status: 'COMPLETED', lastUpdated: '방금 확정' };
      })
    );

    const stepLabel = targetStep?.title || '단계';
    if (isAlreadyConfirmed) {
      showAppToast(`${stepLabel} 확정이 취소되었습니다 (작업 중으로 변경)`);
    } else {
      showAppToast(`${stepLabel} 단계가 확정되었습니다`);
    }
  };

  const appendUserAndAiMessage = (userText: string, customAiReply?: string) => {
    const nowTime = new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      stepId: currentStep,
      sender: 'user',
      author: isAccountClaimed ? '한정호' : '한정호 (게스트)',
      roleBadge: 'Owner',
      timestamp: nowTime,
      content: userText
    };

    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      let replyContent =
        customAiReply ||
        `요청하신 "${userText}" 사항을 반영해 ${activeStepInfo.shortTitle} 산출물을 갱신했습니다.`;

      let artifactTitle = `${activeStepInfo.shortTitle} 업데이트`;
      let artifactSummary = '하위 단계 컨텍스트에 변경사항 반영됨';

      if (currentStep === 'step9') {
        setErdTables((prev) =>
          prev.map((t) =>
            t.id === 'reservations' && !t.columns.some((c) => c.name === 'penalty_fee')
              ? {
                  ...t,
                  columns: [
                    ...t.columns,
                    {
                      id: `col_${Date.now()}`,
                      name: 'penalty_fee',
                      type: 'INTEGER',
                      nullable: false,
                      comment: '노쇼 위약금'
                    }
                  ]
                }
              : t
          )
        );
        replyContent =
          customAiReply ||
          `요청하신 대로 \`reservations\` 테이블에 \`penalty_fee (INTEGER NOT NULL)\` 컬럼을 추가하고 DDL 스크립트를 갱신했습니다.`;
        artifactTitle = 'ERD 스키마 갱신 (v1.3)';
        artifactSummary = 'reservations.penalty_fee 컬럼 추가됨';
      } else if (currentStep === 'step13') {
        const nextNum = 101 + kanbanTasks.length;
        setKanbanTasks((prev) => [
          {
            id: `k_${Date.now()}`,
            ticketKey: `GRM-${nextNum}`,
            title: userText.slice(0, 42),
            description: 'AI 코파일럿 대화로부터 도출되어 스프린트 대기열에 추가된 작업입니다.',
            priority: 'P0',
            assignee: { name: '한정호', initials: 'JH', color: 'bg-accent', role: 'Fullstack' },
            deadline: 'D-2',
            storyPoints: 5,
            reqRef: 'REQ-RESV-03',
            category: 'Backend',
            status: 'todo',
            aiPromptSnippet: `// 🤖 Cursor / Copilot AI 지시서\nImplement: ${userText}`
          },
          ...prev
        ]);
        artifactTitle = `신규 티켓 추가 (GRM-${nextNum})`;
        artifactSummary = 'To-Do 열 상단에 P0로 배치됨';
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        stepId: currentStep,
        sender: 'ai',
        author: activeStepInfo.personaName,
        roleBadge: activeStepInfo.personaRole,
        timestamp: nowTime,
        content: replyContent,
        artifactAction: {
          title: artifactTitle,
          version: 'v1.5',
          summary: artifactSummary,
          targetStep: currentStep
        }
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    }, 450);
  };

  const handleApplyToArtifact = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim()) return;
    const text = promptInput.trim();
    setPromptInput('');
    appendUserAndAiMessage(text);
  };

  const quickPromptsByStep: Record<StepId, string[]> = {
    step1: ['초기 시장 진입 전략 보강', '핵심 성공 지표(KPI) 재검토'],
    step2: ['중개 수수료 5% 유닛 이코노믹스 검증', '점주 구독 모델 수익성 시뮬레이션'],
    step3: ['AWS 인프라 월간 예상 비용 산정', 'OpenAI API 토큰 비용 최적화 방안'],
    step4: ['WBS 칸반으로 넘길 우선순위 선정', 'MVP 제외 아이디어 아카이빙'],
    step5: ['반경 1.5km 조회 기능 요구사항 추가', '게스트 세션 클레임 요구사항 검토'],
    step6: ['컬러 팔레트 명도 대비(WCAG) 검증', '브랜드 SVG 심볼 코드 복사'],
    step7: ['화면 흐름도 IA 라우팅 테이블 동기화', '게스트/회원 권한 분기 검토'],
    step8: ['PostgreSQL 단일 DB 선정 사유 검토', 'Redis 분리 시점 ADR 추가'],
    step9: ['reservations 낙관적 락 컬럼 검토', 'discount_items 인덱스 전략'],
    step10: ['SSE 연결 유지 Nginx 타임아웃 구성', 'VPC 서브넷 격리 구조 점검'],
    step11: ['Git 브랜치 전략 GitHub-flow 규칙 점검', '커밋 컨벤션 템플릿 생성'],
    step12: ['RFC 7807 표준 에러 포맷 검증', '할인 재고 차감 API 스키마 확인'],
    step13: ['P0 핵심 태스크 AI 코딩 지시서 생성', 'Cursor/Copilot용 프롬프트 복사'],
    step14: ['동시 예약 락 예외 테스트 케이스 추가', 'k6 부하 테스트 1000 TPS 검증'],
    step15: ['v1.5.0 프로덕션 릴리즈 노트 확인', '긴급 롤백 절차 점검'],
    step16: ['마감 트래픽 병목 트러블슈팅 분석', 'Redis 캐시 전환 정량 개선 검토']
  };

  const visibleChatMessages =
    chatFilterMode === 'step'
      ? chatMessages.filter((m) => m.stepId === currentStep)
      : chatMessages;

  return (
    <div
      data-theme={theme}
      className="flex flex-col min-h-[100dvh] h-[100dvh] w-full bg-paper text-ink overflow-hidden"
    >
      {/* Floating App Toast */}
      {appToast && (
        <div
          role="status"
          className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-paper px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 whitespace-nowrap"
        >
          <Check className="w-3.5 h-3.5 text-ok shrink-0" />
          <span>{appToast}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 1: LANDING & ONBOARDING */}
      {/* ============================================================== */}
      {viewMode === 'landing' ? (
        <LandingView
          projectIdea={projectIdea}
          setProjectIdea={setProjectIdea}
          pipelineSteps={pipelineSteps}
          currentTrack={pipelineTrack}
          enabledSteps={enabledSteps}
          serviceDomain={serviceDomain}
          onEnterWorkspace={handleEnterWorkspace}
          onLoginSuccess={(email) => {
            setIsAccountClaimed(true);
            setClaimedEmail(email);
            setViewMode('workspace');
            showAppToast(`${email} 계정으로 로그인되었습니다`);
          }}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : (
        /* ============================================================== */
        /* VIEW 2: MAIN WORKSPACE (RESPONSIVE 3-PANE ARCHITECTURE) */
        /* ============================================================== */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* A. TOP GLOBAL HEADER */}
          <header className="h-12 bg-surface border-b border-line px-3 sm:px-4 flex items-center justify-between gap-2 shrink-0 z-30">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setViewMode('landing')}
                className="hover:opacity-85 transition-opacity cursor-pointer whitespace-nowrap flex items-center gap-2"
                title="소개 페이지로 이동"
              >
                <img src="/logo-full.png" alt="Groom" className="h-7 w-auto object-contain" />
              </button>

              <span className="text-subtle">/</span>

              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                className="font-medium text-xs sm:text-sm text-ink truncate hover:text-accent transition-colors flex items-center gap-1.5 cursor-pointer max-w-[200px] sm:max-w-[320px] group text-left"
                title="프로젝트명 및 워크스페이스 설정 변경"
              >
                <span className="truncate">{projectIdea}</span>
                <Settings className="w-3 h-3 text-muted group-hover:text-ink shrink-0 transition-colors" />
              </button>

              {!isAccountClaimed ? (
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(true)}
                  className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-well hover:bg-control text-xs text-muted hover:text-ink transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Clock className="w-3 h-3 text-warn shrink-0" />
                  <span>
                    임시 세션{' '}
                    <code className="font-mono text-ink tabular-nums">
                      {String(guestTimer.hours).padStart(2, '0')}:
                      {String(guestTimer.minutes).padStart(2, '0')}:
                      {String(guestTimer.seconds).padStart(2, '0')}
                    </code>
                  </span>
                </button>
              ) : (
                <span className="hidden md:inline-flex items-center gap-1 text-xs text-ok whitespace-nowrap">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{claimedEmail}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  aria-label="인앱 알림 열기"
                  onClick={() => setIsBellDropdownOpen(!isBellDropdownOpen)}
                  className="p-1.5 rounded-lg bg-well hover:bg-control text-ink-2 hover:text-ink relative transition-colors cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-1 rounded-full bg-danger text-accent-ink font-mono text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isBellDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-surface border border-line rounded-xl overflow-hidden z-50">
                    <div className="px-4 py-2.5 bg-well border-b border-line flex items-center justify-between text-xs">
                      <span className="font-semibold text-ink">알림 ({unreadCount})</span>
                      <button
                        type="button"
                        onClick={() => setUnreadCount(0)}
                        className="text-xs text-muted hover:text-ink cursor-pointer"
                      >
                        모두 읽음
                      </button>
                    </div>

                    <div className="divide-y divide-line text-xs">
                      <div
                        onClick={() => {
                          handleForceNavigateStep('step15');
                          setIsBellDropdownOpen(false);
                        }}
                        className="p-3.5 hover:bg-well transition-colors cursor-pointer space-y-1"
                      >
                        <div className="flex items-center justify-between text-muted">
                          <span className="text-ok font-medium">배포 성공 (v1.5.0)</span>
                          <span>방금 전</span>
                        </div>
                        <div className="font-semibold text-ink">
                          Redis TTL 및 SSE 스트리밍 운영 배포 완료
                        </div>
                        <p className="text-muted">
                          Step 15 배포 이력 &amp; 릴리즈 노트에서 상세 지표를 확인하세요.
                        </p>
                      </div>

                      <div
                        onClick={() => {
                          handleForceNavigateStep('step13');
                          setIsBellDropdownOpen(false);
                        }}
                        className="p-3.5 hover:bg-well transition-colors cursor-pointer space-y-1"
                      >
                        <div className="flex items-center justify-between text-muted">
                          <span className="text-danger font-medium">마감 임박 (D-2)</span>
                          <span>14분 전</span>
                        </div>
                        <div className="font-semibold text-ink">
                          [GRM-103] ERD 및 화면 흐름 JSONB 양방향 동기화
                        </div>
                        <p className="text-muted">
                          Step 13 WBS 칸반에서 할당된 P0 작업 마감일이 48시간 남았습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Workspace Settings Button */}
              <button
                type="button"
                aria-label="워크스페이스 설정 열기"
                title="설정"
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-1.5 rounded-lg bg-well hover:bg-control text-ink-2 hover:text-ink transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* MOBILE / TABLET PANE SWITCHER (< 1024px) */}
          <div className="lg:hidden bg-surface border-b border-line px-3 py-1.5 flex items-center gap-1 shrink-0">
            {[
              { id: 'steps' as const, label: `단계 (${activeStepCount}/${ALL_STEP_IDS.length})` },
              { id: 'chat' as const, label: 'AI 코파일럿' },
              { id: 'artifact' as const, label: `산출물 (${activeStepInfo.shortTitle})` }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMobilePane(tab.id)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  mobilePane === tab.id
                    ? 'bg-well text-ink font-semibold'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 3-COLUMN COLLAPSIBLE & SAFE-CLAMPED RESIZABLE WORKSPACE BODY */}
          <div ref={workspaceBodyRef} className="flex-1 flex overflow-hidden min-w-0">
            {/* ======================================================== */}
            {/* B-RAIL. COLLAPSED LEFT PIPELINE RAIL (Desktop >= 1024px) */}
            {/* ======================================================== */}
            {isLeftCollapsed && (
              <aside
                aria-label="접힌 파이프라인 단계 바"
                className="hidden lg:flex w-12 bg-surface border-r border-line flex-col items-center justify-between py-2.5 shrink-0 select-none"
              >
                <div className="flex flex-col items-center gap-1.5 w-full px-1.5">
                  <button
                    type="button"
                    aria-label="파이프라인 목록 펼치기"
                    title="파이프라인 목록 펼치기"
                    onClick={toggleLeftPane}
                    className="w-8 h-8 rounded-lg bg-well hover:bg-control text-ink flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <PanelLeftOpen className="w-4 h-4" />
                  </button>

                  <div className="w-6 border-t border-line my-1" />

                  {/* Compact 01-16 Step Quick Buttons */}
                  <div className="flex flex-col items-center gap-1 w-full overflow-y-auto max-h-[calc(100vh-140px)] py-1">
                    {pipelineSteps.map((step) => {
                      const isEnabled = enabledSteps[step.id];
                      const isSelected = isEnabled && currentStep === step.id;
                      const stepNumStr = String(step.number).padStart(2, '0');
                      return (
                        <button
                          key={step.id}
                          type="button"
                          onClick={() => handleSelectStep(step.id)}
                          title={`${step.title}${!isEnabled ? ' (SKIPPED)' : ''}`}
                          className={`relative w-8 h-7 rounded flex items-center justify-center transition-colors cursor-pointer text-xs shrink-0 ${
                            !isEnabled
                              ? 'opacity-30 text-muted line-through hover:bg-well'
                              : isSelected
                              ? 'bg-ink text-paper font-semibold'
                              : 'text-ink-2 hover:bg-well hover:text-ink'
                          }`}
                        >
                          <code className="font-mono text-[10px]">{stepNumStr}</code>
                          {isEnabled && step.status === 'COMPLETED' && (
                            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-ok" />
                          )}
                          {isEnabled && step.status === 'IN_PROGRESS' && !isSelected && (
                            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-accent" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <code
                  title={`활성 단계 확정률 ${completedActiveCount}/${activeStepCount}`}
                  className="font-mono text-[10px] text-muted tabular-nums"
                >
                  {progressPercentage}%
                </code>
              </aside>
            )}

            {/* ======================================================== */}
            {/* B. LEFT SIDEBAR: 5-PHASE / 16-INDEPENDENT MODULES PIPELINE */}
            {/* ======================================================== */}
            <aside
              style={isDesktop && !isLeftCollapsed ? { width: `${leftWidth}px` } : undefined}
              className={`${mobilePane === 'steps' ? 'flex w-full' : 'hidden'} ${
                isLeftCollapsed ? 'lg:hidden' : 'lg:flex'
              } bg-surface border-r lg:border-r-0 border-line flex-col justify-between shrink-0 min-w-0 overflow-hidden`}
            >
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {/* Sidebar Header with Title, Collapse Button & Progress */}
                <div className="p-3.5 border-b border-line space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-ink truncate">
                      파이프라인 ({activeStepCount}/{ALL_STEP_IDS.length})
                    </span>
                    <button
                      type="button"
                      aria-label="파이프라인 목록 접기"
                      title="파이프라인 목록 접기"
                      onClick={toggleLeftPane}
                      className="hidden lg:inline-flex p-1 rounded-md hover:bg-well text-muted hover:text-ink transition-colors cursor-pointer shrink-0"
                    >
                      <PanelLeftClose className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5 gap-1">
                      <span className="text-muted truncate">단계 확정률</span>
                      <code className="font-mono font-semibold text-ink tabular-nums shrink-0">
                        {completedActiveCount}/{activeStepCount} ({progressPercentage}%)
                      </code>
                    </div>
                    <div className="w-full h-1 bg-well rounded-full overflow-hidden">
                      <div
                        style={{ width: `${progressPercentage}%` }}
                        className="h-full bg-ink rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* 5-Phase Grouped Accordion Pipeline Navigation */}
                <nav aria-label="5대 Phase 16개 독립 모듈" className="p-2 space-y-2">
                  {PIPELINE_PHASES.map((phase) => {
                    const isPhaseCollapsed = collapsedPhases[phase.id];
                    const phaseSteps = phase.stepIds
                      .map((id) => pipelineSteps.find((s) => s.id === id))
                      .filter(Boolean) as typeof pipelineSteps;
                    const phaseActiveCount = phaseSteps.filter((s) => enabledSteps[s.id]).length;
                    const phaseCompletedCount = phaseSteps.filter(
                      (s) => enabledSteps[s.id] && s.status === 'COMPLETED'
                    ).length;

                    return (
                      <div
                        key={phase.id}
                        className="rounded-lg border border-line/60 bg-paper/20 overflow-hidden"
                      >
                        {/* Phase Group Accordion Header */}
                        <button
                          type="button"
                          onClick={() => togglePhaseCollapse(phase.id)}
                          className="w-full px-2.5 py-2 flex items-center justify-between gap-1.5 text-left hover:bg-well/50 transition-colors cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            {isPhaseCollapsed ? (
                              <ChevronRight className="w-3.5 h-3.5 text-muted shrink-0" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-muted shrink-0" />
                            )}
                            <span className="text-xs font-semibold text-ink truncate">
                              {phase.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-muted px-1.5 py-0.5 rounded bg-well shrink-0">
                            {phaseCompletedCount}/{phaseActiveCount}
                          </span>
                        </button>

                        {/* Phase Independent Step Modules */}
                        {!isPhaseCollapsed && (
                          <div className="p-1 pt-0.5 space-y-0.5 border-t border-line/40">
                            {phaseSteps.map((step) => {
                              const isEnabled = enabledSteps[step.id];
                              const isSelected = isEnabled && currentStep === step.id;
                              const stepNumStr = String(step.number).padStart(2, '0');
                              const cleanLabel = step.title.replace(/^Step \d+\.\s*/, '');

                              return (
                                <button
                                  key={step.id}
                                  type="button"
                                  onClick={() => handleSelectStep(step.id)}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors flex items-center justify-between gap-1.5 cursor-pointer min-w-0 ${
                                    !isEnabled
                                      ? 'opacity-40 hover:bg-well/40 text-muted'
                                      : isSelected
                                      ? 'bg-well text-ink font-semibold'
                                      : 'text-ink-2 hover:bg-well/60 hover:text-ink'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <code className="font-mono text-[10px] text-muted shrink-0">
                                      {stepNumStr}
                                    </code>
                                    <span
                                      className={`text-xs truncate ${
                                        !isEnabled ? 'line-through text-muted' : ''
                                      }`}
                                    >
                                      {cleanLabel}
                                    </span>
                                  </div>

                                  <div className="shrink-0 flex items-center">
                                    {!isEnabled ? (
                                      <span className="px-1.5 py-0.5 rounded bg-well border border-line text-[9px] font-medium text-muted">
                                        SKIPPED
                                      </span>
                                    ) : step.status === 'COMPLETED' ? (
                                      <Check className="w-3.5 h-3.5 text-ok" />
                                    ) : step.status === 'IN_PROGRESS' ? (
                                      <span
                                        className="w-2 h-2 rounded-full bg-accent"
                                        title="진행 중 (IN_PROGRESS)"
                                      />
                                    ) : (
                                      <Lock className="w-3 h-3 text-subtle" />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Status Summary */}
              <div className="p-3 border-t border-line space-y-1 text-xs text-muted shrink-0">
                <div className="px-2 py-1 flex items-center justify-between gap-2">
                  <span className="truncate">운영 릴리즈 버전</span>
                  <code className="font-mono text-ok font-semibold shrink-0">v1.5.0</code>
                </div>
                <div className="px-2 py-1 flex items-center justify-between gap-2">
                  <span className="truncate">선택 트랙</span>
                  <code className="font-mono shrink-0 uppercase text-[10px] px-1.5 py-0.5 rounded bg-well border border-line font-medium text-ink">
                    {pipelineTrack}
                  </code>
                </div>
              </div>
            </aside>

            {/* ======================================================== */}
            {/* SPLITTER 1: RESIZE LEFT PIPELINE SIDEBAR (Desktop >= 1024px) */}
            {/* ======================================================== */}
            {!isLeftCollapsed && (
              <div
                role="separator"
                aria-orientation="vertical"
                aria-label="파이프라인 영역 너비 조절 구분선"
                title="드래그하여 파이프라인 너비 조절 (더블클릭 시 기본 크기)"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setActiveSplitter('left');
                }}
                onDoubleClick={() => {
                  const containerW = workspaceBodyRef.current?.clientWidth || window.innerWidth;
                  const clamped = clampSafePaneWidths(
                    containerW,
                    LEFT_DEFAULT_WIDTH,
                    chatWidth,
                    false,
                    isChatCollapsed,
                    isArtifactCollapsed
                  );
                  setLeftWidth(clamped.left);
                }}
                className={`hidden lg:flex w-1.5 shrink-0 cursor-col-resize items-center justify-center relative group select-none transition-colors z-20 ${
                  activeSplitter === 'left' ? 'bg-accent-soft' : 'bg-surface hover:bg-accent-soft'
                }`}
              >
                <div
                  className={`w-px h-full transition-colors ${
                    activeSplitter === 'left' ? 'bg-accent' : 'bg-line group-hover:bg-accent'
                  }`}
                />
                <div
                  className={`absolute w-1 h-8 rounded-full transition-colors ${
                    activeSplitter === 'left'
                      ? 'bg-accent'
                      : 'bg-line-strong group-hover:bg-accent'
                  }`}
                />
              </div>
            )}

            {/* ======================================================== */}
            {/* C-RAIL. COLLAPSED AI COPILOT CHAT RAIL (Desktop >= 1024px) */}
            {/* ======================================================== */}
            {isChatCollapsed && (
              <div
                aria-label="접힌 AI 채팅 영역 바"
                onClick={toggleChatPane}
                title="클릭하여 AI 코파일럿 채팅 펼치기"
                className="hidden lg:flex w-11 bg-surface border-r border-line flex-col items-center justify-between py-2.5 shrink-0 cursor-pointer hover:bg-well transition-colors select-none"
              >
                <div className="flex flex-col items-center gap-3">
                  <button
                    type="button"
                    aria-label="AI 채팅 영역 펼치기"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChatPane();
                    }}
                    className="w-8 h-8 rounded-lg bg-well hover:bg-control text-ink flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-accent" />
                  </button>

                  <span className="text-xs font-medium text-muted [writing-mode:vertical-rl] py-1">
                    AI 코파일럿 채팅
                  </span>
                </div>

                <code
                  title="현재 단계 대화 메시지 수"
                  className="px-1.5 py-0.5 rounded bg-well font-mono text-[10px] text-ink-2 tabular-nums"
                >
                  {visibleChatMessages.length}
                </code>
              </div>
            )}

            {/* ======================================================== */}
            {/* C. CENTER PANEL: STEP-SYNCED AI COPILOT CHAT */}
            {/* ======================================================== */}
            <section
              style={
                isDesktop && !isChatCollapsed && !isArtifactCollapsed
                  ? { width: `${chatWidth}px` }
                  : undefined
              }
              className={`${mobilePane === 'chat' ? 'flex w-full' : 'hidden'} ${
                isChatCollapsed
                  ? 'lg:hidden'
                  : isArtifactCollapsed
                  ? 'lg:flex lg:flex-1 lg:min-w-0'
                  : 'lg:flex shrink-0'
              } bg-paper border-r lg:border-r-0 border-line flex-col min-w-0 overflow-hidden`}
            >
              {/* Copilot Header */}
              <div className="h-12 px-3 bg-surface border-b border-line flex items-center justify-between gap-2 shrink-0">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-ink truncate">
                    {activeStepInfo.personaName}
                  </div>
                  <div className="text-[11px] text-muted truncate">
                    Step 0{activeStepInfo.number} {activeStepInfo.personaRole}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Step vs All Chat Scope Toggle */}
                  <div className="flex items-center bg-well p-0.5 rounded-md text-[11px]">
                    <button
                      type="button"
                      onClick={() => setChatFilterMode('step')}
                      className={`px-2 py-0.5 rounded cursor-pointer whitespace-nowrap ${
                        chatFilterMode === 'step'
                          ? 'bg-surface text-ink font-medium'
                          : 'text-muted hover:text-ink'
                      }`}
                    >
                      단계
                    </button>
                    <button
                      type="button"
                      onClick={() => setChatFilterMode('all')}
                      className={`px-2 py-0.5 rounded cursor-pointer whitespace-nowrap ${
                        chatFilterMode === 'all'
                          ? 'bg-surface text-ink font-medium'
                          : 'text-muted hover:text-ink'
                      }`}
                    >
                      전체
                    </button>
                  </div>

                  {/* Model Picker */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsModelPickerOpen(!isModelPickerOpen)}
                      className="px-2 py-1 rounded-md bg-well hover:bg-control text-xs text-ink-2 flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>
                        {selectedModel === 'sonnet'
                          ? 'Sonnet'
                          : selectedModel === 'gpt4o'
                          ? 'GPT-4o'
                          : 'Flash'}
                      </span>
                      <ChevronDown className="w-3 h-3 text-muted" />
                    </button>

                    {isModelPickerOpen && (
                      <div className="absolute right-0 mt-1.5 w-56 bg-surface border border-line rounded-xl p-1.5 z-50 text-xs space-y-1">
                        {[
                          {
                            id: 'sonnet',
                            name: 'Claude 3.5 Sonnet',
                            desc: '스키마, API 및 코드 설계'
                          },
                          {
                            id: 'gpt4o',
                            name: 'GPT-4o Structured',
                            desc: '인프라 및 운영 원인 분석'
                          },
                          {
                            id: 'flash_lite',
                            name: 'Gemini Flash-Lite',
                            desc: '빠른 기획 초안 생성'
                          }
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              setSelectedModel(m.id as 'sonnet' | 'gpt4o' | 'flash_lite');
                              setIsModelPickerOpen(false);
                            }}
                            className={`w-full text-left p-2 rounded-lg transition-colors cursor-pointer ${
                              selectedModel === m.id
                                ? 'bg-well text-ink font-medium'
                                : 'hover:bg-well text-ink-2'
                            }`}
                          >
                            <div className="text-xs text-ink">{m.name}</div>
                            <div className="text-xs text-muted">{m.desc}</div>
                          </button>
                        ))}

                        <div className="pt-1.5 border-t border-line px-2 pb-1">
                          <div className="text-xs text-muted mb-1">추론 깊이</div>
                          <div className="flex gap-1">
                            {(['low', 'medium', 'high'] as const).map((lvl) => (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => setThinkingEffort(lvl)}
                                className={`flex-1 py-1 rounded-md text-xs font-medium cursor-pointer ${
                                  thinkingEffort === lvl
                                    ? 'bg-ink text-paper'
                                    : 'bg-well text-muted hover:text-ink'
                                }`}
                              >
                                {lvl}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Collapse AI Chat Button (Desktop) */}
                  <button
                    type="button"
                    aria-label="AI 채팅 영역 접기"
                    title="AI 채팅 영역 접기"
                    onClick={toggleChatPane}
                    className="hidden lg:inline-flex p-1 rounded-md hover:bg-well text-muted hover:text-ink transition-colors cursor-pointer"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Conversational Thread */}
              <div className="flex-1 overflow-y-auto p-3.5">
                <div className="max-w-3xl w-full mx-auto space-y-4">
                  {visibleChatMessages.map((msg) => (
                    <div key={msg.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-muted gap-2">
                        <span className="font-medium text-ink truncate">{msg.author}</span>
                        <span className="shrink-0">{msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-3 rounded-xl text-xs leading-relaxed border ${
                          msg.sender === 'user'
                            ? 'bg-well border-line text-ink'
                            : 'bg-surface border-line text-ink-2'
                        }`}
                      >
                        {msg.contextRefs && msg.contextRefs.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {msg.contextRefs.map((ref) => (
                              <span
                                key={ref}
                                className="px-2 py-0.5 rounded bg-well text-[11px] text-muted"
                              >
                                {ref}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="whitespace-pre-wrap leading-relaxed break-words">
                          {msg.content}
                        </p>

                        {msg.artifactAction && (
                          <button
                            type="button"
                            onClick={() => {
                              if (isArtifactCollapsed) setIsArtifactCollapsed(false);
                              handleForceNavigateStep(msg.artifactAction!.targetStep);
                            }}
                            className="mt-2.5 w-full text-left px-3 py-2 rounded-lg bg-well hover:bg-control flex items-center justify-between gap-2 group transition-colors cursor-pointer"
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-ink truncate">
                                {msg.artifactAction.title}
                              </div>
                              <div className="text-xs text-muted truncate">
                                {msg.artifactAction.summary}
                              </div>
                            </div>
                            <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-ink shrink-0" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </div>

              {/* Prompt Suggestions & Input Box */}
              <div className="p-3 bg-surface border-t border-line">
                <div className="max-w-3xl w-full mx-auto space-y-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                    {quickPromptsByStep[currentStep].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setPromptInput(q)}
                        className="text-xs px-2.5 py-1 rounded-md bg-well hover:bg-control text-ink-2 whitespace-nowrap transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  <form
                    onSubmit={handleApplyToArtifact}
                    className="bg-well border border-line rounded-xl p-2.5 space-y-2 transition-colors"
                  >
                    <label htmlFor="copilot-prompt-textarea" className="sr-only">
                      AI 코파일럿 프롬프트 입력
                    </label>
                    <textarea
                      id="copilot-prompt-textarea"
                      aria-label="AI 코파일럿 프롬프트 입력"
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleApplyToArtifact();
                        }
                      }}
                      rows={2}
                      placeholder={`${activeStepInfo.shortTitle} 수정 요청을 입력하세요...`}
                      className="w-full bg-transparent text-xs text-ink placeholder:text-muted rounded resize-none leading-relaxed"
                    />

                    <div className="flex items-center justify-between pt-1.5 border-t border-line gap-2">
                      <span className="text-xs text-muted flex items-center gap-1 whitespace-nowrap">
                        <CornerDownLeft className="w-3 h-3 shrink-0" /> Enter 전송
                      </span>

                      <button
                        type="submit"
                        className="px-3 py-1 rounded-lg bg-ink hover:opacity-90 text-paper text-xs font-medium flex items-center gap-1.5 transition-opacity cursor-pointer whitespace-nowrap"
                      >
                        <Send className="w-3 h-3" />
                        <span>산출물 반영</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>

            {/* ======================================================== */}
            {/* SPLITTER 2: RESIZE AI CHAT ↔ RIGHT ARTIFACT (Desktop >= 1024px) */}
            {/* ======================================================== */}
            {!isChatCollapsed && !isArtifactCollapsed && (
              <div
                role="separator"
                aria-orientation="vertical"
                aria-label="AI 채팅과 문서 뷰어 너비 조절 구분선"
                title="드래그하여 AI 채팅 및 문서 영역 크기 조절 (더블클릭 시 기본 크기)"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setActiveSplitter('chat');
                }}
                onDoubleClick={() => {
                  const containerW = workspaceBodyRef.current?.clientWidth || window.innerWidth;
                  const clamped = clampSafePaneWidths(
                    containerW,
                    leftWidth,
                    CHAT_DEFAULT_WIDTH,
                    isLeftCollapsed,
                    false,
                    false
                  );
                  setChatWidth(clamped.chat);
                }}
                className={`hidden lg:flex w-1.5 shrink-0 cursor-col-resize items-center justify-center relative group select-none transition-colors z-20 ${
                  activeSplitter === 'chat' ? 'bg-accent-soft' : 'bg-surface hover:bg-accent-soft'
                }`}
              >
                <div
                  className={`w-px h-full transition-colors ${
                    activeSplitter === 'chat' ? 'bg-accent' : 'bg-line group-hover:bg-accent'
                  }`}
                />
                <div
                  className={`absolute w-1 h-8 rounded-full transition-colors ${
                    activeSplitter === 'chat'
                      ? 'bg-accent'
                      : 'bg-line-strong group-hover:bg-accent'
                  }`}
                />
              </div>
            )}

            {/* ======================================================== */}
            {/* ======================================================== */}
            {/* D. RIGHT PANEL: 16-INDEPENDENT MODULES ARTIFACT VIEWER */}
            {/* ======================================================== */}
            <main
              className={`${mobilePane === 'artifact' ? 'flex w-full' : 'hidden'} ${
                isArtifactCollapsed ? 'lg:hidden' : 'lg:flex lg:min-w-[460px]'
              } flex-1 min-w-0 flex-col overflow-hidden bg-paper`}
            >
              {/* Step 01 (개요) & Step 02 (BM): Structured Markdown Document Viewer */}
              {(currentStep === 'step1' || currentStep === 'step2') && (
                <DocumentArtifactView
                  currentStep={currentStep}
                  projectTitle={projectIdea}
                  requirements={requirements}
                  setRequirements={setRequirements}
                  onConfirmStep={handleConfirmStep}
                  isConfirmed={activeStepInfo.status === 'COMPLETED'}
                  onCollapsePane={toggleArtifactPane}
                  onRequestAiRefine={(sectionTitle) => {
                    if (isChatCollapsed) setIsChatCollapsed(false);
                    appendUserAndAiMessage(
                      `"${sectionTitle}" 섹션의 비즈니스 가치와 시장 진입 가설을 더 구체적으로 보강해 줘.`
                    );
                    setMobilePane('chat');
                  }}
                />
              )}

              {/* Step 03: 비용 및 예산 산정서 */}
              {currentStep === 'step3' && (
                <BudgetEstimatorView
                  items={budgetItems}
                  setItems={setBudgetItems}
                  onConfirmStep={handleConfirmStep}
                  onCollapsePane={toggleArtifactPane}
                  isConfirmed={activeStepInfo.status === 'COMPLETED'}
                />
              )}

              {/* Step 04: 아이디어 백로그 */}
              {currentStep === 'step4' && (
                <IdeaBacklogView
                  ideas={ideaBacklog}
                  setIdeas={setIdeaBacklog}
                  onSendToWbs={handleSendIdeaToKanban}
                  onNavigateStep={handleForceNavigateStep}
                  onConfirmStep={handleConfirmStep}
                  onCollapsePane={toggleArtifactPane}
                  isConfirmed={activeStepInfo.status === 'COMPLETED'}
                />
              )}

              {/* Step 05: 요구사항 및 제약사항 (PRD) */}
              {currentStep === 'step5' && (
                <DocumentArtifactView
                  currentStep={currentStep}
                  projectTitle={projectIdea}
                  requirements={requirements}
                  setRequirements={setRequirements}
                  onConfirmStep={handleConfirmStep}
                  isConfirmed={activeStepInfo.status === 'COMPLETED'}
                  onCollapsePane={toggleArtifactPane}
                  onRequestAiRefine={(sectionTitle) => {
                    if (isChatCollapsed) setIsChatCollapsed(false);
                    appendUserAndAiMessage(
                      `PRD "${sectionTitle}" 요구사항의 예외 케이스 및 검증 기준을 보강해 줘.`
                    );
                    setMobilePane('chat');
                  }}
                />
              )}

              {/* Step 06: 브랜딩 & 디자인 시스템 */}
              {currentStep === 'step6' && (
                <BrandingDesignView
                  branding={branding}
                  setBranding={setBranding}
                  onConfirmStep={handleConfirmStep}
                  onCollapsePane={toggleArtifactPane}
                  isConfirmed={activeStepInfo.status === 'COMPLETED'}
                />
              )}

              {/* Step 07 (화면 흐름도), Step 09 (ERD), Step 10 (아키텍처): 토폴로지 캔버스 뷰 */}
              {(currentStep === 'step7' ||
                currentStep === 'step9' ||
                currentStep === 'step10') && (
                <TopologyCanvasView
                  currentStep={currentStep}
                  uxNodes={uxNodes}
                  setUxNodes={setUxNodes}
                  uxEdges={uxEdges}
                  setUxEdges={setUxEdges}
                  uxZones={uxZones}
                  setUxZones={setUxZones}
                  erdTables={erdTables}
                  setErdTables={setErdTables}
                  erdRelations={erdRelations}
                  setErdRelations={setErdRelations}
                  erdZones={erdZones}
                  setErdZones={setErdZones}
                  archNodes={archNodes}
                  setArchNodes={setArchNodes}
                  archEdges={archEdges}
                  setArchEdges={setArchEdges}
                  archZones={archZones}
                  setArchZones={setArchZones}
                  onSendCanvasUpdateToChat={(summary) => appendUserAndAiMessage(summary)}
                  theme={theme}
                  onCollapsePane={toggleArtifactPane}
                  onConfirmStep={handleConfirmStep}
                  isConfirmed={activeStepInfo.status === 'COMPLETED'}
                />
              )}

              {/* Step 08: 기술 스택 선정 정의서 (ADR) */}
              {currentStep === 'step8' && (
                <AdrDecisionView
                  decisions={adrDecisions}
                  setDecisions={setAdrDecisions}
                  onConfirmStep={handleConfirmStep}
                  onCollapsePane={toggleArtifactPane}
                  isConfirmed={activeStepInfo.status === 'COMPLETED'}
                />
              )}

              {/* Step 11: 개발 컨벤션 정의서 */}
              {currentStep === 'step11' && (
                <ConventionDocView
                  conventions={devConventions}
                  setConventions={setDevConventions}
                  onConfirmStep={handleConfirmStep}
                  onCollapsePane={toggleArtifactPane}
                  isConfirmed={activeStepInfo.status === 'COMPLETED'}
                />
              )}

              {/* Step 12: 백엔드 API 명세서 */}
              {currentStep === 'step12' && (
                <ApiSpecificationView
                  endpoints={apiEndpoints}
                  setEndpoints={setApiEndpoints}
                  onConfirmStep={handleConfirmStep}
                  onCollapsePane={toggleArtifactPane}
                  isConfirmed={activeStepInfo.status === 'COMPLETED'}
                />
              )}

              {/* Step 13: WBS 및 일정 칸반 보드 (+ 태스크별 AI 코딩 지시서 모달) */}
              {currentStep === 'step13' && (
                <KanbanBoardView
                  tasks={kanbanTasks}
                  setTasks={setKanbanTasks}
                  onCollapsePane={toggleArtifactPane}
                  onConfirmStep={handleConfirmStep}
                  isConfirmed={activeStepInfo.status === 'COMPLETED'}
                />
              )}

              {/* Step 14: 테스트 케이스 & QA */}
              {currentStep === 'step14' && (
                <QaTestingView
                  testCases={qaTestCases}
                  setTestCases={setQaTestCases}
                  loadMetrics={loadTestMetrics}
                  onConfirmStep={handleConfirmStep}
                  onCollapsePane={toggleArtifactPane}
                  isConfirmed={activeStepInfo.status === 'COMPLETED'}
                />
              )}

              {/* Step 15: 배포 이력 & 릴리즈 노트 */}
              {currentStep === 'step15' && (
                <ReleaseHistoryView
                  deployments={deployments}
                  setDeployments={setDeployments}
                  onConfirmStep={handleConfirmStep}
                  onCollapsePane={toggleArtifactPane}
                  isConfirmed={activeStepInfo.status === 'COMPLETED'}
                />
              )}

              {/* Step 16: 트러블슈팅 아카이빙 */}
              {currentStep === 'step16' && (
                <TroubleshootingArchiveView
                  items={troubleshootings}
                  setItems={setTroubleshootings}
                  onConfirmStep={handleConfirmStep}
                  onCollapsePane={toggleArtifactPane}
                  isConfirmed={activeStepInfo.status === 'COMPLETED'}
                />
              )}
            </main>

            {/* ======================================================== */}
            {/* D-RAIL. COLLAPSED RIGHT ARTIFACT RAIL (Desktop >= 1024px) */}
            {/* ======================================================== */}
            {isArtifactCollapsed && (
              <div
                aria-label="접힌 산출물 문서 영역 바"
                onClick={toggleArtifactPane}
                title={`클릭하여 ${activeStepInfo.shortTitle} 산출물 뷰어 펼치기`}
                className="hidden lg:flex w-11 bg-surface border-l border-line flex-col items-center justify-between py-2.5 shrink-0 cursor-pointer hover:bg-well transition-colors select-none"
              >
                <div className="flex flex-col items-center gap-3">
                  <button
                    type="button"
                    aria-label="문서 영역 펼치기"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleArtifactPane();
                    }}
                    className="w-8 h-8 rounded-lg bg-well hover:bg-control text-ink flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <PanelRightOpen className="w-4 h-4 text-accent" />
                  </button>

                  <span className="text-xs font-medium text-muted [writing-mode:vertical-rl] py-1">
                    {activeStepInfo.shortTitle} 산출물 뷰어
                  </span>
                </div>

                <FileText className="w-3.5 h-3.5 text-muted" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODALS: ACCOUNT CLAIM & RBAC INVITE */}
      {/* ============================================================== */}
      <WorkspaceModals
        isClaimModalOpen={isClaimModalOpen}
        setIsClaimModalOpen={setIsClaimModalOpen}
        isAccountClaimed={isAccountClaimed}
        onClaimSuccess={(email) => {
          setIsAccountClaimed(true);
          setClaimedEmail(email);
        }}
        isInviteModalOpen={isInviteModalOpen}
        setIsInviteModalOpen={setIsInviteModalOpen}
        members={members}
        setMembers={setMembers}
      />

      {/* ============================================================== */}
      {/* WORKSPACE SETTINGS MODAL */}
      {/* ============================================================== */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        projectIdea={projectIdea}
        onUpdateProjectName={(name) => {
          setProjectIdea(name);
          showAppToast(`프로젝트명이 '${name}'(으)로 변경되었습니다`);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        isLeftCollapsed={isLeftCollapsed}
        toggleLeftPane={toggleLeftPane}
        isChatCollapsed={isChatCollapsed}
        toggleChatPane={toggleChatPane}
        isArtifactCollapsed={isArtifactCollapsed}
        toggleArtifactPane={toggleArtifactPane}
        isLayoutCustomized={isLayoutCustomized}
        resetWorkspaceLayout={resetWorkspaceLayout}
        pipelineTrack={pipelineTrack}
        setPipelineTrack={(t) => {
          setPipelineTrack(t);
          if (t === 'startup') {
            setEnabledSteps({ ...TRACK_PRESET_STEPS.startup });
          } else if (t === 'backend') {
            setEnabledSteps({ ...TRACK_PRESET_STEPS.backend });
          } else if (t === 'fullstack') {
            setEnabledSteps({ ...TRACK_PRESET_STEPS.fullstack });
          }
          const trackLabel =
            t === 'startup'
              ? '비개발자/창업가 트랙'
              : t === 'backend'
              ? '백엔드 포트폴리오 트랙'
              : t === 'fullstack'
              ? '풀스택 전문가 트랙'
              : '커스텀 트랙';
          showAppToast(`파이프라인이 ${trackLabel}으로 변경되었습니다`);
        }}
        enabledSteps={enabledSteps}
        pipelineSteps={pipelineSteps}
        serviceDomain={serviceDomain}
        setServiceDomain={(d) => {
          setServiceDomain(d);
          showAppToast(`서비스 도메인이 ${d.toUpperCase()} 스택으로 설정되었습니다`);
        }}
        onToggleStep={handleToggleStep}
        guestTimer={guestTimer}
        isAccountClaimed={isAccountClaimed}
        claimedEmail={claimedEmail}
        onOpenClaimModal={() => setIsClaimModalOpen(true)}
        members={members}
        onOpenInviteModal={() => setIsInviteModalOpen(true)}
      />
    </div>
  );
}
