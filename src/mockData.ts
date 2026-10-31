export type StepId =
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'
  | 'step6'
  | 'step7'
  | 'step8';

export type PipelineTrack = 'beginner' | 'expert' | 'custom';
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
  'step8'
];

export const TRACK_PRESET_STEPS: Record<'beginner' | 'expert', Record<StepId, boolean>> = {
  expert: {
    step1: true,
    step2: true,
    step3: true,
    step4: true,
    step5: true,
    step6: true,
    step7: true,
    step8: true
  },
  beginner: {
    step1: true,
    step2: false,
    step3: true,
    step4: true,
    step5: false,
    step6: true,
    step7: false,
    step8: false
  }
};

export interface PipelineStepInfo {
  id: StepId;
  number: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  personaName: string;
  personaRole: string;
  modelTier: string;
  status: StepStatus;
  lastUpdated: string;
}

export type PortSide = 'top' | 'right' | 'bottom' | 'left';

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
// STEP 03: UI/UX SCREEN FLOW TYPES
// =====================================================================
export interface UxScreenNode {
  id: string;
  name: string;
  route: string;
  screenType: 'Page' | 'Modal' | 'Workspace' | 'Drawer';
  summary: string;
  keyElements: string[];
  uxMetric: string;
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

// =====================================================================
// STEP 04: DATABASE ERD TYPES
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
// STEP 05: SYSTEM ARCHITECTURE TYPES
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
// STEP 06: WBS KANBAN TYPES
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
}

// =====================================================================
// STEP 07: API SPECIFICATION & IDE PROMPT TYPES
// =====================================================================
export interface ApiEndpointSpec {
  id: string;
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  authScope: string;
  reqRef: string;
  requestJson: string;
  responseJson: string;
}

export interface IdePromptItem {
  id: string;
  ticketRef: string;
  title: string;
  targetIde: string;
  linkedSteps: string[];
  promptCode: string;
}

// =====================================================================
// STEP 08: DEPLOYMENT, TROUBLESHOOTING & V2.0 BACKLOG TYPES
// =====================================================================
export interface DeploymentChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface DeploymentRecord {
  id: string;
  version: string;
  releaseTitle: string;
  deployedAt: string;
  status: 'DEPLOYED (Success)' | 'ROLLED_BACK';
  commitRef: string;
  highlights: string[];
  rollbackTarget: string;
  rollbackCommand: string;
  rollbackNote: string;
  checklist: DeploymentChecklistItem[];
}

export interface TroubleshootingItem {
  id: string;
  issueNumber: number;
  title: string;
  versionTrack: 'v1.0 MVP' | 'v1.5 성능 개선';
  resolvedInVersion: string;
  severity: 'Critical' | 'High' | 'Medium';
  causeAnalysis: string;
  resolutionProcess: string;
  beforeMetric: string;
  afterMetric: string;
  improvementSummary: string;
}

export interface BacklogIdeaItem {
  id: string;
  title: string;
  targetRelease: string;
  domainTag: string;
  description: string;
  priority: 'P0' | 'P1' | 'P2';
  sentTicketKey?: string;
}

// =====================================================================
// SHARED CHAT, PRD & MEMBER TYPES
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

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';
  joinedAt: string;
  isCurrentUser?: boolean;
}

// =====================================================================
// 8-STEP STANDARD LIFECYCLE PIPELINE METADATA
// =====================================================================
export const INITIAL_PIPELINE_STEPS: PipelineStepInfo[] = [
  {
    id: 'step1',
    number: 1,
    title: 'Step 01. 서비스 기획 및 BM',
    shortTitle: '서비스 기획 및 BM',
    subtitle: '문제 정의, 타겟 고객, 수익 모델',
    personaName: 'Product Strategist AI',
    personaRole: '비즈니스 전략 디렉터',
    modelTier: 'GPT-4o-mini',
    status: 'COMPLETED',
    lastUpdated: '25분 전 확정'
  },
  {
    id: 'step2',
    number: 2,
    title: 'Step 02. 요구사항 명세 (PRD)',
    shortTitle: '요구사항 명세 (PRD)',
    subtitle: '기능 및 비기능 요구사항, 우선순위 표',
    personaName: 'Lead PM Copilot',
    personaRole: '수석 테크니컬 PM',
    modelTier: 'Claude 3.5 Sonnet',
    status: 'COMPLETED',
    lastUpdated: '18분 전 확정'
  },
  {
    id: 'step3',
    number: 3,
    title: 'Step 03. 화면 흐름 및 UI/UX',
    shortTitle: '화면 흐름 및 UI/UX',
    subtitle: '화면 전환 플로우차트, 사용자 동선 설계',
    personaName: 'Principal UX Architect',
    personaRole: '프로덕트 디자이너',
    modelTier: 'Claude 3.5 Sonnet',
    status: 'COMPLETED',
    lastUpdated: '12분 전 확정'
  },
  {
    id: 'step4',
    number: 4,
    title: 'Step 04. 데이터베이스 설계 (ERD)',
    shortTitle: '데이터베이스 설계 (ERD)',
    subtitle: '테이블 스키마 PK/FK 및 DDL 동기화',
    personaName: 'Principal DB Architect',
    personaRole: '데이터 아키텍트',
    modelTier: 'Claude 3.5 Sonnet',
    status: 'IN_PROGRESS',
    lastUpdated: '방금 동기화됨'
  },
  {
    id: 'step5',
    number: 5,
    title: 'Step 05. 시스템 아키텍처 구성도',
    shortTitle: '시스템 아키텍처 구성도',
    subtitle: 'VPC 서브넷, Spring Boot, RDBMS, Redis',
    personaName: 'Cloud Infra Architect',
    personaRole: '인프라 아키텍트',
    modelTier: 'GPT-4o',
    status: 'IN_PROGRESS',
    lastUpdated: '3분 전 편집됨'
  },
  {
    id: 'step6',
    number: 6,
    title: 'Step 06. WBS 및 일정 칸반 보드',
    shortTitle: 'WBS 및 일정 칸반',
    subtitle: '태스크 분할, 담당자 배정, 스프린트 추적',
    personaName: 'Agile Delivery Lead',
    personaRole: '스크럼 마스터',
    modelTier: 'GPT-4o-mini',
    status: 'IN_PROGRESS',
    lastUpdated: '5분 전 갱신됨'
  },
  {
    id: 'step7',
    number: 7,
    title: 'Step 07. 개발 컨벤션 & API 명세',
    shortTitle: '컨벤션 & API 명세',
    subtitle: 'REST API 스펙, Git 전략, IDE 코딩 프롬프트',
    personaName: 'Staff API & DX Lead',
    personaRole: '수석 백엔드 리드',
    modelTier: 'Claude 3.5 Sonnet',
    status: 'IN_PROGRESS',
    lastUpdated: '방금 생성됨'
  },
  {
    id: 'step8',
    number: 8,
    title: 'Step 08. 운영 & 트러블슈팅 아카이빙',
    shortTitle: '운영 & 트러블슈팅',
    subtitle: '배포 릴리즈 노트, 장애 해결 일지, 백로그',
    personaName: 'SRE & Release Copilot',
    personaRole: '사이트 신뢰성 엔지니어',
    modelTier: 'GPT-4o',
    status: 'IN_PROGRESS',
    lastUpdated: 'v1.5.0 운영 중'
  }
];

// =====================================================================
// STEP 02: PRD REQUIREMENTS DATA
// =====================================================================
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
  },
  {
    id: 'r5',
    reqCode: 'REQ-RBAC-05',
    category: '권한 / 협업',
    title: '프로젝트 멤버 초대 코드 및 RBAC 접근 제어',
    specification:
      '초대 코드(grm_invite_*) 기반 팀 합류. OWNER, ADMIN, EDITOR, VIEWER 4단계 권한에 따른 API 엔드포인트 인가 검증.',
    acceptanceCriteria: 'VIEWER 권한 사용자의 캔버스 노드 수정 및 DDL 변경 API 403 차단',
    priority: 'P1',
    status: 'Review'
  }
];

// =====================================================================
// STEP 03: UI/UX SCREEN FLOW DATA
// ([랜딩 페이지] -> [온보딩 모달] -> [메인 워크스페이스] -> [결제 모달])
// =====================================================================
export const INITIAL_UX_ZONES: CanvasZone[] = [
  {
    id: 'uxz_entry',
    title: '진입 및 온보딩 퍼널',
    subtitle: 'Guest Entry & Track Setup',
    x: 32,
    y: 48,
    width: 616,
    height: 310,
    tone: 'neutral'
  },
  {
    id: 'uxz_core',
    title: '핵심 설계 워크스페이스 및 결제 전환',
    subtitle: 'Core Workspace & Checkout Funnel',
    x: 680,
    y: 48,
    width: 616,
    height: 310,
    tone: 'accent'
  }
];

export const INITIAL_UX_NODES: UxScreenNode[] = [
  {
    id: 'ux_landing',
    name: '랜딩 페이지',
    route: '/',
    screenType: 'Page',
    summary: '비로그인 방문자가 한 줄 서비스 아이디어를 입력하고 즉시 체험을 시작하는 진입 화면',
    keyElements: ['한 줄 아이디어 입력 바', '도메인 프리셋 칩', '8단계 파이프라인 미리보기'],
    uxMetric: '입력 전환율 64%',
    x: 56,
    y: 112
  },
  {
    id: 'ux_onboarding',
    name: '온보딩 모달',
    route: '/?modal=track-setup',
    screenType: 'Modal',
    summary: '초보자(4단계), 전문가(8단계), 커스텀 트랙 및 서비스 도메인 스택을 구성하는 설정 모달',
    keyElements: ['트랙 3종 라디오 카드', '8단계 ON/OFF 스위치', '웹/모바일/게임 스택 선택'],
    uxMetric: '평균 설정 12초',
    x: 382,
    y: 112
  },
  {
    id: 'ux_workspace',
    name: '메인 워크스페이스',
    route: '/workspace/:projectId',
    screenType: 'Workspace',
    summary: '좌측 파이프라인 네비게이션, 중앙 AI 코파일럿, 우측 산출물 캔버스가 결합된 3단 작업 화면',
    keyElements: ['동적 스텝 사이드바', '컨텍스트 체이닝 채팅', 'ERD/아키텍처/칸반 뷰어'],
    uxMetric: '세션 체류 28분',
    x: 708,
    y: 112
  },
  {
    id: 'ux_payment',
    name: '결제 모달',
    route: '/workspace/:projectId/checkout',
    screenType: 'Modal',
    summary: '예약 보증금 선결제 또는 팀 플랜 구독 결제를 처리하고 게스트 계정을 영구 귀속하는 모달',
    keyElements: ['보증금/플랜 금액 명세', '간편결제 수단 선택', '결제 완료 및 영수증 발행'],
    uxMetric: '결제 완료율 71%',
    x: 1034,
    y: 112
  }
];

export const INITIAL_UX_EDGES: UxFlowEdge[] = [
  {
    id: 'uxe_1',
    source: 'ux_landing',
    target: 'ux_onboarding',
    sourcePort: 'right',
    targetPort: 'left',
    triggerLabel: '설계 시작 클릭',
    guardCondition: '아이디어 1자 이상 입력'
  },
  {
    id: 'uxe_2',
    source: 'ux_onboarding',
    target: 'ux_workspace',
    sourcePort: 'right',
    targetPort: 'left',
    triggerLabel: '트랙 확정 및 생성',
    guardCondition: '24h 게스트 토큰 발급'
  },
  {
    id: 'uxe_3',
    source: 'ux_workspace',
    target: 'ux_payment',
    sourcePort: 'right',
    targetPort: 'left',
    triggerLabel: '보증금 / 플랜 결제',
    guardCondition: '계정 연동(Claim) 검증'
  }
];

// =====================================================================
// STEP 04: DATABASE ERD DATA
// =====================================================================
export const INITIAL_ERD_TABLES: ErdTableNode[] = [
  {
    id: 'users',
    name: 'users',
    logicalName: '회원 및 게스트 계정',
    domainGroup: 'Core Auth',
    x: 48,
    y: 56,
    columns: [
      { id: 'u1', name: 'id', type: 'BIGSERIAL', isPk: true, nullable: false, comment: '고유 식별자' },
      { id: 'u2', name: 'email', type: 'VARCHAR(120)', nullable: true, comment: '게스트는 NULL 허용' },
      { id: 'u3', name: 'nickname', type: 'VARCHAR(40)', nullable: false, comment: '표시 이름' },
      { id: 'u4', name: 'user_role', type: 'VARCHAR(20)', nullable: false, comment: 'CUSTOMER | OWNER | GUEST' },
      { id: 'u5', name: 'is_claimed', type: 'BOOLEAN', nullable: false, comment: '정식 계정 연동 여부' },
      { id: 'u6', name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, comment: '가입 일시' }
    ]
  },
  {
    id: 'bakeries',
    name: 'bakeries',
    logicalName: '동네 빵집 매장',
    domainGroup: 'Store & Catalog',
    x: 440,
    y: 56,
    columns: [
      { id: 'b1', name: 'id', type: 'BIGSERIAL', isPk: true, nullable: false, comment: '매장 PK' },
      { id: 'b2', name: 'owner_id', type: 'BIGINT', isFk: true, nullable: false, comment: 'users.id 참조' },
      { id: 'b3', name: 'store_name', type: 'VARCHAR(80)', nullable: false, comment: '상호명' },
      { id: 'b4', name: 'address_road', type: 'VARCHAR(200)', nullable: false, comment: '도로명 주소' },
      { id: 'b5', name: 'latitude', type: 'NUMERIC(10,7)', nullable: false, comment: '위도 좌표' },
      { id: 'b6', name: 'closing_time', type: 'TIME', nullable: false, comment: '영업 마감 시각' }
    ]
  },
  {
    id: 'discount_items',
    name: 'discount_items',
    logicalName: '마감 할인 등록 품목',
    domainGroup: 'Store & Catalog',
    x: 440,
    y: 350,
    columns: [
      { id: 'd1', name: 'id', type: 'BIGSERIAL', isPk: true, nullable: false, comment: '할인 품목 PK' },
      { id: 'd2', name: 'bakery_id', type: 'BIGINT', isFk: true, nullable: false, comment: 'bakeries.id 참조' },
      { id: 'd3', name: 'item_name', type: 'VARCHAR(100)', nullable: false, comment: '빵 품목명' },
      { id: 'd4', name: 'origin_price', type: 'INTEGER', nullable: false, comment: '정가 (KRW)' },
      { id: 'd5', name: 'sale_price', type: 'INTEGER', nullable: false, comment: '마감 할인가 (KRW)' },
      { id: 'd6', name: 'stock_qty', type: 'INTEGER', nullable: false, comment: '잔여 수량' },
      { id: 'd7', name: 'version', type: 'INTEGER', nullable: false, comment: '낙관적 락 버전' }
    ]
  },
  {
    id: 'reservations',
    name: 'reservations',
    logicalName: '픽업 예약 및 보증금',
    domainGroup: 'Order & Settlement',
    x: 48,
    y: 350,
    columns: [
      { id: 'r1', name: 'id', type: 'BIGSERIAL', isPk: true, nullable: false, comment: '예약 번호 PK' },
      { id: 'r2', name: 'user_id', type: 'BIGINT', isFk: true, nullable: false, comment: '구매자 users.id' },
      { id: 'r3', name: 'item_id', type: 'BIGINT', isFk: true, nullable: false, comment: 'discount_items.id' },
      { id: 'r4', name: 'quantity', type: 'SMALLINT', nullable: false, comment: '예약 수량' },
      { id: 'r5', name: 'pickup_time', type: 'TIMESTAMPTZ', nullable: false, comment: '픽업 예정 시각' },
      { id: 'r6', name: 'deposit_status', type: 'VARCHAR(20)', nullable: false, comment: 'PENDING | PAID | REFUNDED' },
      { id: 'r7', name: 'order_status', type: 'VARCHAR(20)', nullable: false, comment: 'RESERVED | PICKED_UP | NOSHOW' }
    ]
  }
];

export const INITIAL_ERD_ZONES: CanvasZone[] = [
  {
    id: 'ez_customer_order',
    title: '고객 및 예약 도메인',
    subtitle: 'Customer & Order',
    x: 24,
    y: 20,
    width: 348,
    height: 600,
    tone: 'accent'
  },
  {
    id: 'ez_bakery_inv',
    title: '매장 및 마감 재고 도메인',
    subtitle: 'Bakery & Inventory',
    x: 412,
    y: 20,
    width: 348,
    height: 600,
    tone: 'ok'
  }
];

export const INITIAL_ERD_RELATIONS: ErdRelation[] = [
  {
    id: 'rel_user_bakery',
    source: 'users',
    target: 'bakeries',
    sourcePort: 'right',
    targetPort: 'left',
    sourceCol: 'id',
    targetCol: 'owner_id',
    cardinality: '1:N',
    label: '점주 소유 (1:N)'
  },
  {
    id: 'rel_bakery_items',
    source: 'bakeries',
    target: 'discount_items',
    sourcePort: 'bottom',
    targetPort: 'top',
    sourceCol: 'id',
    targetCol: 'bakery_id',
    cardinality: '1:N',
    label: '마감 품목 등록 (1:N)'
  },
  {
    id: 'rel_items_resv',
    source: 'discount_items',
    target: 'reservations',
    sourcePort: 'left',
    targetPort: 'right',
    sourceCol: 'id',
    targetCol: 'item_id',
    cardinality: '1:N',
    label: '품목 예약 (1:N)'
  },
  {
    id: 'rel_user_resv',
    source: 'users',
    target: 'reservations',
    sourcePort: 'bottom',
    targetPort: 'top',
    sourceCol: 'id',
    targetCol: 'user_id',
    cardinality: '1:N',
    label: '고객 주문 (1:N)'
  }
];

// =====================================================================
// STEP 05: SYSTEM ARCHITECTURE DATA
// =====================================================================
export const INITIAL_ARCH_ZONES: CanvasZone[] = [
  {
    id: 'az_public',
    title: 'VPC Public Edge Subnet',
    subtitle: '10.20.1.0/24 - CDN / ALB',
    x: 36,
    y: 44,
    width: 290,
    height: 390,
    tone: 'neutral'
  },
  {
    id: 'az_app',
    title: 'VPC Private App Subnet',
    subtitle: '10.20.10.0/24 - Spring API',
    x: 356,
    y: 44,
    width: 290,
    height: 390,
    tone: 'accent'
  },
  {
    id: 'az_data',
    title: 'VPC Private Data Subnet',
    subtitle: '10.20.20.0/24 - RDBMS & Redis',
    x: 676,
    y: 44,
    width: 290,
    height: 390,
    tone: 'ok'
  }
];

export const INITIAL_ARCH_NODES: ArchNode[] = [
  {
    id: 'client',
    name: 'Client (React SPA)',
    category: 'Client',
    techStack: 'React 18 + Vite + TypeScript',
    spec: 'Tailwind CSS, Interactive Canvas',
    zone: 'Public Zone',
    x: 64,
    y: 165,
    status: 'active',
    metrics: {
      latency: 'TTFB < 120ms',
      throughput: 'CDN Edge Cached',
      note: '비로그인 게스트 로컬 스토리지 토큰 및 SSE 스트림 수신'
    }
  },
  {
    id: 'spring',
    name: 'Spring Boot Server',
    category: 'Application',
    techStack: 'Java 17 LTS, Spring Boot 3.2',
    spec: 'Spring Security 6, JPA / QueryDSL',
    zone: 'Private App Zone',
    x: 386,
    y: 165,
    status: 'active',
    metrics: {
      latency: 'Avg 42ms (P95 110ms)',
      throughput: '850 TPS (c6i.large)',
      note: 'JWT RBAC 인가 필터, 낙관적 락 재고 제어 및 Spring AI 오케스트레이션'
    }
  },
  {
    id: 'postgres',
    name: 'PostgreSQL (Single DB)',
    category: 'Database',
    techStack: 'PostgreSQL 15.x',
    spec: 'RDBMS + JSONB Topology Storage',
    zone: 'Private Data Zone',
    x: 708,
    y: 95,
    status: 'active',
    metrics: {
      latency: 'Query < 8.4ms',
      throughput: 'HikariCP Pool: 30',
      note: 'V1.0 단일 DB 아키텍처: 회원, 매장, 예약 트랜잭션 및 캔버스 JSONB 영구 저장'
    }
  },
  {
    id: 'redis',
    name: 'Redis Cache Cluster',
    category: 'Cache',
    techStack: 'Redis 7.2 In-Memory',
    spec: 'Guest TTL (24h), JWT Whitelist',
    zone: 'Private Data Zone',
    x: 708,
    y: 265,
    status: 'v15_planned',
    metrics: {
      latency: 'Sub-ms (< 0.8ms)',
      throughput: 'DB 부하 72% 절감',
      note: 'V1.5 고도화: 게스트 임시 데이터 격리(24h TTL) 및 조회 응답 15ms 달성'
    }
  }
];

export const INITIAL_ARCH_EDGES: ArchEdge[] = [
  {
    id: 'e_client_spring',
    source: 'client',
    target: 'spring',
    sourcePort: 'right',
    targetPort: 'left',
    protocol: 'HTTPS REST / SSE',
    port: '443 -> 8080'
  },
  {
    id: 'e_spring_pg',
    source: 'spring',
    target: 'postgres',
    sourcePort: 'right',
    targetPort: 'left',
    protocol: 'JDBC / QueryDSL',
    port: 'TCP 5432'
  },
  {
    id: 'e_spring_redis',
    source: 'spring',
    target: 'redis',
    sourcePort: 'right',
    targetPort: 'left',
    protocol: 'Lettuce Async',
    port: 'TCP 6379',
    isOptionalV15: true
  }
];

// =====================================================================
// STEP 06: WBS KANBAN TASKS DATA
// =====================================================================
export const INITIAL_KANBAN_TASKS: KanbanTask[] = [
  {
    id: 'k1',
    ticketKey: 'GRM-101',
    title: '게스트 세션 발급 API 및 Claim 데이터 이관 트랜잭션 구현',
    description: '비로그인 진입 시 임시 UUID 토큰을 발급하고, 정식 가입 시 외래키 참조를 일괄 업데이트합니다.',
    priority: 'P0',
    assignee: { name: '한정호', initials: 'JH', color: 'bg-accent', role: 'Backend' },
    deadline: 'D-1',
    storyPoints: 5,
    reqRef: 'REQ-AUTH-01',
    category: 'Backend',
    status: 'done'
  },
  {
    id: 'k2',
    ticketKey: 'GRM-102',
    title: 'JWT 화이트리스트 검증 필터 및 프로젝트별 RBAC 인가 처리',
    description: 'Spring Security 6 커스텀 필터에서 프로젝트 멤버 역할(OWNER/ADMIN/EDITOR/VIEWER)을 검증합니다.',
    priority: 'P0',
    assignee: { name: '김도윤', initials: 'DY', color: 'bg-ok', role: 'Security' },
    deadline: 'D-1',
    storyPoints: 3,
    reqRef: 'REQ-RBAC-05',
    category: 'Backend',
    status: 'done'
  },
  {
    id: 'k3',
    ticketKey: 'GRM-103',
    title: 'ERD 및 화면 흐름 캔버스 JSONB 양방향 동기화 API 연동',
    description: '노드 좌표 및 컬럼 스키마(JSONB) 변경 시 백엔드 명세서와 실시간 동기화합니다.',
    priority: 'P0',
    assignee: { name: '한정호', initials: 'JH', color: 'bg-accent', role: 'Fullstack' },
    deadline: 'D-2',
    storyPoints: 8,
    reqRef: 'REQ-STORE-02',
    category: 'Frontend',
    status: 'in_progress'
  },
  {
    id: 'k4',
    ticketKey: 'GRM-104',
    title: '마감 할인 재고 차감 동시성 제어 (JPA Optimistic Lock)',
    description: '동일 품목에 대한 다수 구매자의 동시 픽업 예약 시 version 컬럼 기반 충돌 감지 및 재시도 처리.',
    priority: 'P0',
    assignee: { name: '김도윤', initials: 'DY', color: 'bg-ok', role: 'Backend' },
    deadline: 'D-3',
    storyPoints: 5,
    reqRef: 'REQ-RESV-03',
    category: 'Database',
    status: 'in_progress'
  },
  {
    id: 'k5',
    ticketKey: 'GRM-105',
    title: '픽업 예정 30분 전 인앱 알림 스케줄러 및 미결제 자동 취소 배치',
    description: '예약 보증금 미결제 건(15분 경과)을 스캔하여 상태를 NOSHOW_CANCELED로 변경하고 재고를 복구합니다.',
    priority: 'P1',
    assignee: { name: '박서연', initials: 'SY', color: 'bg-warn', role: 'Backend' },
    deadline: 'D-4',
    storyPoints: 5,
    reqRef: 'REQ-NOTI-04',
    category: 'Backend',
    status: 'todo'
  },
  {
    id: 'k6',
    ticketKey: 'GRM-106',
    title: 'JMeter 기반 단일 DB 병목 지점 부하 테스트 시나리오 작성',
    description: '500 동시 접속 환경에서 토큰 검증 쿼리 및 N+1 조회 지연 시간(P99 Latency) 베이스라인 측정.',
    priority: 'P1',
    assignee: { name: '한정호', initials: 'JH', color: 'bg-accent', role: 'Infra' },
    deadline: 'D-6',
    storyPoints: 3,
    reqRef: 'REQ-AUTH-01',
    category: 'Infra',
    status: 'todo'
  }
];

// =====================================================================
// STEP 07: API ENDPOINTS & AI IDE CODING PROMPTS DATA
// =====================================================================
export const INITIAL_API_ENDPOINTS: ApiEndpointSpec[] = [
  {
    id: 'api_1',
    method: 'POST',
    path: '/v1/projects',
    summary: '신규 프로젝트 생성 및 동적 파이프라인 트랙(초보자/전문가/커스텀) 초기화',
    authScope: 'Guest Shadow Token / Bearer JWT',
    reqRef: 'REQ-AUTH-01',
    requestJson: `{
  "title": "동네 빵집 마감 할인 서비스",
  "domain": "WEB",
  "trackType": "EXPERT_FULL_8",
  "enabledSteps": ["step1", "step2", "step3", "step4", "step5", "step6", "step7", "step8"]
}`,
    responseJson: `{
  "success": true,
  "data": {
    "projectId": "prj_9f82c1a0",
    "guestSessionTtlSec": 86400,
    "activeTrack": "EXPERT_FULL_8",
    "createdAt": "2026-10-29T14:20:00+09:00"
  }
}`
  },
  {
    id: 'api_2',
    method: 'GET',
    path: '/v1/topology',
    summary: '프로젝트 화면 흐름(UX), ERD 스키마, 시스템 아키텍처 JSONB 노드/간선 통합 조회',
    authScope: 'RBAC: VIEWER 이상',
    reqRef: 'REQ-STORE-02',
    requestJson: `// Query Parameters
GET /v1/topology?projectId=prj_9f82c1a0&layer=ERD,ARCH,UX_FLOW`,
    responseJson: `{
  "success": true,
  "data": {
    "schemaVersion": "v1.5.0",
    "uxNodeCount": 4,
    "erdTables": ["users", "bakeries", "discount_items", "reservations"],
    "archMode": "V15_REDIS_ENABLED"
  }
}`
  },
  {
    id: 'api_3',
    method: 'POST',
    path: '/v1/reservations',
    summary: '마감 할인 품목 픽업 예약 생성 및 낙관적 락(@Version) 기반 재고 차감',
    authScope: 'RBAC: CUSTOMER (Claim 완료 계정)',
    reqRef: 'REQ-RESV-03',
    requestJson: `{
  "discountItemId": 402,
  "quantity": 2,
  "expectedVersion": 7,
  "pickupTime": "2026-10-29T20:30:00+09:00",
  "depositAmount": 3500
}`,
    responseJson: `{
  "success": true,
  "data": {
    "reservationId": 9104,
    "orderStatus": "RESERVED",
    "depositStatus": "PAID",
    "remainingStock": 3,
    "newVersion": 8
  }
}`
  },
  {
    id: 'api_4',
    method: 'PATCH',
    path: '/v1/auth/claim',
    summary: '비로그인 게스트 임시 세션(24h)의 모든 산출물을 정식 가입 계정으로 원자적 귀속',
    authScope: 'Guest UUID Header + SignUp Payload',
    reqRef: 'REQ-AUTH-01',
    requestJson: `{
  "guestToken": "gst_44d19b2e_shadow",
  "email": "jungho.han@groom.dev",
  "passwordHash": "$2a$12$R9h/cIPz0gi..."
}`,
    responseJson: `{
  "success": true,
  "data": {
    "claimedUserId": 1024,
    "migratedProjectCount": 1,
    "migratedArtifactCount": 8,
    "sessionExpiryRemoved": true
  }
}`
  }
];

export const INITIAL_IDE_PROMPTS: IdePromptItem[] = [
  {
    id: 'prm_1',
    ticketRef: 'GRM-104',
    title: '마감 할인 재고 동시성 제어 (JPA Optimistic Lock + 재시도 퍼사드)',
    targetIde: 'Cursor / IntelliJ AI / GitHub Copilot',
    linkedSteps: ['Step 02 PRD (REQ-STORE-02)', 'Step 04 ERD (discount_items.version)', 'Step 07 API (POST /v1/reservations)'],
    promptCode: `@Context
당신은 Spring Boot 3.2 + Java 17 + PostgreSQL 15 기반 백엔드 시니어 엔지니어입니다.
Groom 프로젝트의 확정된 설계 산출물(Step 02 PRD, Step 04 ERD, Step 07 API 컨벤션)을 준수하여 마감 할인 예약 도메인을 구현하세요.

@DatabaseSchema (Step 04 확정 스키마)
- Table: discount_items (id BIGSERIAL PK, bakery_id BIGINT FK, stock_qty INTEGER NOT NULL, version INTEGER NOT NULL)
- Table: reservations (id BIGSERIAL PK, user_id BIGINT FK, item_id BIGINT FK, quantity SMALLINT, pickup_time TIMESTAMPTZ, deposit_status VARCHAR(20), order_status VARCHAR(20))

@Requirements & Constraints
1. DiscountItem 엔티티의 version 필드에 JPA @Version을 선언해 오후 8시 마감 정각 동시 요청 시 초과 판매(재고 음수)를 원천 차단하세요.
2. ObjectOptimisticLockingFailureException 발생 시 최대 3회 지수 백오프(50ms)로 재시도하는 ReservationOptimisticFacade를 작성하세요.
3. 재고 부족 시 HTTP 409 Conflict와 표준 에러 코드(ITEM_OUT_OF_STOCK)를 ApiResponse<Void> 규격으로 반환하세요.
4. 동시 스레드 30개가 잔여 수량 5개 품목을 예약하는 CountDownLatch 기반 통합 테스트 코드를 함께 작성하세요.`
  },
  {
    id: 'prm_2',
    ticketRef: 'GRM-101',
    title: '게스트 24h 임시 세션 발급 및 정식 계정 귀속(Claim) 서비스 구현',
    targetIde: 'Cursor / GitHub Copilot',
    linkedSteps: ['Step 01 BM (PLG 퍼널)', 'Step 02 PRD (REQ-AUTH-01)', 'Step 05 Arch (Redis 24h TTL)'],
    promptCode: `@Context
비로그인 방문자가 즉시 8단계 워크스페이스를 생성하고, 이후 이메일 가입 시 모든 산출물 소유권을 무손실 이관하는 Account Claim 모듈을 작성하세요.

@ArchitectureSpecs (Step 05 V1.5 기준)
- 임시 게스트 메타데이터 및 토큰 화이트리스트는 Redis(Key: "guest:session:{uuid}", TTL: 86400초)에 저장합니다.
- PATCH /v1/auth/claim 호출 시 단일 @Transactional 경계 안에서 users.is_claimed = true 전환, 프로젝트 소유자 매핑 갱신, Redis 임시 키 즉시 삭제(UNLINK)를 수행하세요.

@AcceptanceCriteria
- 이관 도중 예외 발생 시 PostgreSQL 트랜잭션이 롤백되어야 하며 Redis 키가 조기 유실되지 않아야 합니다.
- 응답 포맷은 Step 07 컨벤션의 ApiResponse<ClaimResultResponse> 레코드를 사용하세요.`
  },
  {
    id: 'prm_3',
    ticketRef: 'GRM-103',
    title: 'React 18 화면 흐름 및 ERD 토폴로지 캔버스 양방향 동기화 훅 구현',
    targetIde: 'Cursor / Windsurf',
    linkedSteps: ['Step 03 UI/UX Flow', 'Step 04 ERD Canvas', 'Step 07 API (GET /v1/topology)'],
    promptCode: `@Context
React 18 + TypeScript 환경에서 Groom의 시각화 캔버스(화면 흐름 노드, ERD 테이블, 아키텍처 노드) 변경사항을 디바운싱하여 백엔드 JSONB API와 동기화하는 커스텀 훅 useTopologySync를 구현하세요.

@ImplementationRules
1. 노드 드래그나 포인터 간선 연결 후 600ms 디바운스를 적용해 불필요한 네트워크 호출을 억제하세요.
2. VIEWER 역할 사용자가 수정 시도 시 HTTP 403 응답을 감지하여 낙관적 UI 상태를 직전 스냅샷으로 롤백하고 토스트 알림을 띄우세요.
3. 마우스 휠 확대/축소(0.4x ~ 2.0x) 좌표 변환 시 커서 기준점(Cursor-anchored zoom) 공식을 유지하세요.`
  }
];

// =====================================================================
// STEP 08: DEPLOYMENT HISTORY, TROUBLESHOOTING & V2.0 BACKLOG DATA
// =====================================================================
export const INITIAL_DEPLOYMENTS: DeploymentRecord[] = [
  {
    id: 'dep_v150',
    version: 'v1.5.0 (Performance Optimization)',
    releaseTitle: '인메모리 캐시 계층 확장 및 비동기 스트리밍 전환',
    deployedAt: '2026-10-25 14:30',
    status: 'DEPLOYED (Success)',
    commitRef: 'feat/redis-sse (#8f9a2b)',
    highlights: [
      'Redis 인메모리 화이트리스트 및 게스트 24시간 TTL 도입으로 단일 RDBMS 부하 72% 절감',
      'AI 연속 문서 생성 파이프라인을 동기식 응답에서 SSE(Server-Sent Events) 실시간 스트리밍으로 전환',
      '프로젝트 및 하위 산출물 목록 조회 시 발생하던 JPA N+1 쿼리를 QueryDSL Fetch Join으로 최적화'
    ],
    rollbackTarget: 'v1.0.1 (#3c4d5e)',
    rollbackCommand: 'kubectl rollout undo deployment/groom-api-server -n prod && redis-cli -h groom-cache FLUSHDB',
    rollbackNote: 'v1.5.0은 스키마 파괴적 변경(Breaking DDL)이 없으므로 feature-flag(USE_REDIS_SESSION=false) 전환만으로 무중단 폴백이 가능합니다.',
    checklist: [
      { id: 'ck1', label: 'Redis 7.2 클러스터 연결 풀 및 메모리 Eviction 정책(volatile-ttl) 검증', checked: true },
      { id: 'ck2', label: 'Nginx Reverse Proxy SSE 스트림용 proxy_buffering off 설정 반영', checked: true },
      { id: 'ck3', label: 'JMeter 500 동시 접속 부하 테스트 P95 지연 시간 30ms 이하 통과', checked: true },
      { id: 'ck4', label: '배포 후 30분간 5xx 에러율 0.0% 및 HikariCP 활성 커넥션 안정성 확인', checked: true }
    ]
  },
  {
    id: 'dep_v101',
    version: 'v1.0.1 (Hotfix)',
    releaseTitle: 'ERD 캔버스 연쇄 삭제 무결성 패치',
    deployedAt: '2026-10-12 09:15',
    status: 'DEPLOYED (Success)',
    commitRef: 'fix/erd-cascade (#3c4d5e)',
    highlights: [
      'ERD 캔버스 노드 삭제 시 연결된 엣지 외래키 제약조건 오류 및 고아 간선(Orphan Edge) 잔존 버그 수정',
      'SQL DDL 파서에서 복합 외래키 컬럼 자동 추론 정규식 예외 처리 보강'
    ],
    rollbackTarget: 'v1.0.0 (#1a2b3c)',
    rollbackCommand: 'git revert 3c4d5e --no-edit && ./gradlew bootJar && docker compose up -d --no-deps api',
    rollbackNote: '프론트엔드 정적 번들과 백엔드 JSONB 직렬화 검증기만 변경되어 즉시 이미지 태그 롤백이 가능합니다.',
    checklist: [
      { id: 'ck5', label: '테이블 삭제 시 연결된 관계선 배열 동시 정리 단위 테스트 통과', checked: true },
      { id: 'ck6', label: '기존 저장된 프로젝트 JSONB 스냅샷 하위 호환성 검증', checked: true },
      { id: 'ck7', label: '운영 헬스체크(/actuator/health) 정상 응답 확인', checked: true }
    ]
  },
  {
    id: 'dep_v100',
    version: 'v1.0.0 (Initial MVP Release)',
    releaseTitle: 'Groom 코어 파이프라인 워크스페이스 최초 정식 출시',
    deployedAt: '2026-10-10 18:00',
    status: 'DEPLOYED (Success)',
    commitRef: 'release/v1.0.0 (#1a2b3c)',
    highlights: [
      '비로그인 24시간 게스트 체험 모드 및 정식 계정 영구 귀속(Claim) 플로우 최초 배포',
      '컨텍스트 체이닝 기반 기획서(BM, PRD) 생성 및 PDF/Word/Markdown 문서 내보내기 지원',
      '인터랙티브 시각화 캔버스(ERD, 시스템 아키텍처) 및 3단 WBS 칸반 보드 오픈'
    ],
    rollbackTarget: 'v0.9.4-rc2 (Staging Baseline)',
    rollbackCommand: 'aws ecs update-service --cluster groom-prod --service api --task-definition groom-api:12',
    rollbackNote: '최초 정식 릴리즈 기준점입니다. 긴급 장애 시 점검 페이지 전환 후 초기 스냅샷으로 복구합니다.',
    checklist: [
      { id: 'ck8', label: 'Flyway V1__init_schema.sql 운영 PostgreSQL 15 반영 완료', checked: true },
      { id: 'ck9', label: 'SSL 인증서(ACM) 및 도메인 라우팅 연결 확인', checked: true },
      { id: 'ck10', label: '일일 자동 DB 스냅샷 백업 스케줄 활성화', checked: true }
    ]
  }
];

export const INITIAL_TROUBLESHOOTINGS: TroubleshootingItem[] = [
  {
    id: 'ts_1',
    issueNumber: 1,
    title: '게스트 데이터 증가로 인한 단일 RDBMS 부하 급증',
    versionTrack: 'v1.5 성능 개선',
    resolvedInVersion: 'v1.5.0',
    severity: 'Critical',
    causeAnalysis:
      '비로그인 게스트 체험 유입이 일 4,000건 이상으로 늘어나면서, 매 캔버스 자동 저장과 인가 필터 검증마다 PostgreSQL 단일 인스턴스의 guest_sessions 및 token_whitelist 테이블에 초당 850건 이상의 디스크 I/O 조회·갱신이 집중되어 HikariCP 커넥션 풀 고갈 위험이 발생했습니다.',
    resolutionProcess:
      '휘발성 성격인 24시간 미만 게스트 세션과 JWT 화이트리스트 검증 계층을 Redis 7.2 인메모리 클러스터로 분리했습니다. 키 생성 시 EXPIRE 86400(24h TTL)을 부여해 만료 배치 쿼리를 제거하고, 사용자가 영구 저장(Claim)을 요청하는 시점에만 PostgreSQL로 일괄 영속화하도록 쓰기 경로를 재설계했습니다.',
    beforeMetric: '평균 조회 120ms / DB CPU 78%',
    afterMetric: '평균 조회 15ms / DB CPU 22%',
    improvementSummary: '조회 응답 속도 120ms에서 15ms로 87.5% 개선, 단일 RDBMS 쿼리 부하 72% 절감'
  },
  {
    id: 'ts_2',
    issueNumber: 2,
    title: 'AI 연속 문서 생성 시 톰캣 워커 스레드 블로킹 현상',
    versionTrack: 'v1.5 성능 개선',
    resolvedInVersion: 'v1.5.0',
    severity: 'High',
    causeAnalysis:
      '초기 V1.0에서는 LLM API 응답이 완전히 끝날 때까지(평균 16~22초) 일반 동기식 REST 컨트롤러가 서블릿 워커 스레드를 점유한 채 대기했습니다. 이로 인해 동시 생성 요청이 150건을 넘어가자 일반 조회 API까지 응답 지연이 전파되는 스레드 풀 병목이 재현되었습니다.',
    resolutionProcess:
      '문서 생성 엔드포인트를 Spring SseEmitter 및 비동기 전용 스레드 풀 기반의 SSE(Server-Sent Events) 스트리밍 파이프라인으로 전환하고, 앞단 Nginx의 proxy_buffering을 해제하여 첫 토큰 생성 즉시 클라이언트에 청크 단위로 렌더링되도록 개선했습니다.',
    beforeMetric: '스레드 18.4s 점유 / TTFT 17.2s',
    afterMetric: '서블릿 즉시 반환 / TTFT 0.6s',
    improvementSummary: '체감 첫 응답 시간(TTFT) 96% 단축 및 동시 처리 가능 세션 수 4.2배 향상'
  },
  {
    id: 'ts_3',
    issueNumber: 3,
    title: 'ERD 캔버스 노드 삭제 시 고아 간선(Orphan Edge) 및 DDL 제약조건 오류',
    versionTrack: 'v1.0 MVP',
    resolvedInVersion: 'v1.0.1',
    severity: 'Medium',
    causeAnalysis:
      '사용자가 ERD 캔버스에서 부모 테이블(예: bakeries) 노드를 삭제했을 때 테이블 배열에서만 노드가 제거되고, 해당 테이블을 source 또는 target으로 참조하던 관계선(erdRelations) 메타데이터가 JSONB에 그대로 남아 SQL DDL 자동 생성기에서 참조 무결성 파싱 오류가 발생했습니다.',
    resolutionProcess:
      '노드 삭제 액션 핸들러와 백엔드 도메인 서비스 양쪽에 연쇄 정리(Cascade Prune) 불변식을 추가하여, 삭제 대상 노드 ID와 연결된 모든 간선 및 무효화된 외래키 참조 표시를 단일 상태 업데이트로 함께 제거하도록 패치했습니다.',
    beforeMetric: 'DDL 직렬화 오류율 4.8%',
    afterMetric: 'DDL 직렬화 오류율 0.0%',
    improvementSummary: '캔버스 편집 후 SQL 재생성 실패율 0% 달성 및 스키마 정합성 보장'
  }
];

export const INITIAL_BACKLOG_IDEAS: BacklogIdeaItem[] = [
  {
    id: 'bg_1',
    title: '모바일 앱 및 게임 도메인 특화 파이프라인 프리셋 확장',
    targetRelease: 'v2.0 Roadmap',
    domainTag: 'Domain Expansion',
    description:
      '현재 웹 풀스택 중심인 8단계 템플릿을 확장하여 Flutter/React Native 화면 네비게이션 트리와 유니티·언리얼 게임 코어 루프 및 매치메이킹 서버 토폴로지 프리셋을 지원합니다.',
    priority: 'P1'
  },
  {
    id: 'bg_2',
    title: '외부 IDE 플러그인 직접 연동 (VS Code / JetBrains Extension)',
    targetRelease: 'v3.0 Roadmap',
    domainTag: 'Developer Experience',
    description:
      'Step 07에서 생성된 API 명세서, SQL DDL, 태스크별 AI 코딩 프롬프트를 클립보드 복사 없이 로컬 IDE 워크스페이스 컨텍스트로 즉시 주입하고 코드 변경분과 역동기화합니다.',
    priority: 'P0'
  },
  {
    id: 'bg_3',
    title: '다중 팀원 실시간 동시 편집 캔버스 (CRDT / WebSocket)',
    targetRelease: 'v2.0 Roadmap',
    domainTag: 'Collaboration',
    description:
      '2인 이상의 팀원이 Step 03 화면 흐름이나 Step 04 ERD 캔버스를 동시에 조작할 때 실시간 커서 위치를 표시하고 상태 충돌 없이 병합하는 협업 엔진을 도입합니다.',
    priority: 'P1'
  },
  {
    id: 'bg_4',
    title: '배포 이벤트 및 마감 알림 외부 웹훅 연동 (Slack / 카카오 알림톡)',
    targetRelease: 'v2.0 Roadmap',
    domainTag: 'Operations',
    description:
      'Step 08 신규 릴리즈 배포 결과와 Step 06 칸반 P0 마감 임박 알림을 팀 Slack 채널 및 점주용 알림톡 웹훅으로 자동 송신합니다.',
    priority: 'P2'
  }
];

// =====================================================================
// STEP-CONTEXTUALIZED AI COPILOT CONVERSATIONS (ALL 8 STEPS)
// =====================================================================
export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm_s1',
    stepId: 'step1',
    sender: 'ai',
    author: 'Product Strategist AI',
    roleBadge: '비즈니스 전략 디렉터',
    timestamp: '14:02',
    content:
      '입력해주신 "동네 빵집 마감 할인 서비스" 아이디어를 기반으로 양면 시장 타겟 고객(폐기 손실을 줄이려는 동네 베이커리 점주 & 합리적 소비를 원하는 반경 1.5km 거주민)과 수수료·구독 수익 모델을 구조화했습니다.\n\n초기 이탈을 막기 위해 비로그인 게스트 탐색 후 픽업 예약 시점에 가입을 유도하는 PLG 전략을 반영했습니다.',
    contextRefs: ['도메인: 하이퍼로컬 O2O', '수익 모델: 중개 수수료 5%']
  },
  {
    id: 'm_s2',
    stepId: 'step2',
    sender: 'ai',
    author: 'Lead PM Copilot',
    roleBadge: '수석 테크니컬 PM',
    timestamp: '14:06',
    content:
      'Step 01 비즈니스 모델을 컨텍스트로 이어받아 핵심 요구사항 5건(REQ-AUTH-01 ~ REQ-RBAC-05)을 정의했습니다. 마감 할인 특성상 오후 8시 정각에 예약 트래픽이 몰리므로 낙관적 락 동시성 제어 조건을 P0 필수 인수 조건에 명시했습니다.',
    contextRefs: ['Step 01 BM 참조됨', 'P0 요구사항 3건 확정']
  },
  {
    id: 'm_s3',
    stepId: 'step3',
    sender: 'ai',
    author: 'Principal UX Architect',
    roleBadge: '프로덕트 디자이너',
    timestamp: '14:10',
    content:
      'Step 01~02의 게스트 온보딩 및 예약 전환 규칙을 바탕으로 핵심 화면 흐름 플로우차트를 구성했습니다.\n\n[랜딩 페이지] -> [온보딩 모달] -> [메인 워크스페이스] -> [결제 모달] 순으로 이어지며, 우측 캔버스에서 화면 노드를 클릭해 라우트와 핵심 UI 요소를 편집하거나 포인터를 드래그해 예외 분기 동선을 추가할 수 있습니다.',
    contextRefs: ['REQ-AUTH-01 반영', '4개 핵심 화면 전환 연결됨'],
    artifactAction: {
      title: 'UI/UX 화면 전환 플로우차트 생성',
      version: 'v1.1',
      summary: '랜딩 -> 온보딩 -> 워크스페이스 -> 결제 모달 플로우 구성',
      targetStep: 'step3'
    }
  },
  {
    id: 'm_s4_1',
    stepId: 'step4',
    sender: 'ai',
    author: 'Principal DB Architect',
    roleBadge: '데이터 아키텍트',
    timestamp: '14:15',
    content:
      'Step 02 PRD와 Step 03 화면 흐름의 결제·예약 단계를 반영해 PostgreSQL 15 기준 4개 핵심 테이블(`users`, `bakeries`, `discount_items`, `reservations`)을 정규화 설계했습니다.',
    contextRefs: ['REQ-STORE-02', 'REQ-RESV-03', '3NF 정규화 완료']
  },
  {
    id: 'm_s4_2',
    stepId: 'step4',
    sender: 'user',
    author: '한정호 (게스트)',
    roleBadge: 'Owner',
    timestamp: '14:17',
    content:
      '예약만 걸어두고 매장에 나타나지 않는 노쇼(No-Show)가 가장 걱정됩니다. 예약 테이블에 픽업 예정 시각과 보증금 결제 상태를 추적할 수 있게 반영해 주세요.'
  },
  {
    id: 'm_s4_3',
    stepId: 'step4',
    sender: 'ai',
    author: 'Principal DB Architect',
    roleBadge: '데이터 아키텍트',
    timestamp: '14:18',
    content:
      '`reservations` 테이블에 `pickup_time (TIMESTAMPTZ)` 및 `deposit_status (VARCHAR(20))` 컬럼을 반영하고 우측 ERD 캔버스와 PostgreSQL DDL 스크립트를 동기화했습니다.',
    contextRefs: ['reservations 스키마 갱신', 'DDL v1.2 동기화'],
    artifactAction: {
      title: 'ERD 스키마 및 SQL DDL 업데이트',
      version: 'v1.2',
      summary: 'reservations.pickup_time, deposit_status 컬럼 반영 완료',
      targetStep: 'step4'
    }
  },
  {
    id: 'm_s5',
    stepId: 'step5',
    sender: 'ai',
    author: 'Cloud Infra Architect',
    roleBadge: '인프라 아키텍트',
    timestamp: '14:20',
    content:
      'VPC 서브넷 내부에 Client, Spring Boot Server, PostgreSQL(단일 DB), Redis 캐시 노드를 배치한 인프라 토폴로지를 구성했습니다. 상단 스위처로 V1.0 단일 DB 초기 구성과 V1.5 Redis 확장 구성을 비교해 볼 수 있습니다.',
    contextRefs: ['VPC 3-Tier 격리', 'V1.5 Redis TTL 아키텍처']
  },
  {
    id: 'm_s6',
    stepId: 'step6',
    sender: 'ai',
    author: 'Agile Delivery Lead',
    roleBadge: '스크럼 마스터',
    timestamp: '14:21',
    content:
      '앞선 PRD 요구사항과 ERD·아키텍처 설계를 기반으로 Sprint 1 구현 티켓 6건(GRM-101 ~ GRM-106)을 추출했습니다. 우측 칸반 보드에서 카드를 드래그해 진행 상태를 변경하거나 Step 08 백로그에서 신규 티켓을 이관받을 수 있습니다.',
    contextRefs: ['총 29 Story Points', 'P0 핵심 경로 4건 배정']
  },
  {
    id: 'm_s7',
    stepId: 'step7',
    sender: 'ai',
    author: 'Staff API & DX Lead',
    roleBadge: '수석 백엔드 리드',
    timestamp: '14:22',
    content:
      '확정된 스키마와 권한 정책을 바탕으로 RESTful API 엔드포인트 명세(`POST /v1/projects`, `GET /v1/topology`, `POST /v1/reservations` 등)와 Git 브랜치 전략을 정리했습니다.\n\n두 번째 탭 [AI 코딩 지시서]에서 Cursor나 Copilot에 바로 붙여넣을 수 있는 태스크별 최적화 프롬프트를 복사해 보세요.',
    contextRefs: ['REST API 4종 명세', 'IDE 프롬프트 3종 최적화'],
    artifactAction: {
      title: 'API 명세서 및 IDE 코딩 프롬프트 생성',
      version: 'v1.0',
      summary: '엔드포인트 JSON 스펙 및 GRM 티켓별 AI 프롬프트 준비 완료',
      targetStep: 'step7'
    }
  },
  {
    id: 'm_s8',
    stepId: 'step8',
    sender: 'ai',
    author: 'SRE & Release Copilot',
    roleBadge: '사이트 신뢰성 엔지니어',
    timestamp: '14:23',
    content:
      '현재 운영 환경은 `v1.5.0 (Healthy)` 버전으로 구동 중입니다. 우측 뷰어에서 버전별 배포 타임라인과 롤백 가이드, 실제 부하 문제를 해결한 트러블슈팅 일지(조회 응답 120ms -> 15ms 개선, SSE 전환), 그리고 v2.0+ 차기 백로그를 통합 관리할 수 있습니다.',
    contextRefs: ['Prod: v1.5.0 Healthy', '트러블슈팅 3건 아카이빙']
  }
];

export const INITIAL_MEMBERS: ProjectMember[] = [
  {
    id: 'mem1',
    name: '한정호',
    email: 'jungho.han@groom.dev',
    initials: 'JH',
    role: 'OWNER',
    joinedAt: '생성자 (현재 세션)',
    isCurrentUser: true
  },
  {
    id: 'mem2',
    name: '김도윤',
    email: 'doyun.kim@groom.dev',
    initials: 'DY',
    role: 'EDITOR',
    joinedAt: '12분 전 합류'
  }
];
