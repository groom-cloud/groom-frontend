import React, { useState } from 'react';
import {
  Palette,
  Copy,
  Check,
  Sparkles,
  Type,
  Sun,
  Moon,
  Layers,
  Code2,
  PanelRightClose,
  Edit3,
  Plus,
  Trash2,
  X,
  Image as ImageIcon
} from 'lucide-react';
import type { BrandingInfo, StepId } from '../mockData';
import { ExportDropdown } from './ExportDropdown';

interface BrandingDesignViewProps {
  branding: BrandingInfo;
  setBranding?: React.Dispatch<React.SetStateAction<BrandingInfo>>;
  onConfirmStep?: (step: StepId) => void;
  onCollapsePane?: () => void;
  isConfirmed?: boolean;
}

interface TypographyItem {
  level: string;
  size: string;
  weight: string;
  lineHeight?: string;
  usage: string;
  sampleText?: string;
}

const DEFAULT_TYPO_SCALE: TypographyItem[] = [
  {
    level: 'Heading 1',
    size: '28px / 1.75rem',
    weight: '700 (Bold)',
    lineHeight: '1.25',
    usage: '모듈 메인 타이틀 및 핵심 헤드라인',
    sampleText: '당일 생산 빵, 퇴근길 골든타임에 반값 예약'
  },
  {
    level: 'Heading 2',
    size: '20px / 1.25rem',
    weight: '700 (Bold)',
    lineHeight: '1.35',
    usage: '섹션 서브타이틀 및 카드 헤더',
    sampleText: '동네 빵집 마감 잉여 재고 소진 솔루션'
  },
  {
    level: 'Heading 3',
    size: '16px / 1.0rem',
    weight: '600 (SemiBold)',
    lineHeight: '1.4',
    usage: '소분류 헤더 및 다이얼로그 타이틀',
    sampleText: '반경 1.5km 이내 신규 할인 알림 수신'
  },
  {
    level: 'Body Regular',
    size: '14px / 0.875rem',
    weight: '400 (Regular)',
    lineHeight: '1.6',
    usage: '본문 내용 및 상세 설명문',
    sampleText: '매장 방문 20분 전 사전 주문을 완료하면 대기 없이 포장된 신선한 베이커리를 수령할 수 있습니다.'
  },
  {
    level: 'Caption / Meta',
    size: '12px / 0.75rem',
    weight: '500 (Medium)',
    lineHeight: '1.5',
    usage: '배지, 타임스탬프, 부가 메타데이터',
    sampleText: '성수동 르베이커리 · 잔여 3개 · 20:30 마감'
  },
  {
    level: 'Monospace / Code',
    size: '13px / 0.8125rem',
    weight: '500 (Medium)',
    lineHeight: '1.5',
    usage: 'API URI, 코드 스니펫, 수치 토큰',
    sampleText: 'GET /v1/stores/:id/inventory?status=DISCOUNT_ACTIVE'
  }
];

const LOGO_PRESETS = [
  {
    id: 'bakery',
    name: '베이커리 (크루아상 & 시계)',
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><path d="M8 28C8 20 15 14 24 14C33 14 40 20 40 28C40 33 36 36 31 36H17C12 36 8 33 8 28Z" stroke="#FF6B00" stroke-width="3" stroke-linejoin="round"/><path d="M16 26C18 20 22 17 28 17" stroke="#FF9500" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="27" r="2.5" fill="#FF6B00"/><path d="M24 22V27L27 29" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/></svg>`
  },
  {
    id: 'cloud',
    name: '구름 (클라우드 & 파이프라인)',
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><path d="M12 32C8.68629 32 6 29.3137 6 26C6 22.9556 8.27265 20.4437 11.2387 20.0637C12.3789 14.8694 16.9458 11 22.4 11C28.5303 11 33.5 15.9697 33.5 22.1C37.199 22.4 40 25.4 40 29C40 32.866 36.866 36 33 36H12" stroke="#3B82F6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 25L26 29L32 23" stroke="#60A5FA" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'lightning',
    name: '번개 (초고속 성능 & 런칭)',
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><path d="M26 6L12 28H24L22 42L36 20H24L26 6Z" fill="#F59E0B" fill-opacity="0.15" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'shield',
    name: '보안 (신뢰 & 실시간 검증)',
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><path d="M24 6L10 12V24C10 32.5 16 39.5 24 42C32 39.5 38 32.5 38 24V12L24 6Z" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 24L22 28L30 20" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'rocket',
    name: '로켓 (스타트업 스케일업)',
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><path d="M24 8C24 8 32 12 32 24C32 30 28 34 24 38C20 34 16 30 16 24C16 12 24 8 24 8Z" fill="#8B5CF6" fill-opacity="0.15" stroke="#8B5CF6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="22" r="3" stroke="#8B5CF6" stroke-width="2.5"/><path d="M16 26L10 32V38L18 34" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 26L38 32V38L30 34" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'coffee',
    name: '카페 (F&B 로컬 커머스)',
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><path d="M10 16H34V30C34 34.4183 30.4183 38 26 38H18C13.5817 38 10 34.4183 10 30V16Z" fill="#D97706" fill-opacity="0.15" stroke="#D97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M34 20H38C40.2091 20 42 21.7909 42 24C42 26.2091 40.2091 28 38 28H34" stroke="#D97706" stroke-width="3" stroke-linecap="round"/><path d="M16 10C16 10 17 12 16 14" stroke="#D97706" stroke-width="2" stroke-linecap="round"/><path d="M22 8C22 8 23 11 22 14" stroke="#D97706" stroke-width="2" stroke-linecap="round"/><path d="M28 10C28 10 29 12 28 14" stroke="#D97706" stroke-width="2" stroke-linecap="round"/></svg>`
  },
  {
    id: 'store',
    name: '스토어 (동네 상점 마켓)',
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><path d="M8 18L11 8H37L40 18" stroke="#3B82F6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 18H42V38C42 39.1 41.1 40 40 40H8C6.9 40 6 39.1 6 38V18Z" fill="#3B82F6" fill-opacity="0.15" stroke="#3B82F6" stroke-width="3"/><path d="M20 40V26H28V40" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round"/></svg>`
  },
  {
    id: 'sparkles',
    name: '스파클 (AI 지능형 추천)',
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><path d="M24 6L28 18L40 22L28 26L24 38L20 26L8 22L20 18L24 6Z" fill="#EC4899" fill-opacity="0.15" stroke="#EC4899" stroke-width="3" stroke-linejoin="round"/><path d="M38 34L40 38L44 40L40 42L38 46L36 42L32 40L36 38L38 34Z" fill="#EC4899" stroke="#EC4899" stroke-width="2" stroke-linejoin="round"/></svg>`
  }
];

interface ThemePreset {
  id: string;
  name: string;
  accent: string;
  accentName: string;
  darkBg: string;
  darkSurface: string;
  darkBorder: string;
  darkText: string;
  lightBg: string;
  lightSurface: string;
  lightBorder: string;
  lightText: string;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'warm-amber',
    name: '마감빵빵 웜 앰버 (추천)',
    accent: '#FF6B00',
    accentName: 'Bakery Warm Amber',
    darkBg: '#151311',
    darkSurface: '#211C18',
    darkBorder: '#3A322A',
    darkText: '#FBF9F5',
    lightBg: '#FDFBF7',
    lightSurface: '#FFFFFF',
    lightBorder: '#EFE7DA',
    lightText: '#261E16'
  },
  {
    id: 'titanium-blue',
    name: '애플 HIG 티타늄 블루',
    accent: '#2563EB',
    accentName: 'System Blue',
    darkBg: '#0E1015',
    darkSurface: '#161922',
    darkBorder: '#292E3D',
    darkText: '#F8FAFC',
    lightBg: '#F8FAFC',
    lightSurface: '#FFFFFF',
    lightBorder: '#E2E8F0',
    lightText: '#0F172A'
  },
  {
    id: 'emerald-fresh',
    name: '에코 에메랄드 그린',
    accent: '#10B981',
    accentName: 'Fresh Emerald',
    darkBg: '#0F1814',
    darkSurface: '#17251F',
    darkBorder: '#2A3F35',
    darkText: '#F4FAF6',
    lightBg: '#F4FAF6',
    lightSurface: '#FFFFFF',
    lightBorder: '#D8EDE2',
    lightText: '#062B1D'
  },
  {
    id: 'cyber-violet',
    name: '모던 바이올렛 인디고',
    accent: '#8B5CF6',
    accentName: 'Modern Violet',
    darkBg: '#13111C',
    darkSurface: '#1D1A2B',
    darkBorder: '#342E4C',
    darkText: '#FAF8FF',
    lightBg: '#FAF8FF',
    lightSurface: '#FFFFFF',
    lightBorder: '#E9E2FA',
    lightText: '#1A1433'
  }
];

export const BrandingDesignView: React.FC<BrandingDesignViewProps> = ({
  branding,
  setBranding,
  onConfirmStep,
  onCollapsePane,
  isConfirmed = false
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [selectedThemePreset, setSelectedThemePreset] = useState<string>('warm-amber');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Typography Settings State
  const [primaryFont, setPrimaryFont] = useState('Pretendard Variable');
  const [monoFont, setMonoFont] = useState('JetBrains Mono');
  const [typoScale, setTypoScale] = useState<TypographyItem[]>(() => {
    return branding.typographyScale && branding.typographyScale.length > 0
      ? branding.typographyScale.map((t, idx) => ({
          level: t.level || `Level ${idx + 1}`,
          size: t.size || '16px',
          weight: t.weight || '500',
          lineHeight: t.lineHeight || '1.5',
          usage: t.usage || '텍스트',
          sampleText: (t as any).sampleText || DEFAULT_TYPO_SCALE[idx]?.sampleText || '마감빵빵 서비스 미리보기'
        }))
      : DEFAULT_TYPO_SCALE;
  });

  // Logo Customizer Modal State
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [customLogoInput, setCustomLogoInput] = useState('');

  // Modals state
  const [isAddingPrinciple, setIsAddingPrinciple] = useState(false);
  const [newPrincipleTitle, setNewPrincipleTitle] = useState('');
  const [newPrincipleDesc, setNewPrincipleDesc] = useState('');

  const [isAddingSwatch, setIsAddingSwatch] = useState(false);
  const [newSwatchName, setNewSwatchName] = useState('');
  const [newSwatchRole, setNewSwatchRole] = useState('');
  const [newSwatchHex, setNewSwatchHex] = useState('#3B82F6');

  const [isAddingTypoLevel, setIsAddingTypoLevel] = useState(false);
  const [newTypoLevel, setNewTypoLevel] = useState('');
  const [newTypoSize, setNewTypoSize] = useState('15px / 0.9375rem');
  const [newTypoWeight, setNewTypoWeight] = useState('600 (SemiBold)');
  const [newTypoUsage, setNewTypoUsage] = useState('부가 설명 라벨');
  const [newTypoSample, setNewTypoSample] = useState('실시간 베이커리 픽업 예약');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleCopyHex = (hex: string, label: string) => {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopiedHex(hex);
    showToast(`${label} 컬러 코드 (${hex})가 복사되었습니다.`);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleCopySvg = () => {
    navigator.clipboard?.writeText(branding.logoSymbolSvg || '').catch(() => {});
    showToast('로고 심볼 SVG 코드가 클립보드에 복사되었습니다.');
  };

  const handleSelectLogoPreset = (svgCode: string) => {
    if (setBranding) {
      setBranding((prev) => ({ ...prev, logoSymbolSvg: svgCode }));
    }
    setIsLogoModalOpen(false);
    showToast('새 로고 심볼이 적용되었습니다.');
  };

  const handleApplyCustomLogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLogoInput.trim()) return;
    if (setBranding) {
      setBranding((prev) => ({ ...prev, logoSymbolSvg: customLogoInput.trim() }));
    }
    setIsLogoModalOpen(false);
    setCustomLogoInput('');
    showToast('커스텀 로고가 적용되었습니다.');
  };

  // Typography scale handlers
  const handleUpdateTypoItem = (idx: number, field: keyof TypographyItem, val: string) => {
    setTypoScale((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleDeleteTypoItem = (idx: number) => {
    setTypoScale((prev) => prev.filter((_, i) => i !== idx));
    showToast('타이포그래피 단계가 삭제되었습니다.');
  };

  const handleAddTypoLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypoLevel.trim()) return;
    setTypoScale((prev) => [
      ...prev,
      {
        level: newTypoLevel.trim(),
        size: newTypoSize.trim(),
        weight: newTypoWeight.trim(),
        usage: newTypoUsage.trim(),
        sampleText: newTypoSample.trim() || '새 타이포그래피 미리보기'
      }
    ]);
    setIsAddingTypoLevel(false);
    setNewTypoLevel('');
    showToast('새 타이포그래피 단계가 추가되었습니다.');
  };

  // Add / Delete Handlers
  const handleAddPrinciple = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrincipleTitle.trim() || !newPrincipleDesc.trim()) return;

    if (setBranding) {
      setBranding((prev) => ({
        ...prev,
        designPrinciples: [
          ...(prev.designPrinciples || []),
          { title: newPrincipleTitle.trim(), desc: newPrincipleDesc.trim() }
        ]
      }));
    }
    setIsAddingPrinciple(false);
    setNewPrincipleTitle('');
    setNewPrincipleDesc('');
    showToast('새 디자인 원칙이 추가되었습니다.');
  };

  const handleDeletePrinciple = (idx: number) => {
    if (setBranding) {
      setBranding((prev) => ({
        ...prev,
        designPrinciples: (prev.designPrinciples || []).filter((_, i) => i !== idx)
      }));
      showToast('디자인 원칙이 삭제되었습니다.');
    }
  };

  const handleAddSwatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSwatchName.trim() || !newSwatchHex.trim()) return;

    if (setBranding) {
      setBranding((prev) => ({
        ...prev,
        colorSwatches: [
          ...(prev.colorSwatches || []),
          { name: newSwatchName.trim(), role: newSwatchRole.trim() || '커스텀 컬러', hex: newSwatchHex.trim() }
        ]
      }));
    }
    setIsAddingSwatch(false);
    setNewSwatchName('');
    setNewSwatchRole('');
    setNewSwatchHex('#3B82F6');
    showToast('새 컬러 스와치가 추가되었습니다.');
  };

  const handleDeleteSwatch = (name: string) => {
    if (setBranding) {
      setBranding((prev) => ({
        ...prev,
        colorSwatches: (prev.colorSwatches || []).filter((c) => c.name !== name)
      }));
      showToast(`"${name}" 컬러 스와치가 삭제되었습니다.`);
    }
  };

  const handleUpdatePrinciple = (idx: number, field: 'title' | 'desc', val: string) => {
    if (setBranding) {
      setBranding((prev) => {
        const next = [...(prev.designPrinciples || [])];
        const current = next[idx];
        if (typeof current === 'string') {
          next[idx] = { title: current, desc: '', [field]: val };
        } else {
          next[idx] = { ...current, [field]: val };
        }
        return { ...prev, designPrinciples: next };
      });
    }
  };

  const handleUpdateSwatch = (origName: string, field: 'name' | 'role' | 'hex', val: string) => {
    if (setBranding) {
      setBranding((prev) => ({
        ...prev,
        colorSwatches: (prev.colorSwatches || []).map((c) =>
          c.name === origName ? { ...c, [field]: val } : c
        )
      }));
    }
  };

  const handleUpdateSlogan = (slogan: string) => {
    if (setBranding) {
      setBranding((prev) => ({ ...prev, slogan }));
    }
  };

  const handleUpdateBrandName = (brandName: string) => {
    if (setBranding) {
      setBranding((prev) => ({ ...prev, brandName, serviceName: brandName }));
    }
  };

  // Active theme preset resolver
  const activeThemePreset = THEME_PRESETS.find((t) => t.id === selectedThemePreset) || THEME_PRESETS[0];

  const buildMarkdown = () => {
    return `# 07. 브랜딩 & 디자인 시스템 (Branding & Design System)

- **서비스명**: ${branding.brandName || branding.serviceName}
- **슬로건**: "${branding.slogan}"
- **브랜드 스토리**: ${branding.brandStory || '로컬 베이커리와 퇴근길 소비자를 실시간으로 잇는 친환경 마감 픽업 플랫폼'}
- **심볼 의미**: ${branding.symbolMeaning || '크루아상과 실시간 시계 바늘이 결합된 따뜻한 가치'}

## 디자인 원칙 (Design Principles)
${(branding.designPrinciples || [])
  .map((dp) => (typeof dp === 'string' ? `- ${dp}` : `- **${dp.title}**: ${dp.desc}`))
  .join('\n')}

## 컬러 시스템 (Color Palette Swatches)
| 컬러명 | 역할 | Hex |
|---|---|---|
${(branding.colorSwatches || []).map((c) => `| ${c.name} | ${c.role} | \`${c.hex}\` |`).join('\n')}

## 타이포그래피 (Typography Hierarchy)
- **Primary Font**: ${primaryFont}
- **Monospace Font**: ${monoFont}
${typoScale.map((t) => `- **${t.level}** (${t.size} / ${t.weight}): ${t.sampleText || t.usage}`).join('\n')}
`;
  };

  return (
    <div className="h-full flex flex-col bg-canvas text-ink overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 bg-ink text-paper px-3.5 py-2 rounded-lg text-xs font-medium shadow-lg border border-line-strong flex items-center gap-2">
          <Check className="w-4 h-4 text-accent" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="px-5 py-3.5 bg-surface border-b border-line flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Palette className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">07. Branding & Design</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-well text-muted border border-line">
                Design System v1.0
              </span>
            </div>
            <h2 className="text-sm font-bold text-ink truncate">브랜딩 & 디자인 시스템</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ExportDropdown
            title="07_브랜딩_및_디자인_시스템"
            getMarkdown={buildMarkdown}
            onShowToast={showToast}
          />

          <button
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              isEditMode
                ? 'bg-accent text-accent-ink font-semibold'
                : 'bg-well hover:bg-control text-ink border border-line'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditMode ? '편집 완료' : '편집하기'}</span>
          </button>

          {onConfirmStep && (
            <button
              type="button"
              onClick={() => onConfirmStep('step7')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isConfirmed
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-surface border border-line hover:border-line-strong text-ink'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isConfirmed ? '확정 완료' : '산출물 확정'}</span>
            </button>
          )}

          {onCollapsePane && (
            <button
              type="button"
              onClick={onCollapsePane}
              className="p-1.5 text-muted hover:text-ink rounded-lg hover:bg-well transition-colors cursor-pointer"
              title="패널 접기"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Section 1: Logo & Brand Identity Card */}
        <div className="p-5 rounded-2xl bg-surface border border-line space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-bold text-ink">로고 심볼 및 브랜드 아이덴티티</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsLogoModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>로고 변경</span>
              </button>
              <button
                type="button"
                onClick={handleCopySvg}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-well border border-line text-xs font-medium text-muted hover:text-ink transition-colors cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>SVG 복사</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
            {/* Logo Preview */}
            <div className="flex flex-col items-center justify-center p-6 bg-canvas border border-line-strong rounded-xl text-center space-y-3">
              <div
                onClick={() => setIsLogoModalOpen(true)}
                title="클릭하여 로고 심볼 변경"
                className="w-20 h-20 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                dangerouslySetInnerHTML={{ __html: branding.logoSymbolSvg || '' }}
              />
              <div className="w-full">
                {isEditMode ? (
                  <input
                    type="text"
                    value={branding.brandName || branding.serviceName}
                    onChange={(e) => handleUpdateBrandName(e.target.value)}
                    className="w-full text-center text-base font-bold text-ink bg-well border border-line rounded px-2 py-1 focus:outline-none focus:border-accent"
                  />
                ) : (
                  <div className="text-base font-bold text-ink">{branding.brandName || branding.serviceName}</div>
                )}
                <div className="text-xs text-muted font-medium mt-0.5">Vector SVG Glyph</div>
              </div>
            </div>

            {/* Slogan & Core Concept */}
            <div className="md:col-span-2 space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-muted block mb-1">브랜드 슬로건</span>
                {isEditMode ? (
                  <input
                    type="text"
                    value={branding.slogan}
                    onChange={(e) => handleUpdateSlogan(e.target.value)}
                    className="w-full text-sm font-bold text-ink bg-well border border-line rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent"
                  />
                ) : (
                  <p className="text-lg font-bold text-ink mt-0.5">
                    "{branding.slogan}"
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-muted block">
                    디자인 원칙 (Design Principles)
                  </span>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => setIsAddingPrinciple(true)}
                      className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>원칙 추가</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(branding.designPrinciples || []).map((dp, idx) => {
                    const isObj = typeof dp !== 'string';
                    const title = isObj ? dp.title : dp;
                    const desc = isObj ? dp.desc : '';

                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-well/50 border border-line space-y-1 relative group"
                      >
                        {isEditMode && (
                          <button
                            type="button"
                            onClick={() => handleDeletePrinciple(idx)}
                            className="absolute top-2 right-2 text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer"
                            title="원칙 삭제"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                        {isEditMode ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={title}
                              onChange={(e) => handleUpdatePrinciple(idx, 'title', e.target.value)}
                              className="font-bold text-xs text-ink bg-well border border-line rounded px-1.5 py-0.5 w-full outline-none"
                            />
                            <textarea
                              rows={2}
                              value={desc}
                              onChange={(e) => handleUpdatePrinciple(idx, 'desc', e.target.value)}
                              className="text-[11px] text-ink-2 bg-well border border-line rounded p-1.5 w-full outline-none resize-none leading-relaxed"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="font-bold text-xs text-ink">{title}</div>
                            {desc && <p className="text-[11px] text-muted leading-relaxed">{desc}</p>}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Color Palette Swatches */}
        <div className="p-5 rounded-2xl bg-surface border border-line space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-bold text-ink">컬러 시스템 (Color Palette Swatches)</h3>
            </div>
            {isEditMode && (
              <button
                type="button"
                onClick={() => setIsAddingSwatch(true)}
                className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>컬러 스와치 추가</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {(branding.colorSwatches || []).map((swatch) => (
              <div
                key={swatch.name}
                className="rounded-xl border border-line overflow-hidden bg-well/40 space-y-2 pb-2.5 relative group hover:border-line-strong transition-colors"
              >
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => handleDeleteSwatch(swatch.name)}
                    className="absolute top-1.5 right-1.5 z-10 bg-black/60 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger cursor-pointer"
                    title="스와치 삭제"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                <div
                  className="h-16 w-full cursor-pointer relative flex items-center justify-center transition-transform hover:opacity-95"
                  style={{ backgroundColor: swatch.hex }}
                  onClick={() => handleCopyHex(swatch.hex, swatch.name)}
                  title="클릭하여 Hex 코드 복사"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white flex items-center gap-1 shadow-xs">
                    {copiedHex === swatch.hex ? <Check className="w-3 h-3 text-ok" /> : <Copy className="w-3 h-3" />}
                    복사
                  </span>
                </div>

                <div className="px-2 space-y-1">
                  {isEditMode ? (
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={swatch.name}
                        onChange={(e) => handleUpdateSwatch(swatch.name, 'name', e.target.value)}
                        className="text-xs font-bold text-ink bg-well border border-line rounded px-1 py-0.5 w-full outline-none"
                      />
                      <input
                        type="text"
                        value={swatch.role}
                        onChange={(e) => handleUpdateSwatch(swatch.name, 'role', e.target.value)}
                        className="text-[10px] text-muted bg-well border border-line rounded px-1 py-0.5 w-full outline-none"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="color"
                          value={swatch.hex}
                          onChange={(e) => handleUpdateSwatch(swatch.name, 'hex', e.target.value)}
                          className="w-5 h-5 rounded border border-line cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={swatch.hex}
                          onChange={(e) => handleUpdateSwatch(swatch.name, 'hex', e.target.value)}
                          className="font-mono text-[10px] text-ink bg-well border border-line rounded px-1 py-0.5 flex-1 outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="font-bold text-xs text-ink truncate">{swatch.name}</div>
                      <div className="text-[10px] text-muted truncate">{swatch.role}</div>
                      <div className="font-mono text-[11px] text-ink-2 font-semibold">{swatch.hex}</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Typography Hierarchy & Scale Settings */}
        <div className="p-5 rounded-2xl bg-surface border border-line space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-bold text-ink">타이포그래피 스케일 (Typography Hierarchy)</h3>
            </div>
            <div className="flex items-center gap-2">
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setIsAddingTypoLevel(true)}
                  className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>타이포 단계 추가</span>
                </button>
              )}
            </div>
          </div>

          {/* Font Family Selection Controls */}
          <div className="p-3.5 rounded-xl bg-well/40 border border-line grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-muted font-medium mb-1">기본 본문 & 헤딩 서체 (Primary Sans)</label>
              {isEditMode ? (
                <select
                  value={primaryFont}
                  onChange={(e) => setPrimaryFont(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink font-semibold outline-none"
                >
                  <option value="Pretendard Variable">Pretendard Variable (권장 기본값)</option>
                  <option value="Inter">Inter (Global Clean)</option>
                  <option value="SUIT Variable">SUIT Variable (모던 산세리프)</option>
                  <option value="Toss Product Sans">Toss Product Sans (토스 스타일)</option>
                  <option value="Noto Sans KR">Noto Sans KR (구글 표준)</option>
                  <option value="-apple-system, BlinkMacSystemFont">Apple System UI (HIG)</option>
                </select>
              ) : (
                <div className="font-bold text-ink flex items-center gap-2">
                  <span>{primaryFont}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface border border-line text-muted">Primary</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-muted font-medium mb-1">코드 & 수치 서체 (Monospace)</label>
              {isEditMode ? (
                <select
                  value={monoFont}
                  onChange={(e) => setMonoFont(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink font-semibold outline-none"
                >
                  <option value="JetBrains Mono">JetBrains Mono (개발 표준)</option>
                  <option value="Fira Code">Fira Code (프로그래밍 합자)</option>
                  <option value="SF Mono">SF Mono (애플 스타일)</option>
                  <option value="Geist Mono">Geist Mono (Vercel 스타일)</option>
                </select>
              ) : (
                <div className="font-bold text-ink flex items-center gap-2">
                  <span>{monoFont}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface border border-line text-muted">Code</span>
                </div>
              )}
            </div>
          </div>

          {/* Typography Scale Rows */}
          <div className="space-y-3 divide-y divide-line">
            {typoScale.map((t, idx) => (
              <div key={idx} className="pt-3 flex items-start justify-between gap-4 flex-wrap group">
                <div className="w-48 shrink-0 space-y-1">
                  {isEditMode ? (
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={t.level}
                        onChange={(e) => handleUpdateTypoItem(idx, 'level', e.target.value)}
                        className="font-bold text-xs text-ink bg-well border border-line rounded px-1.5 py-0.5 w-full outline-none"
                      />
                      <input
                        type="text"
                        value={t.size}
                        onChange={(e) => handleUpdateTypoItem(idx, 'size', e.target.value)}
                        className="text-[11px] text-muted bg-well border border-line rounded px-1.5 py-0.5 w-full outline-none"
                        placeholder="20px / 1.25rem"
                      />
                      <input
                        type="text"
                        value={t.weight}
                        onChange={(e) => handleUpdateTypoItem(idx, 'weight', e.target.value)}
                        className="text-[10px] text-muted bg-well border border-line rounded px-1.5 py-0.5 w-full outline-none"
                        placeholder="700 (Bold)"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="text-xs font-bold text-ink">{t.level}</div>
                      <div className="text-[11px] text-muted font-sans tabular-nums">
                        {t.size} · {t.weight}
                      </div>
                      <div className="text-[10px] text-muted/80">{t.usage}</div>
                    </>
                  )}
                </div>

                <div className="flex-1 min-w-[240px]">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={t.sampleText || ''}
                      onChange={(e) => handleUpdateTypoItem(idx, 'sampleText', e.target.value)}
                      className="w-full text-sm text-ink bg-well border border-line rounded-lg px-2.5 py-1.5 outline-none focus:border-accent"
                    />
                  ) : (
                    <div
                      className={`truncate ${
                        idx === 0
                          ? 'text-2xl font-bold text-ink'
                          : idx === 1
                          ? 'text-xl font-bold text-ink'
                          : idx === 2
                          ? 'text-base font-semibold text-ink'
                          : idx === 3
                          ? 'text-sm text-ink-2 leading-relaxed'
                          : idx === 5
                          ? 'text-xs font-mono text-accent'
                          : 'text-xs text-muted'
                      }`}
                    >
                      {t.sampleText}
                    </div>
                  )}
                </div>

                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => handleDeleteTypoItem(idx)}
                    className="p-1 text-muted hover:text-danger rounded transition-colors cursor-pointer shrink-0"
                    title="타이포 단계 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Live Theme Component Preview Board */}
        <div className="p-5 rounded-2xl bg-surface border border-line space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-bold text-ink">다크 / 라이트 테마 프리뷰 보드</h3>
            </div>

            {/* Direct Theme & Preset Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Dark / Light Toggle */}
              <div className="flex items-center bg-well border border-line rounded-lg p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewTheme('light')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    previewTheme === 'light'
                      ? 'bg-amber-500/15 text-amber-500 font-semibold shadow-xs'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>라이트 모드</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTheme('dark')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    previewTheme === 'dark'
                      ? 'bg-blue-500/15 text-blue-400 font-semibold shadow-xs'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>다크 모드</span>
                </button>
              </div>

              {/* Theme Preset Selector */}
              <div className="flex items-center gap-1 bg-well/60 border border-line rounded-lg p-0.5">
                {THEME_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedThemePreset(preset.id)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      selectedThemePreset === preset.id
                        ? 'bg-surface text-ink font-semibold shadow-xs'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full inline-block mr-1 align-middle"
                      style={{ backgroundColor: preset.accent }}
                    />
                    {preset.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Theme Preview Card */}
          <div
            className="p-6 sm:p-8 rounded-xl border transition-colors duration-150"
            style={{
              backgroundColor: previewTheme === 'dark' ? activeThemePreset.darkBg : activeThemePreset.lightBg,
              borderColor: previewTheme === 'dark' ? activeThemePreset.darkBorder : activeThemePreset.lightBorder,
              color: previewTheme === 'dark' ? activeThemePreset.darkText : activeThemePreset.lightText
            }}
          >
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-xs"
                    style={{ backgroundColor: activeThemePreset.accent }}
                  >
                    빵
                  </div>
                  <div>
                    <span className="font-bold text-sm block leading-none">
                      {branding.brandName || branding.serviceName}
                    </span>
                    <span className="text-[10px] opacity-70">실시간 마감 알림 장바구니</span>
                  </div>
                </div>

                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-semibold border text-emerald-500"
                  style={{
                    backgroundColor: previewTheme === 'dark' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                    borderColor: 'rgba(16, 185, 129, 0.3)'
                  }}
                >
                  ● 픽업 가능 (20:30 마감)
                </span>
              </div>

              <div
                className="p-4 rounded-xl border shadow-sm space-y-2 transition-colors duration-150"
                style={{
                  backgroundColor: previewTheme === 'dark' ? activeThemePreset.darkSurface : activeThemePreset.lightSurface,
                  borderColor: previewTheme === 'dark' ? activeThemePreset.darkBorder : activeThemePreset.lightBorder
                }}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold">천연발효 통밀 깜파뉴 & 소금빵 세트</span>
                  <span
                    className="font-bold tabular-nums"
                    style={{ color: activeThemePreset.accent }}
                  >
                    ₩4,200 (50% OFF)
                  </span>
                </div>
                <div className="text-[11px] opacity-75">성수동 아뜰리에 르베이커리 · 잔여 3세트</div>
                <div className="text-[10px] opacity-60">노쇼 방지 보증금: ₩1,000 사전 결제</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex-1 py-2.5 rounded-lg text-white font-semibold text-xs transition-opacity hover:opacity-90 cursor-pointer text-center shadow-xs"
                  style={{ backgroundColor: activeThemePreset.accent }}
                >
                  선결제 보증금 픽업 예약 (₩1,000)
                </button>
                <button
                  type="button"
                  className="px-3 py-2.5 rounded-lg text-xs font-medium border hover:opacity-80 cursor-pointer"
                  style={{
                    borderColor: previewTheme === 'dark' ? activeThemePreset.darkBorder : activeThemePreset.lightBorder,
                    backgroundColor: previewTheme === 'dark' ? activeThemePreset.darkSurface : activeThemePreset.lightSurface
                  }}
                >
                  매장 위치 보기
                </button>
              </div>

              <div className="text-center">
                <span className="text-[11px] opacity-60">
                  현재 활성 테마: <strong>{activeThemePreset.name}</strong> ·{' '}
                  {previewTheme === 'dark' ? '다크 모드' : '라이트 모드'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Change Logo Symbol */}
      {isLogoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface border border-line-strong rounded-2xl w-full max-w-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-accent-soft border border-accent-line flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">로고 심볼 프리셋 및 커스텀 변경</h3>
                  <p className="text-[11px] text-muted">서비스 성격에 맞는 로고 글리프를 선택하거나 커스텀 SVG를 입력하세요.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLogoModalOpen(false)}
                className="p-1 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <span className="text-xs font-bold text-ink block mb-2">추천 벡터 로고 프리셋</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {LOGO_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectLogoPreset(preset.svg)}
                      className="p-3 rounded-xl bg-well/60 hover:bg-well border border-line hover:border-accent text-center flex flex-col items-center gap-2 transition-colors cursor-pointer group"
                    >
                      <div
                        className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform"
                        dangerouslySetInnerHTML={{ __html: preset.svg }}
                      />
                      <span className="text-[11px] font-semibold text-ink truncate w-full">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-line space-y-2">
                <span className="text-xs font-bold text-ink block">직접 SVG 코드 입력</span>
                <form onSubmit={handleApplyCustomLogo} className="space-y-2">
                  <textarea
                    rows={3}
                    value={customLogoInput}
                    onChange={(e) => setCustomLogoInput(e.target.value)}
                    placeholder="SVG 태그 코드를 직접 붙여넣으세요"
                    className="w-full p-2.5 rounded-lg bg-well border border-line text-ink font-mono text-xs focus:outline-none focus:border-accent"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsLogoModalOpen(false)}
                      className="px-3 py-1.5 rounded-lg bg-well text-muted hover:text-ink text-xs font-medium cursor-pointer"
                    >
                      닫기
                    </button>
                    <button
                      type="submit"
                      disabled={!customLogoInput.trim()}
                      className="px-4 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold cursor-pointer disabled:opacity-50"
                    >
                      커스텀 SVG 적용
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Typography Level */}
      {isAddingTypoLevel && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface border border-line-strong rounded-2xl w-full max-w-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-accent-soft border border-accent-line flex items-center justify-center">
                  <Type className="w-4 h-4 text-accent" />
                </div>
                <h3 className="text-sm font-bold text-ink">새 타이포그래피 단계 추가</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingTypoLevel(false)}
                className="p-1 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTypoLevel} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">레벨명 (Level)</label>
                  <input
                    type="text"
                    value={newTypoLevel}
                    onChange={(e) => setNewTypoLevel(e.target.value)}
                    placeholder="예: Subtitle Bold"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">크기 (Size / Rem)</label>
                  <input
                    type="text"
                    value={newTypoSize}
                    onChange={(e) => setNewTypoSize(e.target.value)}
                    placeholder="예: 18px / 1.125rem"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">굵기 (Weight)</label>
                  <input
                    type="text"
                    value={newTypoWeight}
                    onChange={(e) => setNewTypoWeight(e.target.value)}
                    placeholder="예: 600 (SemiBold)"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">용도 (Usage)</label>
                  <input
                    type="text"
                    value={newTypoUsage}
                    onChange={(e) => setNewTypoUsage(e.target.value)}
                    placeholder="예: 카드 상단 서브헤더"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">미리보기 텍스트</label>
                <input
                  type="text"
                  value={newTypoSample}
                  onChange={(e) => setNewTypoSample(e.target.value)}
                  placeholder="예: 실시간 베이커리 픽업 예약"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingTypoLevel(false)}
                  className="px-3 py-1.5 rounded-lg bg-well text-muted hover:text-ink text-xs font-medium cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold cursor-pointer"
                >
                  타이포 단계 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Design Principle */}
      {isAddingPrinciple && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface border border-line-strong rounded-2xl w-full max-w-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="text-sm font-bold text-ink">새 디자인 원칙 추가</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingPrinciple(false)}
                className="p-1 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPrinciple} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">원칙 키워드 / 제목</label>
                <input
                  type="text"
                  value={newPrincipleTitle}
                  onChange={(e) => setNewPrincipleTitle(e.target.value)}
                  placeholder="예: 미니멀 & 직관적 인터랙션"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">상세 설명 및 가이드라인</label>
                <textarea
                  value={newPrincipleDesc}
                  onChange={(e) => setNewPrincipleDesc(e.target.value)}
                  rows={3}
                  placeholder="예: 불필요한 장식적 요소를 배제하고 필수 액션까지 3클릭 이내에 도달하도록 설계합니다."
                  className="w-full p-2.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingPrinciple(false)}
                  className="px-3 py-1.5 rounded-lg bg-well text-muted hover:text-ink text-xs font-medium cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold cursor-pointer"
                >
                  원칙 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Color Swatch */}
      {isAddingSwatch && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface border border-line-strong rounded-2xl w-full max-w-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Palette className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="text-sm font-bold text-ink">새 컬러 스와치 등록</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingSwatch(false)}
                className="p-1 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSwatch} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">컬러명</label>
                  <input
                    type="text"
                    value={newSwatchName}
                    onChange={(e) => setNewSwatchName(e.target.value)}
                    placeholder="예: Success Emerald"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">역할 (Role)</label>
                  <input
                    type="text"
                    value={newSwatchRole}
                    onChange={(e) => setNewSwatchRole(e.target.value)}
                    placeholder="예: 성공 상태 및 활성 배지"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">Hex 컬러 코드</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newSwatchHex}
                    onChange={(e) => setNewSwatchHex(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-line cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={newSwatchHex}
                    onChange={(e) => setNewSwatchHex(e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink font-mono text-xs focus:outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingSwatch(false)}
                  className="px-3 py-1.5 rounded-lg bg-well text-muted hover:text-ink text-xs font-medium cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold cursor-pointer"
                >
                  스와치 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
