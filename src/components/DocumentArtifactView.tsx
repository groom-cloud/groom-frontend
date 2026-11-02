import React, { useState, useEffect } from 'react';
import {
  FileText,
  Edit3,
  Check,
  CheckCircle2,
  Code2,
  Eye,
  Plus,
  Copy,
  Download,
  Trash2,
  Printer,
  RotateCcw,
  X,
  PanelRightClose,
  ChevronUp,
  ChevronDown,
  Table as TableIcon,
  AlignLeft,
  LayoutGrid
} from 'lucide-react';
import type { PrdRequirement, PrdNonFunctionalReq, StepId } from '../mockData';
import { INITIAL_PRD_NON_FUNCTIONAL } from '../mockData';

export type BmBlockFormat = 'text' | 'table' | 'cards';

export interface BmBlockCardItem {
  id: string;
  label: string;
  text: string;
}

export interface BmBlock {
  id: string;
  title: string;
  format: BmBlockFormat;
  content: string;
  tableHeaders?: string[];
  tableRows?: string[][];
  cardItems?: BmBlockCardItem[];
}

interface DocumentArtifactViewProps {
  currentStep: StepId;
  projectTitle: string;
  requirements: PrdRequirement[];
  setRequirements: React.Dispatch<React.SetStateAction<PrdRequirement[]>>;
  nonFunctionalReqs?: PrdNonFunctionalReq[];
  setNonFunctionalReqs?: React.Dispatch<React.SetStateAction<PrdNonFunctionalReq[]>>;
  onConfirmStep: (step: StepId) => void;
  onRequestAiRefine: (sectionTitle: string) => void;
  onCollapsePane?: () => void;
  isConfirmed?: boolean;
}

export const DocumentArtifactView: React.FC<DocumentArtifactViewProps> = ({
  currentStep,
  projectTitle,
  requirements,
  setRequirements,
  nonFunctionalReqs,
  setNonFunctionalReqs,
  onConfirmStep,
  onRequestAiRefine,
  onCollapsePane,
  isConfirmed = false
}) => {
  const [localNonFunctionalReqs, setLocalNonFunctionalReqs] = useState<PrdNonFunctionalReq[]>(INITIAL_PRD_NON_FUNCTIONAL);
  const nfrs = nonFunctionalReqs || localNonFunctionalReqs;
  const setNfrs = setNonFunctionalReqs || setLocalNonFunctionalReqs;
  const [prdTab, setPrdTab] = useState<'functional' | 'non_functional'>('functional');

  const [isEditMode, setIsEditMode] = useState(false);
  const [docSubTab, setDocSubTab] = useState<'formatted' | 'raw_md'>('formatted');
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [exportToast, setExportToast] = useState<string | null>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const showToast = (msg: string) => {
    setExportToast(msg);
    setTimeout(() => setExportToast(null), 2600);
  };

  // Editable Step 1 Overview Blocks
  const [overviewBlocks, setOverviewBlocks] = useState<BmBlock[]>([
    {
      id: 'ov_block_meta',
      title: '1. 프로젝트 기본 정보 및 핵심 비전',
      format: 'cards',
      content:
        '서비스 도메인: 하이퍼로컬 O2O 웹 | 타깃: 반경 1.5km 거주민 & 베이커리 점주 | 핵심 가치: 당일 마감 빵 50% 할인 픽업 | 성공 지표: 마감 재고 소진율 80%',
      tableHeaders: ['구분 / 핵심 항목', '설정값 및 전략'],
      tableRows: [
        ['서비스 도메인', '하이퍼로컬 O2O 웹'],
        ['핵심 고객', '반경 1.5km 거주민 & 로컬 베이커리 점주'],
        ['초기 진입 전략', '비로그인 인근 재고 탐색'],
        ['핵심 성공 지표 (KPI)', '마감 재고 소진율 80%']
      ],
      cardItems: [
        { id: 'meta_1', label: '서비스 도메인', text: '하이퍼로컬 O2O 웹' },
        { id: 'meta_2', label: '핵심 고객', text: '반경 1.5km 거주민 & 베이커리' },
        { id: 'meta_3', label: '초기 진입 전략', text: '비로그인 인근 재고 탐색' },
        { id: 'meta_4', label: '핵심 성공 지표 (KPI)', text: '마감 재고 소진율 80%' }
      ]
    },
    {
      id: 'ov_block_1',
      title: '2. 핵심 문제 정의 및 배경',
      format: 'text',
      content:
        '당일 생산·당일 폐기 원칙을 지키는 프리미엄 동네 베이커리의 마감 시간대(19:00~21:30) 잉여 빵 재고를 반경 1.5km 내 거주민 및 직장인에게 30~50% 할인가로 실시간 연결하는 하이퍼로컬 픽업 예약 웹 플랫폼입니다.'
    },
    {
      id: 'ov_block_2',
      title: '3. 타깃 고객 페르소나 및 양면 시장 가치',
      format: 'cards',
      content: '',
      cardItems: [
        {
          id: 'card_demand',
          label: '수요자 · 퇴근길 1인가구/거주민',
          text: '퇴근 동선 내 검증된 동네 빵집의 신선한 베이커리를 반값에 예약하고, 대기 없이 매장에서 즉시 픽업할 수 있는 합리적 소비 경험을 제공합니다.'
        },
        {
          id: 'card_supply',
          label: '공급자 · 동네 베이커리 점주',
          text: '마감 2시간 전 사진·수량만 입력하면 단골 구독자에게 자동 알림 발송. 선결제 보증금 제도로 노쇼(No-Show)를 원천 차단하고 일평균 폐기 손실을 75% 이상 절감합니다.'
        }
      ]
    },
    {
      id: 'ov_block_3',
      title: '4. 핵심 제공 솔루션 및 기능 범위',
      format: 'table',
      content: '',
      tableHeaders: ['구분', '제공 솔루션', '기대 효과'],
      tableRows: [
        ['실시간 재고 푸시', '점주가 20:00 재고 등록 시 반경 1.5km 단골에게 알림', '오픈 30분 내 80% 소진'],
        ['선결제 픽업 예약', 'PG사 간편결제 및 예약 보증금 결제 후 매장 방문 수령', '노쇼 발생률 0.5% 미만 차단'],
        ['비로그인 둘러보기', '게스트 세션으로 인근 빵집 잔여 수량 실시간 탐색', '초기 가입 이탈율 60% 개선']
      ]
    }
  ]);

  // Editable Step 2 Business Model Blocks
  const [bmBlocks, setBmBlocks] = useState<BmBlock[]>([
    {
      id: 'bm_block_1',
      title: '1. 비즈니스 모델 캔버스 요약',
      format: 'cards',
      content: '',
      cardItems: [
        { id: 'bm_c1', label: '수익 모델 (Revenue)', text: '픽업 예약 건당 중개 수수료 5% + 점주 월간 프로 구독(월 19,900원)' },
        { id: 'bm_c2', label: '핵심 파트너', text: '지역 로컬 베이커리, PG 결제사, 카카오 알림톡/문자 발송사' },
        { id: 'bm_c3', label: '고객 관계', text: '퇴근 시간대 정기 알림, 단골 빵집 찜하기, 선결제 보증금 제도' },
        { id: 'bm_c4', label: '비용 구조 (Cost)', text: '클라우드 인프라(AWS), 알림톡 발송비, PG 수수료(2.5%)' }
      ]
    },
    {
      id: 'bm_block_2',
      title: '2. 수수료 및 가격 정책',
      format: 'table',
      content: '',
      tableHeaders: ['수익원 구분', '과금 체계', '적용 기준'],
      tableRows: [
        ['중개 거래 수수료', '결제 금액의 5%', '할인 빵 픽업 완료 시 정산 차감'],
        ['점주 프리미엄 구독', '월 19,900원', '단골 푸시 무제한 + 일간 재고 분석 대시보드'],
        ['소비자 예약 보증금', '건당 1,000원 선결제', '픽업 시 본 결제 금액에서 자동 공제']
      ]
    },
    {
      id: 'bm_block_3',
      title: '3. 유닛 이코노믹스 및 마진 분석',
      format: 'text',
      content:
        '평균 객단가 12,000원 기준 건당 5% 수수료(600원) 발생. PG 결제 수수료(약 300원) 및 카카오 알림톡(15원) 차감 후 건당 공헌이익 약 285원(마진율 47.5%). 점주당 월평균 150건 거래 발생 시 점주당 월 42,750원 순수익 창출.'
    },
    {
      id: 'bm_block_4',
      title: '4. 초기 시장 진입 (GTM) 및 운영 리스크 대응',
      format: 'table',
      content: '',
      tableHeaders: ['리스크 항목', '해결 메커니즘', '하위 스키마·아키텍처 반영'],
      tableRows: [
        [
          '예약 후 미방문 (노쇼)',
          '픽업 예정 시각 지정 및 보증금 선결제 상태 추적',
          'reservations.deposit_status'
        ],
        [
          '마감 정각 동시 예약 충돌',
          '20:00 오픈 직후 잔여 수량 차감 시 초과 판매 방지',
          'discount_items.version (@Version)'
        ],
        [
          '초기 가입 이탈',
          '비로그인 상태에서 동네 할인 빵 목록 즉시 조회 허용',
          'Guest Shadow Session, Claim API'
        ]
      ]
    }
  ]);

  const activeBlocks = currentStep === 'step1' ? overviewBlocks : bmBlocks;
  const setActiveBlocks = (updater: React.SetStateAction<BmBlock[]>) => {
    if (currentStep === 'step1') {
      setOverviewBlocks(updater);
    } else {
      setBmBlocks(updater);
    }
  };

  const getCardGridClass = (count: number) => {
    if (count <= 1) return 'grid grid-cols-1 gap-4';
    if (count === 2) return 'grid grid-cols-1 @lg:grid-cols-2 gap-4';
    if (count === 3) return 'grid grid-cols-1 @sm:grid-cols-2 @xl:grid-cols-3 gap-4';
    return 'grid grid-cols-1 @sm:grid-cols-2 @2xl:grid-cols-4 gap-4';
  };

  // Block manipulation handlers
  const handleUpdateBlockTitle = (id: string, title: string) => {
    setActiveBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, title } : b)));
  };

  const handleUpdateBlockContent = (id: string, content: string) => {
    setActiveBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const handleChangeBlockFormat = (id: string, newFormat: BmBlockFormat) => {
    setActiveBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const updated: BmBlock = { ...b, format: newFormat };
        if (newFormat === 'table') {
          if (!updated.tableHeaders || updated.tableHeaders.length === 0) {
            updated.tableHeaders = ['항목 / 구분', '주요 내용', '비고'];
          }
          if (!updated.tableRows || updated.tableRows.length === 0) {
            updated.tableRows = [['기본 항목', updated.content || '세부 명세를 작성하세요', '-']];
          }
        } else if (newFormat === 'cards') {
          if (!updated.cardItems || updated.cardItems.length === 0) {
            updated.cardItems = [
              { id: `c_${Date.now()}_1`, label: '대상 구분 1', text: updated.content || '가치 제안 또는 세부 내용을 작성하세요.' },
              { id: `c_${Date.now()}_2`, label: '대상 구분 2', text: '두 번째 대상에 대한 가치 제안을 작성하세요.' }
            ];
          }
        } else if (newFormat === 'text') {
          if (!updated.content) {
            if (updated.tableRows && updated.tableRows.length > 0) {
              updated.content = updated.tableRows.map((r) => r.join(' | ')).join('\n');
            } else if (updated.cardItems && updated.cardItems.length > 0) {
              updated.content = updated.cardItems.map((c) => `[${c.label}] ${c.text}`).join('\n\n');
            }
          }
        }
        return updated;
      })
    );
    showToast(`블록 형식이 '${newFormat === 'text' ? '텍스트' : newFormat === 'table' ? '표' : '카드'}'(으)로 변경되었습니다`);
  };

  const handleDeleteBlock = (id: string) => {
    setActiveBlocks((prev) => prev.filter((b) => b.id !== id));
    showToast('블록 섹션이 삭제되었습니다');
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activeBlocks.length) return;
    setActiveBlocks((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleUpdateTableHeader = (blockId: string, colIdx: number, val: string) => {
    setActiveBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        const newHeaders = [...(b.tableHeaders || [])];
        newHeaders[colIdx] = val;
        return { ...b, tableHeaders: newHeaders };
      })
    );
  };

  const handleUpdateTableCell = (blockId: string, rowIdx: number, colIdx: number, val: string) => {
    setActiveBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        const newRows = (b.tableRows || []).map((row, rIdx) => {
          if (rIdx !== rowIdx) return row;
          const newRow = [...row];
          newRow[colIdx] = val;
          return newRow;
        });
        return { ...b, tableRows: newRows };
      })
    );
  };

  const handleDeleteTableRow = (blockId: string, rowIdx: number) => {
    setActiveBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        return { ...b, tableRows: (b.tableRows || []).filter((_, rIdx) => rIdx !== rowIdx) };
      })
    );
  };

  const handleAddTableColumn = (blockId: string) => {
    setActiveBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        const currentHeaders = b.tableHeaders || ['항목', '내용', '비고'];
        const nextColNum = currentHeaders.length + 1;
        const newHeaders = [...currentHeaders, `열 ${nextColNum}`];
        const newRows = (b.tableRows || []).map((row) => [...row, '']);
        return {
          ...b,
          tableHeaders: newHeaders,
          tableRows: newRows
        };
      })
    );
    showToast('새 열(컬럼)이 추가되었습니다');
  };

  const handleDeleteTableColumn = (blockId: string, colIdx: number) => {
    setActiveBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        const currentHeaders = b.tableHeaders || ['항목', '내용', '비고'];
        if (currentHeaders.length <= 1) {
          showToast('표에는 최소 1개의 열이 필요합니다');
          return b;
        }
        const newHeaders = currentHeaders.filter((_, idx) => idx !== colIdx);
        const newRows = (b.tableRows || []).map((row) => row.filter((_, idx) => idx !== colIdx));
        return {
          ...b,
          tableHeaders: newHeaders,
          tableRows: newRows
        };
      })
    );
    showToast('열(컬럼)이 삭제되었습니다');
  };

  const handleUpdateCardItem = (blockId: string, cardId: string, field: 'label' | 'text', val: string) => {
    setActiveBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        return {
          ...b,
          cardItems: (b.cardItems || []).map((c) => (c.id === cardId ? { ...c, [field]: val } : c))
        };
      })
    );
  };

  const handleDeleteCardItem = (blockId: string, cardId: string) => {
    setActiveBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        return { ...b, cardItems: (b.cardItems || []).filter((c) => c.id !== cardId) };
      })
    );
  };

  // =====================================================================
  // UNIFIED ADD MODAL STATES & SUBMIT HANDLERS (Step 1 & 2)
  // =====================================================================
  const [addModalType, setAddModalType] = useState<'section' | 'table_row' | 'card_item' | 'requirement' | 'non_functional' | null>(null);
  const [targetBlockId, setTargetBlockId] = useState<string | null>(null);

  // Table Row inputs
  const [modalRowCells, setModalRowCells] = useState<string[]>([]);

  // Card Item inputs
  const [modalCardLabel, setModalCardLabel] = useState('');
  const [modalCardText, setModalCardText] = useState('');

  // Section (New Block) inputs
  const [modalSectionTitle, setModalSectionTitle] = useState('');
  const [modalSectionFormat, setModalSectionFormat] = useState<BmBlockFormat>('text');
  const [modalSectionContent, setModalSectionContent] = useState('');

  // Requirement inputs
  const [modalReqCode, setModalReqCode] = useState('');
  const [modalReqTitle, setModalReqTitle] = useState('');
  const [modalReqCategory, setModalReqCategory] = useState('기능 요구사항');
  const [modalReqPriority, setModalReqPriority] = useState<'P0' | 'P1' | 'P2'>('P0');
  const [modalReqSpec, setModalReqSpec] = useState('');
  const [modalReqAc, setModalReqAc] = useState('');

  // Non-Functional Requirement inputs
  const [modalNfrCode, setModalNfrCode] = useState('');
  const [modalNfrCategory, setModalNfrCategory] = useState<
    '성능 및 지연시간' | '동시성 및 신뢰성' | '가용성' | '보안 및 개인정보' | '확장성'
  >('성능 및 지연시간');
  const [modalNfrTitle, setModalNfrTitle] = useState('');
  const [modalNfrTarget, setModalNfrTarget] = useState('');
  const [modalNfrVerify, setModalNfrVerify] = useState('');
  const [modalNfrPriority, setModalNfrPriority] = useState<'P0' | 'P1' | 'P2'>('P0');

  // Handlers for Table Row modal
  const handleOpenTableRowModal = (blockId: string) => {
    const target = activeBlocks.find((b) => b.id === blockId);
    const colCount = target?.tableHeaders?.length || 3;
    setTargetBlockId(blockId);
    setModalRowCells(Array(colCount).fill(''));
    setAddModalType('table_row');
  };

  const handleSubmitTableRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBlockId) return;
    setActiveBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== targetBlockId) return b;
        return { ...b, tableRows: [...(b.tableRows || []), [...modalRowCells]] };
      })
    );
    setAddModalType(null);
    showToast('새 표 행이 추가되었습니다');
  };

  // Handlers for Card Item modal
  const handleOpenCardItemModal = (blockId: string) => {
    setTargetBlockId(blockId);
    setModalCardLabel('');
    setModalCardText('');
    setAddModalType('card_item');
  };

  const handleSubmitCardItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBlockId || !modalCardLabel.trim()) return;
    const newCard: BmBlockCardItem = {
      id: `card_${Date.now()}`,
      label: modalCardLabel.trim(),
      text: modalCardText.trim() || '세부 내용을 기술하세요.'
    };
    setActiveBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== targetBlockId) return b;
        return { ...b, cardItems: [...(b.cardItems || []), newCard] };
      })
    );
    setAddModalType(null);
    showToast('새 카드 항목이 추가되었습니다');
  };

  // Handlers for Section Modal
  const handleOpenSectionModal = () => {
    const nextNum = activeBlocks.length + 1;
    setModalSectionTitle(`${nextNum}. 신규 비즈니스 항목 및 운영 전략`);
    setModalSectionFormat('text');
    setModalSectionContent('');
    setAddModalType('section');
  };

  const handleSubmitSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalSectionTitle.trim()) return;
    const newBlock: BmBlock = {
      id: `bm_block_${Date.now()}`,
      title: modalSectionTitle.trim(),
      format: modalSectionFormat,
      content: modalSectionFormat === 'text' ? (modalSectionContent.trim() || '상세 전략 및 정책 내용을 기술하세요.') : '',
      tableHeaders: modalSectionFormat === 'table' ? ['구분 / 항목', '주요 내용', '비고'] : undefined,
      tableRows: modalSectionFormat === 'table' ? [['초기 항목', modalSectionContent.trim() || '세부 명세를 작성하세요', '-']] : undefined,
      cardItems: modalSectionFormat === 'cards' ? [
        { id: `c_${Date.now()}_1`, label: '대상 구분 1', text: modalSectionContent.trim() || '첫 번째 대상에 대한 가치 제안을 입력하세요.' },
        { id: `c_${Date.now()}_2`, label: '대상 구분 2', text: '두 번째 대상에 대한 가치 제안을 입력하세요.' }
      ] : undefined
    };
    setActiveBlocks((prev) => [...prev, newBlock]);
    setAddModalType(null);
    showToast('새 블록 섹션이 추가되었습니다');
  };

  const handleOpenReqModal = () => {
    const nextNum = String(requirements.length + 1).padStart(2, '0');
    setModalReqCode(`REQ-CUST-${nextNum}`);
    setModalReqTitle('');
    setModalReqCategory('기능 요구사항');
    setModalReqPriority('P0');
    setModalReqSpec('');
    setModalReqAc('');
    setAddModalType('requirement');
  };

  const handleSubmitRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalReqTitle.trim()) return;
    const newReq: PrdRequirement = {
      id: `req_${Date.now()}`,
      reqCode: modalReqCode.trim() || `REQ-${Date.now()}`,
      category: modalReqCategory.trim() || '기능 요구사항',
      title: modalReqTitle.trim(),
      priority: modalReqPriority,
      specification: modalReqSpec.trim() || '구현할 세부 명세 내용을 작성하세요.',
      acceptanceCriteria: modalReqAc.trim() || '인수 검증 완료 기준을 명시하세요.',
      status: 'Review'
    };
    setRequirements((prev) => [...prev, newReq]);
    setAddModalType(null);
    showToast(`[${newReq.reqCode}] 새 요구사항이 추가되었습니다`);
  };

  const handleOpenNfrModal = () => {
    const nextNum = nfrs.length + 1;
    setModalNfrCode(`NFR-QUAL-0${nextNum}`);
    setModalNfrCategory('성능 및 지연시간');
    setModalNfrTitle('');
    setModalNfrTarget('');
    setModalNfrVerify('');
    setModalNfrPriority('P0');
    setAddModalType('non_functional');
  };

  const handleSubmitNfr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalNfrTitle.trim()) return;
    const newNfr: PrdNonFunctionalReq = {
      id: `nfr_${Date.now()}`,
      nfrCode: modalNfrCode.trim() || `NFR-${Date.now()}`,
      category: modalNfrCategory,
      title: modalNfrTitle.trim(),
      targetMetric: modalNfrTarget.trim() || '목표 수치 및 품질 지표를 정의하세요.',
      verificationMethod: modalNfrVerify.trim() || '부하 테스트 및 메트릭 로깅 검증',
      priority: modalNfrPriority,
      status: 'Confirmed'
    };
    setNfrs((prev) => [...prev, newNfr]);
    setAddModalType(null);
    showToast(`[${newNfr.nfrCode}] 비기능 요구사항이 추가되었습니다`);
  };

  const handleDeleteNfr = (id: string) => {
    setNfrs((prev) => prev.filter((item) => item.id !== id));
    showToast('비기능 요구사항이 삭제되었습니다');
  };

  const toggleNfrStatus = (id: string) => {
    setNfrs((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'Confirmed' ? 'Review' : 'Confirmed' }
          : item
      )
    );
  };

  // Build default markdown from structured state
  const buildMarkdownFromState = (step: StepId) => {
    if (step === 'step1') {
      const blocksMd = overviewBlocks
        .map((b) => {
          if (b.format === 'table') {
            const headers = b.tableHeaders || ['항목', '내용', '비고'];
            const rows = b.tableRows || [];
            const headerRow = `| ${headers.join(' | ')} |`;
            const sepRow = `| ${headers.map(() => '---').join(' | ')} |`;
            const dataRows = rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
            return `## ${b.title}\n\n${headerRow}\n${sepRow}\n${dataRows}`;
          }
          if (b.format === 'cards') {
            const cards = b.cardItems || [];
            return `## ${b.title}\n\n` + cards.map((c) => `### ${c.label}\n${c.text}`).join('\n\n');
          }
          return `## ${b.title}\n\n${b.content}`;
        })
        .join('\n\n');

      return `# 01. 서비스 개요 및 기획서\n\n## 프로젝트명: ${projectTitle}\n\n${blocksMd}`;
    }
    if (step === 'step2') {
      const blocksMd = bmBlocks
        .map((b) => {
          if (b.format === 'table') {
            const headers = b.tableHeaders || ['항목', '내용', '비고'];
            const rows = b.tableRows || [];
            const headerRow = `| ${headers.join(' | ')} |`;
            const sepRow = `| ${headers.map(() => '---').join(' | ')} |`;
            const dataRows = rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
            return `## ${b.title}\n\n${headerRow}\n${sepRow}\n${dataRows}`;
          }
          if (b.format === 'cards') {
            const cards = b.cardItems || [];
            return `## ${b.title}\n\n` + cards.map((c) => `### ${c.label}\n${c.text}`).join('\n\n');
          }
          return `## ${b.title}\n\n${b.content}`;
        })
        .join('\n\n');

      return `# 02. 비즈니스 모델 (BM)\n\n## 프로젝트명: ${projectTitle}\n\n${blocksMd}`;
    }
    return `# 05. 요구사항 명세서 (PRD)\n\n## 5.1 기능 요구사항 (${requirements.length}건)\n${requirements
      .map(
        (r) =>
          `- **[${r.reqCode}] (${r.priority} / ${r.status}) ${r.title}**\n  - 분류: ${r.category}\n  - 상세 명세: ${r.specification}\n  - 인수 조건: ${r.acceptanceCriteria}`
      )
      .join('\n')}\n\n## 5.2 비기능 요구사항 (성능 및 품질 목표 - ${nfrs.length}건)\n${nfrs
      .map(
        (n) =>
          `- **[${n.nfrCode}] (${n.priority} / ${n.status}) ${n.title}**\n  - 분류: ${n.category}\n  - 목표 지표: ${n.targetMetric}\n  - 검증 방식: ${n.verificationMethod}`
      )
      .join('\n')}`;
  };

  // Raw Markdown editable state per step
  const [rawMdStep1, setRawMdStep1] = useState(() => buildMarkdownFromState('step1'));
  const [rawMdStep2, setRawMdStep2] = useState(() => buildMarkdownFromState('step2'));
  const [rawMdStep5, setRawMdStep5] = useState(() => buildMarkdownFromState('step5'));
  const [isRawDirtyStep1, setIsRawDirtyStep1] = useState(false);
  const [isRawDirtyStep2, setIsRawDirtyStep2] = useState(false);
  const [isRawDirtyStep5, setIsRawDirtyStep5] = useState(false);

  // Keep raw markdown synced with structured edits unless user customized raw markdown directly
  useEffect(() => {
    if (!isRawDirtyStep1) {
      setRawMdStep1(buildMarkdownFromState('step1'));
    }
  }, [projectTitle, overviewBlocks, isRawDirtyStep1]);

  useEffect(() => {
    if (!isRawDirtyStep2) {
      setRawMdStep2(buildMarkdownFromState('step2'));
    }
  }, [projectTitle, bmBlocks, isRawDirtyStep2]);

  useEffect(() => {
    if (!isRawDirtyStep5) {
      setRawMdStep5(buildMarkdownFromState('step5'));
    }
  }, [requirements, nfrs, isRawDirtyStep5]);

  const currentRawMarkdown =
    currentStep === 'step1'
      ? rawMdStep1
      : currentStep === 'step2'
      ? rawMdStep2
      : rawMdStep5;

  const handleRawMarkdownChange = (val: string) => {
    if (currentStep === 'step1') {
      setRawMdStep1(val);
      setIsRawDirtyStep1(true);
    } else if (currentStep === 'step2') {
      setRawMdStep2(val);
      setIsRawDirtyStep2(true);
    } else {
      setRawMdStep5(val);
      setIsRawDirtyStep5(true);
    }
  };

  const handleSyncRawToStructured = () => {
    showToast('마크다운 원문 변경사항이 반영되었습니다');
  };

  const handleResetRawMarkdown = () => {
    if (currentStep === 'step1') {
      setIsRawDirtyStep1(false);
      setRawMdStep1(buildMarkdownFromState('step1'));
    } else if (currentStep === 'step2') {
      setIsRawDirtyStep2(false);
      setRawMdStep2(buildMarkdownFromState('step2'));
    } else {
      setIsRawDirtyStep5(false);
      setRawMdStep5(buildMarkdownFromState('step5'));
    }
    showToast('구조화 문서 기준으로 원문을 다시 생성했습니다');
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard?.writeText(currentRawMarkdown).catch(() => {});
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 1800);
    showToast('클립보드에 마크다운이 복사되었습니다');
  };

  const handleConfirm = () => {
    setIsEditMode(false);
    onConfirmStep(currentStep);
  };

  // =====================================================================
  // EXPORT HANDLERS: Word (.doc), PDF (Print), Markdown (.md)
  // =====================================================================
  const buildExportHtml = () => {
    const docTitle =
      currentStep === 'step1'
        ? `${projectTitle} - 서비스 개요 및 비즈니스 모델 (BM)`
        : `${projectTitle} - 요구사항 및 기술 제약사항 명세서 (PRD v1.2)`;

    if (currentStep === 'step1') {
      return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<title>${docTitle}</title>
<style>
  body { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; color: #1d1d1f; line-height: 1.65; max-width: 780px; margin: 40px auto; padding: 0 24px; }
  h1 { font-size: 24px; border-bottom: 2px solid #1d1d1f; padding-bottom: 12px; margin-bottom: 20px; }
  h2 { font-size: 17px; margin-top: 28px; margin-bottom: 10px; color: #1d1d1f; }
  p { font-size: 13.5px; color: #333; margin: 8px 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
  th, td { border: 1px solid #d2d2d7; padding: 10px 12px; text-align: left; vertical-align: top; }
  th { background-color: #f5f5f7; font-weight: 600; }
  code { font-family: Consolas, monospace; background: #f5f5f7; padding: 2px 5px; border-radius: 4px; }
  .cards-grid { display: flex; gap: 14px; margin-top: 10px; }
  .card-box { flex: 1; border: 1px solid #d2d2d7; padding: 12px 14px; border-radius: 8px; background: #fafafa; }
</style>
</head>
<body>
  <h1>${docTitle}</h1>
  ${bmBlocks
    .map((block) => {
      if (block.format === 'table') {
        const headers = block.tableHeaders || ['항목', '내용', '비고'];
        const rows = block.tableRows || [];
        return `<h2>${block.title}</h2>
<table>
  <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
  <tbody>
    ${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}
  </tbody>
</table>`;
      }
      if (block.format === 'cards') {
        const cards = block.cardItems || [];
        return `<h2>${block.title}</h2>
<div class="cards-grid">
  ${cards.map((c) => `<div class="card-box"><strong>${c.label}</strong><p>${c.text.replace(/\n/g, '<br/>')}</p></div>`).join('')}
</div>`;
      }
      return `<h2>${block.title}</h2>
<p>${(block.content || '').replace(/\n/g, '<br/>')}</p>`;
    })
    .join('')}
</body>
</html>`;
    }

    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<title>${docTitle}</title>
<style>
  body { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; color: #1d1d1f; line-height: 1.65; max-width: 820px; margin: 40px auto; padding: 0 24px; }
  h1 { font-size: 24px; border-bottom: 2px solid #1d1d1f; padding-bottom: 12px; margin-bottom: 20px; }
  h2 { font-size: 17px; margin-top: 28px; margin-bottom: 10px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12.5px; }
  th, td { border: 1px solid #d2d2d7; padding: 9px 10px; text-align: left; vertical-align: top; }
  th { background-color: #f5f5f7; font-weight: 600; }
  ul { padding-left: 20px; font-size: 13.5px; }
  li { margin-bottom: 8px; }
</style>
</head>
<body>
  <h1>${docTitle}</h1>
  <h2>1. 기능 요구사항 명세 (${requirements.length}건)</h2>
  <table>
    <thead>
      <tr><th>ID</th><th>분류</th><th>중요도</th><th>기능 제목 및 상세 명세</th><th>인수 조건</th><th>상태</th></tr>
    </thead>
    <tbody>
      ${requirements
        .map(
          (r) =>
            `<tr><td><strong>${r.reqCode}</strong></td><td>${r.category}</td><td>${r.priority}</td><td><strong>${r.title}</strong><br/>${r.specification}</td><td>${r.acceptanceCriteria}</td><td>${r.status}</td></tr>`
        )
        .join('')}
    </tbody>
  </table>
  <h2>2. 비기능 요구사항 및 품질 목표 (${nfrs.length}건)</h2>
  <table>
    <thead>
      <tr><th>ID</th><th>분류</th><th>중요도</th><th>목표 지표</th><th>검증 방식</th><th>상태</th></tr>
    </thead>
    <tbody>
      ${nfrs
        .map(
          (n) =>
            `<tr><td><strong>${n.nfrCode}</strong></td><td>${n.category}</td><td>${n.priority}</td><td><strong>${n.title}</strong><br/>${n.targetMetric}</td><td>${n.verificationMethod}</td><td>${n.status}</td></tr>`
        )
        .join('')}
    </tbody>
  </table>
</body>
</html>`;
  };

  const handleExportWord = () => {
    const htmlContent = buildExportHtml();
    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName =
      currentStep === 'step1'
        ? `01_SERVICE_OVERVIEW_${projectTitle.replace(/\s+/g, '_')}.doc`
        : currentStep === 'step2'
        ? `02_BUSINESS_MODEL_${projectTitle.replace(/\s+/g, '_')}.doc`
        : `05_PRD_SPECIFICATION_${projectTitle.replace(/\s+/g, '_')}.doc`;
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExportMenuOpen(false);
    showToast(`Word 문서(${fileName}) 다운로드가 시작되었습니다`);
  };

  const handleExportMarkdownFile = () => {
    const blob = new Blob([currentRawMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName =
      currentStep === 'step1'
        ? '01_SERVICE_OVERVIEW.md'
        : currentStep === 'step2'
        ? '02_BUSINESS_MODEL.md'
        : '05_PRD_SPECIFICATION.md';
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExportMenuOpen(false);
    showToast(`마크다운 파일(${fileName}) 다운로드가 시작되었습니다`);
  };

  const handleExportPdf = () => {
    setIsExportMenuOpen(false);
    const htmlContent = buildExportHtml();
    const printWindow = window.open('', '_blank', 'width=900,height=720');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
      showToast('PDF 저장을 위한 인쇄 대화상자를 열었습니다');
    } else {
      window.print();
      showToast('브라우저 PDF 인쇄 창을 열었습니다');
    }
  };

  // =====================================================================
  // CRUD HANDLERS FOR STEP 1 & STEP 2
  // =====================================================================
  const handleDeleteRequirement = (id: string) => {
    setRequirements((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleRequirementStatus = (id: string) => {
    setRequirements((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: r.status === 'Confirmed' ? 'Review' : 'Confirmed' } : r))
    );
  };

  return (
    <div className="@container relative flex-1 flex flex-col h-full bg-surface overflow-hidden">
      {/* Floating Non-Layout-Shifting Toast */}
      {exportToast && (
        <div
          role="status"
          className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-paper px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 whitespace-nowrap"
        >
          <Check className="w-3.5 h-3.5 text-ok shrink-0" />
          <span>{exportToast}</span>
        </div>
      )}

      {/* Export Dropdown Menu (Rendered outside toolbar overflow to prevent clipping) */}
      {isExportMenuOpen && (
        <>
          <div
            onClick={() => setIsExportMenuOpen(false)}
            className="fixed inset-0 z-40"
          />
          <div className="absolute right-4 top-12 w-52 bg-surface border border-line-strong rounded-xl p-1.5 z-50 text-xs space-y-0.5">
            <button
              type="button"
              onClick={handleExportPdf}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-well text-ink flex items-center justify-between cursor-pointer"
            >
              <span className="font-medium">PDF 문서로 저장 / 인쇄</span>
              <Printer className="w-3.5 h-3.5 text-muted" />
            </button>
            <button
              type="button"
              onClick={handleExportWord}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-well text-ink flex items-center justify-between cursor-pointer"
            >
              <span className="font-medium">Word (.doc) 다운로드</span>
              <Download className="w-3.5 h-3.5 text-muted" />
            </button>
            <button
              type="button"
              onClick={handleExportMarkdownFile}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-well text-ink flex items-center justify-between cursor-pointer"
            >
              <span className="font-medium">Markdown (.md) 다운로드</span>
              <Code2 className="w-3.5 h-3.5 text-muted" />
            </button>
            <button
              type="button"
              onClick={() => {
                handleCopyMarkdown();
                setIsExportMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-well text-ink flex items-center justify-between cursor-pointer border-t border-line mt-1 pt-2"
            >
              <span>마크다운 클립보드 복사</span>
              {copiedBadge ? (
                <Check className="w-3.5 h-3.5 text-ok" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-muted" />
              )}
            </button>
          </div>
        </>
      )}

      {/* Single-Row Document Toolbar (Container-Query Adaptive) */}
      <div className="h-12 px-3 @xl:px-4 bg-surface border-b border-line flex items-center justify-between gap-2 overflow-x-auto shrink-0">
        <div className="flex items-center gap-2 min-w-0 shrink-0">
          <div className="hidden @xl:flex items-center gap-1.5 text-xs min-w-0">
            <FileText className="w-3.5 h-3.5 text-muted shrink-0" />
            <code className="text-ink font-mono font-medium truncate max-w-[160px] @2xl:max-w-none">
              {currentStep === 'step1'
                ? '01_SERVICE_OVERVIEW.md'
                : currentStep === 'step2'
                ? '02_BUSINESS_MODEL.md'
                : '04_PRD_SPECIFICATION.md'}
            </code>
          </div>

          {/* Sub-mode switcher: Formatted vs Raw Markdown */}
          <div className="flex items-center bg-well p-0.5 rounded-lg text-xs shrink-0">
            <button
              type="button"
              onClick={() => setDocSubTab('formatted')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                docSubTab === 'formatted'
                  ? 'bg-surface text-ink font-medium'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden @2xl:inline">구조화 문서</span>
              <span className="@2xl:hidden">문서</span>
            </button>
            <button
              type="button"
              onClick={() => setDocSubTab('raw_md')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                docSubTab === 'raw_md'
                  ? 'bg-surface text-ink font-medium'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden @2xl:inline">마크다운 원문 편집</span>
              <span className="@2xl:hidden">원문</span>
            </button>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            className="px-2.5 py-1.5 rounded-lg bg-well hover:bg-control text-ink text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-muted" />
            <span className="hidden @2xl:inline">내보내기 (PDF / Word)</span>
            <span className="@2xl:hidden">내보내기</span>
          </button>

          {docSubTab === 'formatted' && (
            <button
              type="button"
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                isEditMode
                  ? 'bg-accent text-accent-ink'
                  : 'bg-well hover:bg-control text-ink'
              }`}
              title={isEditMode ? '편집을 완료하고 읽기 모드로 전환' : '문서 내용 수정 및 항목 추가'}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden @2xl:inline">
                {isEditMode ? '편집 완료' : '편집하기'}
              </span>
              <span className="@2xl:hidden">{isEditMode ? '완료' : '편집'}</span>
            </button>
          )}

          {isConfirmed ? (
            <button
              type="button"
              onClick={handleConfirm}
              className="group bg-ok-soft text-ok border border-ok/30 hover:bg-danger-soft hover:text-danger hover:border-danger/30 text-xs font-medium px-2.5 @2xl:px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5"
              title="클릭하여 단계 확정을 취소하고 작업 중으로 되돌립니다"
            >
              <CheckCircle2 className="w-3.5 h-3.5 group-hover:hidden" />
              <span className="group-hover:hidden">확정 완료</span>
              <RotateCcw className="w-3.5 h-3.5 hidden group-hover:inline" />
              <span className="hidden group-hover:inline">확정 취소</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              className="px-2.5 @2xl:px-3 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper text-xs font-medium flex items-center gap-1.5 transition-opacity cursor-pointer whitespace-nowrap"
              title="현재 단계의 산출물을 확정합니다"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>단계 확정</span>
            </button>
          )}

          {onCollapsePane && (
            <button
              type="button"
              aria-label="문서 영역 접기"
              title="문서 영역 접기"
              onClick={onCollapsePane}
              className="hidden lg:inline-flex p-1.5 rounded-lg bg-well hover:bg-control text-muted hover:text-ink transition-colors cursor-pointer"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Continuous Editorial Document Body */}
      <div className="flex-1 overflow-y-auto px-4 @xl:px-8 py-6 @xl:py-10">
        <div className="max-w-3xl mx-auto">
          {docSubTab === 'raw_md' ? (
            /* ======================================================== */
            /* EDITABLE RAW MARKDOWN EDITOR */
            /* ======================================================== */
            <div className="border border-line rounded-xl overflow-hidden bg-well">
              <div className="px-4 py-2.5 border-b border-line flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-ink font-medium">
                  <span>마크다운 원문 직접 편집기 (UTF-8)</span>
                  <span className="text-muted">· {currentRawMarkdown.split('\n').length}줄</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleResetRawMarkdown}
                    className="px-2.5 py-1 rounded-md bg-surface hover:bg-control text-muted hover:text-ink flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>구조화 데이터로 초기화</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSyncRawToStructured}
                    className="px-2.5 py-1 rounded-md bg-ink text-paper font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>원문 변경사항 저장</span>
                  </button>
                </div>
              </div>
              <textarea
                aria-label="마크다운 원문 편집기"
                value={currentRawMarkdown}
                onChange={(e) => handleRawMarkdownChange(e.target.value)}
                rows={22}
                className="w-full p-5 text-xs font-mono text-ink leading-relaxed bg-surface focus:outline-none resize-y"
              />
            </div>
          ) : currentStep === 'step1' || currentStep === 'step2' ? (
            /* ======================================================== */
            /* STEP 1 (OVERVIEW) & STEP 2 (BM): EDITORIAL DOCUMENT      */
            /* ======================================================== */
            <article className="divide-y divide-line">
              {/* Document Title Header */}
              <header className="pb-6">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs text-muted">
                    {currentStep === 'step1'
                      ? 'Step 01 · 서비스 개요 및 기획서'
                      : 'Step 02 · 비즈니스 모델 (BM)'}
                  </span>
                  {!isEditMode && (
                    <button
                      type="button"
                      onClick={() => setIsEditMode(true)}
                      className="text-xs text-accent hover:underline font-medium cursor-pointer"
                    >
                      문서 항목 직접 수정하기
                    </button>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
                  {projectTitle}
                </h1>
              </header>

              {/* Dynamic Unified BM Blocks (Delete / Format Switch / Reorder / Edit) */}
              <div className="divide-y divide-line">
                {activeBlocks.map((block, index) => (
                  <section key={block.id} className="py-6 space-y-4">
                    {isEditMode ? (
                      /* Edit Mode Block Container */
                      <div className="p-4 sm:p-5 rounded-2xl bg-well/50 border border-line space-y-4">
                        {/* Block Header Toolbar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-line">
                          {/* Title Input */}
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              aria-label="블록 소제목 편집"
                              value={block.title}
                              onChange={(e) => handleUpdateBlockTitle(block.id, e.target.value)}
                              className="w-full bg-surface border border-accent-line rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-ink focus:outline-none focus:border-ink/40"
                              placeholder="블록 소제목을 입력하세요..."
                            />
                          </div>

                          {/* Right Controls: Format Switcher & Reorder & Delete */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Format Switcher Pills */}
                            <div className="flex items-center bg-surface border border-line rounded-lg p-0.5 text-xs font-medium">
                              <button
                                type="button"
                                onClick={() => handleChangeBlockFormat(block.id, 'text')}
                                className={`px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-colors ${
                                  block.format === 'text'
                                    ? 'bg-ink text-paper font-semibold shadow-xs'
                                    : 'text-muted hover:text-ink'
                                }`}
                                title="텍스트 문단 형식으로 변경"
                              >
                                <AlignLeft className="w-3 h-3" />
                                <span className="hidden sm:inline">텍스트</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleChangeBlockFormat(block.id, 'table')}
                                className={`px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-colors ${
                                  block.format === 'table'
                                    ? 'bg-ink text-paper font-semibold shadow-xs'
                                    : 'text-muted hover:text-ink'
                                }`}
                                title="표(Table) 형식으로 변경"
                              >
                                <TableIcon className="w-3 h-3" />
                                <span className="hidden sm:inline">표 형식</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleChangeBlockFormat(block.id, 'cards')}
                                className={`px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-colors ${
                                  block.format === 'cards'
                                    ? 'bg-ink text-paper font-semibold shadow-xs'
                                    : 'text-muted hover:text-ink'
                                }`}
                                title="2열 카드 비교 형식으로 변경"
                              >
                                <LayoutGrid className="w-3 h-3" />
                                <span className="hidden sm:inline">카드</span>
                              </button>
                            </div>

                            {/* Reorder Buttons */}
                            <div className="flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() => handleMoveBlock(index, 'up')}
                                disabled={index === 0}
                                aria-label="블록 위로 이동"
                                className="p-1 rounded-md text-muted hover:text-ink hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                title="블록 위로 이동"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveBlock(index, 'down')}
                                disabled={index === activeBlocks.length - 1}
                                aria-label="블록 아래로 이동"
                                className="p-1 rounded-md text-muted hover:text-ink hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                title="블록 아래로 이동"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Delete Block Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteBlock(block.id)}
                              aria-label="블록 삭제"
                              className="p-1.5 text-muted hover:text-danger rounded-md hover:bg-surface cursor-pointer transition-colors"
                              title="이 블록 삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Format-Specific Body in Edit Mode */}
                        {block.format === 'text' && (
                          <textarea
                            aria-label={`${block.title} 본문 내용 편집`}
                            rows={4}
                            value={block.content}
                            onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                            className="w-full bg-surface border border-line rounded-xl p-3.5 text-xs sm:text-sm text-ink leading-relaxed focus:outline-none focus:border-ink/40"
                            placeholder="상세 내용을 자유롭게 기술하세요..."
                          />
                        )}

                        {block.format === 'table' && (
                          <div className="space-y-3">
                            <div className="overflow-x-auto border border-line rounded-xl bg-surface">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                  <tr className="border-b border-line bg-well/60 text-muted font-medium">
                                    {(block.tableHeaders || ['항목', '내용', '비고']).map((header, cIdx) => (
                                      <th key={cIdx} className="p-2 min-w-[130px]">
                                        <div className="flex items-center gap-1">
                                          <input
                                            type="text"
                                            aria-label={`컬럼 ${cIdx + 1} 헤더`}
                                            value={header}
                                            onChange={(e) => handleUpdateTableHeader(block.id, cIdx, e.target.value)}
                                            className="flex-1 min-w-0 bg-surface border border-line rounded px-2 py-1 text-xs font-semibold text-ink focus:outline-none focus:border-ink/40"
                                          />
                                          {(block.tableHeaders?.length || 0) > 1 && (
                                            <button
                                              type="button"
                                              aria-label={`열 ${cIdx + 1} 삭제`}
                                              onClick={() => handleDeleteTableColumn(block.id, cIdx)}
                                              className="p-1 text-muted hover:text-danger rounded cursor-pointer shrink-0"
                                              title="이 열 삭제"
                                            >
                                              <X className="w-3.5 h-3.5" />
                                            </button>
                                          )}
                                        </div>
                                      </th>
                                    ))}
                                    <th className="p-2 w-12 text-center text-muted">행 삭제</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-line text-ink-2">
                                  {(block.tableRows || []).map((row, rIdx) => (
                                    <tr key={rIdx} className="hover:bg-well/30 transition-colors">
                                      {row.map((cell, cIdx) => (
                                        <td key={cIdx} className="p-2 align-top">
                                          <input
                                            type="text"
                                            aria-label={`행 ${rIdx + 1} 열 ${cIdx + 1} 셀`}
                                            value={cell}
                                            onChange={(e) => handleUpdateTableCell(block.id, rIdx, cIdx, e.target.value)}
                                            className="w-full bg-well border border-line rounded px-2.5 py-1.5 text-xs text-ink"
                                          />
                                        </td>
                                      ))}
                                      <td className="p-2 text-center align-top">
                                        <button
                                          type="button"
                                          aria-label="행 삭제"
                                          onClick={() => handleDeleteTableRow(block.id, rIdx)}
                                          className="p-1 text-muted hover:text-danger rounded cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* In-place Add Column & Add Row Buttons */}
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleAddTableColumn(block.id)}
                                className="px-2.5 py-1 rounded-md bg-surface border border-line hover:bg-control text-ink text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>열 추가</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenTableRowModal(block.id)}
                                className="px-2.5 py-1 rounded-md bg-surface border border-line hover:bg-control text-ink text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>행 추가</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {block.format === 'cards' && (
                          <div className="space-y-3">
                            <div className={getCardGridClass(block.cardItems?.length || 0)}>
                              {(block.cardItems || []).map((card) => (
                                <div key={card.id} className="p-3.5 bg-surface border border-line rounded-xl space-y-2.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <input
                                      type="text"
                                      aria-label="카드 구분명 편집"
                                      value={card.label}
                                      onChange={(e) => handleUpdateCardItem(block.id, card.id, 'label', e.target.value)}
                                      className="flex-1 min-w-0 bg-well border border-line rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink focus:outline-none focus:border-ink/40"
                                      placeholder="카드 제목 입력"
                                    />
                                    <button
                                      type="button"
                                      aria-label="카드 삭제"
                                      onClick={() => handleDeleteCardItem(block.id, card.id)}
                                      className="p-1.5 text-muted hover:text-danger rounded-lg hover:bg-well cursor-pointer transition-colors shrink-0"
                                      title="이 카드 삭제"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <textarea
                                    rows={4}
                                    aria-label="카드 상세 내용 편집"
                                    value={card.text}
                                    onChange={(e) => handleUpdateCardItem(block.id, card.id, 'text', e.target.value)}
                                    className="w-full bg-well border border-line rounded-lg p-2.5 text-xs text-ink leading-relaxed focus:outline-none focus:border-ink/40"
                                    placeholder="상세 내용을 입력하세요..."
                                  />
                                </div>
                              ))}
                            </div>

                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleOpenCardItemModal(block.id)}
                                className="px-2.5 py-1 rounded-md bg-surface border border-line hover:bg-control text-ink text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>카드 추가</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Read Mode: Clean Editorial Document */
                      <>
                        <div className="flex items-center justify-between gap-2">
                          <h2 className="text-sm sm:text-base font-semibold text-ink">
                            {block.title}
                          </h2>
                          <button
                            type="button"
                            onClick={() => onRequestAiRefine(block.title)}
                            className="text-xs text-accent hover:underline font-medium cursor-pointer whitespace-nowrap"
                          >
                            AI 문단 보강
                          </button>
                        </div>

                        {block.format === 'text' && (
                          <p className="text-xs sm:text-sm text-ink-2 leading-relaxed max-w-[68ch] whitespace-pre-wrap">
                            {block.content}
                          </p>
                        )}

                        {block.format === 'table' && (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-y border-line text-muted font-medium bg-well/30">
                                  {(block.tableHeaders || []).map((header, cIdx) => (
                                    <th key={cIdx} className="py-2.5 px-3 whitespace-nowrap">{header}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-line text-ink-2">
                                {(block.tableRows || []).map((row, rIdx) => (
                                  <tr key={rIdx} className="hover:bg-well/20 transition-colors">
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="py-3 px-3 align-top">
                                        {cIdx === row.length - 1 && cell.includes('.') ? (
                                          <code className="text-xs font-mono bg-well px-1.5 py-0.5 rounded">{cell}</code>
                                        ) : (
                                          cell
                                        )}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {block.format === 'cards' && (
                          <div className={`${getCardGridClass(block.cardItems?.length || 0)} pt-1`}>
                            {(block.cardItems || []).map((card) => (
                              <div
                                key={card.id}
                                className="p-4 rounded-xl border border-line bg-well/30 space-y-2 flex flex-col justify-between"
                              >
                                <div className="space-y-1.5">
                                  <div className="text-xs font-bold text-ink tracking-tight">{card.label}</div>
                                  <p className="text-xs sm:text-sm text-ink-2 leading-relaxed whitespace-pre-wrap">
                                    {card.text}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </section>
                ))}
              </div>

              {/* Add New Custom Block Button (Only in Edit Mode) */}
              {isEditMode && (
                <div className="pt-8 pb-4 flex justify-center">
                  <button
                    type="button"
                    onClick={handleOpenSectionModal}
                    className="px-4 py-2.5 rounded-xl bg-well hover:bg-control text-ink text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-dashed border-line hover:border-ink/40"
                  >
                    <Plus className="w-4 h-4 text-accent" />
                    <span>신규 블록 섹션 추가</span>
                  </button>
                </div>
              )}
            </article>
          ) : (
            /* ======================================================== */
            /* STEP 5: EDITORIAL PRD SPECIFICATION (FULL EDIT)          */
            /* ======================================================== */
            <article className="space-y-6">
              <header className="pb-4 border-b border-line flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="text-xs text-muted mb-1.5">
                    Step 05 · 요구사항 명세서 (PRD)
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
                    제품 요구사항 명세서 (PRD)
                  </h1>
                </div>

                {isEditMode && (
                  <div className="flex items-center gap-2">
                    {prdTab === 'functional' ? (
                      <button
                        type="button"
                        onClick={handleOpenReqModal}
                        className="px-3 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ 기능 요구사항 추가</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleOpenNfrModal}
                        className="px-3 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ 비기능 목표 추가</span>
                      </button>
                    )}
                  </div>
                )}
              </header>

              {/* PRD Sub-tabs Switcher */}
              <div className="flex items-center gap-2 border-b border-line pb-3">
                <button
                  type="button"
                  onClick={() => setPrdTab('functional')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                    prdTab === 'functional'
                      ? 'bg-accent text-accent-ink shadow-sm'
                      : 'bg-well text-muted hover:text-ink border border-line'
                  }`}
                >
                  <span>기능 요구사항</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                    prdTab === 'functional' ? 'bg-black/20 text-accent-ink' : 'bg-surface text-muted'
                  }`}>
                    {requirements.length}건
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPrdTab('non_functional')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                    prdTab === 'non_functional'
                      ? 'bg-accent text-accent-ink shadow-sm'
                      : 'bg-well text-muted hover:text-ink border border-line'
                  }`}
                >
                  <span>비기능 요구사항 (성능/품질 목표)</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                    prdTab === 'non_functional' ? 'bg-black/20 text-accent-ink' : 'bg-surface text-muted'
                  }`}>
                    {nfrs.length}건
                  </span>
                </button>
              </div>

              {/* Functional Requirements Table */}
              {prdTab === 'functional' && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm sm:text-base font-semibold text-ink">
                      기능 요구사항 목록 ({requirements.length}건)
                    </h2>
                    <span className="text-xs text-muted">
                      {isEditMode ? '모든 셀을 직접 클릭해 수정하거나 삭제할 수 있습니다' : '우측 상단 [편집하기]에서 모든 항목 수정 가능'}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-y border-line text-muted font-medium">
                          <th className="py-2.5 pr-3 w-32 whitespace-nowrap">ID · 분류</th>
                          <th className="py-2.5 px-3 w-20 whitespace-nowrap">중요도</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">기능 제목 및 상세 명세</th>
                          <th className="py-2.5 px-3 w-56 whitespace-nowrap">인수 조건</th>
                          <th className="py-2.5 pl-3 w-24 text-right whitespace-nowrap">상태</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {requirements.map((req) => (
                          <tr key={req.id}>
                            <td className="py-3.5 pr-3 align-top space-y-1">
                              {isEditMode ? (
                                <>
                                  <input
                                    type="text"
                                    aria-label="요구사항 코드 편집"
                                    value={req.reqCode}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setRequirements((prev) =>
                                        prev.map((item) => (item.id === req.id ? { ...item, reqCode: val } : item))
                                      );
                                    }}
                                    className="w-full bg-well border border-line rounded px-2 py-1 font-mono text-xs text-ink"
                                  />
                                  <input
                                    type="text"
                                    aria-label="요구사항 분류 편집"
                                    value={req.category}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setRequirements((prev) =>
                                        prev.map((item) => (item.id === req.id ? { ...item, category: val } : item))
                                      );
                                    }}
                                    className="w-full bg-well border border-line rounded px-2 py-1 text-xs text-muted"
                                  />
                                </>
                              ) : (
                                <>
                                  <span className="font-mono text-xs text-ink font-semibold block">
                                    {req.reqCode}
                                  </span>
                                  <span className="text-xs text-muted block">{req.category}</span>
                                </>
                              )}
                            </td>
                            <td className="py-3.5 px-3 align-top font-mono font-semibold">
                              {isEditMode ? (
                                <select
                                  aria-label="중요도 선택"
                                  value={req.priority}
                                  onChange={(e) => {
                                    const val = e.target.value as 'P0' | 'P1' | 'P2';
                                    setRequirements((prev) =>
                                      prev.map((item) => (item.id === req.id ? { ...item, priority: val } : item))
                                    );
                                  }}
                                  className="bg-well border border-line rounded px-1.5 py-1 text-xs text-ink"
                                >
                                  <option value="P0">P0</option>
                                  <option value="P1">P1</option>
                                  <option value="P2">P2</option>
                                </select>
                              ) : (
                                <span
                                  className={
                                    req.priority === 'P0'
                                      ? 'text-danger'
                                      : req.priority === 'P1'
                                      ? 'text-warn'
                                      : 'text-muted'
                                  }
                                >
                                  {req.priority}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-3 align-top space-y-1.5">
                              {isEditMode ? (
                                <>
                                  <input
                                    type="text"
                                    aria-label={`${req.reqCode} 제목 편집`}
                                    value={req.title}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setRequirements((prev) =>
                                        prev.map((item) => (item.id === req.id ? { ...item, title: val } : item))
                                      );
                                    }}
                                    className="w-full bg-well border border-line rounded-lg px-2.5 py-1 text-xs font-semibold text-ink"
                                  />
                                  <textarea
                                    aria-label={`${req.reqCode} 요구사항 명세 편집`}
                                    value={req.specification}
                                    rows={2}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setRequirements((prev) =>
                                        prev.map((item) => (item.id === req.id ? { ...item, specification: val } : item))
                                      );
                                    }}
                                    className="w-full bg-well border border-accent-line rounded-lg px-2.5 py-1.5 text-xs text-ink"
                                  />
                                </>
                              ) : (
                                <>
                                  <div className="font-semibold text-ink mb-1">{req.title}</div>
                                  <p className="text-muted text-xs leading-relaxed max-w-[60ch]">
                                    {req.specification}
                                  </p>
                                </>
                              )}
                            </td>
                            <td className="py-3.5 px-3 align-top text-xs text-ink-2 font-mono">
                              {isEditMode ? (
                                <textarea
                                  aria-label={`${req.reqCode} 인수 조건 편집`}
                                  value={req.acceptanceCriteria}
                                  rows={2}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setRequirements((prev) =>
                                      prev.map((item) =>
                                        item.id === req.id ? { ...item, acceptanceCriteria: val } : item
                                      )
                                    );
                                  }}
                                  className="w-full bg-well border border-line rounded-lg px-2 py-1 text-xs font-mono text-ink"
                                />
                              ) : (
                                req.acceptanceCriteria
                              )}
                            </td>
                            <td className="py-3.5 pl-3 align-top text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => toggleRequirementStatus(req.id)}
                                  className={`px-2 py-0.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                                    req.status === 'Confirmed'
                                      ? 'bg-ok-soft text-ok'
                                      : 'bg-well text-muted hover:text-ink'
                                  }`}
                                >
                                  {req.status === 'Confirmed' ? '확정됨' : '검토 중'}
                                </button>
                                {isEditMode && (
                                  <button
                                    type="button"
                                    aria-label="요구사항 삭제"
                                    onClick={() => handleDeleteRequirement(req.id)}
                                    className="p-1 text-muted hover:text-danger cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Non-Functional Requirements Table */}
              {prdTab === 'non_functional' && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm sm:text-base font-semibold text-ink">
                      비기능 요구사항 (성능, 신뢰성, 가용성, 보안 목표)
                    </h2>
                    <span className="text-xs text-muted">
                      {isEditMode ? '모든 셀을 직접 클릭해 수정하거나 삭제할 수 있습니다' : '우측 상단 [편집하기]에서 모든 항목 수정 가능'}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-y border-line text-muted font-medium">
                          <th className="py-2.5 pr-3 w-36 whitespace-nowrap">ID · 분류</th>
                          <th className="py-2.5 px-3 w-20 whitespace-nowrap">중요도</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">품질/성능 목표 및 상세 지표</th>
                          <th className="py-2.5 px-3 w-64 whitespace-nowrap">검증 방식 및 테스트 도구</th>
                          <th className="py-2.5 pl-3 w-24 text-right whitespace-nowrap">상태</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {nfrs.map((nfr) => (
                          <tr key={nfr.id}>
                            <td className="py-3.5 pr-3 align-top space-y-1">
                              {isEditMode ? (
                                <>
                                  <input
                                    type="text"
                                    aria-label="비기능 코드 편집"
                                    value={nfr.nfrCode}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setNfrs((prev) =>
                                        prev.map((item) => (item.id === nfr.id ? { ...item, nfrCode: val } : item))
                                      );
                                    }}
                                    className="w-full bg-well border border-line rounded px-2 py-1 font-mono text-xs text-ink"
                                  />
                                  <select
                                    aria-label="비기능 분류 선택"
                                    value={nfr.category}
                                    onChange={(e) => {
                                      const val = e.target.value as any;
                                      setNfrs((prev) =>
                                        prev.map((item) => (item.id === nfr.id ? { ...item, category: val } : item))
                                      );
                                    }}
                                    className="w-full bg-well border border-line rounded px-2 py-1 text-xs text-muted"
                                  >
                                    <option value="성능 및 지연시간">성능 및 지연시간</option>
                                    <option value="동시성 및 신뢰성">동시성 및 신뢰성</option>
                                    <option value="가용성">가용성</option>
                                    <option value="보안 및 개인정보">보안 및 개인정보</option>
                                    <option value="확장성">확장성</option>
                                  </select>
                                </>
                              ) : (
                                <>
                                  <span className="font-mono text-xs text-ink font-semibold block">
                                    {nfr.nfrCode}
                                  </span>
                                  <span className="text-xs text-muted block">{nfr.category}</span>
                                </>
                              )}
                            </td>
                            <td className="py-3.5 px-3 align-top font-mono font-semibold">
                              {isEditMode ? (
                                <select
                                  aria-label="중요도 선택"
                                  value={nfr.priority}
                                  onChange={(e) => {
                                    const val = e.target.value as 'P0' | 'P1' | 'P2';
                                    setNfrs((prev) =>
                                      prev.map((item) => (item.id === nfr.id ? { ...item, priority: val } : item))
                                    );
                                  }}
                                  className="bg-well border border-line rounded px-1.5 py-1 text-xs text-ink"
                                >
                                  <option value="P0">P0</option>
                                  <option value="P1">P1</option>
                                  <option value="P2">P2</option>
                                </select>
                              ) : (
                                <span
                                  className={
                                    nfr.priority === 'P0'
                                      ? 'text-danger'
                                      : nfr.priority === 'P1'
                                      ? 'text-warn'
                                      : 'text-muted'
                                  }
                                >
                                  {nfr.priority}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-3 align-top space-y-1.5">
                              {isEditMode ? (
                                <>
                                  <input
                                    type="text"
                                    aria-label={`${nfr.nfrCode} 제목 편집`}
                                    value={nfr.title}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setNfrs((prev) =>
                                        prev.map((item) => (item.id === nfr.id ? { ...item, title: val } : item))
                                      );
                                    }}
                                    className="w-full bg-well border border-line rounded-lg px-2.5 py-1 text-xs font-semibold text-ink"
                                  />
                                  <textarea
                                    aria-label={`${nfr.nfrCode} 목표 지표 편집`}
                                    value={nfr.targetMetric}
                                    rows={2}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setNfrs((prev) =>
                                        prev.map((item) => (item.id === nfr.id ? { ...item, targetMetric: val } : item))
                                      );
                                    }}
                                    className="w-full bg-well border border-accent-line rounded-lg px-2.5 py-1.5 text-xs text-ink"
                                  />
                                </>
                              ) : (
                                <>
                                  <div className="font-semibold text-ink mb-1">{nfr.title}</div>
                                  <p className="text-muted text-xs leading-relaxed max-w-[60ch]">
                                    {nfr.targetMetric}
                                  </p>
                                </>
                              )}
                            </td>
                            <td className="py-3.5 px-3 align-top text-xs text-ink-2 font-mono">
                              {isEditMode ? (
                                <textarea
                                  aria-label={`${nfr.nfrCode} 검증 방식 편집`}
                                  value={nfr.verificationMethod}
                                  rows={2}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setNfrs((prev) =>
                                      prev.map((item) => (item.id === nfr.id ? { ...item, verificationMethod: val } : item))
                                    );
                                  }}
                                  className="w-full bg-well border border-line rounded-lg px-2 py-1 text-xs font-mono text-ink"
                                />
                              ) : (
                                nfr.verificationMethod
                              )}
                            </td>
                            <td className="py-3.5 pl-3 align-top text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => toggleNfrStatus(nfr.id)}
                                  className={`px-2 py-0.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                                    nfr.status === 'Confirmed'
                                      ? 'bg-ok-soft text-ok'
                                      : 'bg-well text-muted hover:text-ink'
                                  }`}
                                >
                                  {nfr.status === 'Confirmed' ? '확정됨' : '검토 중'}
                                </button>
                                {isEditMode && (
                                  <button
                                    type="button"
                                    aria-label="비기능 요구사항 삭제"
                                    onClick={() => handleDeleteNfr(nfr.id)}
                                    className="p-1 text-muted hover:text-danger cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </article>
          )}
        </div>
      </div>
    
      {/* ===================================================================== */}
      {/* UNIFIED ADD MODAL DIALOGS (Step 1 & 2) */}
      {/* ===================================================================== */}
      {addModalType && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-overlay flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAddModalType(null);
          }}
        >
          <div className="bg-surface border border-line rounded-2xl shadow-floating max-w-lg w-full overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* 1. Table Row Modal */}
            {addModalType === 'table_row' && (
              <>
                <div className="px-5 py-4 bg-well/70 border-b border-line flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-ink">표 행 추가</h3>
                    <p className="text-xs text-muted mt-0.5">선택한 표 블록에 새로운 데이터 행을 추가합니다.</p>
                  </div>
                  <button
                    type="button"
                    aria-label="닫기"
                    onClick={() => setAddModalType(null)}
                    className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSubmitTableRow} className="p-5 space-y-4 text-xs">
                  {(() => {
                    const block = bmBlocks.find((b) => b.id === targetBlockId);
                    const headers = block?.tableHeaders || ['항목', '내용', '비고'];
                    return headers.map((header, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <label className="font-semibold text-ink block">{header}</label>
                        <input
                          type="text"
                          aria-label={header}
                          value={modalRowCells[idx] || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setModalRowCells((prev) => {
                              const copy = [...prev];
                              copy[idx] = val;
                              return copy;
                            });
                          }}
                          placeholder={`${header} 입력...`}
                          className="w-full bg-well border border-line rounded-lg px-3 py-2 text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink/40"
                          autoFocus={idx === 0}
                        />
                      </div>
                    ));
                  })()}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                    <button
                      type="button"
                      onClick={() => setAddModalType(null)}
                      className="px-3.5 py-1.5 rounded-lg bg-well hover:bg-control text-muted hover:text-ink transition-colors cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper font-medium transition-opacity cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>행 등록</span>
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* 2. Card Item Modal */}
            {addModalType === 'card_item' && (
              <>
                <div className="px-5 py-4 bg-well/70 border-b border-line flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-ink">새 카드 항목 추가</h3>
                    <p className="text-xs text-muted mt-0.5">카드 비교 그리드에 새로운 대상 카드를 등록합니다.</p>
                  </div>
                  <button
                    type="button"
                    aria-label="닫기"
                    onClick={() => setAddModalType(null)}
                    className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSubmitCardItem} className="p-5 space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-ink block">카드 구분명 <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      aria-label="카드 구분명"
                      value={modalCardLabel}
                      onChange={(e) => setModalCardLabel(e.target.value)}
                      placeholder="예: 플랫폼 운영자 · 정산 관리자"
                      className="w-full bg-well border border-line rounded-lg px-3 py-2 text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink/40 font-semibold"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-ink block">가치 제안 및 세부 내용</label>
                    <textarea
                      rows={4}
                      aria-label="카드 상세 내용"
                      value={modalCardText}
                      onChange={(e) => setModalCardText(e.target.value)}
                      placeholder="해당 대상에게 제공되는 가치 또는 상세 역할을 작성하세요..."
                      className="w-full bg-well border border-line rounded-lg p-3 text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink/40 leading-relaxed"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                    <button
                      type="button"
                      onClick={() => setAddModalType(null)}
                      className="px-3.5 py-1.5 rounded-lg bg-well hover:bg-control text-muted hover:text-ink transition-colors cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper font-medium transition-opacity cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>카드 등록</span>
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* 3. Section (New Block) Modal */}
            {addModalType === 'section' && (
              <>
                <div className="px-5 py-4 bg-well/70 border-b border-line flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-ink">신규 블록 섹션 추가</h3>
                    <p className="text-xs text-muted mt-0.5">서비스 기획 및 BM 문서에 새로운 소제목과 블록을 추가합니다.</p>
                  </div>
                  <button
                    type="button"
                    aria-label="닫기"
                    onClick={() => setAddModalType(null)}
                    className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSubmitSection} className="p-5 space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-ink block">소제목 명칭 <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      aria-label="소제목 명칭"
                      value={modalSectionTitle}
                      onChange={(e) => setModalSectionTitle(e.target.value)}
                      placeholder="예: 5. 제휴 파트너십 및 수수료 배분 모델"
                      className="w-full bg-well border border-line rounded-lg px-3 py-2 text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink/40 font-semibold"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-ink block">블록 표시 형식 선택</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setModalSectionFormat('text')}
                        className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer flex flex-col items-center gap-1 ${
                          modalSectionFormat === 'text'
                            ? 'bg-ink text-paper border-ink font-semibold'
                            : 'bg-well text-ink border-line hover:bg-control'
                        }`}
                      >
                        <AlignLeft className="w-4 h-4" />
                        <span>텍스트 문단</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalSectionFormat('table')}
                        className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer flex flex-col items-center gap-1 ${
                          modalSectionFormat === 'table'
                            ? 'bg-ink text-paper border-ink font-semibold'
                            : 'bg-well text-ink border-line hover:bg-control'
                        }`}
                      >
                        <TableIcon className="w-4 h-4" />
                        <span>표 (Table)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalSectionFormat('cards')}
                        className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer flex flex-col items-center gap-1 ${
                          modalSectionFormat === 'cards'
                            ? 'bg-ink text-paper border-ink font-semibold'
                            : 'bg-well text-ink border-line hover:bg-control'
                        }`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                        <span>2열 카드</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-ink block">
                      {modalSectionFormat === 'text' ? '상세 기획 및 정책 본문' : '초기 내용 및 가이드'}
                    </label>
                    <textarea
                      rows={4}
                      aria-label="상세 기획 내용"
                      value={modalSectionContent}
                      onChange={(e) => setModalSectionContent(e.target.value)}
                      placeholder="해당 섹션에 대한 세부 전략, 정책, 또는 운영 규칙을 작성하세요..."
                      className="w-full bg-well border border-line rounded-lg p-3 text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink/40 leading-relaxed"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                    <button
                      type="button"
                      onClick={() => setAddModalType(null)}
                      className="px-3.5 py-1.5 rounded-lg bg-well hover:bg-control text-muted hover:text-ink transition-colors cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper font-medium transition-opacity cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>블록 생성</span>
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* 3. Requirement Modal */}
            {addModalType === 'requirement' && (
              <>
                <div className="px-5 py-4 bg-well/70 border-b border-line flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-ink">새 PRD 기능 요구사항 등록</h3>
                    <p className="text-xs text-muted mt-0.5">요구사항 명세서에 새 엔지니어링 기능 요구사항을 추가합니다.</p>
                  </div>
                  <button
                    type="button"
                    aria-label="닫기"
                    onClick={() => setAddModalType(null)}
                    className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSubmitRequirement} className="p-5 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-4 space-y-1.5">
                      <label className="font-semibold text-ink block">요구사항 코드</label>
                      <input
                        type="text"
                        aria-label="요구사항 코드"
                        value={modalReqCode}
                        onChange={(e) => setModalReqCode(e.target.value)}
                        className="w-full bg-well border border-line rounded-lg px-3 py-2 text-xs font-mono text-ink"
                        required
                      />
                    </div>
                    <div className="sm:col-span-4 space-y-1.5">
                      <label className="font-semibold text-ink block">분류 카테고리</label>
                      <input
                        type="text"
                        aria-label="분류 카테고리"
                        value={modalReqCategory}
                        onChange={(e) => setModalReqCategory(e.target.value)}
                        placeholder="예: 마감 재고 할인"
                        className="w-full bg-well border border-line rounded-lg px-3 py-2 text-xs text-ink"
                      />
                    </div>
                    <div className="sm:col-span-4 space-y-1.5">
                      <label className="font-semibold text-ink block">우선순위</label>
                      <select
                        aria-label="우선순위"
                        value={modalReqPriority}
                        onChange={(e) => setModalReqPriority(e.target.value as 'P0' | 'P1' | 'P2')}
                        className="w-full bg-well border border-line rounded-lg px-3 py-2 text-xs text-ink font-mono"
                      >
                        <option value="P0">P0 (필수 MVP)</option>
                        <option value="P1">P1 (권장 기능)</option>
                        <option value="P2">P2 (선택 사항)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-ink block">요구사항 제목 <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      aria-label="요구사항 제목"
                      value={modalReqTitle}
                      onChange={(e) => setModalReqTitle(e.target.value)}
                      placeholder="예: 마감 할인 품목 실시간 재고 차감 및 동시성 제어"
                      className="w-full bg-well border border-line rounded-lg px-3 py-2 text-xs text-ink font-semibold focus:outline-none focus:border-ink/40"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-ink block">상세 기능 명세</label>
                    <textarea
                      rows={3}
                      aria-label="상세 기능 명세"
                      value={modalReqSpec}
                      onChange={(e) => setModalReqSpec(e.target.value)}
                      placeholder="기능의 동작 방식, 예외 처리, 비즈니스 규칙을 명세합니다..."
                      className="w-full bg-well border border-line rounded-lg p-3 text-xs text-ink leading-relaxed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-ink block">인수 조건 (Acceptance Criteria)</label>
                    <textarea
                      rows={2}
                      aria-label="인수 조건"
                      value={modalReqAc}
                      onChange={(e) => setModalReqAc(e.target.value)}
                      placeholder="예: 동시 100건 예약 인입 시 정합성 100% 보장 및 초과 판매 0건 검증"
                      className="w-full bg-well border border-line rounded-lg p-3 text-xs text-ink leading-relaxed"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                    <button
                      type="button"
                      onClick={() => setAddModalType(null)}
                      className="px-3.5 py-1.5 rounded-lg bg-well hover:bg-control text-muted hover:text-ink transition-colors cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper font-medium transition-opacity cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>요구사항 등록</span>
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* 4. Non-Functional Requirement Modal */}
            {addModalType === 'non_functional' && (
              <>
                <div className="px-5 py-4 bg-well/70 border-b border-line flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-ink">새 비기능 요구사항 (품질/성능 목표) 등록</h3>
                    <p className="text-xs text-muted mt-0.5">시스템 응답속도, 동시성, 가용성, 보안 목표 지표를 추가합니다.</p>
                  </div>
                  <button
                    type="button"
                    aria-label="닫기"
                    onClick={() => setAddModalType(null)}
                    className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSubmitNfr} className="p-5 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="font-semibold text-ink block mb-1">식별 코드</label>
                      <input
                        type="text"
                        value={modalNfrCode}
                        onChange={(e) => setModalNfrCode(e.target.value)}
                        placeholder="예: NFR-PERF-06"
                        className="w-full bg-well border border-line rounded-lg px-3 py-2 text-xs text-ink font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-ink block mb-1">분류</label>
                      <select
                        value={modalNfrCategory}
                        onChange={(e) =>
                          setModalNfrCategory(
                            e.target.value as '성능 및 지연시간' | '동시성 및 신뢰성' | '가용성' | '보안 및 개인정보' | '확장성'
                          )
                        }
                        className="w-full bg-well border border-line rounded-lg px-2.5 py-2 text-xs text-ink outline-none"
                      >
                        <option value="성능 및 지연시간">성능 및 지연시간</option>
                        <option value="동시성 및 신뢰성">동시성 및 신뢰성</option>
                        <option value="가용성">가용성</option>
                        <option value="보안 및 개인정보">보안 및 개인정보</option>
                        <option value="확장성">확장성</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-ink block mb-1">우선순위</label>
                      <select
                        value={modalNfrPriority}
                        onChange={(e) => setModalNfrPriority(e.target.value as 'P0' | 'P1' | 'P2')}
                        className="w-full bg-well border border-line rounded-lg px-2.5 py-2 text-xs text-ink outline-none"
                      >
                        <option value="P0">P0 (필수)</option>
                        <option value="P1">P1 (중요)</option>
                        <option value="P2">P2 (선택)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-ink block">
                      목표 항목 제목 <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={modalNfrTitle}
                      onChange={(e) => setModalNfrTitle(e.target.value)}
                      placeholder="예: 마감 할인 등록 후 실시간 SSE 푸시 수신 지연"
                      className="w-full bg-well border border-line rounded-lg px-3 py-2 text-xs text-ink font-semibold focus:outline-none"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-ink block">
                      목표 수치 및 품질 지표 (Target Metric) <span className="text-danger">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={modalNfrTarget}
                      onChange={(e) => setModalNfrTarget(e.target.value)}
                      placeholder="예: 점주 마감 등록 후 3.0초 이내 반경 1.5km 고객 디바이스 수신"
                      className="w-full bg-well border border-line rounded-lg p-2.5 text-xs text-ink leading-relaxed outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-ink block">검증 방식 및 테스트 도구</label>
                    <input
                      type="text"
                      value={modalNfrVerify}
                      onChange={(e) => setModalNfrVerify(e.target.value)}
                      placeholder="예: k6 부하 테스트 스크립트 및 SSE 타임스탬프 로깅 검증"
                      className="w-full bg-well border border-line rounded-lg px-3 py-2 text-xs text-ink font-mono outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                    <button
                      type="button"
                      onClick={() => setAddModalType(null)}
                      className="px-3.5 py-1.5 rounded-lg bg-well hover:bg-control text-muted hover:text-ink transition-colors cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper font-medium transition-opacity cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>비기능 목표 추가</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
</div>
  );
};
