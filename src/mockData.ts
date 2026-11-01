// =====================================================================
// GROOM WORKSPACE - 5 PHASES / 16 INDEPENDENT MODULES DATA SYSTEM
// =====================================================================

export type StepId =
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'
  | 'step6'
  | 'step7'
  | 'step8'
  | 'step9'
  | 'step10'
  | 'step11'
  | 'step12'
  | 'step13'
  | 'step14'
  | 'step15'
  | 'step16';

export type PhaseId =
  | 'planning'
  | 'design_spec'
  | 'architecture'
  | 'development'
  | 'ops_maint';

export type PipelineTrack = 'startup' | 'backend' | 'fullstack' | 'custom';
export type ViewMode = 'landing' | 'workspace';
export type StepStatus = 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED';
export type ServiceDomain = 'web' | 'mobile' | 'ai' | 'game';

export const ALL_STEP_IDS: StepId[] = [
  'step1',
  'step2',
  'step3',
  'step4',
  'step5',
  'step6',
  'step7',
  'step8',
  'step9',
  'step10',
  'step11',
  'step12',
  'step13',
  'step14',
  'step15',
  'step16'
];

export interface PhaseInfo {
  id: PhaseId;
  number: number;
  title: string;
  titleEn: string;
  subtitle: string;
  stepIds: StepId[];
}

export const PIPELINE_PHASES: PhaseInfo[] = [
  {
    id: 'planning',
    number: 1,
    title: 'Phase 1. 기획 및 비즈니스',
    titleEn: 'Planning & Business',
    subtitle: '서비스 정의, 수익 모델, 예산 산정 및 아이디어 백로그',
    stepIds: ['step1', 'step2', 'step3', 'step4']
  },
  {
    id: 'design_spec',
    number: 2,
    title: 'Phase 2. UI/UX 및 요구사항',
    titleEn: 'Design & Spec',
    subtitle: 'PRD 명세, 브랜딩 디자인 시스템, 화면 흐름 & 라우팅',
    stepIds: ['step5', 'step6', 'step7']
  },
  {
    id: 'architecture',
    number: 3,
    title: 'Phase 3. 시스템 아키텍처 설계',
    titleEn: 'Architecture & Modeling',
    subtitle: '기술 선정 정의서(ADR), 데이터베이스 ERD, 토폴로지 구성도',
    stepIds: ['step8', 'step9', 'step10']
  },
  {
    id: 'development',
    number: 4,
    title: 'Phase 4. 개발 및 일정 관리',
    titleEn: 'Development & Sprint',
    subtitle: '개발 컨벤션, REST API 명세서, WBS 칸반 & AI 코딩 지시서',
    stepIds: ['step11', 'step12', 'step13']
  },
  {
    id: 'ops_maint',
    number: 5,
    title: 'Phase 5. 테스트 및 운영',
    titleEn: 'Ops & Maintenance',
    subtitle: 'QA 테스트케이스, 배포 릴리즈 타임라인, 트러블슈팅 아카이빙',
    stepIds: ['step14', 'step15', 'step16']
  }
];

// =====================================================================
// 4 PIPELINE TRACK PRESETS
// =====================================================================
export const TRACK_PRESET_STEPS: Record<
  'startup' | 'backend' | 'fullstack',
  Record<StepId, boolean>
> = {
  // 1. 비개발자/창업가 트랙 (8개 활성)
  startup: {
    step1: true,
    step2: true,
    step3: true,
    step4: false,
    step5: true,
    step6: true,
    step7: true,
    step8: false,
    step9: false,
    step10: false,
    step11: false,
    step12: false,
    step13: true,
    step14: true,
    step15: false,
    step16: false
  },
  // 2. 백엔드 포트폴리오 트랙 (11개 활성)
  backend: {
    step1: true,
    step2: false,
    step3: false,
    step4: false,
    step5: true,
    step6: false,
    step7: false,
    step8: true,
    step9: true,
    step10: true,
    step11: true,
    step12: true,
    step13: true,
    step14: true,
    step15: true,
    step16: true
  },
  // 3. 풀스택 전문가 트랙 (16개 전체 활성 - 기본값)
  fullstack: {
    step1: true,
    step2: true,
    step3: true,
    step4: true,
    step5: true,
    step6: true,
    step7: true,
    step8: true,
    step9: true,
    step10: true,
    step11: true,
    step12: true,
    step13: true,
    step14: true,
    step15: true,
    step16: true
  }
};

export interface PipelineStepInfo {
  id: StepId;
  number: number;
  phaseId: PhaseId;
  title: string;
  shortTitle: string;
  subtitle: string;
  deliverable: string;
  personaName: string;
  personaRole: string;
  modelTier: string;
  status: StepStatus;
  lastUpdated: string;
}

export const INITIAL_PIPELINE_STEPS: PipelineStepInfo[] = [
  // Phase 1
  {
    id: 'step1',
    number: 1,
    phaseId: 'planning',
    title: '01. 서비스 개요 및 기획서',
    shortTitle: '서비스 개요',
    subtitle: '핵심 문제 정의, 타겟 고객, 문제 해결 방안',
    deliverable: '01_SERVICE_OVERVIEW.md',
    personaName: 'Product Strategist AI',
    personaRole: '비즈니스 전략 디렉터',
    modelTier: 'GPT-4o-mini',
    status: 'COMPLETED',
    lastUpdated: '15분 전 확정'
  },
  {
    id: 'step2',
    number: 2,
    phaseId: 'planning',
    title: '02. 비즈니스 모델 (BM)',
    shortTitle: '비즈니스 모델 (BM)',
    subtitle: '수익 구조, 가격 정책, 양면 시장 수수료 설계',
    deliverable: '02_BUSINESS_MODEL.md',
    personaName: 'Monetization Architect',
    personaRole: 'BM & 가격 정책 전략가',
    modelTier: 'GPT-4o',
    status: 'COMPLETED',
    lastUpdated: '18분 전 확정'
  },
  {
    id: 'step3',
    number: 3,
    phaseId: 'planning',
    title: '03. 비용 및 예산 산정서',
    shortTitle: '비용 및 예산',
    subtitle: '클라우드 인프라, AI API, SaaS 구독료 월간 계산',
    deliverable: '03_BUDGET_ESTIMATION.xlsx',
    personaName: 'FinOps Specialist',
    personaRole: '클라우드 재무 엔지니어',
    modelTier: 'GPT-4o-mini',
    status: 'IN_PROGRESS',
    lastUpdated: '10분 전 갱신'
  },
  {
    id: 'step4',
    number: 4,
    phaseId: 'planning',
    title: '04. 아이디어 백로그',
    shortTitle: '아이디어 백로그',
    subtitle: '기능 아이디어 큐, 우선순위 태그 및 칸반 이관',
    deliverable: '04_IDEA_BACKLOG.csv',
    personaName: 'Ideation Coach',
    personaRole: '제품 인큐베이터',
    modelTier: 'GPT-4o-mini',
    status: 'IN_PROGRESS',
    lastUpdated: '방금 동기화됨'
  },
  // Phase 2
  {
    id: 'step5',
    number: 5,
    phaseId: 'design_spec',
    title: '05. 요구사항 및 제약사항 (PRD)',
    shortTitle: '요구사항 (PRD)',
    subtitle: '기능/비기능 요구사항, 제약조건 및 인수 기준',
    deliverable: '05_PRD_SPECIFICATION.md',
    personaName: 'Lead PM Copilot',
    personaRole: '수석 테크니컬 PM',
    modelTier: 'Claude 3.5 Sonnet',
    status: 'COMPLETED',
    lastUpdated: '12분 전 확정'
  },
  {
    id: 'step6',
    number: 6,
    phaseId: 'design_spec',
    title: '06. 브랜딩 & 디자인 시스템',
    shortTitle: '브랜딩 & 디자인',
    subtitle: '로고 심볼, 슬로건, 컬러 스와치, 타이포그래피',
    deliverable: '06_DESIGN_SYSTEM.tokens',
    personaName: 'Design System Lead',
    personaRole: '비주얼 디자인 아키텍트',
    modelTier: 'Claude 3.5 Sonnet',
    status: 'IN_PROGRESS',
    lastUpdated: '방금 동기화됨'
  },
  {
    id: 'step7',
    number: 7,
    phaseId: 'design_spec',
    title: '07. 화면 흐름도 & 프론트 라우팅',
    shortTitle: '화면 흐름 & 라우팅',
    subtitle: '캔버스 플로우, IA 라우팅 테이블, 노드 인스펙터',
    deliverable: '07_UI_SCREEN_FLOW.canvas',
    personaName: 'Principal UX Architect',
    personaRole: '수석 인터랙션 디자이너',
    modelTier: 'Claude 3.5 Sonnet',
    status: 'COMPLETED',
    lastUpdated: '8분 전 확정'
  },
  // Phase 3
  {
    id: 'step8',
    number: 8,
    phaseId: 'architecture',
    title: '08. 기술 스택 선정 정의서 (ADR)',
    shortTitle: '기술 선정 (ADR)',
    subtitle: '아키텍처 의사결정 기록, 대안 기술 비교 및 채택 근거',
    deliverable: '08_ADR_DECISIONS.md',
    personaName: 'Enterprise Architect',
    personaRole: '수석 기술 아키텍트',
    modelTier: 'Claude 3.5 Sonnet',
    status: 'IN_PROGRESS',
    lastUpdated: '20분 전 갱신'
  },
  {
    id: 'step9',
    number: 9,
    phaseId: 'architecture',
    title: '09. 데이터베이스 설계 (ERD)',
    shortTitle: '데이터베이스 (ERD)',
    subtitle: '테이블 관계선, PK/FK 제약조건, PostgreSQL DDL',
    deliverable: '09_SCHEMA_POSTGRESQL.sql',
    personaName: 'Principal DB Architect',
    personaRole: '데이터베이스 아키텍트',
    modelTier: 'Claude 3.5 Sonnet',
    status: 'IN_PROGRESS',
    lastUpdated: '방금 동기화됨'
  },
  {
    id: 'step10',
    number: 10,
    phaseId: 'architecture',
    title: '10. 시스템 아키텍처 구성도',
    shortTitle: '시스템 아키텍처',
    subtitle: 'VPC 서브넷, Spring, DB, Cache, SSE 토폴로지',
    deliverable: '10_SYSTEM_TOPOLOGY.tf',
    personaName: 'Cloud Infra Architect',
    personaRole: '클라우드 인프라 아키텍트',
    modelTier: 'GPT-4o',
    status: 'IN_PROGRESS',
    lastUpdated: '5분 전 편집됨'
  },
  // Phase 4
  {
    id: 'step11',
    number: 11,
    phaseId: 'development',
    title: '11. 개발 컨벤션 정의서',
    shortTitle: '개발 컨벤션',
    subtitle: 'Git 브랜치 전략, 커밋 메시지 규칙, 디렉토리 구조',
    deliverable: '11_DEV_CONVENTIONS.md',
    personaName: 'Engineering Standards Lead',
    personaRole: '개발 문화 & 컨벤션 리드',
    modelTier: 'GPT-4o-mini',
    status: 'IN_PROGRESS',
    lastUpdated: '방금 생성됨'
  },
  {
    id: 'step12',
    number: 12,
    phaseId: 'development',
    title: '12. 백엔드 API 명세서',
    shortTitle: '백엔드 API 명세',
    subtitle: 'REST 엔드포인트, JSON 스키마, RFC 7807 에러 규격',
    deliverable: '12_OPENAPI_SPEC.json',
    personaName: 'Staff API & DX Lead',
    personaRole: '수석 백엔드 API 리드',
    modelTier: 'Claude 3.5 Sonnet',
    status: 'IN_PROGRESS',
    lastUpdated: '방금 동기화됨'
  },
  {
    id: 'step13',
    number: 13,
    phaseId: 'development',
    title: '13. WBS 및 일정 칸반 보드',
    shortTitle: 'WBS & 칸반 보드',
    subtitle: '스프린트 백로그, 작업 티켓, AI 코딩 지시서 생성',
    deliverable: '13_WBS_SPRINT_BOARD.kanban',
    personaName: 'Agile Delivery Lead',
    personaRole: '스크럼 마스터 & 딜리버리 리드',
    modelTier: 'GPT-4o-mini',
    status: 'IN_PROGRESS',
    lastUpdated: '3분 전 갱신됨'
  },
  // Phase 5
  {
    id: 'step14',
    number: 14,
    phaseId: 'ops_maint',
    title: '14. 테스트 케이스 & QA',
    shortTitle: '테스트 & QA',
    subtitle: '기능 체크리스트, 예외 동작 검증, k6 부하 테스트 지표',
    deliverable: '14_QA_TEST_CASES.spec',
    personaName: 'QA Automation Lead',
    personaRole: '품질 보증 & 부하 테스트 엔지니어',
    modelTier: 'Claude 3.5 Sonnet',
    status: 'IN_PROGRESS',
    lastUpdated: '방금 갱신됨'
  },
  {
    id: 'step15',
    number: 15,
    phaseId: 'ops_maint',
    title: '15. 배포 이력 & 릴리즈 노트',
    shortTitle: '배포 & 릴리즈',
    subtitle: '운영 버전 상태, 변경 사항 타임라인, 롤백 런북',
    deliverable: '15_RELEASE_HISTORY.log',
    personaName: 'SRE & Release Copilot',
    personaRole: '릴리즈 매니저',
    modelTier: 'GPT-4o',
    status: 'IN_PROGRESS',
    lastUpdated: 'v1.5.0 운영 중'
  },
  {
    id: 'step16',
    number: 16,
    phaseId: 'ops_maint',
    title: '16. 트러블슈팅 아카이빙',
    shortTitle: '트러블슈팅 일지',
    subtitle: '병목 원인 분석, 해결 과정, Before/After 정량 지표',
    deliverable: '16_TROUBLESHOOTING.archive',
    personaName: 'Performance Tuning SRE',
    personaRole: '시스템 성능 최적화 리드',
    modelTier: 'GPT-4o',
    status: 'IN_PROGRESS',
    lastUpdated: '1시간 전 기록'
  }
];

// =====================================================================
// STEP 03: BUDGET & COST ESTIMATION TYPES
// =====================================================================
export interface BudgetItem {
  id: string;
  category: '인프라/클라우드' | 'AI 및 모델 API' | '서드파티 및 SaaS' | '도메인 및 SSL';
  name: string;
  itemName?: string;
  provider?: string;
  tierSpec?: string;
  monthlyCostUsd: number;
  monthlyCostKrw: number;
  estimatedCostKrw?: number;
  billingCycle: '월간 결제' | '연간 선납' | '사용량 비례';
  notes?: string;
  description?: string;
}

export const INITIAL_BUDGET_ITEMS: BudgetItem[] = [
  {
    id: 'b1',
    category: '인프라/클라우드',
    name: 'AWS EC2 Web/API 서버',
    tierSpec: 't4g.small (2 vCPU, 2GB RAM, Seoul)',
    monthlyCostUsd: 14.6,
    monthlyCostKrw: 19500,
    billingCycle: '월간 결제',
    notes: 'Spring Boot 3 컨테이너 구동, 기본 트래픽 처리'
  },
  {
    id: 'b2',
    category: '인프라/클라우드',
    name: 'AWS RDS PostgreSQL',
    tierSpec: 'db.t4g.micro (2 vCPU, 1GB RAM, 20GB GP3)',
    monthlyCostUsd: 18.2,
    monthlyCostKrw: 24500,
    billingCycle: '월간 결제',
    notes: '트랜잭션 데이터 저장 및 자동 백업(7일)'
  },
  {
    id: 'b3',
    category: '인프라/클라우드',
    name: 'AWS ElastiCache Redis',
    tierSpec: 'cache.t4g.micro (Single-AZ, 0.5GB)',
    monthlyCostUsd: 13.0,
    monthlyCostKrw: 17500,
    billingCycle: '월간 결제',
    notes: '실시간 재고 차감 및 세션 캐싱 (V1.5)'
  },
  {
    id: 'b4',
    category: 'AI 및 모델 API',
    name: 'OpenAI gpt-4o-mini',
    tierSpec: '월 약 500만 토큰 예상 (입력/출력 혼합)',
    monthlyCostUsd: 2.5,
    monthlyCostKrw: 3350,
    billingCycle: '사용량 비례',
    notes: '빵 품목 자동 분류 및 기획 템플릿 생성'
  },
  {
    id: 'b5',
    category: '서드파티 및 SaaS',
    name: 'Supabase Auth & Storage',
    tierSpec: 'Free Tier (MAU 50,000 / Storage 1GB)',
    monthlyCostUsd: 0.0,
    monthlyCostKrw: 0,
    billingCycle: '월간 결제',
    notes: '초기 MVP 무료 티어 활용'
  },
  {
    id: 'b6',
    category: '서드파티 및 SaaS',
    name: '카카오 비즈니스 알림톡 / SMS',
    tierSpec: '월 1,000건 발송 기준 (건당 8.5원)',
    monthlyCostUsd: 6.5,
    monthlyCostKrw: 8500,
    billingCycle: '사용량 비례',
    notes: '픽업 30분 전 알림톡 송신'
  },
  {
    id: 'b7',
    category: '도메인 및 SSL',
    name: 'Route 53 & 도메인 등록',
    tierSpec: 'groom.shop 도메인 + 호스팅 영역 1개',
    monthlyCostUsd: 1.5,
    monthlyCostKrw: 2000,
    billingCycle: '연간 선납',
    notes: '연 15달러 수준의 도메인 유지비'
  }
];

// =====================================================================
// STEP 04: IDEA BACKLOG TYPES
// =====================================================================
export interface BacklogIdeaItem {
  id: string;
  title: string;
  category: '기능 확장' | 'UX 개선' | '수익화' | '기술 부채' | string;
  description: string;
  priority: 'P0' | 'P1' | 'P2';
  suggestedBy?: string;
  suggestedAt?: string;
  votes?: number;
  status: 'backlog' | 'transferred_to_wbs' | 'wbs_converted' | 'idea';
  targetRelease?: string;
  sentTicketKey?: string;
  effort?: string;
  impact?: string;
}

export const INITIAL_IDEA_BACKLOG: BacklogIdeaItem[] = [
  {
    id: 'idea-1',
    title: '동네 빵집 단골 스탬프 & 쿠폰 자동 적립',
    category: '수익화',
    description:
      '5회 이상 마감 할인 픽업 완료 시 다음 예약 10% 추가 할인 쿠폰을 자동 발급하여 재구매율 증대.',
    priority: 'P1',
    suggestedBy: 'Product Strategist AI',
    votes: 14,
    status: 'backlog',
    targetRelease: 'v2.0'
  },
  {
    id: 'idea-2',
    title: '배달 대행(부릉/바로고) API 연동 퀵 배송 옵션',
    category: '기능 확장',
    description:
      '픽업 방문이 어려운 1인 가구를 위해 마감 30분 전 근거리 라이더 퀵 배송 모드 선택 기능 제공.',
    priority: 'P2',
    suggestedBy: 'Agile Delivery Lead',
    votes: 8,
    status: 'backlog',
    targetRelease: 'v2.1'
  },
  {
    id: 'idea-3',
    title: '점주 전용 POS 연동 재고 자동 바코드 스캔',
    category: 'UX 개선',
    description:
      '점주가 모바일로 일일이 품목을 입력하지 않고 POS 바코드 스캔 시 마감 할인 즉시 반영.',
    priority: 'P0',
    suggestedBy: 'Principal UX Architect',
    votes: 22,
    status: 'transferred_to_wbs',
    targetRelease: 'v1.6',
    sentTicketKey: 'GROOM-42'
  },
  {
    id: 'idea-4',
    title: '비건/글루텐프리 빵 알레르기 필터링 및 선호 알림',
    category: '기능 확장',
    description:
      '특정 원재료 알레르기가 있는 유저에게 해당 성분이 배제된 빵이 마감 할인으로 등록되면 즉시 푸시.',
    priority: 'P1',
    suggestedBy: 'Lead PM Copilot',
    votes: 19,
    status: 'backlog',
    targetRelease: 'v1.6'
  }
];

// =====================================================================
// STEP 06: BRANDING & DESIGN SYSTEM TYPES
// =====================================================================
export interface ColorSwatch {
  name: string;
  role: string;
  hex: string;
  oklch: string;
  isDark?: boolean;
}

export interface BrandingInfo {
  serviceName: string;
  brandName?: string;
  slogan: string;
  brandStory: string;
  symbolMeaning: string;
  logoSymbolSvg?: string;
  designPrinciples?: Array<{ title: string; desc: string }>;
  colorSwatches?: Array<{ name: string; role: string; hex: string }>;
  primaryColors: ColorSwatch[];
  neutralColors: ColorSwatch[];
  semanticColors: ColorSwatch[];
  typographyScale: Array<{
    level: string;
    size: string;
    weight: string;
    lineHeight: string;
    usage: string;
  }>;
}

export const INITIAL_BRANDING_INFO: BrandingInfo = {
  serviceName: 'Groom (그룸)',
  brandName: 'Groom (그룸)',
  slogan: '한 줄의 서비스 아이디어를 여덟 단계의 표준 라이프사이클로.',
  brandStory:
    'Groom은 구름(Cloud)처럼 가볍게 시작하여 단단한 엔지니어링 표준으로 완성해 나가는 디지털 제품 빌더입니다. 아이디어 기획부터 인프라 토폴로지, 코딩 프롬프트까지 유기적으로 이어지는 워크스페이스를 지향합니다.',
  symbolMeaning:
    '구름(Cloud) 외곽선 내부에 배치된 서킷 노드는 소프트웨어 아키텍처와 엔지니어링 파이프라인의 연결성을 상징합니다.',
  logoSymbolSvg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 36C8 36 4 32 4 27C4 22.5 7.5 19 12 18.5C13.5 11 20 6 28 6C36.5 6 43.5 12.5 44 21C46.5 22.5 48 25.5 48 29C48 33.5 44.5 36 40 36H12Z" stroke="#0071E3" stroke-width="3" stroke-linejoin="round"/><circle cx="28" cy="24" r="3" fill="#0071E3"/><circle cx="36" cy="30" r="3" fill="#0071E3"/><path d="M18 36L28 24M28 24H36" stroke="#0071E3" stroke-width="3"/></svg>`,
  designPrinciples: [
    { title: 'Calm & Functional', desc: '불필요한 애니메이션과 그라디언트를 배제하고 정보의 전달력에 집중합니다.' },
    { title: 'Subtle Contrast', desc: 'WCAG AAA 규격을 준수하는 고대비 모노톤과 선명한 Electric Blue 악센트를 사용합니다.' },
    { title: 'Systematic Grid', desc: '8px 베이스라인 그리드와 정밀한 레이아웃 규칙을 엄격히 적용합니다.' }
  ],
  colorSwatches: [
    { name: 'Electric Blue', role: 'Accent', hex: '#0071E3' },
    { name: 'Canvas Dark', role: 'Background', hex: '#0f1117' },
    { name: 'Surface Well', role: 'Surface', hex: '#181a20' },
    { name: 'Ink White', role: 'Typography', hex: '#f0f2f5' }
  ],
  primaryColors: [
    {
      name: 'Electric Blue',
      role: 'Primary Brand / Signal Accent',
      hex: '#0071E3',
      oklch: 'oklch(51% 0.19 255)'
    },
    {
      name: 'Deep Blue',
      role: 'Primary Hover & Deep Signal',
      hex: '#0058B6',
      oklch: 'oklch(45% 0.19 255)'
    },
    {
      name: 'Soft Tint Blue',
      role: 'Selection / Chip Background',
      hex: '#EBF4FF',
      oklch: 'oklch(51% 0.19 255 / 0.12)'
    }
  ],
  neutralColors: [
    {
      name: 'Paper White',
      role: 'Light Background',
      hex: '#F8F9FA',
      oklch: 'oklch(96.8% 0.005 260)'
    },
    {
      name: 'Titanium Dark',
      role: 'Dark Canvas Background',
      hex: '#0E1015',
      oklch: 'oklch(15.5% 0.008 260)',
      isDark: true
    },
    {
      name: 'Surface Slate',
      role: 'Dark Card / Surface',
      hex: '#161922',
      oklch: 'oklch(21.5% 0.01 260)',
      isDark: true
    },
    {
      name: 'Ink Charcoal',
      role: 'Primary Text',
      hex: '#1D2129',
      oklch: 'oklch(21% 0.008 260)'
    }
  ],
  semanticColors: [
    {
      name: 'Emerald Green',
      role: 'Success / Completed Step',
      hex: '#34C759',
      oklch: 'oklch(52% 0.15 152)'
    },
    {
      name: 'Amber Yellow',
      role: 'Warning / Review Needed',
      hex: '#FF9500',
      oklch: 'oklch(56% 0.15 65)'
    },
    {
      name: 'Crimson Red',
      role: 'Critical / P0 Priority',
      hex: '#FF3B30',
      oklch: 'oklch(53% 0.20 25)'
    }
  ],
  typographyScale: [
    {
      level: 'Display Hero',
      size: '40px (2.5rem)',
      weight: '800 (ExtraBold)',
      lineHeight: '1.15',
      usage: '랜딩 메인 타이틀 및 핵심 캐치프레이즈'
    },
    {
      level: 'Heading 1',
      size: '22px (1.375rem)',
      weight: '700 (Bold)',
      lineHeight: '1.3',
      usage: '모듈 페이지 타이틀 및 메인 다이얼로그 헤더'
    },
    {
      level: 'Heading 2',
      size: '16px (1.0rem)',
      weight: '600 (SemiBold)',
      lineHeight: '1.4',
      usage: '섹션 서브타이틀 및 카드 헤더'
    },
    {
      level: 'Body Text',
      size: '13px (0.8125rem)',
      weight: '400 (Regular) / 500 (Medium)',
      lineHeight: '1.6',
      usage: '본문 텍스트, 설명 문구, 테이블 셀 데이터'
    },
    {
      level: 'Caption / Badge',
      size: '11px (0.6875rem)',
      weight: '600 (SemiBold)',
      lineHeight: '1.4',
      usage: '배지 라벨, 메타 정보, 툴팁, 날짜'
    },
    {
      level: 'Code / Mono',
      size: '12px (0.75rem)',
      weight: '500 (Medium)',
      lineHeight: '1.5',
      usage: 'API 경로, SQL 쿼리, DDL, Git 커밋 해시 (JetBrains Mono)'
    }
  ]
};

// =====================================================================
// STEP 07: UI/UX SCREEN FLOW & FRONTEND ROUTING TYPES
// =====================================================================
export type PortSide = 'top' | 'right' | 'bottom' | 'left';

export interface UxScreenNode {
  id: string;
  name: string;
  route: string;
  screenType: 'Page' | 'Modal' | 'Workspace' | 'Drawer';
  authLevel: 'Public' | 'Guest' | 'Member';
  auth?: 'Public' | 'Guest' | 'Member';
  summary: string;
  subComponents: string[];
  keyElements?: string[];
  uxMetric?: string;
  stateQueryParams: string[];
  backendApiEndpoint: string;
  nextRouteActions: Array<{
    label: string;
    targetRoute: string;
    action?: string;
  }>;
  x: number;
  y: number;
}

export interface UxFlowEdge {
  id: string;
  source: string;
  target: string;
  sourcePort?: PortSide;
  targetPort?: PortSide;
  triggerLabel: string;
  guardCondition: string;
}

export interface CanvasZone {
  id: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tone: 'neutral' | 'accent' | 'ok' | 'warn';
}

// =====================================================================
// STEP 08: ARCHITECTURE DECISION RECORDS (ADR)
// =====================================================================
export interface AdrAlternative {
  tech: string;
  pros: string;
  cons: string;
  decisionReason: string;
  whyNotChosen?: string;
}

export interface AdrDecision {
  id: string;
  adrNumber: number;
  title: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Infra';
  selectedTech: string;
  chosenTech?: string;
  status: 'Accepted' | 'Proposed';
  decisionDate: string;
  decidedAt?: string;
  context: string;
  rationale?: string;
  alternatives: AdrAlternative[];
  consequences: string | string[];
}

export const INITIAL_ADR_DECISIONS: AdrDecision[] = [
  {
    id: 'adr-1',
    adrNumber: 1,
    title: 'MVP 초기 데이터베이스 단일화: PostgreSQL 선정',
    category: 'Database',
    selectedTech: 'PostgreSQL 16 (JSONB + pg_trgm)',
    status: 'Accepted',
    decisionDate: '2026-10-24',
    context:
      '초기 개발 단계에서 NoSQL(MongoDB)과 RDBMS를 혼용하면 트랜잭션 보장과 인프라 비용 부담이 가중됨. 마감 할인과 예약 주문 간의 ACID 트랜잭션 무결성을 최우선으로 확보해야 함.',
    alternatives: [
      {
        tech: 'PostgreSQL 16',
        pros: 'JSONB 지원으로 비정형 캔버스 노드 저장 가능, 강력한 ACID 트랜잭션, 낙관적 락 지원',
        cons: '대규모 분산 클러스터 구성 시 운영 난이도 존재',
        decisionReason: '정형 관계 데이터와 비정형 JSON 아티팩트를 단일 엔진에서 완벽히 수용 가능'
      },
      {
        tech: 'MongoDB 7.0',
        pros: '유연한 도큐먼트 스키마, 빠른 수평 샤딩 확장',
        cons: '다중 테이블 조인 및 복합 트랜잭션 시 정합성 유지 비용 증가',
        decisionReason: '재고 차감 및 주문 정산의 절대적 정합성 요구에 부적합하여 탈락'
      }
    ],
    consequences:
      '초기 아키텍처가 단순화되어 인프라 월 비용을 18달러 선으로 절감함. 추후 읽기 트래픽 폭증 시 Read Replica를 도입하기로 결정.'
  },
  {
    id: 'adr-2',
    adrNumber: 2,
    title: '동시성 제어 전략: 비관적 락 대신 낙관적 락(Optimistic Lock) 도입',
    category: 'Backend',
    selectedTech: 'JPA @Version 컬럼 기반 Optimistic Lock',
    status: 'Accepted',
    decisionDate: '2026-10-26',
    context:
      '마감 할인 빵의 잔여 수량이 1~2개 남았을 때 여러 사용자가 동시에 결제 버튼을 누르면 DB Lock 경합이 발생할 수 있음.',
    alternatives: [
      {
        tech: '낙관적 락 (Optimistic Lock)',
        pros: 'DB 커넥션 점유 시간이 짧고 데드락 위험이 전혀 없음. 실패 시 재시도 모달로 부드럽게 안내',
        cons: '충돌 빈도가 극도로 높을 때 재시도 비용 증가',
        decisionReason: '일반적인 동네 빵집 마감 트래픽(동시 10~50명)에서 최고 효율을 냄'
      },
      {
        tech: '비관적 락 (Pessimistic Lock: SELECT FOR UPDATE)',
        pros: '충돌 시 즉시 블로킹되어 재시도 로직 불필요',
        cons: '트랜잭션 지연 시 DB 커넥션 풀(HikariCP) 고갈 위험',
        decisionReason: '병목 위험이 높아 초기 MVP에서는 배제'
      }
    ],
    consequences:
      '재고 마이너스 버그 0% 달성. 충돌 발생 시 프론트엔드에 `409 Conflict`와 함께 "이미 다른 분이 먼저 예약했습니다" 모달을 띄워 UX 충격 최소화.'
  },
  {
    id: 'adr-3',
    adrNumber: 3,
    title: '실시간 알림 및 상태 변경 스트리밍: SSE (Server-Sent Events) 채택',
    category: 'Backend',
    selectedTech: 'HTTP/2 Server-Sent Events (Spring SseEmitter)',
    status: 'Accepted',
    decisionDate: '2026-10-27',
    context:
      '점주의 마감 상품 등록 및 구매자의 픽업 예약 상태 변경을 클라이언트에 실시간으로 푸시해야 함.',
    alternatives: [
      {
        tech: 'Server-Sent Events (SSE)',
        pros: '단방향 푸시에 최적화, 표준 HTTP 기반으로 프록시/Nginx 방화벽 호환성 탁월, 가벼움',
        cons: '클라이언트에서 서버로의 실시간 양방향 전송은 별도 HTTP POST 필요',
        decisionReason: '알림 수신은 서버 ➔ 클라이언트 단방향 흐름이므로 최적의 가성비'
      },
      {
        tech: 'WebSocket (STOMP)',
        pros: '양방향 풀듀플렉스 통신 가능',
        cons: '연결 유지 비용이 크고 Nginx 타임아웃 및 세션 클러스터링 관리 복잡',
        decisionReason: '채팅 앱이 아니므로 오버엔지니어링으로 판단'
      }
    ],
    consequences:
      '브라우저 폴링 부하를 제거하여 서버 CPU 사용률을 35% 절감함.'
  },
  {
    id: 'adr-4',
    adrNumber: 4,
    title: '프론트엔드 스타일링 엔진: Tailwind CSS v4 + OKLCH 시맨틱 토큰',
    category: 'Frontend',
    selectedTech: 'Tailwind CSS v4 (@theme OKLCH Tokens)',
    status: 'Accepted',
    decisionDate: '2026-10-28',
    context:
      '애플 HIG와 Toss 풍의 세련된 다크/라이트 테마를 일관성 있게 구현하고, 런타임 CSS-in-JS 오버헤드를 배제해야 함.',
    alternatives: [
      {
        tech: 'Tailwind CSS v4 (OKLCH)',
        pros: '빌드 타임 CSS 생성으로 무부하, 넓은 색공간(P3/OKLCH) 지원, 다크모드 무결점 전환',
        cons: '초기 유틸리티 클래스 학습 필요',
        decisionReason: '가장 빠르고 높은 심미적 완성도를 보장'
      },
      {
        tech: 'Styled-Components / Emotion',
        pros: '컴포넌트 스코프 캡슐화 용이',
        cons: 'React 19 및 SSR 환경에서 런타임 주입 오버헤드 발생',
        decisionReason: '현대 프론트엔드 렌더링 성능 가이드에 위배되어 탈락'
      }
    ],
    consequences:
      'CSS 번들 사이즈 46KB 달성 및 다크모드 전환 시 깜빡임(FOUC) 제로 달성.'
  }
];

// =====================================================================
// STEP 09: DATABASE ERD TYPES
// =====================================================================
export interface TableColumn {
  id: string;
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  nullable?: boolean;
  comment?: string;
}

export interface ErdTableNode {
  id: string;
  name: string;
  logicalName: string;
  domainGroup: 'Core Auth' | 'Store & Catalog' | 'Order & Settlement';
  x: number;
  y: number;
  columns: TableColumn[];
}

export interface ErdRelation {
  id: string;
  source: string;
  target: string;
  sourcePort?: PortSide;
  targetPort?: PortSide;
  sourceCol: string;
  targetCol: string;
  cardinality: '1:N' | '1:1' | 'N:M';
  label: string;
}

// =====================================================================
// STEP 10: SYSTEM ARCHITECTURE TYPES
// =====================================================================
export interface ArchNode {
  id: string;
  name: string;
  category: 'Client' | 'Application' | 'Database' | 'Cache' | 'External';
  techStack: string;
  spec: string;
  zone: 'Public Zone' | 'Private App Zone' | 'Private Data Zone';
  x: number;
  y: number;
  status: 'active' | 'v15_planned';
  metrics: {
    latency: string;
    throughput: string;
    note: string;
  };
}

export interface ArchEdge {
  id: string;
  source: string;
  target: string;
  sourcePort?: PortSide;
  targetPort?: PortSide;
  protocol: string;
  port: string;
  isOptionalV15?: boolean;
}

// =====================================================================
// STEP 11: DEV CONVENTIONS TYPES
// =====================================================================
export interface DevConventionInfo {
  gitBranchStrategy: {
    model: string;
    description: string;
    branches: Array<{ name: string; purpose: string; protection: string }>;
  };
  commitMessageRules: {
    format: string;
    types: Array<{ type: string; description: string; example: string }>;
  };
  folderTree: {
    frontend: string;
    backend: string;
  };
  gitStrategy: {
    model: string;
    branches: Array<{ name: string; purpose: string; namingConvention: string }>;
  };
  commitConvention: {
    format: string;
    types: Array<{ type: string; description: string; example: string }>;
  };
  folderStructure: {
    frontendTree: string;
    backendTree: string;
  };
  codeRules: string[];
}

export const INITIAL_DEV_CONVENTIONS: DevConventionInfo = {
  gitBranchStrategy: {
    model: 'GitHub-flow (Simple & Agile)',
    description:
      'main 브랜치는 언제든 프로덕션에 배포 가능한 상태를 유지하며, 모든 작업은 짧은 수명의 feature 브랜치에서 PR을 거쳐 병합됩니다.',
    branches: [
      {
        name: 'main',
        purpose: '운영(Production) 배포용 기본 브랜치',
        protection: 'Direct Push 금지, 최소 1인 코드리뷰 및 CI 통과 필수'
      },
      {
        name: 'feature/{ticket-key}-{name}',
        purpose: '신규 기능 개발 및 티켓 단위 작업',
        protection: '로컬에서 생성 후 PR 발송'
      },
      {
        name: 'hotfix/{issue-id}',
        purpose: '운영 긴급 버그 수정',
        protection: 'main에서 분기 후 긴급 테스트 통과 시 즉시 squash merge'
      }
    ]
  },
  commitMessageRules: {
    format: '<type>(<scope>): <subject> (ex: feat(auth): add guest claim endpoint)',
    types: [
      {
        type: 'feat',
        description: '새로운 기능 추가',
        example: 'feat(order): add optimistic lock to reservation decrement'
      },
      {
        type: 'fix',
        description: '버그 수정',
        example: 'fix(erd): resolve foreign key type mismatch on store_id'
      },
      {
        type: 'docs',
        description: '문서 추가 및 수정',
        example: 'docs(api): update openapi schema with rfc7807 error format'
      },
      {
        type: 'refactor',
        description: '기능 변화 없는 코드 구조 개선',
        example: 'refactor(canvas): extract touch-drag gesture handler'
      },
      {
        type: 'test',
        description: '테스트 코드 추가 및 리팩토링',
        example: 'test(qa): add k6 concurrency test script for 1500 TPS'
      },
      {
        type: 'chore',
        description: '빌드 스크립트, 의존성 패키지 관리',
        example: 'chore(deps): downgrade typescript to ^5.7.2 for vercel CI'
      }
    ]
  },
  folderTree: {
    frontend: `groom-frontend/
├── public/                 # Favicon, Logo assets, OG image
├── src/
│   ├── assets/             # SVG & Static media
│   ├── components/         # 16 Specialized Module Viewers & Modals
│   ├── index.css           # Tailwind v4 @theme OKLCH design tokens
│   ├── main.tsx            # React 19 bootstrap
│   ├── mockData.ts         # Pipeline data ledger & types
│   └── App.tsx             # 3-Pane workspace shell & stage router
├── package.json
└── vite.config.ts`,
    backend: `groom-backend/
├── src/main/java/com/groom/
│   ├── domain/             # Entities, Repositories, Domain Services
│   │   ├── auth/           # Guest claim, Member, JWT
│   │   ├── store/          # Bread item, Store catalog, Inventory
│   │   └── reservation/    # Order, Deposit, No-show scheduler
│   ├── api/                # REST Controllers, DTOs, OpenAPI Spec
│   ├── infrastructure/     # SseEmitter, Redis Config, PostgreSQL JPA
│   └── global/             # RFC 7807 Exception Handler, Security
└── src/test/java/          # Unit & Integration Tests (k6, Testcontainers)`
  },
  gitStrategy: {
    model: 'GitHub-flow (Simple & Agile)',
    branches: [
      {
        name: 'main',
        purpose: '운영(Production) 배포용 단일 소스 브랜치',
        namingConvention: 'main (Direct Push 금지, PR 필수)'
      },
      {
        name: 'feature/*',
        purpose: '신규 비즈니스 기능 개발 및 티켓 단위 작업',
        namingConvention: 'feature/{ticket-key}-{short-desc} (ex: feature/GROOM-12-kakao-login)'
      },
      {
        name: 'hotfix/*',
        purpose: '운영 긴급 결함 수정',
        namingConvention: 'hotfix/{issue-id}-{short-desc} (ex: hotfix/SEC-04-token-expiry)'
      }
    ]
  },
  commitConvention: {
    format: '<type>(<scope>): <subject> (ex: feat(auth): add guest claim endpoint)',
    types: [
      {
        type: 'feat',
        description: '새로운 기능 추가',
        example: 'feat(order): add optimistic lock to reservation decrement'
      },
      {
        type: 'fix',
        description: '버그 수정',
        example: 'fix(erd): resolve foreign key type mismatch on store_id'
      },
      {
        type: 'docs',
        description: '문서 추가 및 수정',
        example: 'docs(api): update openapi schema with rfc7807 error format'
      },
      {
        type: 'refactor',
        description: '기능 변화 없는 코드 구조 개선',
        example: 'refactor(canvas): extract touch-drag gesture handler'
      },
      {
        type: 'test',
        description: '테스트 코드 추가 및 리팩토링',
        example: 'test(qa): add k6 concurrency test script for 1500 TPS'
      },
      {
        type: 'chore',
        description: '빌드 스크립트, 의존성 패키지 관리',
        example: 'chore(deps): downgrade typescript to ^5.7.2 for vercel CI'
      }
    ]
  },
  folderStructure: {
    frontendTree: `groom-frontend/
├── public/                 # Favicon, Logo assets, OG image
├── src/
│   ├── assets/             # SVG & Static media
│   ├── components/         # 16 Specialized Module Viewers & Modals
│   ├── index.css           # Tailwind v4 @theme OKLCH design tokens
│   ├── main.tsx            # React 19 bootstrap
│   ├── mockData.ts         # Pipeline data ledger & types
│   └── App.tsx             # 3-Pane workspace shell & stage router
├── package.json
└── vite.config.ts`,
    backendTree: `groom-backend/
├── src/main/java/com/groom/
│   ├── domain/             # Entities, Repositories, Domain Services
│   │   ├── auth/           # Guest claim, Member, JWT
│   │   ├── store/          # Bread item, Store catalog, Inventory
│   │   └── reservation/    # Order, Deposit, No-show scheduler
│   ├── api/                # REST Controllers, DTOs, OpenAPI Spec
│   ├── infrastructure/     # SseEmitter, Redis Config, PostgreSQL JPA
│   └── global/             # RFC 7807 Exception Handler, Security
└── src/test/java/          # Unit & Integration Tests (k6, Testcontainers)`
  },
  codeRules: [
    'Hallmark 디자인 규칙: 불필요한 transition-all 지양, 단일 속성(opacity, transform 등) 명시적 트랜지션 적용',
    '글래스모피즘(backdrop-blur) 배제, 고대비 단색 보더 및 웰(Well) 서피스로 시각 계층 형성',
    'REST 엔드포인트 에러 응답은 RFC 7807 Problem Details 포맷 준수',
    '트랜잭션 분리: Redis 기반 분산락 적용 구간은 DB 트랜잭션 외부에서 획득/해제',
    'Zero Unused Imports: TypeScript noUnusedLocals / noUnusedParameters 빌드 에러 0건 유지'
  ]
};

// =====================================================================
// STEP 12: BACKEND API SPECIFICATION (SWAGGER STYLE)
// =====================================================================
export interface ApiEndpointSpec {
  id: string;
  domainGroup: '인증 및 세션' | '점주 마감 등록' | '픽업 예약/결제' | '실시간 알림';
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  authScope: 'Public' | 'Guest' | 'Member' | 'StoreOwner';
  reqRef: string;
  requestJson: string;
  responseJson: string;
  rfc7807ErrorJson: string;
}

export const INITIAL_API_ENDPOINTS: ApiEndpointSpec[] = [
  {
    id: 'api-1',
    domainGroup: '인증 및 세션',
    method: 'POST',
    path: '/api/v1/auth/claim-guest',
    summary: '게스트 세션 계정 귀속 (Account Claim)',
    authScope: 'Guest',
    reqRef: 'REQ-AUTH-01',
    requestJson: `{
  "guestSessionToken": "gst_9f81a7b2c4e6",
  "email": "user@example.com",
  "password": "SecurePassword123!"
}`,
    responseJson: `{
  "success": true,
  "userId": "usr_01J9X8K2M4P6Q8",
  "claimedEmail": "user@example.com",
  "transferredItemsCount": 42,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5c..."
}`,
    rfc7807ErrorJson: `{
  "type": "https://api.groom.dev/errors/email-already-exists",
  "title": "Email Conflict",
  "status": 409,
  "detail": "해당 이메일로 등록된 계정이 이미 존재합니다.",
  "instance": "/api/v1/auth/claim-guest"
}`
  },
  {
    id: 'api-2',
    domainGroup: '점주 마감 등록',
    method: 'POST',
    path: '/api/v1/stores/{storeId}/discount-items',
    summary: '마감 할인 빵 품목 30초 퀵 등록',
    authScope: 'StoreOwner',
    reqRef: 'REQ-STORE-02',
    requestJson: `{
  "itemName": "소금빵 3입 세트",
  "originalPrice": 9000,
  "discountRate": 40,
  "discountPrice": 5400,
  "quantity": 5,
  "pickupUntil": "21:30"
}`,
    responseJson: `{
  "itemId": "itm_77a91b2c",
  "storeId": "str_1001",
  "status": "ON_SALE",
  "remainingQty": 5,
  "registeredAt": "2026-10-31T20:00:00Z"
}`,
    rfc7807ErrorJson: `{
  "type": "https://api.groom.dev/errors/invalid-pickup-time",
  "title": "Invalid Pickup Time",
  "status": 400,
  "detail": "픽업 마감 시각은 현재 시각보다 최소 30분 이후여야 합니다.",
  "instance": "/api/v1/stores/str_1001/discount-items"
}`
  },
  {
    id: 'api-3',
    domainGroup: '픽업 예약/결제',
    method: 'POST',
    path: '/api/v1/reservations',
    summary: '마감 할인 픽업 예약 및 보증금 결제 (낙관적 락)',
    authScope: 'Member',
    reqRef: 'REQ-RESV-03',
    requestJson: `{
  "itemId": "itm_77a91b2c",
  "quantity": 1,
  "expectedPickupTime": "21:15",
  "depositAmount": 1000,
  "itemVersion": 3
}`,
    responseJson: `{
  "reservationId": "rsv_44c892a1",
  "status": "CONFIRMED",
  "remainingQty": 4,
  "qrCodeUrl": "https://cdn.groom.dev/qr/rsv_44c892a1.png",
  "cancelDeadline": "2026-10-31T21:00:00Z"
}`,
    rfc7807ErrorJson: `{
  "type": "https://api.groom.dev/errors/optimistic-lock-conflict",
  "title": "Inventory Conflict",
  "status": 409,
  "detail": "동시에 예약이 진행되어 재고가 소진되었습니다. 다시 확인해 주세요.",
  "instance": "/api/v1/reservations"
}`
  },
  {
    id: 'api-4',
    domainGroup: '실시간 알림',
    method: 'GET',
    path: '/api/v1/notifications/stream',
    summary: 'SSE 기반 실시간 알림 스트림 구독',
    authScope: 'Member',
    reqRef: 'REQ-NOTI-04',
    requestJson: `/* No Request Body (Headers: Accept: text/event-stream) */`,
    responseJson: `event: notification
data: { "type": "RESERVATION_CONFIRMED", "message": "성심당 튀김소보로 예약이 확정되었습니다!" }`,
    rfc7807ErrorJson: `{
  "type": "https://api.groom.dev/errors/sse-timeout",
  "title": "Stream Timeout",
  "status": 504,
  "detail": "알림 연결이 타임아웃되었습니다. 자동 재연결을 시도합니다.",
  "instance": "/api/v1/notifications/stream"
}`
  }
];

// =====================================================================
// STEP 13: WBS KANBAN & COMBINED AI CODING INSTRUCTION
// =====================================================================
export interface KanbanTask {
  id: string;
  ticketKey: string;
  title: string;
  description: string;
  priority: 'P0' | 'P1' | 'P2';
  assignee: {
    name: string;
    initials: string;
    color: string;
    role: string;
  };
  deadline: string;
  storyPoints: number;
  reqRef: string;
  category: 'Backend' | 'Frontend' | 'Database' | 'Infra';
  status: 'todo' | 'in_progress' | 'done';
  aiPromptSnippet: string;
}

export const INITIAL_KANBAN_TASKS: KanbanTask[] = [
  {
    id: 'k1',
    ticketKey: 'GROOM-01',
    title: '게스트 섀도우 세션 발급 및 계정 귀속 트랜잭션',
    description:
      '비로그인 진입 시 UUID 발급 후, 로그인/회원가입 시 아티팩트 소유권을 원자적으로 이관하는 백엔드 API 및 프론트 모달 연동',
    priority: 'P0',
    assignee: {
      name: '김준호',
      initials: 'JH',
      color: 'bg-accent text-accent-ink',
      role: 'Backend Lead'
    },
    deadline: '2026-11-04',
    storyPoints: 5,
    reqRef: 'REQ-AUTH-01',
    category: 'Backend',
    status: 'done',
    aiPromptSnippet: `// 🤖 Cursor / Copilot AI 개발 지시 프롬프트 (GROOM-01)
// [맥락 연계: REQ-AUTH-01 + PostgreSQL 스키마 + RFC 7807]
Create a Spring Boot 3 service method for 'claimGuestSession':
1. Parameters: guestToken (String), userEmail (String), password (String)
2. Verify guestToken exists in Redis session store.
3. In a single @Transactional boundary:
   - Create new Member entity (hashed password with BCrypt).
   - Update project_workspaces SET owner_id = :newUserId WHERE guest_token = :guestToken;
   - Revoke guestToken and return JWT AccessToken (expires in 2h).
4. If userEmail already exists, throw DuplicateEmailException which translates to RFC 7807 (409 Conflict).`
  },
  {
    id: 'k2',
    ticketKey: 'GROOM-02',
    title: '마감 할인 예약 시 낙관적 락(@Version) 재고 차감 로직',
    description:
      '동시성 경합 시 재고가 음수로 떨어지지 않도록 JPA 낙관적 락 및 409 Conflict 핸들러 구현',
    priority: 'P0',
    assignee: {
      name: '이수진',
      initials: 'SJ',
      color: 'bg-ok text-ok-ink',
      role: 'Database Engineer'
    },
    deadline: '2026-11-06',
    storyPoints: 8,
    reqRef: 'REQ-RESV-03',
    category: 'Backend',
    status: 'in_progress',
    aiPromptSnippet: `// 🤖 Cursor / Copilot AI 개발 지시 프롬프트 (GROOM-02)
// [맥락 연계: REQ-RESV-03 + ADR-02 낙관적 락 + 09 ERD discount_items]
Implement reservation decrement service with Optimistic Locking:
1. DiscountItem entity has '@Version private Long version;' column.
2. Inside ReservationService.createReservation():
   - Fetch DiscountItem by itemId.
   - If item.remainingQty < requestedQty, throw InsufficientStockException.
   - item.setRemainingQty(item.getRemainingQty() - requestedQty);
   - Save reservation with status PENDING_DEPOSIT.
3. Catch OptimisticLockingFailureException:
   - Do NOT retry blindly. Return HTTP 409 Conflict with detail: "이미 다른 구매자가 먼저 예약했습니다."`
  },
  {
    id: 'k3',
    ticketKey: 'GROOM-03',
    title: 'SSE 기반 실시간 알림 스트리밍 엔드포인트 구현',
    description:
      '점주 등록 및 픽업 예약 상태 변경 시 Nginx 타임아웃 방지 하트비트 포함 SseEmitter 구현',
    priority: 'P1',
    assignee: {
      name: '박민우',
      initials: 'MW',
      color: 'bg-warn text-ink',
      role: 'Frontend / Fullstack'
    },
    deadline: '2026-11-09',
    storyPoints: 3,
    reqRef: 'REQ-NOTI-04',
    category: 'Backend',
    status: 'todo',
    aiPromptSnippet: `// 🤖 Cursor / Copilot AI 개발 지시 프롬프트 (GROOM-03)
// [맥락 연계: REQ-NOTI-04 + 10 인프라 Nginx + ADR-03 SSE]
Implement Server-Sent Events controller in Spring Boot 3:
1. Endpoint: GET /api/v1/notifications/stream (produces = MediaType.TEXT_EVENT_STREAM_VALUE)
2. SseEmitter timeout: 30 minutes.
3. Send periodic heartbeat comments every 25 seconds: ': keep-alive\\n\\n' to prevent Nginx proxy_read_timeout (60s).
4. On application event (ReservationCreatedEvent), find user's emitter and send JSON payload.`
  },
  {
    id: 'k4',
    ticketKey: 'GROOM-04',
    title: '인터랙티브 캔버스 핀치 줌 및 터치 드래그 지원',
    description:
      '모바일 환경에서 캔버스 배경 패닝, 2핑거 핀치 줌 및 노드 터치 이동 제스처 지원',
    priority: 'P0',
    assignee: {
      name: '최영희',
      initials: 'YH',
      color: 'bg-accent-strong text-accent-ink',
      role: 'Frontend Specialist'
    },
    deadline: '2026-11-05',
    storyPoints: 5,
    reqRef: 'REQ-UI-05',
    category: 'Frontend',
    status: 'done',
    aiPromptSnippet: `// 🤖 Cursor / Copilot AI 개발 지시 프롬프트 (GROOM-04)
// [맥락 연계: 07 화면 흐름 + 09 ERD + 10 아키텍처 공통 캔버스]
Enhance React canvas with mobile gesture support:
1. Add 'touch-none select-none' to canvas viewport.
2. Implement onTouchStart, onTouchMove, onTouchEnd:
   - 1 finger: pan canvas (panX, panY) or drag node if started on node.
   - 2 fingers: calculate Euclidean distance and update zoom scale (0.4x ~ 2.0x) around midpoint.
3. Prevent pull-to-refresh on mobile browsers.`
  }
];

// =====================================================================
// STEP 14: QA TEST CASES & LOAD TEST METRICS
// =====================================================================
export interface QaTestCase {
  id: string;
  category: '기능 테스트' | '예외 처리' | '동시성 검증' | '보안/인증';
  scenarioType?: string;
  testTitle: string;
  title?: string;
  precondition: string;
  testSteps: string[];
  steps?: string[];
  expectedResult: string;
  isPassed: boolean;
  status?: 'PASSED' | 'FAILED' | 'PENDING';
  severity: 'Critical' | 'Major' | 'Minor';
}

export interface QaLoadTestMetric {
  scenarioName: string;
  targetTps: number;
  actualTps: number;
  p95LatencyMs: number;
  errorRatePercent: number;
  virtualUsers: number;
  testDuration: string;
  tool: 'k6' | 'JMeter';
  status: 'PASSED' | 'FAILED';
}

export const INITIAL_QA_TEST_CASES: QaTestCase[] = [
  {
    id: 'qa-1',
    category: '동시성 검증',
    testTitle: '잔여 수량 1개 상품에 대한 50개 동시 예약 요청 시 초과 차감 방지',
    precondition: '수량 1개인 마감 할인 상품 등록 완료',
    testSteps: [
      'JMeter로 가상 유저 50명이 동일 시점에 POST /api/v1/reservations 발송',
      '응답 상태 코드 및 DB 잔여 수량 조회'
    ],
    expectedResult:
      '정확히 1건만 200 OK 성공하고 나머지 49건은 409 Conflict 반환. DB 수량은 정확히 0 유지.',
    isPassed: true,
    severity: 'Critical'
  },
  {
    id: 'qa-2',
    category: '보안/인증',
    testTitle: '24시간 만료된 게스트 세션의 프로젝트 데이터 격리 및 접근 차단',
    precondition: '발급 후 24시간이 경과한 게스트 토큰 준비',
    testSteps: [
      '만료된 토큰으로 GET /api/v1/projects/:id 요청',
      '토큰 갱신 없이 수정 API 호출'
    ],
    expectedResult: 'HTTP 401 Unauthorized 반환 및 재로그인 유도 모달 노출.',
    isPassed: true,
    severity: 'Major'
  },
  {
    id: 'qa-3',
    category: '기능 테스트',
    testTitle: '점주 마감 할인 품목 등록 시 반경 1.5km 유저에게 SSE 푸시 전송',
    precondition: '유저 브라우저에서 SSE 스트림 구독 활성화',
    testSteps: [
      '점주 계정으로 신규 품목 등록 API 호출',
      '유저 브라우저 이벤트 리스너 수신 대기'
    ],
    expectedResult: '등록 완료 후 300ms 이내에 브라우저에 실시간 알림 팝업 수신.',
    isPassed: true,
    severity: 'Major'
  },
  {
    id: 'qa-4',
    category: '예외 처리',
    testTitle: '픽업 15분 경과 후 미결제 상태 시 예약 자동 취소 및 재고 원복',
    precondition: 'PENDING_DEPOSIT 상태의 예약 생성',
    testSteps: [
      '스케줄러 주기(1분) 대기 후 배치 트리거',
      '예약 상태 및 상품 재고 조회'
    ],
    expectedResult:
      '예약 상태가 CANCELLED_TIMEOUT으로 변경되고 잔여 수량이 즉시 +1 복원됨.',
    isPassed: true,
    severity: 'Major'
  }
];

export const INITIAL_LOAD_TEST_METRICS: QaLoadTestMetric[] = [
  {
    scenarioName: '마감 할인 목록 조회 & 검색 (Peak Load)',
    targetTps: 1500,
    actualTps: 1680,
    p95LatencyMs: 42,
    errorRatePercent: 0.02,
    virtualUsers: 250,
    testDuration: '10분간 지속',
    tool: 'k6',
    status: 'PASSED'
  },
  {
    scenarioName: '동시 예약 생성 및 낙관적 락 경합',
    targetTps: 300,
    actualTps: 320,
    p95LatencyMs: 78,
    errorRatePercent: 0.0,
    virtualUsers: 100,
    testDuration: '5분간 버스트',
    tool: 'k6',
    status: 'PASSED'
  }
];

// =====================================================================
// STEP 15: RELEASE HISTORY & LOGS
// =====================================================================
export interface DeploymentRecord {
  id: string;
  version: string;
  releaseTitle?: string;
  deployedAt: string;
  deployedBy?: string;
  status: 'DEPLOYED (Success)' | 'ROLLED_BACK' | 'Production' | 'Staging';
  commitRef?: string;
  commitHash: string;
  highlights?: string[];
  changelog: string[];
  rollbackTarget?: string;
  rollbackCommand?: string;
  rollbackNote?: string;
  rollbackGuide: string;
  environment?: 'Production' | 'Staging';
}

export const INITIAL_RELEASE_HISTORY: DeploymentRecord[] = [
  {
    id: 'rel-1',
    version: 'v1.5.0',
    releaseTitle: '성능 최적화 및 SSE 실시간 스트리밍 릴리즈',
    deployedAt: '2026-10-30 18:30:00 (KST)',
    status: 'Production',
    commitRef: 'c4bb501',
    commitHash: 'c4bb501',
    highlights: [
      'Redis 캐싱 계층 도입으로 마감 상품 목록 p95 레이턴시 120ms ➔ 15ms 단축',
      'HTTP/2 Server-Sent Events (SSE) 실시간 알림 파이프라인 오픈',
      'TypeScript ^5.7.2 다운그레이드 및 Vercel 빌드 무결성 확보'
    ],
    changelog: [
      'Redis 캐싱 계층 도입으로 마감 상품 목록 p95 레이턴시 120ms ➔ 15ms 단축',
      'HTTP/2 Server-Sent Events (SSE) 실시간 알림 파이프라인 오픈',
      'TypeScript ^5.7.2 다운그레이드 및 Vercel 빌드 무결성 확보'
    ],
    rollbackTarget: 'v1.0.1 (commit 2e179c8)',
    rollbackCommand: 'kubectl rollout undo deployment/groom-api --to-revision=3',
    rollbackNote: 'Redis 장애 발생 시 application.yml의 cache.enabled=false 플래그 즉시 롤백 가능',
    rollbackGuide: 'kubectl rollout undo deployment/groom-api --to-revision=3',
    environment: 'Production'
  },
  {
    id: 'rel-2',
    version: 'v1.0.1',
    releaseTitle: '게스트 세션 만료 알림 및 UI 반응성 핫픽스',
    deployedAt: '2026-10-27 14:15:00 (KST)',
    status: 'Production',
    commitRef: '2e179c8',
    commitHash: '2e179c8',
    highlights: [
      '게스트 세션 만료 1시간 전 상단 띠 배너 알림 추가',
      '모바일 캔버스 터치 제스처 패닝 및 핀치 줌 핫픽스'
    ],
    changelog: [
      '게스트 세션 만료 1시간 전 상단 띠 배너 알림 추가',
      '모바일 캔버스 터치 제스처 패닝 및 핀치 줌 핫픽스'
    ],
    rollbackTarget: 'v1.0.0 (commit 10a82f1)',
    rollbackCommand: 'kubectl rollout undo deployment/groom-api --to-revision=2',
    rollbackNote: '무중단 롤링 업데이트로 다운타임 0초 유지',
    rollbackGuide: 'kubectl rollout undo deployment/groom-api --to-revision=2',
    environment: 'Production'
  },
  {
    id: 'rel-3',
    version: 'v1.0.0',
    releaseTitle: 'Groom 공식 알파 프로토타입 첫 릴리즈',
    deployedAt: '2026-10-20 11:00:00 (KST)',
    status: 'Production',
    commitRef: '10a82f1',
    commitHash: '10a82f1',
    highlights: [
      '01 서비스 기획부터 08 배포까지 기본 워크스페이스 코파일럿 개시',
      'PostgreSQL DDL 및 낙관적 락 재고 차감 엔진 구축'
    ],
    changelog: [
      '01 서비스 기획부터 08 배포까지 기본 워크스페이스 코파일럿 개시',
      'PostgreSQL DDL 및 낙관적 락 재고 차감 엔진 구축'
    ],
    rollbackTarget: 'None (Initial Release)',
    rollbackCommand: 'N/A',
    rollbackNote: '초기 프로덕션 배포 완료',
    rollbackGuide: 'git checkout v0.9.9 && docker compose restart',
    environment: 'Production'
  }
];

// =====================================================================
// STEP 16: TROUBLESHOOTING ARCHIVE
// =====================================================================
export interface TroubleshootingItem {
  id: string;
  issueNumber: number;
  title: string;
  versionTrack?: 'v1.0 MVP' | 'v1.5 성능 개선';
  resolvedInVersion: string;
  resolvedAt: string;
  severity: 'Critical' | 'High' | 'Medium';
  tags: string[];
  problemSymptom: string;
  rootCause: string;
  solutionMechanisms: string[];
  metricsBefore: {
    metricName: string;
    value: string;
    numericValue: number;
  };
  metricsAfter: {
    value: string;
    numericValue: number;
  };
  symptomAndCause: string;
  resolutionProcess: string;
  beforeMetric: string;
  afterMetric: string;
  improvementSummary: string;
  metricComparison: {
    label: string;
    beforeVal: number;
    afterVal: number;
    unit: string;
  };
}

export const INITIAL_TROUBLESHOOTING_ARCHIVE: TroubleshootingItem[] = [
  {
    id: 'tr-1',
    issueNumber: 101,
    title: '마감 임박 픽업 알림 폴링 폭증 시 DB 커넥션 풀(HikariCP) 고갈 장애',
    versionTrack: 'v1.5 성능 개선',
    resolvedInVersion: 'v1.5.0',
    resolvedAt: '2026-10-30',
    severity: 'Critical',
    tags: ['SSE', 'HikariCP', 'ConnectionPool'],
    problemSymptom:
      '사용자 500명이 동시에 3초 간격으로 마감 상품 상태를 HTTP 폴링하면서 DB 커넥션 풀(max-pool=20)이 100% 포화되어 504 타임아웃 발생.',
    rootCause:
      '무상태 HTTP 단기 폴링 방식으로 인해 쿼리가 집중되며 트랜잭션 대기열이 비정상적으로 누적됨.',
    solutionMechanisms: [
      '무의미한 HTTP 클라이언트 폴링을 중단하고 Server-Sent Events(SSE) 단방향 스트림 도입',
      'Spring SseEmitter를 통해 재고 변경 이벤트 발생 시에만 클라이언트로 푸시'
    ],
    metricsBefore: {
      metricName: 'HikariCP 풀 점유율',
      value: '100% (504 오류)',
      numericValue: 100
    },
    metricsAfter: {
      value: '12% (오류 0%)',
      numericValue: 12
    },
    symptomAndCause:
      '사용자 500명이 동시에 3초 간격으로 마감 상품 상태를 HTTP 폴링하면서 DB 커넥션 풀(HikariCP max-pool-size=20)이 100% 포화되어 504 게이트웨이 타임아웃 발생.',
    resolutionProcess:
      '1) 무의미한 HTTP 클라이언트 폴링을 전면 중단하고 Server-Sent Events(SSE) 단방향 스트림 도입. 2) Spring SseEmitter를 통해 상태 변경 이벤트가 발생할 때만 클라이언트로 푸시하도록 아키텍처 전환.',
    beforeMetric: '커넥션 점유율 100% (504 에러 38%)',
    afterMetric: '커넥션 점유율 12% (에러율 0%)',
    improvementSummary: 'DB 커넥션 고갈 완전 해소 및 불필요한 네트워크 트래픽 88% 절감',
    metricComparison: {
      label: 'HikariCP 풀 점유율',
      beforeVal: 100,
      afterVal: 12,
      unit: '%'
    }
  },
  {
    id: 'tr-2',
    issueNumber: 102,
    title: '할인 품목 다중 검색 시 Full Table Scan으로 인한 응답 지연 (120ms)',
    versionTrack: 'v1.5 성능 개선',
    resolvedInVersion: 'v1.5.0',
    resolvedAt: '2026-10-28',
    severity: 'High',
    tags: ['Redis', 'Index', 'Latency'],
    problemSymptom:
      '매장 위치(store_id)와 마감 할인 상태(status)를 복합 조건으로 조회할 때 인덱스가 없어 discount_items 전체 테이블 스캔 발생.',
    rootCause:
      '단일 컬럼 인덱스 부재 및 캐싱 레이어 부재로 모든 사용자 검색 요청이 디스크 I/O로 직결됨.',
    solutionMechanisms: [
      '(store_id, status, created_at DESC) 복합 B-Tree 인덱스 신설',
      'Redis에 반경 1.5km 활성 할인 품목 목록을 60초 TTL로 캐싱'
    ],
    metricsBefore: {
      metricName: '목록 조회 p95 Latency',
      value: '120ms',
      numericValue: 120
    },
    metricsAfter: {
      value: '15ms',
      numericValue: 15
    },
    symptomAndCause:
      '매장 위치(store_id)와 마감 할인 상태(status)를 복합 조건으로 조회할 때 인덱스가 없어 discount_items 전체 테이블 스캔 발생.',
    resolutionProcess:
      '1) (store_id, status, created_at DESC) 복합 B-Tree 인덱스 신설. 2) Redis에 반경 1.5km 활성 할인 품목 목록을 60초 TTL로 캐싱.',
    beforeMetric: '조회 지연 p95 120ms',
    afterMetric: '조회 지연 p95 15ms',
    improvementSummary: 'Redis 캐시 히트율 92% 달성 및 쿼리 지연시간 87.5% 단축',
    metricComparison: {
      label: '목록 조회 p95 Latency',
      beforeVal: 120,
      afterVal: 15,
      unit: 'ms'
    }
  },
  {
    id: 'tr-3',
    issueNumber: 103,
    title: '게스트 세션 계정 연동(Claim) 시 동시 중복 클릭으로 인한 무결성 위반',
    versionTrack: 'v1.0 MVP',
    resolvedInVersion: 'v1.0.1',
    resolvedAt: '2026-10-25',
    severity: 'Medium',
    tags: ['Redisson', 'Idempotency', 'Lock'],
    problemSymptom:
      '네트워크 지연 시 사용자가 [계정 연동하기] 버튼을 빠르게 연타하여 2개의 연동 트랜잭션이 동시 진입해 DB Unique Constraint 에러 발생.',
    rootCause:
      '클라이언트 단 디바운스 누락 및 백엔드 락 부재로 분산 환경에서 경쟁 상태 발생.',
    solutionMechanisms: [
      '프론트엔드 버튼에 useTransition / Debounce 적용하여 첫 클릭 후 즉시 비활성화',
      '백엔드 Redis 분산 락(Redisson)을 3초간 적용하여 동일 guestToken 중복 처리 차단'
    ],
    metricsBefore: {
      metricName: '중복 연동 에러율',
      value: '100% (500 Error)',
      numericValue: 100
    },
    metricsAfter: {
      value: '0% (멱등 처리)',
      numericValue: 0
    },
    symptomAndCause:
      '네트워크 지연 시 사용자가 [계정 연동하기] 버튼을 빠르게 연타하여 2개의 연동 트랜잭션이 동시 진입해 DB Unique Constraint 에러 발생.',
    resolutionProcess:
      '1) 프론트엔드 버튼에 useTransition / Debounce 적용하여 첫 클릭 후 즉시 버튼 비활성화. 2) 백엔드 Redis 분산 락(Redisson)을 3초간 적용하여 동일 guestToken 중복 처리 원천 차단.',
    beforeMetric: '연타 시 500 Server Error 발생',
    afterMetric: '안전한 멱등성 보장 (200 OK 1건 처리)',
    improvementSummary: '계정 귀속 트랜잭션 멱등성 100% 확보',
    metricComparison: {
      label: '중복 연동 에러율',
      beforeVal: 100,
      afterVal: 0,
      unit: '%'
    }
  }
];

// =====================================================================
// STEP 05: PRD REQUIREMENTS DATA
// =====================================================================
export interface PrdRequirement {
  id: string;
  reqCode: string;
  category: string;
  title: string;
  specification: string;
  acceptanceCriteria: string;
  priority: 'P0' | 'P1' | 'P2';
  status: 'Confirmed' | 'Review';
}

export const INITIAL_PRD_REQUIREMENTS: PrdRequirement[] = [
  {
    id: 'r1',
    reqCode: 'REQ-AUTH-01',
    category: '온보딩 / 인증',
    title: '게스트 섀도우 세션 및 계정 귀속 (Account Claim)',
    specification:
      '비로그인 진입 시 UUID 기반 임시 워크스페이스 발급(24h 유효). 회원가입 시 작업 산출물 일체를 정식 유저 소유로 트랜잭션 이관.',
    acceptanceCriteria: 'Claim 수행 시 하위 문서, ERD 노드(JSONB), WBS 티켓 누락률 0% 보장',
    priority: 'P0',
    status: 'Confirmed'
  },
  {
    id: 'r2',
    reqCode: 'REQ-STORE-02',
    category: '점주 마감 등록',
    title: '마감 할인 품목 30초 퀵 등록 및 재고 차감',
    specification:
      '빵집 점주가 마감 시간대 할인율(30~50%), 잔여 수량, 픽업 마감 시각을 등록하면 반경 1.5km 구독 유저에게 즉시 노출.',
    acceptanceCriteria: '동시 예약 요청 시 낙관적 락(version 컬럼)으로 재고 음수 발생 차단',
    priority: 'P0',
    status: 'Confirmed'
  },
  {
    id: 'r3',
    reqCode: 'REQ-RESV-03',
    category: '픽업 예약 / 보증금',
    title: '노쇼(No-Show) 방지 픽업 시간 지정 및 보증금 상태 관리',
    specification:
      '구매자가 픽업 예정 시각(pickup_time)을 지정하여 예약 생성. 보증금 결제 상태(PENDING, PAID, REFUNDED)에 따라 점주 화면에 확정 알림 송신.',
    acceptanceCriteria: '예약 후 15분 내 미결제 시 스케줄러가 자동으로 재고 원복 처리',
    priority: 'P0',
    status: 'Confirmed'
  },
  {
    id: 'r4',
    reqCode: 'REQ-NOTI-04',
    category: '알림 / 웹훅',
    title: '마감 임박 및 예약 상태 변경 인앱/웹훅 알림',
    specification:
      '단골 매장 신규 할인 등록 및 픽업 30분 전 리마인더 알림 발송. V1.0은 인앱 폴링, V1.5는 SSE 스트리밍 적용.',
    acceptanceCriteria: '알림 이벤트가 주문 메인 트랜잭션을 블로킹하지 않도록 분리',
    priority: 'P1',
    status: 'Confirmed'
  }
];

// =====================================================================
// STEP 07: INITIAL UI/UX SCREEN NODES & EDGES
// =====================================================================
export const INITIAL_UX_NODES: UxScreenNode[] = [
  {
    id: 'ux_landing',
    name: '01. 서비스 랜딩',
    route: '/',
    screenType: 'Page',
    authLevel: 'Public',
    summary: '서비스 소개 및 한 줄 아이디어로 즉시 워크스페이스 시작',
    subComponents: ['LandingHero', 'SocialAuthModal', 'TrackPresetPill', 'Footer'],
    stateQueryParams: ['theme=dark', 'ref=google'],
    backendApiEndpoint: 'GET /api/v1/public/overview',
    nextRouteActions: [
      { label: '설계 시작하기', targetRoute: '/workspace' },
      { label: '로그인 / 회원가입', targetRoute: '/auth/modal' }
    ],
    x: 60,
    y: 80
  },
  {
    id: 'ux_workspace',
    name: '02. 메인 워크스페이스',
    route: '/workspace',
    screenType: 'Workspace',
    authLevel: 'Guest',
    summary: '5대 Phase / 16개 독립 모듈 3단 통합 엔지니어링 화면',
    subComponents: [
      'PhaseSidebarAccordion',
      'CentralChatPane',
      'SpecializedArtifactViewer',
      'GlobalHeader'
    ],
    stateQueryParams: ['step=step1', 'track=fullstack', 'domain=web'],
    backendApiEndpoint: 'GET /api/v1/projects/:id',
    nextRouteActions: [
      { label: '설정 모달 열기', targetRoute: '/settings' },
      { label: '계정 연동 모달', targetRoute: '/claim' }
    ],
    x: 360,
    y: 80
  },
  {
    id: 'ux_routing_canvas',
    name: '03. 화면 흐름 & 라우팅',
    route: '/workspace?step=step7',
    screenType: 'Page',
    authLevel: 'Member',
    summary: '인터랙티브 화면 동선 캔버스 및 IA 라우팅 테이블 뷰어',
    subComponents: ['CanvasDotGrid', 'ScreenNodeCard', 'InspectorDrawer', 'IaTableView'],
    stateQueryParams: ['view=canvas', 'selected=ux_workspace'],
    backendApiEndpoint: 'GET /api/v1/projects/:id/screens',
    nextRouteActions: [{ label: '노드 클릭 시 인스펙터 오픈', targetRoute: 'drawer:inspect' }],
    x: 680,
    y: 80
  },
  {
    id: 'ux_erd_canvas',
    name: '04. 데이터베이스 ERD',
    route: '/workspace?step=step9',
    screenType: 'Page',
    authLevel: 'Member',
    summary: 'PostgreSQL 테이블 스키마 및 DDL 동기화 도트 캔버스',
    subComponents: ['TableNodeCard', 'PortConnectionSvg', 'DdlCodeDrawer'],
    stateQueryParams: ['schema=postgresql', 'zoom=100'],
    backendApiEndpoint: 'GET /api/v1/projects/:id/erd',
    nextRouteActions: [{ label: '테이블 속성 편집', targetRoute: 'modal:edit-table' }],
    x: 360,
    y: 340
  },
  {
    id: 'ux_kanban_board',
    name: '05. WBS 칸반 & AI 프롬프트',
    route: '/workspace?step=step13',
    screenType: 'Page',
    authLevel: 'Member',
    summary: '스프린트 태스크 관리 및 태스크별 IDE 코딩 프롬프트 생성',
    subComponents: ['KanbanColumn', 'TaskCard', 'AiPromptCodeModal'],
    stateQueryParams: ['filter=all', 'sprint=1'],
    backendApiEndpoint: 'GET /api/v1/projects/:id/tasks',
    nextRouteActions: [
      { label: '카드 클릭 시 AI 프롬프트 모달', targetRoute: 'modal:ide-prompt' }
    ],
    x: 680,
    y: 340
  }
];

export const INITIAL_UX_EDGES: UxFlowEdge[] = [
  {
    id: 'ux_edge_1',
    source: 'ux_landing',
    target: 'ux_workspace',
    sourcePort: 'right',
    targetPort: 'left',
    triggerLabel: '시작하기 클릭',
    guardCondition: '게스트 세션 토큰 자동 발급'
  },
  {
    id: 'ux_edge_2',
    source: 'ux_workspace',
    target: 'ux_routing_canvas',
    sourcePort: 'right',
    targetPort: 'left',
    triggerLabel: 'Step 07 선택',
    guardCondition: '권한 검증 완료'
  },
  {
    id: 'ux_edge_3',
    source: 'ux_workspace',
    target: 'ux_erd_canvas',
    sourcePort: 'bottom',
    targetPort: 'top',
    triggerLabel: 'Step 09 선택',
    guardCondition: '스키마 동기화 완료'
  },
  {
    id: 'ux_edge_4',
    source: 'ux_routing_canvas',
    target: 'ux_kanban_board',
    sourcePort: 'bottom',
    targetPort: 'top',
    triggerLabel: 'WBS 일정 연동',
    guardCondition: '화면 명세 확정'
  }
];

export const INITIAL_CANVAS_ZONES: CanvasZone[] = [
  {
    id: 'zone_front',
    title: 'Client Web & Mobile Flow',
    subtitle: '반응형 웹 및 모바일 앱 화면 동선 영역',
    x: 40,
    y: 40,
    width: 920,
    height: 240,
    tone: 'accent'
  },
  {
    id: 'zone_backend',
    title: 'Core Engineering & Sprint',
    subtitle: '데이터베이스 모델링 및 개발 스프린트 관리 영역',
    x: 320,
    y: 300,
    width: 640,
    height: 240,
    tone: 'neutral'
  }
];

export const INITIAL_UX_ZONES: CanvasZone[] = INITIAL_CANVAS_ZONES;
export const INITIAL_ERD_ZONES: CanvasZone[] = INITIAL_CANVAS_ZONES;
export const INITIAL_ARCH_ZONES: CanvasZone[] = INITIAL_CANVAS_ZONES;

// =====================================================================
// STEP 09: INITIAL ERD TABLES & RELATIONS
// =====================================================================
export const INITIAL_ERD_TABLES: ErdTableNode[] = [
  {
    id: 'tbl_members',
    name: 'members',
    logicalName: '회원 / 계정',
    domainGroup: 'Core Auth',
    x: 60,
    y: 80,
    columns: [
      { id: 'c1', name: 'id', type: 'UUID', isPk: true, comment: '회원 식별자' },
      { id: 'c2', name: 'email', type: 'VARCHAR(255)', nullable: false, comment: '로그인 이메일' },
      { id: 'c3', name: 'role', type: 'VARCHAR(20)', nullable: false, comment: 'MEMBER / STORE_OWNER' },
      { id: 'c4', name: 'guest_token', type: 'VARCHAR(128)', nullable: true, comment: '이전 섀도우 세션' },
      { id: 'c5', name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, comment: '가입 일시' }
    ]
  },
  {
    id: 'tbl_stores',
    name: 'stores',
    logicalName: '빵집 매장',
    domainGroup: 'Store & Catalog',
    x: 380,
    y: 80,
    columns: [
      { id: 'c6', name: 'id', type: 'UUID', isPk: true, comment: '매장 식별자' },
      { id: 'c7', name: 'owner_id', type: 'UUID', isFk: true, comment: '점주 회원 FK' },
      { id: 'c8', name: 'name', type: 'VARCHAR(100)', nullable: false, comment: '매장 상호명' },
      { id: 'c9', name: 'address', type: 'VARCHAR(255)', nullable: false, comment: '도로명 주소' },
      { id: 'c10', name: 'pickup_cutoff', type: 'TIME', nullable: false, comment: '당일 마감 시각' }
    ]
  },
  {
    id: 'tbl_discount_items',
    name: 'discount_items',
    logicalName: '마감 할인 품목',
    domainGroup: 'Store & Catalog',
    x: 720,
    y: 80,
    columns: [
      { id: 'c11', name: 'id', type: 'UUID', isPk: true, comment: '품목 식별자' },
      { id: 'c12', name: 'store_id', type: 'UUID', isFk: true, comment: '매장 FK' },
      { id: 'c13', name: 'name', type: 'VARCHAR(100)', nullable: false, comment: '빵 이름' },
      { id: 'c14', name: 'discount_price', type: 'INTEGER', nullable: false, comment: '할인가 (원)' },
      { id: 'c15', name: 'remaining_qty', type: 'INTEGER', nullable: false, comment: '잔여 수량' },
      { id: 'c16', name: 'version', type: 'BIGINT', nullable: false, comment: '낙관적 락 버전' }
    ]
  },
  {
    id: 'tbl_reservations',
    name: 'reservations',
    logicalName: '픽업 예약 주문',
    domainGroup: 'Order & Settlement',
    x: 540,
    y: 350,
    columns: [
      { id: 'c17', name: 'id', type: 'UUID', isPk: true, comment: '예약 번호' },
      { id: 'c18', name: 'item_id', type: 'UUID', isFk: true, comment: '할인 품목 FK' },
      { id: 'c19', name: 'buyer_id', type: 'UUID', isFk: true, comment: '구매자 FK' },
      { id: 'c20', name: 'status', type: 'VARCHAR(30)', nullable: false, comment: 'PENDING / CONFIRMED' },
      { id: 'c21', name: 'pickup_time', type: 'TIMESTAMPTZ', nullable: false, comment: '예정 시각' },
      { id: 'c22', name: 'deposit_paid', type: 'INTEGER', nullable: false, comment: '보증금' }
    ]
  }
];

export const INITIAL_ERD_RELATIONS: ErdRelation[] = [
  {
    id: 'rel_1',
    source: 'tbl_members',
    target: 'tbl_stores',
    sourcePort: 'right',
    targetPort: 'left',
    sourceCol: 'id',
    targetCol: 'owner_id',
    cardinality: '1:N',
    label: 'owns'
  },
  {
    id: 'rel_2',
    source: 'tbl_stores',
    target: 'tbl_discount_items',
    sourcePort: 'right',
    targetPort: 'left',
    sourceCol: 'id',
    targetCol: 'store_id',
    cardinality: '1:N',
    label: 'registers'
  },
  {
    id: 'rel_3',
    source: 'tbl_discount_items',
    target: 'tbl_reservations',
    sourcePort: 'bottom',
    targetPort: 'top',
    sourceCol: 'id',
    targetCol: 'item_id',
    cardinality: '1:N',
    label: 'reserved_in'
  }
];

// =====================================================================
// STEP 10: INITIAL ARCHITECTURE NODES & EDGES
// =====================================================================
export const INITIAL_ARCH_NODES: ArchNode[] = [
  {
    id: 'arch_client',
    name: 'Web / Mobile Client',
    category: 'Client',
    techStack: 'React 19 + TypeScript + Vite',
    spec: 'Vercel Edge Global CDN',
    zone: 'Public Zone',
    x: 60,
    y: 100,
    status: 'active',
    metrics: { latency: '12ms', throughput: 'Edge Instant', note: 'SPA 정적 파일 호스팅' }
  },
  {
    id: 'arch_backend',
    name: 'Spring Boot 3 Core API',
    category: 'Application',
    techStack: 'Java 21 + Spring Boot 3 + JPA',
    spec: 'AWS EC2 t4g.small (Seoul)',
    zone: 'Private App Zone',
    x: 360,
    y: 100,
    status: 'active',
    metrics: { latency: '18ms', throughput: '1,680 TPS', note: '비즈니스 로직 & 트랜잭션' }
  },
  {
    id: 'arch_redis',
    name: 'Redis Cache & SSE Pub/Sub',
    category: 'Cache',
    techStack: 'Redis 7.2 In-Memory Store',
    spec: 'ElastiCache t4g.micro',
    zone: 'Private App Zone',
    x: 360,
    y: 280,
    status: 'active',
    metrics: { latency: '1.2ms', throughput: '15,000 QPS', note: '재고 캐시 & 실시간 알림' }
  },
  {
    id: 'arch_db',
    name: 'PostgreSQL Primary DB',
    category: 'Database',
    techStack: 'PostgreSQL 16 (JSONB/ACID)',
    spec: 'AWS RDS db.t4g.micro (20GB GP3)',
    zone: 'Private Data Zone',
    x: 680,
    y: 100,
    status: 'active',
    metrics: { latency: '3.5ms', throughput: 'ACID Strict', note: '회원, 매장, 주문 영구 보관' }
  }
];

export const INITIAL_ARCH_EDGES: ArchEdge[] = [
  {
    id: 'arch_edge_1',
    source: 'arch_client',
    target: 'arch_backend',
    sourcePort: 'right',
    targetPort: 'left',
    protocol: 'HTTPS / REST / SSE',
    port: '443'
  },
  {
    id: 'arch_edge_2',
    source: 'arch_backend',
    target: 'arch_redis',
    sourcePort: 'bottom',
    targetPort: 'top',
    protocol: 'RESP',
    port: '6379'
  },
  {
    id: 'arch_edge_3',
    source: 'arch_backend',
    target: 'arch_db',
    sourcePort: 'right',
    targetPort: 'left',
    protocol: 'TCP / JDBC',
    port: '5432'
  }
];

// =====================================================================
// CHAT & PROJECT MEMBER TYPES
// =====================================================================
export interface ChatMessage {
  id: string;
  stepId: StepId;
  sender: 'ai' | 'user';
  author: string;
  roleBadge: string;
  timestamp: string;
  content: string;
  contextRefs?: string[];
  artifactAction?: {
    title: string;
    version: string;
    summary: string;
    targetStep: StepId;
  };
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';
  joinedAt: string;
  isCurrentUser?: boolean;
}

export const INITIAL_PROJECT_MEMBERS: ProjectMember[] = [
  {
    id: 'mem_1',
    name: '한정호',
    email: 'thegamerhan@gmail.com',
    initials: 'JH',
    role: 'OWNER',
    joinedAt: '2026-10-24',
    isCurrentUser: true
  },
  {
    id: 'mem_2',
    name: '김도현',
    email: 'dohyun@groom.dev',
    initials: 'DH',
    role: 'ADMIN',
    joinedAt: '2026-10-25'
  },
  {
    id: 'mem_3',
    name: '송지은',
    email: 'jieun.designer@groom.dev',
    initials: 'JE',
    role: 'EDITOR',
    joinedAt: '2026-10-27'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm_s1_1',
    stepId: 'step1',
    sender: 'ai',
    author: 'Principal Product Architect',
    roleBadge: '수석 프로덕트 기획',
    timestamp: '14:00',
    content:
      '동네 빵집 마감 할인 서비스의 개요 및 기획서 초안이 작성되었습니다. 반경 1.5km 하이퍼로컬 타깃과 마감 재고 소진율 80% 달성을 핵심 목표로 설정했습니다.',
    contextRefs: ['서비스 개요 v1.0', '초기 진입 전략'],
    artifactAction: {
      title: '서비스 개요 및 기획서 생성',
      version: 'v1.0',
      summary: '하이퍼로컬 O2O 타깃 및 KPI 설정 완료',
      targetStep: 'step1'
    }
  },
  {
    id: 'm_s7_1',
    stepId: 'step7',
    sender: 'ai',
    author: 'Lead UX Architect',
    roleBadge: '화면 설계 리드',
    timestamp: '14:10',
    content:
      '메인 워크스페이스, 온보딩, 결제 모달 등 핵심 프론트엔드 라우팅과 화면 전환 흐름도를 토폴로지 캔버스에 구성했습니다. 상단 탭에서 [IA 라우팅 테이블 뷰]로도 전환할 수 있습니다.',
    contextRefs: ['화면 흐름도 4개 노드', 'IA 테이블 매핑'],
    artifactAction: {
      title: '화면 흐름도 & 라우팅 구성',
      version: 'v1.0',
      summary: '4개 노드 배치 및 인스펙터 API 연동 준비 완료',
      targetStep: 'step7'
    }
  },
  {
    id: 'm_s9_1',
    stepId: 'step9',
    sender: 'ai',
    author: 'Principal DB Architect',
    roleBadge: '데이터 아키텍트',
    timestamp: '14:15',
    content:
      'PostgreSQL 15 기준 4개 핵심 테이블(`members`, `bakeries`, `discount_items`, `reservations`)을 정규화 설계하고 관계선을 연결했습니다.',
    contextRefs: ['reservations 스키마', '3NF 정규화 완료'],
    artifactAction: {
      title: 'ERD 스키마 설계',
      version: 'v1.2',
      summary: 'reservations, discount_items 등 테이블 4종 연계 완료',
      targetStep: 'step9'
    }
  },
  {
    id: 'm_s13_1',
    stepId: 'step13',
    sender: 'ai',
    author: 'Agile Delivery Lead',
    roleBadge: '스크럼 마스터',
    timestamp: '14:21',
    content:
      '스프린트 1 구현 티켓 6건(GRM-101 ~ GRM-106)을 WBS 칸반 보드에 배치했습니다. 카드를 클릭하면 [🤖 이 태스크의 AI 코딩 지시서] 탭에서 Cursor/Copilot 전용 프롬프트를 바로 복사할 수 있습니다.',
    contextRefs: ['총 29 Story Points', 'P0 핵심 경로 4건 배정'],
    artifactAction: {
      title: 'WBS 칸반 보드 생성',
      version: 'v1.0',
      summary: 'Sprint 1 티켓 6건 및 AI 지시서 템플릿 준비 완료',
      targetStep: 'step13'
    }
  }
];
