// =====================================================================
// GROOM WORKSPACE - 5 PHASES / 17 INDEPENDENT MODULES DATA SYSTEM
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
  | 'step16'
  | 'step17';

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
  'step16',
  'step17'
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
    subtitle: 'PRD 명세서, 서비스 정책/제약, 브랜딩 디자인, 화면 흐름 & 라우팅',
    stepIds: ['step5', 'step6', 'step7', 'step8']
  },
  {
    id: 'architecture',
    number: 3,
    title: 'Phase 3. 시스템 아키텍처 설계',
    titleEn: 'Architecture & Modeling',
    subtitle: '기술 선정 정의서(ADR), 데이터베이스 ERD, 토폴로지 구성도',
    stepIds: ['step9', 'step10', 'step11']
  },
  {
    id: 'development',
    number: 4,
    title: 'Phase 4. 개발 및 일정 관리',
    titleEn: 'Development & Sprint',
    subtitle: '개발 컨벤션, REST API 명세서, WBS 칸반 & AI 코딩 지시서',
    stepIds: ['step12', 'step13', 'step14']
  },
  {
    id: 'ops_maint',
    number: 5,
    title: 'Phase 5. 테스트 및 운영',
    titleEn: 'Ops & Maintenance',
    subtitle: 'QA 테스트케이스, 배포 릴리즈 타임라인, 트러블슈팅 아카이빙',
    stepIds: ['step15', 'step16', 'step17']
  }
];

// =====================================================================
// 4 PIPELINE TRACK PRESETS
// =====================================================================
export const TRACK_PRESET_STEPS: Record<
  'startup' | 'backend' | 'fullstack',
  Record<StepId, boolean>
> = {
  // 1. 비개발자/창업가 트랙 (10개 활성)
  startup: {
    step1: true,
    step2: true,
    step3: true,
    step4: true,
    step5: true,
    step6: true,
    step7: true,
    step8: true,
    step9: false,
    step10: false,
    step11: false,
    step12: false,
    step13: false,
    step14: true,
    step15: true,
    step16: false,
    step17: false
  },
  // 2. 백엔드 포트폴리오 트랙 (12개 활성)
  backend: {
    step1: true,
    step2: false,
    step3: false,
    step4: false,
    step5: true,
    step6: true,
    step7: false,
    step8: false,
    step9: true,
    step10: true,
    step11: true,
    step12: true,
    step13: true,
    step14: true,
    step15: true,
    step16: true,
    step17: true
  },
  // 3. 풀스택 전문가 트랙 (17개 전체 활성 - 기본값)
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
    step16: true,
    step17: true
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
  // Phase 1. 기획 및 비즈니스 (Planning)
  {
    id: 'step1',
    number: 1,
    phaseId: 'planning',
    title: '서비스 개요 및 기획서',
    shortTitle: '서비스 개요',
    subtitle: '동네 빵집 마감 할인 알림 및 예약 픽업 O2O 기획서',
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
    title: '비즈니스 모델 (BM)',
    shortTitle: '비즈니스 모델 (BM)',
    subtitle: '당일 마감 빵 50% 할인, 5% 중개 수수료 및 점주 구독 BM',
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
    title: '비용 및 예산 산정서',
    shortTitle: '비용 및 예산',
    subtitle: '클라우드 인프라, 알림톡/SMS, 지도 API 월간 운영 예산',
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
    title: '아이디어 백로그',
    shortTitle: '아이디어 백로그',
    subtitle: '단골 빵집 찜, 빵 나오는 시간표, 비건/알러지 뱃지 아이디어 큐',
    deliverable: '04_IDEA_BACKLOG.csv',
    personaName: 'Ideation Coach',
    personaRole: '제품 인큐베이터',
    modelTier: 'GPT-4o-mini',
    status: 'IN_PROGRESS',
    lastUpdated: '방금 동기화됨'
  },
  // Phase 2. UI/UX 및 요구사항 (Design & Spec)
  {
    id: 'step5',
    number: 5,
    phaseId: 'design_spec',
    title: '요구사항 명세서 (PRD)',
    shortTitle: '요구사항 (PRD)',
    subtitle: '점주 마감재고 등록, 1.5km 알림, 예약/결제 기능 및 비기능 목표',
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
    title: '서비스 정책 및 제약사항',
    shortTitle: '서비스 정책',
    subtitle: '취소/환불 규정, 노쇼 방지 보증금, 당일 식품 품질 및 위치정보 제약',
    deliverable: '06_SERVICE_POLICIES.md',
    personaName: 'Service Policy Lead',
    personaRole: '서비스 정책 & 규제 전문가',
    modelTier: 'GPT-4o',
    status: 'IN_PROGRESS',
    lastUpdated: '방금 생성됨'
  },
  {
    id: 'step7',
    number: 7,
    phaseId: 'design_spec',
    title: '브랜딩 & 디자인 시스템',
    shortTitle: '브랜딩 & 디자인',
    subtitle: '베이커리 크루아상 심볼, 웜톤 오렌지 스와치, 타이포그래피',
    deliverable: '07_DESIGN_SYSTEM.tokens',
    personaName: 'Design System Lead',
    personaRole: '비주얼 디자인 아키텍트',
    modelTier: 'Claude 3.5 Sonnet',
    status: 'IN_PROGRESS',
    lastUpdated: '방금 동기화됨'
  },
  {
    id: 'step8',
    number: 8,
    phaseId: 'design_spec',
    title: '화면 흐름도 & 프론트 라우팅',
    shortTitle: '화면 흐름 & 라우팅',
    subtitle: '지도 빵집 탐색 -> 잔여 재고 조회 -> 예약/결제 -> 픽업 바코드 티켓',
    deliverable: '08_UI_SCREEN_FLOW.canvas',
    personaName: 'Principal UX Architect',
    personaRole: '수석 인터랙션 디자이너',
    modelTier: 'Claude 3.5 Sonnet',
    status: 'COMPLETED',
    lastUpdated: '8분 전 확정'
  },
  // Phase 3. 시스템 아키텍처 설계 (Architecture)
  {
    id: 'step9',
    number: 9,
    phaseId: 'architecture',
    title: '기술 스택 선정 정의서 (ADR)',
    shortTitle: '기술 선정 (ADR)',
    subtitle: 'PostgreSQL 15 단일 DB, JPA 낙관적 락(@Version), SSE 단방향 알림',
    deliverable: '09_ADR_DECISIONS.md',
    personaName: 'Enterprise Architect',
    personaRole: '수석 기술 아키텍트',
    modelTier: 'Claude 3.5 Sonnet',
    status: 'IN_PROGRESS',
    lastUpdated: '20분 전 갱신'
  },
  {
    id: 'step10',
    number: 10,
    phaseId: 'architecture',
    title: '데이터베이스 설계 (ERD)',
    shortTitle: '데이터베이스 (ERD)',
    subtitle: 'stores, bread_items, discount_schedules, reservations 테이블',
    deliverable: '10_SCHEMA_POSTGRESQL.sql',
    personaName: 'Principal DB Architect',
    personaRole: '데이터베이스 아키텍트',
    modelTier: 'Claude 3.5 Sonnet',
    status: 'IN_PROGRESS',
    lastUpdated: '방금 동기화됨'
  },
  {
    id: 'step11',
    number: 11,
    phaseId: 'architecture',
    title: '시스템 아키텍처 구성도',
    shortTitle: '시스템 아키텍처',
    subtitle: '모바일 웹 -> ALB -> Spring Boot -> PostgreSQL + SSE 알림 허브',
    deliverable: '11_SYSTEM_TOPOLOGY.tf',
    personaName: 'Cloud Infra Architect',
    personaRole: '클라우드 인프라 아키텍트',
    modelTier: 'GPT-4o',
    status: 'IN_PROGRESS',
    lastUpdated: '5분 전 편집됨'
  },
  // Phase 4. 개발 및 일정 관리 (Development)
  {
    id: 'step12',
    number: 12,
    phaseId: 'development',
    title: '개발 컨벤션 정의서',
    shortTitle: '개발 컨벤션',
    subtitle: 'GitHub-flow 브랜치 전략, 커밋 메시지 규칙, 빵집 서비스 패키지 구조',
    deliverable: '12_DEV_CONVENTIONS.md',
    personaName: 'Engineering Standards Lead',
    personaRole: '개발 문화 & 컨벤션 리드',
    modelTier: 'GPT-4o-mini',
    status: 'IN_PROGRESS',
    lastUpdated: '방금 생성됨'
  },
  {
    id: 'step13',
    number: 13,
    phaseId: 'development',
    title: '백엔드 API 명세서',
    shortTitle: '백엔드 API 명세',
    subtitle: '주변 빵집 조회, 마감 할인 등록, 픽업 예약 및 결제 REST API',
    deliverable: '13_OPENAPI_SPEC.json',
    personaName: 'Staff API & DX Lead',
    personaRole: '수석 백엔드 API 리드',
    modelTier: 'Claude 3.5 Sonnet',
    status: 'IN_PROGRESS',
    lastUpdated: '방금 동기화됨'
  },
  {
    id: 'step14',
    number: 14,
    phaseId: 'development',
    title: 'WBS 및 일정 칸반 보드',
    shortTitle: 'WBS & 칸반 보드',
    subtitle: '동시 예약 락 제어, SSE 알림 브로드캐스트, 픽업 QR 검증 스프린트',
    deliverable: '14_WBS_SPRINT_BOARD.kanban',
    personaName: 'Agile Delivery Lead',
    personaRole: '스크럼 마스터 & 딜리버리 리드',
    modelTier: 'GPT-4o-mini',
    status: 'IN_PROGRESS',
    lastUpdated: '3분 전 갱신됨'
  },
  // Phase 5. 테스트 및 운영 (Ops & Maintenance)
  {
    id: 'step15',
    number: 15,
    phaseId: 'ops_maint',
    title: '테스트 케이스 & QA',
    shortTitle: '테스트 & QA',
    subtitle: '마지막 1개 빵 동시 예약 경쟁 검증, k6 1000 TPS 부하 테스트',
    deliverable: '15_QA_TEST_CASES.spec',
    personaName: 'QA Automation Lead',
    personaRole: '품질 보증 & 부하 테스트 엔지니어',
    modelTier: 'Claude 3.5 Sonnet',
    status: 'IN_PROGRESS',
    lastUpdated: '방금 갱신됨'
  },
  {
    id: 'step16',
    number: 16,
    phaseId: 'ops_maint',
    title: '배포 이력 & 릴리즈 노트',
    shortTitle: '배포 & 릴리즈',
    subtitle: 'v1.2.0 마감 할인 픽업 정식 런칭, 낙관적 락 탑재, 롤백 런북',
    deliverable: '16_RELEASE_HISTORY.log',
    personaName: 'SRE & Release Copilot',
    personaRole: '릴리즈 매니저',
    modelTier: 'GPT-4o',
    status: 'IN_PROGRESS',
    lastUpdated: 'v1.5.0 운영 중'
  },
  {
    id: 'step17',
    number: 17,
    phaseId: 'ops_maint',
    title: '트러블슈팅 아카이빙',
    shortTitle: '트러블슈팅 일지',
    subtitle: '마감세일 동시성 오버셀링 해결(낙관적 락), SSE 타임아웃 핑 프레임',
    deliverable: '17_TROUBLESHOOTING.archive',
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
    tierSpec: 'bread-alert.kr 도메인 + 호스팅 영역 1개',
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
    sentTicketKey: 'BREAD-42'
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
  serviceName: '마감빵빵 (Last-Bread)',
  brandName: '마감빵빵 (Last-Bread)',
  slogan: '동네 빵집의 갓 구운 빵, 마감 전 반값에 만나는 따뜻한 습관',
  brandStory:
    '마감빵빵은 소상공인 베이커리의 당일 생산 빵 폐기율을 0%로 줄이고, 동네 주민에게는 고품질 빵을 합리적인 가격에 제공하는 실시간 마감 할인 예약 픽업 플랫폼입니다. 마감 3시간 전 남은 빵을 30초 만에 퀵 등록하고, 반경 1.5km 주민에게 SSE 알림을 발송하여 오버셀링 없이 안전하게 예약할 수 있습니다.',
  symbolMeaning:
    '따스하게 피어오르는 갓 구운 크루아상 실루엣과 실시간 시계 바늘이 결합되어, 마감 직전의 따뜻한 가치와 시간의 소중함을 상징합니다.',
  logoSymbolSvg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 28C8 20 15 14 24 14C33 14 40 20 40 28C40 33 36 36 31 36H17C12 36 8 33 8 28Z" stroke="#FF6B00" stroke-width="3" stroke-linejoin="round"/><path d="M16 26C18 20 22 17 28 17" stroke="#FF9500" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="27" r="2.5" fill="#FF6B00"/><path d="M24 22V27L27 29" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/></svg>`,
  designPrinciples: [
    { title: 'Warmth & Trust', desc: '따뜻한 빵의 온기와 당일 생산 식품의 정직한 위생 신뢰를 시각화합니다.' },
    { title: 'Hyperlocal Signal', desc: '반경 1.5km 내 긴급 마감 할인율(30~70%)을 고대비 앰버 오렌지로 즉시 식별합니다.' },
    { title: 'Zero Friction Action', desc: '30초 퀵 등록과 1초 픽업 바코드 스캔을 위한 절제된 여백과 고기능 그리드를 적용합니다.' }
  ],
  colorSwatches: [
    { name: 'Warm Amber', role: 'Primary Accent / Crust', hex: '#FF6B00' },
    { name: 'Golden Honey', role: 'Highlight / Butter', hex: '#FF9500' },
    { name: 'Canvas Dark', role: 'Background', hex: '#0f1117' },
    { name: 'Surface Well', role: 'Surface', hex: '#181a20' }
  ],
  primaryColors: [
    {
      name: 'Warm Amber',
      role: 'Primary Brand / Signal Accent',
      hex: '#FF6B00',
      oklch: 'oklch(64% 0.22 45)'
    },
    {
      name: 'Golden Honey',
      role: 'Primary Hover & Highlight',
      hex: '#FF9500',
      oklch: 'oklch(71% 0.18 55)'
    },
    {
      name: 'Soft Tint Amber',
      role: 'Selection / Chip Background',
      hex: '#FFF3E8',
      oklch: 'oklch(64% 0.22 45 / 0.12)'
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
    frontend: `breadalert-frontend/
├── public/                 # Favicon, Logo assets, OG image
├── src/
│   ├── assets/             # SVG & Static media
│   ├── components/         # 17 Specialized Module Viewers & Modals
│   ├── index.css           # Tailwind v4 @theme OKLCH design tokens
│   ├── main.tsx            # React 19 bootstrap
│   ├── mockData.ts         # Pipeline data ledger & types
│   └── App.tsx             # 3-Pane workspace shell & stage router
├── package.json
└── vite.config.ts`,
    backend: `breadalert-backend/
├── src/main/java/com/breadalert/
│   ├── domain/             # Entities, Repositories, Domain Services
│   │   ├── auth/           # Member, JWT, Session
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
        namingConvention: 'feature/{ticket-key}-{short-desc} (ex: feature/BREAD-12-kakao-login)'
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
    frontendTree: `breadalert-frontend/
├── public/                 # Favicon, Logo assets, OG image
├── src/
│   ├── assets/             # SVG & Static media
│   ├── components/         # 17 Specialized Module Viewers & Modals
│   ├── index.css           # Tailwind v4 @theme OKLCH design tokens
│   ├── main.tsx            # React 19 bootstrap
│   ├── mockData.ts         # Pipeline data ledger & types
│   └── App.tsx             # 3-Pane workspace shell & stage router
├── package.json
└── vite.config.ts`,
    backendTree: `breadalert-backend/
├── src/main/java/com/breadalert/
│   ├── domain/             # Entities, Repositories, Domain Services
│   │   ├── auth/           # Member, JWT, Session
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
  domainGroup:
    | '인증 및 세션'
    | '점주 마감 등록'
    | '픽업 예약/결제'
    | '실시간 알림'
    | '탐색 및 위치'
    | '픽업 및 매장 인증';
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
    domainGroup: '탐색 및 위치',
    method: 'GET',
    path: '/api/v1/stores/nearby',
    summary: '반경 1.5km 마감 할인 빵집 지도/목록 실시간 조회',
    authScope: 'Public',
    reqRef: 'REQ-MAP-02',
    requestJson: `/* Query Parameters: lat=37.5665&lng=126.9780&radius=1500&sort=discount */`,
    responseJson: `{
  "totalStores": 14,
  "stores": [
    {
      "storeId": "str_1001",
      "name": "성심 베이커리 서촌점",
      "distanceMeters": 380,
      "discountRateRange": "40% ~ 50%",
      "remainingTotalQty": 9,
      "pickupCutoff": "21:30",
      "items": [
        { "name": "소금빵 3입", "discountPrice": 5400, "remaining": 5 },
        { "name": "통밀 바게트", "discountPrice": 3500, "remaining": 4 }
      ]
    }
  ]
}`,
    rfc7807ErrorJson: `{
  "type": "https://api.breadalert.kr/errors/invalid-coordinates",
  "title": "Invalid Coordinates",
  "status": 400,
  "detail": "위도와 경도 좌표 파라미터가 유효한 범위를 벗어났습니다.",
  "instance": "/api/v1/stores/nearby"
}`
  },
  {
    id: 'api-2',
    domainGroup: '점주 마감 등록',
    method: 'POST',
    path: '/api/v1/stores/{storeId}/discount-items',
    summary: '마감 할인 빵 품목 30초 퀵 등록',
    authScope: 'StoreOwner',
    reqRef: 'REQ-STORE-01',
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
  "type": "https://api.breadalert.kr/errors/invalid-pickup-time",
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
  "qrCodeUrl": "https://cdn.breadalert.kr/qr/rsv_44c892a1.png",
  "cancelDeadline": "2026-10-31T21:00:00Z"
}`,
    rfc7807ErrorJson: `{
  "type": "https://api.breadalert.kr/errors/optimistic-lock-conflict",
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
    reqRef: 'REQ-NOTI-05',
    requestJson: `/* No Request Body (Headers: Accept: text/event-stream) */`,
    responseJson: `event: notification
data: { "type": "DISCOUNT_STARTED", "storeName": "성심 베이커리", "message": "마감 할인 40%가 시작되었습니다!" }`,
    rfc7807ErrorJson: `{
  "type": "https://api.breadalert.kr/errors/sse-timeout",
  "title": "Stream Timeout",
  "status": 504,
  "detail": "알림 연결이 타임아웃되었습니다. 자동 재연결을 시도합니다.",
  "instance": "/api/v1/notifications/stream"
}`
  },
  {
    id: 'api-5',
    domainGroup: '픽업 및 매장 인증',
    method: 'POST',
    path: '/api/v1/reservations/{id}/pickup-verify',
    summary: '[점주] 현장 바코드/QR 스캔 및 수령 완료 확정',
    authScope: 'StoreOwner',
    reqRef: 'REQ-TICK-04',
    requestJson: `{
  "barcodeToken": "bc_99a81c20f",
  "scannedAt": "2026-10-31T21:18:22Z"
}`,
    responseJson: `{
  "reservationId": "rsv_44c892a1",
  "status": "COMPLETED",
  "verified": true,
  "completedAt": "2026-10-31T21:18:22Z",
  "settlementExpectedAmount": 5400
}`,
    rfc7807ErrorJson: `{
  "type": "https://api.breadalert.kr/errors/already-picked-up",
  "title": "Already Completed",
  "status": 400,
  "detail": "이미 수령 완료되었거나 유효하지 않은 바코드입니다.",
  "instance": "/api/v1/reservations/rsv_44c892a1/pickup-verify"
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
    ticketKey: 'BREAD-01',
    title: '점주 마감 빵 30초 퀵 등록 및 반경 1.5km 브로드캐스트',
    description:
      '마감 3시간 전 당일 남은 빵 품목, 수량, 할인율(30~70%) 30초 퀵 등록 및 SSE 발송',
    priority: 'P0',
    assignee: {
      name: '김준호',
      initials: 'JH',
      color: 'bg-accent text-accent-ink',
      role: 'Backend Lead'
    },
    deadline: '2026-11-04',
    storyPoints: 5,
    reqRef: 'REQ-STORE-01',
    category: 'Backend',
    status: 'done',
    aiPromptSnippet: `// 🤖 Cursor / Copilot AI 개발 지시 프롬프트 (BREAD-01)
// [맥락 연계: REQ-STORE-01 + 10 ERD stores/discount_items + 11 SSE Hub]
Implement bakery owner quick-discount registration API in Spring Boot 3:
1. Endpoint: POST /api/v1/stores/{storeId}/discounts
2. Validate: discountRate is between 30 and 70 (POL-DISC-03).
3. In a single @Transactional boundary:
   - Save DiscountItem entities with initial version = 0.
   - Publish StoreDiscountOpenedEvent for SSE broadcasting to clients within 1.5km.
4. Return 201 Created with generated discount item IDs.`
  },
  {
    id: 'k2',
    ticketKey: 'BREAD-02',
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
    aiPromptSnippet: `// 🤖 Cursor / Copilot AI 개발 지시 프롬프트 (BREAD-02)
// [맥락 연계: REQ-RESV-03 + 09 ADR-02 낙관적 락 + 10 ERD discount_items]
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
    ticketKey: 'BREAD-03',
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
    aiPromptSnippet: `// 🤖 Cursor / Copilot AI 개발 지시 프롬프트 (BREAD-03)
// [맥락 연계: REQ-NOTI-04 + 11 아키텍처 Nginx + 09 ADR-03 SSE]
Implement Server-Sent Events controller in Spring Boot 3:
1. Endpoint: GET /api/v1/notifications/stream (produces = MediaType.TEXT_EVENT_STREAM_VALUE)
2. SseEmitter timeout: 30 minutes.
3. Send periodic heartbeat comments every 25 seconds: ': keep-alive\\n\\n' to prevent Nginx proxy_read_timeout (60s).
4. On application event (ReservationCreatedEvent), find user's emitter and send JSON payload.`
  },
  {
    id: 'k4',
    ticketKey: 'BREAD-04',
    title: '현장 방문 수령 1회용 픽업 바코드 생성 및 점주 검증 API',
    description:
      '예약 보증금 결제 후 고객 화면에 1회용 바코드를 렌더링하고, 점주 스캔 시 1초 만에 픽업 완료 처리하는 API 구현',
    priority: 'P0',
    assignee: {
      name: '최영희',
      initials: 'YH',
      color: 'bg-accent-strong text-accent-ink',
      role: 'Frontend Specialist'
    },
    deadline: '2026-11-05',
    storyPoints: 5,
    reqRef: 'REQ-TICK-04',
    category: 'Frontend',
    status: 'done',
    aiPromptSnippet: `// 🤖 Cursor / Copilot AI 개발 지시 프롬프트 (BREAD-04)
// [맥락 연계: REQ-TICK-04 + 08 화면 흐름 04번 티켓 화면 + 13 API 명세]
Implement pickup barcode verification endpoint:
1. Endpoint: POST /api/v1/reservations/{id}/pickup-verify
2. Validate storeOwnerPin and barcodeToken expiration (valid for 3 hours).
3. Update Reservation status to COMPLETED and record completedAt timestamp.
4. If already picked up, throw RFC 7807 (400 Bad Request with "Already Completed").`
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
    testTitle: '타인의 픽업 예약 바코드 티켓 위조 및 비인가 접근 차단',
    precondition: '다른 회원의 유효한 reservation_id 준비',
    testSteps: [
      '타인 계정 토큰 또는 만료된 세션으로 GET /api/v1/reservations/{id}/ticket 요청',
      '위조된 QR 바코드 토큰으로 검증 API 호출'
    ],
    expectedResult: 'HTTP 403 Forbidden 반환 및 픽업 바코드 노출 즉시 차단.',
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
    rollbackCommand: 'kubectl rollout undo deployment/breadalert-api --to-revision=3',
    rollbackNote: 'Redis 장애 발생 시 application.yml의 cache.enabled=false 플래그 즉시 롤백 가능',
    rollbackGuide: 'kubectl rollout undo deployment/breadalert-api --to-revision=3',
    environment: 'Production'
  },
  {
    id: 'rel-2',
    version: 'v1.0.1',
    releaseTitle: '노쇼 보증금 자동 취소 및 모바일 지도 반응성 핫픽스',
    deployedAt: '2026-10-27 14:15:00 (KST)',
    status: 'Production',
    commitRef: '2e179c8',
    commitHash: '2e179c8',
    highlights: [
      '픽업 10분 전 미도착 알림톡 자동 발송 및 취소 수수료 처리 로직 추가',
      '네이버 지도 마커 클러스터링 및 반경 1.5km 핀치 줌 핫픽스'
    ],
    changelog: [
      '픽업 10분 전 미도착 알림톡 자동 발송 및 취소 수수료 처리 로직 추가',
      '네이버 지도 마커 클러스터링 및 반경 1.5km 핀치 줌 핫픽스'
    ],
    rollbackTarget: 'v1.0.0 (commit 10a82f1)',
    rollbackCommand: 'kubectl rollout undo deployment/breadalert-api --to-revision=2',
    rollbackNote: '무중단 롤링 업데이트로 다운타임 0초 유지',
    rollbackGuide: 'kubectl rollout undo deployment/breadalert-api --to-revision=2',
    environment: 'Production'
  },
  {
    id: 'rel-3',
    version: 'v1.0.0',
    releaseTitle: '동네 빵집 마감할인 서비스 MVP 첫 배포',
    deployedAt: '2026-10-20 11:00:00 (KST)',
    status: 'Production',
    commitRef: '10a82f1',
    commitHash: '10a82f1',
    highlights: [
      '01 서비스 기획부터 17 트러블슈팅까지 베이커리 O2O 시스템 개시',
      'PostgreSQL PostGIS 공간 인덱스 및 낙관적 락 재고 차감 엔진 구축'
    ],
    changelog: [
      '01 서비스 기획부터 17 트러블슈팅까지 베이커리 O2O 시스템 개시',
      'PostgreSQL PostGIS 공간 인덱스 및 낙관적 락 재고 차감 엔진 구축'
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
  versionTrack?: 'v1.0 MVP' | 'v1.1 동시성 락' | 'v1.5 성능 개선' | string;
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
    title: '마감 세일 오픈(20:00) 시 동일 빵 동시 결제 폭주로 인한 재고 오버셀링 및 마이너스 재고 발생',
    versionTrack: 'v1.1 동시성 락',
    resolvedInVersion: 'v1.1.0',
    resolvedAt: '2026-10-25',
    severity: 'Critical',
    tags: ['OptimisticLock', 'JPA', 'Concurrency', 'OverSelling'],
    problemSymptom:
      '오후 8시 마감 할인 시작 시 잔여 수량 2개 남은 빵 품목에 50여 명이 동시 결제를 시도하여 재고가 -8개로 음수화되는 오버셀링 장애 발생.',
    rootCause:
      '단순 SELECT 후 UPDATE 방식에서 트랜잭션 격리 레벨 락 부재로 다중 스레드 경쟁 상태(Race Condition) 발생.',
    solutionMechanisms: [
      'discount_schedules 엔티티에 @Version 컬럼 추가하여 JPA 낙관적 락(Optimistic Lock) 적용',
      '충돌 시 OptimisticLockingFailureException 캐치 후 프론트엔드에 409 Conflict 품절 처리 안내'
    ],
    metricsBefore: {
      metricName: '오버셀링 발생률',
      value: '4.8% (재고 음수 발생)',
      numericValue: 4.8
    },
    metricsAfter: {
      value: '0% (정합성 100%)',
      numericValue: 0
    },
    symptomAndCause:
      '오후 8시 마감 할인 시작 시 잔여 수량 2개 남은 빵 품목에 50여 명이 동시 결제를 시도하여 재고가 -8개로 음수화되는 오버셀링 장애 발생.',
    resolutionProcess:
      '1) discount_schedules 엔티티에 @Version 컬럼을 추가하여 JPA 낙관적 락(Optimistic Lock) 적용. 2) 충돌 발생 시 409 Conflict 응답과 함께 "다른 고객이 먼저 결제 완료했습니다" 팝업 모달 제공.',
    beforeMetric: '오버셀링 발생률 4.8%',
    afterMetric: '오버셀링 0건 (정합성 100%)',
    improvementSummary: '동시성 락을 통한 재고 음수 결제 원천 차단',
    metricComparison: {
      label: '오버셀링 발생률',
      beforeVal: 4.8,
      afterVal: 0,
      unit: '%'
    }
  }
];

// =====================================================================
// STEP 05: PRD REQUIREMENTS (FUNCTIONAL & NON-FUNCTIONAL)
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

export interface PrdNonFunctionalReq {
  id: string;
  nfrCode: string;
  category: '성능 및 지연시간' | '동시성 및 신뢰성' | '가용성' | '보안 및 개인정보' | '확장성';
  title: string;
  targetMetric: string;
  verificationMethod: string;
  priority: 'P0' | 'P1' | 'P2';
  status: 'Confirmed' | 'Review';
}

export const INITIAL_PRD_REQUIREMENTS: PrdRequirement[] = [
  {
    id: 'req_1',
    reqCode: 'REQ-STORE-01',
    category: '점주 마감 등록',
    title: '마감 할인 품목 30초 퀵 등록 및 잔여 재고 설정',
    specification:
      '빵집 점주가 당일 마감 시간대 할인율(30~70%), 잔여 빵 수량, 픽업 마감 시각을 30초 내 모바일로 퀵 등록.',
    acceptanceCriteria: '등록 완료 즉시 반경 1.5km 고객 실시간 피드에 노출되고 잔여 수량 반영',
    priority: 'P0',
    status: 'Confirmed'
  },
  {
    id: 'req_2',
    reqCode: 'REQ-MAP-02',
    category: '탐색 및 위치',
    title: '반경 1.5km 동네 빵집 마감 할인 지도/목록 실시간 조회',
    specification:
      '소비자 현재 GPS 위치 기준 1.5km 이내의 당일 마감 세일 진행 빵집 위치, 남은 빵 종류, 할인율 지도 핀 표시.',
    acceptanceCriteria: 'GPS 위치 변경 시 3초 이내 주변 베이커리 목록 갱신 및 마감 여부 뱃지 표시',
    priority: 'P0',
    status: 'Confirmed'
  },
  {
    id: 'req_3',
    reqCode: 'REQ-RESV-03',
    category: '예약 및 결제',
    title: '동시성 제어 기반 마감 빵 픽업 예약 및 수량 실시간 차감',
    specification:
      '소비자가 희망 빵 품목과 수량을 선택해 픽업 예약. 다수 동시 요청 시 재고 오버셀링 방지 락 처리.',
    acceptanceCriteria: '마지막 1개 잔여 빵 동시 예약 시 단 1건만 승인되고 후속 요청은 실시간 품절 안내',
    priority: 'P0',
    status: 'Confirmed'
  },
  {
    id: 'req_4',
    reqCode: 'REQ-TICK-04',
    category: '픽업 및 매장 인증',
    title: '현장 수령용 1회용 픽업 바코드/QR 발급 및 점주 인증',
    specification:
      '예약 완료 시 고객 모바일 화면에 1회용 바코드 티켓 생성. 점주 화면에서 바코드 확인/스캔 시 수령 완료 처리.',
    acceptanceCriteria: '바코드 인증 완료 시 예약 상태가 COMPLETED로 변경되고 점주 정산 대기금으로 반영',
    priority: 'P0',
    status: 'Confirmed'
  },
  {
    id: 'req_5',
    reqCode: 'REQ-NOTI-05',
    category: '실시간 알림',
    title: '단골 빵집 마감 세일 시작 시 실시간 SSE 및 앱 푸시 발송',
    specification:
      '소비자가 찜한 단골 베이커리가 마감 세일을 시작하면 즉시 인앱 SSE 알림 및 카카오 알림톡/푸시 전송.',
    acceptanceCriteria: '마감 등록 이벤트 발생 후 대상 고객에게 3초 이내 푸시 도착 보장',
    priority: 'P1',
    status: 'Confirmed'
  }
];

export const INITIAL_PRD_NON_FUNCTIONAL: PrdNonFunctionalReq[] = [
  {
    id: 'nfr_1',
    nfrCode: 'NFR-PERF-01',
    category: '성능 및 지연시간',
    title: '마감 세일 실시간 알림 전달 지연시간',
    targetMetric: '점주 마감 등록 후 3.0초 이내 반경 1.5km 고객 디바이스 수신',
    verificationMethod: 'k6 부하 테스트 스크립트 및 SSE 수신 핑 타임스탬프 로깅 검증',
    priority: 'P0',
    status: 'Confirmed'
  },
  {
    id: 'nfr_2',
    nfrCode: 'NFR-CONCUR-02',
    category: '동시성 및 신뢰성',
    title: '마감 빵 동시 예약 초과 판매(오버셀링) 0건 보장',
    targetMetric: '동일 상품 잔여 1개에 대해 100건 동시 요청 시 성공 1건, 초과 차감 0건',
    verificationMethod: 'JPA 낙관적 락(@Version) 격리성 및 동시성 통합 테스트(ConcurrencyTest.java)',
    priority: 'P0',
    status: 'Confirmed'
  },
  {
    id: 'nfr_3',
    nfrCode: 'NFR-AVAIL-03',
    category: '가용성',
    title: '마감 집중 시간대(19:00~22:00) 고가용성 보장',
    targetMetric: '마감 피크 3시간 가용률 99.9% (월간 무중단 다운타임 4.3분 이하)',
    verificationMethod: 'AWS ALB 헬스체크 및 다중 가용영역(Multi-AZ) 무중단 롤링 배포 검증',
    priority: 'P0',
    status: 'Confirmed'
  },
  {
    id: 'nfr_4',
    nfrCode: 'NFR-SEC-04',
    category: '보안 및 개인정보',
    title: '위치 정보 보호법 준수 및 고객 GPS 비식별화',
    targetMetric: '소비자 정확한 위경도 좌표는 영구 저장 금지, 반경 1.5km H3 헥사곤 매핑 후 폐기',
    verificationMethod: 'DB DDL 감사 및 위치정보 처리 로그 개인정보 암호화 점검',
    priority: 'P0',
    status: 'Confirmed'
  },
  {
    id: 'nfr_5',
    nfrCode: 'NFR-RESP-05',
    category: '성능 및 지연시간',
    title: '주변 베이커리 마감 목록 조회 API 응답속도',
    targetMetric: '동시 접속 1,000 유저 기준 p95 응답시간 120ms 이하',
    verificationMethod: 'PostgreSQL PostGIS 공간 인덱스(GiST) 쿼리 플랜 및 JMeter 부하 검증',
    priority: 'P1',
    status: 'Confirmed'
  }
];

// =====================================================================
// STEP 06: SERVICE POLICY & CONSTRAINTS TYPES & DATA
// =====================================================================
export interface ServicePolicyItem {
  id: string;
  policyCode: string;
  category: '비즈니스 운영 정책' | '법적 및 보안 제약' | '외부 연동 제약';
  title: string;
  ruleSummary: string;
  details: string;
  enforcementMethod: string;
  impactLevel: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Review';
}

export const INITIAL_SERVICE_POLICIES: ServicePolicyItem[] = [
  {
    id: 'pol_1',
    policyCode: 'POL-RESV-01',
    category: '비즈니스 운영 정책',
    title: '마감 할인 픽업 예약 취소 및 전액 환불 기준',
    ruleSummary: '픽업 예정 시각 10분 전까지 취소 시 100% 환불, 이후 취소 불가',
    details:
      '당일 마감 폐기 임박 베이커리 특성상, 픽업 10분 전 이후 취소 시 다른 고객에게 재판매가 불가능하므로 단순 변심 환불을 엄격히 제한합니다.',
    enforcementMethod: '결제 시스템 환불 승인 인터셉터 및 픽업 10분 전 자동 취소 버튼 비활성화',
    impactLevel: 'High',
    status: 'Active'
  },
  {
    id: 'pol_2',
    policyCode: 'POL-NOSHOW-02',
    category: '비즈니스 운영 정책',
    title: '노쇼(No-Show) 페널티 및 예약 제한 규정',
    ruleSummary: '예약 시간 내 미픽업 시 결제금 환불 불가 및 누적 2회 시 7일간 서비스 예약 차단',
    details:
      '소상공인 빵집 점주의 재고 폐기 피해를 방지하기 위해 정해진 마감 시각까지 픽업하지 않은 경우 보증금/결제금은 매장 점주에게 귀속되며 노쇼 계정은 일시 정지 조치됩니다.',
    enforcementMethod: '매장 마감 시각 스케줄러 배치 처리로 미수령 주문 NOSHOW 확정 및 페널티 카운트',
    impactLevel: 'High',
    status: 'Active'
  },
  {
    id: 'pol_3',
    policyCode: 'POL-DISC-03',
    category: '비즈니스 운영 정책',
    title: '마감 할인 등록 가이드라인 및 할인율 제한',
    ruleSummary: '당일 생산 당일 소진 베이커리 한정, 정가 대비 최소 30% ~ 최대 70% 할인율 강제',
    details:
      '고객 신뢰 확보를 위해 전일 생산 재고는 일절 등록할 수 없으며, 마감 할인 본래 취지에 부합하도록 최소 30% 이상의 할인율을 적용해야만 알림이 발송됩니다.',
    enforcementMethod: '점주 마감 상품 등록 폼 유효성 검사 (할인율 30~70% 범위 외 등록 차단)',
    impactLevel: 'Medium',
    status: 'Active'
  },
  {
    id: 'pol_4',
    policyCode: 'CST-LEGAL-01',
    category: '법적 및 보안 제약',
    title: '위치정보의 보호 및 이용 등에 관한 법률 준수',
    ruleSummary: '실시간 GPS 좌표는 영구 DB에 저장하지 않고, 반경 1.5km 헥사곤 단위 비식별 처리',
    details:
      '위치기반서비스 사업자 인허가 규정에 따라 고객의 동의를 획득한 후 1회성 매칭 연산에만 메모리 상에서 활용하고 디스크에는 행정동 단위 코드만 보관합니다.',
    enforcementMethod: '위치 요청 시 단발성 인메모리 거리 계산(ST_DWithin) 후 파라미터 폐기',
    impactLevel: 'High',
    status: 'Active'
  },
  {
    id: 'pol_5',
    policyCode: 'CST-FOOD-02',
    category: '법적 및 보안 제약',
    title: '식품위생법상 당일 제조 베이커리 위생 고지 및 알레르기 안내',
    ruleSummary: '당일 제조 식품 소비기한 명시, 유제품/육류 함유 빵 섭취 주의사항 라벨 표기',
    details:
      '상온 보관 시 변질 위험이 있는 크림빵, 샌드위치류는 당일 자정까지 섭취 권장 문구 및 난류, 우유, 대두 등 알레르기 유발 물질 정보를 상세 화면에 강제 노출합니다.',
    enforcementMethod: '빵 품목 마스터 등록 시 알레르기 성분 체크리스트 필수 입력 검증',
    impactLevel: 'High',
    status: 'Active'
  },
  {
    id: 'pol_6',
    policyCode: 'EXT-NOTI-01',
    category: '외부 연동 제약',
    title: '정보통신망법 야간 광고성 정보 수신 제한 (21:00 ~ 08:00)',
    ruleSummary: '야간 시간대(21시~08시)에는 마감 세일 푸시 발송 금지, 고객 사전 명시 동의 시에만 발송',
    details:
      '야간 수신 동의를 별도로 체크하지 않은 회원에게는 21시 이후 마감 세일 알림톡/푸시 발송을 자동 차단하고 인앱 피드 목록으로만 조용히 노출합니다.',
    enforcementMethod: '푸시 발송 서비스 내 야간 시간대 수신동의 플래그 필터링 인터셉터',
    impactLevel: 'Medium',
    status: 'Active'
  },
  {
    id: 'pol_7',
    policyCode: 'EXT-MAP-02',
    category: '외부 연동 제약',
    title: '네이버 지도/지오코딩 API 일일 무료 쿼터 초과 시 폴백',
    ruleSummary: '일일 10만 건 무료 쿼터 소진 시 매장 위경도 정적 캐시(Redis/Local) 자동 전환',
    details:
      '매장 좌표는 거의 변경되지 않는 정적 데이터이므로 매장 등록 시에만 지오코딩을 수행하고, 고객 조회 시에는 DB의 PostGIS 지점 좌표를 직접 활용하여 API 쿼터를 방어합니다.',
    enforcementMethod: '매장 주소 변경 시에만 네이버 Geocoding API 호출하는 캐싱 정책',
    impactLevel: 'Low',
    status: 'Active'
  }
];

// =====================================================================
// STEP 07: INITIAL UI/UX SCREEN NODES & EDGES
// =====================================================================
export const INITIAL_UX_NODES: UxScreenNode[] = [
  {
    id: 'ux_home',
    name: '01. 주변 마감빵 지도 & 목록',
    route: '/stores/nearby',
    screenType: 'Page',
    authLevel: 'Public',
    summary: '반경 1.5km 내 당일 마감 할인 진행 중인 빵집 지도 핀 및 실시간 할인율 목록',
    subComponents: ['NearbyMapViewer', 'StoreSummaryCard', 'DiscountFilterBar', 'BottomNav'],
    stateQueryParams: ['lat=37.5665', 'lng=126.9780', 'radius=1500', 'sort=discount'],
    backendApiEndpoint: 'GET /api/v1/stores/nearby',
    nextRouteActions: [
      { label: '빵집 상세 보기', targetRoute: '/stores/:storeId' },
      { label: '단골 빵집 알림 설정', targetRoute: '/notifications/settings' }
    ],
    x: 60,
    y: 80
  },
  {
    id: 'ux_store_detail',
    name: '02. 빵집 상세 & 잔여 재고',
    route: '/stores/:storeId',
    screenType: 'Page',
    authLevel: 'Public',
    summary: '선택 빵집의 당일 마감 할인 품목, 할인율, 픽업 마감 시각 및 남은 수량 조회',
    subComponents: ['StoreHeaderInfo', 'BreadItemRow', 'RemainingQtyBadge', 'CartFloatingBar'],
    stateQueryParams: ['storeId=102', 'tab=discount'],
    backendApiEndpoint: 'GET /api/v1/stores/:storeId/discounts',
    nextRouteActions: [
      { label: '마감 빵 픽업 예약', targetRoute: '/reservations/new' },
      { label: '지도 복귀', targetRoute: '/stores/nearby' }
    ],
    x: 360,
    y: 80
  },
  {
    id: 'ux_reservation',
    name: '03. 마감 빵 픽업 예약/결제',
    route: '/reservations/new',
    screenType: 'Modal',
    authLevel: 'Guest',
    summary: '희망 수량 선택, 픽업 예정 시각 지정, 노쇼 방지 보증금 토스 간편결제',
    subComponents: ['ReservationSummary', 'PickupTimePicker', 'TossPaymentWidget', 'NoShowAgreeModal'],
    stateQueryParams: ['scheduleId=501', 'qty=2'],
    backendApiEndpoint: 'POST /api/v1/reservations',
    nextRouteActions: [
      { label: '결제 및 예약 완료', targetRoute: '/reservations/:id/ticket' },
      { label: '취소', targetRoute: '/stores/:storeId' }
    ],
    x: 680,
    y: 80
  },
  {
    id: 'ux_ticket',
    name: '04. 현장 픽업 바코드 티켓',
    route: '/reservations/:id/ticket',
    screenType: 'Page',
    authLevel: 'Member',
    summary: '매장 방문 후 사장님께 제시할 1회용 픽업 바코드/QR코드 및 영수증 화면',
    subComponents: ['PickupBarcodeQr', 'StoreDirectionsCard', 'CountdownTimer', 'CancelButton'],
    stateQueryParams: ['resvId=resv_7721'],
    backendApiEndpoint: 'GET /api/v1/reservations/:id',
    nextRouteActions: [
      { label: '픽업 완료 영수증', targetRoute: '/receipt/:id' },
      { label: '홈으로 이동', targetRoute: '/stores/nearby' }
    ],
    x: 680,
    y: 300
  },
  {
    id: 'ux_owner_dashboard',
    name: '05. 사장님 마감 재고 퀵 등록',
    route: '/owner/stores/:storeId/discounts',
    screenType: 'Page',
    authLevel: 'Member',
    summary: '마감 3시간 전 당일 남은 빵 품목, 수량, 할인율(30~70%) 30초 퀵 등록 및 SSE 발송',
    subComponents: ['QuickStockInputRow', 'DiscountRateSlider', 'BroadcastAlertButton', 'TodaySalesCard'],
    stateQueryParams: ['storeId=102', 'mode=quick'],
    backendApiEndpoint: 'POST /api/v1/stores/:storeId/discounts',
    nextRouteActions: [
      { label: '실시간 예약 접수 확인', targetRoute: '/owner/reservations' },
      { label: '마감 세일 종료', targetRoute: '/owner/dashboard' }
    ],
    x: 360,
    y: 300
  }
];

export const INITIAL_UX_EDGES: UxFlowEdge[] = [
  {
    id: 'ux_edge_1',
    source: 'ux_home',
    target: 'ux_store_detail',
    sourcePort: 'right',
    targetPort: 'left',
    triggerLabel: '매장 카드 클릭',
    guardCondition: '당일 마감 진행 중'
  },
  {
    id: 'ux_edge_2',
    source: 'ux_store_detail',
    target: 'ux_reservation',
    sourcePort: 'right',
    targetPort: 'left',
    triggerLabel: '마감빵 예약 클릭',
    guardCondition: '잔여 재고 1개 이상'
  },
  {
    id: 'ux_edge_3',
    source: 'ux_reservation',
    target: 'ux_ticket',
    sourcePort: 'bottom',
    targetPort: 'top',
    triggerLabel: '보증금 결제 승인',
    guardCondition: '토스 간편결제 200 OK'
  },
  {
    id: 'ux_edge_4',
    source: 'ux_owner_dashboard',
    target: 'ux_store_detail',
    sourcePort: 'top',
    targetPort: 'bottom',
    triggerLabel: '30초 퀵 등록 완료',
    guardCondition: 'SSE 실시간 브로드캐스트'
  }
];

export const INITIAL_CANVAS_ZONES: CanvasZone[] = [
  {
    id: 'zone_consumer_flow',
    title: '소비자 마감빵 탐색 & 예약 픽업 동선',
    subtitle: '반경 1.5km 지도 조회 -> 잔여 재고 확인 -> 픽업 바코드 발급',
    x: 40,
    y: 40,
    width: 960,
    height: 220,
    tone: 'accent'
  },
  {
    id: 'zone_owner_flow',
    title: '베이커리 점주 마감 등록 & 인증 동선',
    subtitle: '30초 퀵 재고 등록 -> 픽업 바코드 스캔 완료 처리',
    x: 320,
    y: 260,
    width: 680,
    height: 180,
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
    email: 'dohyun@breadalert.kr',
    initials: 'DH',
    role: 'ADMIN',
    joinedAt: '2026-10-25'
  },
  {
    id: 'mem_3',
    name: '송지은',
    email: 'jieun.designer@breadalert.kr',
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
