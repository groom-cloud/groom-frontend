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
  X
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isAddingPrinciple, setIsAddingPrinciple] = useState(false);
  const [newPrincipleTitle, setNewPrincipleTitle] = useState('');
  const [newPrincipleDesc, setNewPrincipleDesc] = useState('');

  const [isAddingSwatch, setIsAddingSwatch] = useState(false);
  const [newSwatchName, setNewSwatchName] = useState('');
  const [newSwatchRole, setNewSwatchRole] = useState('');
  const [newSwatchHex, setNewSwatchHex] = useState('#3B82F6');

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

  const buildMarkdown = () => {
    return `# 05. 브랜딩 & 디자인 시스템 (Branding & Design System)

- **서비스명**: ${branding.brandName || branding.serviceName}
- **슬로건**: "${branding.slogan}"
- **브랜드 스토리**: ${branding.brandStory || '로컬 베이커리와 퇴근길 소비자를 실시간으로 잇는 친환경 마감 픽업 플랫폼'}
- **심볼 의미**: ${branding.symbolMeaning || '클라우드와 연결 노드를 형상화한 구름 심볼'}

## 디자인 원칙 (Design Principles)
${(branding.designPrinciples || [])
  .map((dp) => (typeof dp === 'string' ? `- ${dp}` : `- **${dp.title}**: ${dp.desc}`))
  .join('\n')}

## 컬러 시스템 (Color Palette Swatches)
| 컬러명 | 역할 | Hex |
|---|---|---|
${(branding.colorSwatches || []).map((c) => `| ${c.name} | ${c.role} | \`${c.hex}\` |`).join('\n')}

## 타이포그래피 (Typography Hierarchy)
- **Primary Font**: Pretendard Variable / JetBrains Mono
- **Heading 1**: 28px / Bold (700)
- **Heading 2**: 20px / Bold (700)
- **Heading 3**: 16px / SemiBold (600)
- **Body Regular**: 14px / Regular (400)
- **Monospace**: 13px / Medium (500)
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
              <span className="text-xs text-muted">05. Branding & Design</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-well text-muted border border-line">
                Design System v1.0
              </span>
            </div>
            <h2 className="text-sm font-bold text-ink truncate">브랜딩 & 디자인 시스템</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Switcher for Preview */}
          <div className="flex items-center bg-well border border-line rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setPreviewTheme('dark')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors cursor-pointer ${
                previewTheme === 'dark' ? 'bg-surface text-ink font-semibold shadow-sm' : 'text-muted'
              }`}
            >
              <Moon className="w-3 h-3" />
              <span>Dark</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewTheme('light')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors cursor-pointer ${
                previewTheme === 'light' ? 'bg-surface text-ink font-semibold shadow-sm' : 'text-muted'
              }`}
            >
              <Sun className="w-3 h-3" />
              <span>Light</span>
            </button>
          </div>

          <ExportDropdown
            title="05_브랜딩_및_디자인_시스템"
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
              onClick={() => onConfirmStep('step6')}
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
            <button
              type="button"
              onClick={handleCopySvg}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-well border border-line text-xs font-medium text-muted hover:text-ink transition-colors cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>SVG 복사</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
            {/* Logo Preview */}
            <div className="flex flex-col items-center justify-center p-6 bg-canvas border border-line-strong rounded-xl text-center space-y-3">
              <div
                className="w-20 h-20 flex items-center justify-center text-accent"
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
                <div className="text-xs text-muted font-mono mt-0.5">Vector SVG Glyph</div>
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
                      className="flex items-center gap-1 text-[11px] text-accent font-semibold hover:underline cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>원칙 추가</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {branding.designPrinciples?.map((dp, idx) => {
                    const title = typeof dp === 'string' ? dp : dp.title;
                    const desc = typeof dp === 'string' ? '' : dp.desc;
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-well border border-line text-xs text-ink-2 flex items-start justify-between gap-2 group"
                      >
                        <div className="flex items-start gap-2 min-w-0 flex-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                          <div className="min-w-0 flex-1">
                            {isEditMode ? (
                              <div className="space-y-1 w-full">
                                <input
                                  type="text"
                                  value={title}
                                  placeholder="원칙명"
                                  onChange={(e) => handleUpdatePrinciple(idx, 'title', e.target.value)}
                                  className="w-full text-xs font-semibold text-ink bg-canvas border border-line rounded px-2 py-0.5 focus:outline-none focus:border-accent"
                                />
                                <textarea
                                  value={desc}
                                  placeholder="설명"
                                  rows={2}
                                  onChange={(e) => handleUpdatePrinciple(idx, 'desc', e.target.value)}
                                  className="w-full text-xs text-ink-2 bg-canvas border border-line rounded px-2 py-1 focus:outline-none focus:border-accent resize-none"
                                />
                              </div>
                            ) : (
                              <>
                                <strong className="text-ink font-semibold">{title}: </strong>
                                <span>{desc}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {isEditMode && (
                          <button
                            type="button"
                            onClick={() => handleDeletePrinciple(idx)}
                            className="opacity-60 hover:opacity-100 p-0.5 text-muted hover:text-danger transition-opacity cursor-pointer shrink-0"
                            title="삭제"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
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
              <h3 className="text-sm font-bold text-ink">컬러 시스템 & 스와치 (1-클릭 Hex 복사)</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">WCAG 2.1 AA 준수</span>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setIsAddingSwatch(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent text-accent-ink text-xs font-semibold hover:bg-accent-hover transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>스와치 추가</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {(branding.colorSwatches || []).map((color) => {
              const isCopied = copiedHex === color.hex;
              return (
                <div
                  key={color.name}
                  onClick={() => !isEditMode && handleCopyHex(color.hex, color.name)}
                  className={`group p-3 rounded-xl bg-well border border-line hover:border-line-strong transition-colors flex flex-col justify-between space-y-2.5 relative ${isEditMode ? '' : 'cursor-pointer'}`}
                >
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSwatch(color.name);
                      }}
                      className="absolute top-2 right-2 z-10 p-1 rounded-md bg-black/60 text-muted hover:text-danger transition-colors cursor-pointer"
                      title="스와치 삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}

                  <div
                    className="w-full h-14 rounded-lg shadow-inner flex items-center justify-center relative border border-white/10"
                    style={{ backgroundColor: color.hex }}
                  >
                    {isEditMode ? (
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => handleUpdateSwatch(color.name, 'hex', e.target.value)}
                        className="w-8 h-8 opacity-70 hover:opacity-100 cursor-pointer rounded border-0"
                        title="색상 선택"
                      />
                    ) : (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded px-1.5 py-0.5 text-[10px] text-white flex items-center gap-1 font-mono">
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? '복사됨' : '복사'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    {isEditMode ? (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={color.name}
                          onChange={(e) => handleUpdateSwatch(color.name, 'name', e.target.value)}
                          className="w-full text-xs font-bold text-ink bg-canvas border border-line rounded px-1.5 py-0.5 focus:outline-none focus:border-accent"
                          placeholder="이름"
                        />
                        <input
                          type="text"
                          value={color.role}
                          onChange={(e) => handleUpdateSwatch(color.name, 'role', e.target.value)}
                          className="w-full text-[10px] text-muted bg-canvas border border-line rounded px-1.5 py-0.5 focus:outline-none focus:border-accent"
                          placeholder="용도"
                        />
                        <input
                          type="text"
                          value={color.hex}
                          onChange={(e) => handleUpdateSwatch(color.name, 'hex', e.target.value)}
                          className="w-full text-xs font-mono font-semibold text-accent bg-canvas border border-line rounded px-1.5 py-0.5 focus:outline-none focus:border-accent"
                          placeholder="#000000"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="text-xs font-bold text-ink truncate">{color.name}</div>
                        <div className="text-[10px] text-muted truncate">{color.role}</div>
                        <div className="text-xs font-mono font-semibold text-accent mt-1 flex items-center justify-between">
                          <span>{color.hex}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Typography Scale */}
        <div className="p-5 rounded-2xl bg-surface border border-line space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-bold text-ink">타이포그래피 스케일 (Typography Hierarchy)</h3>
            </div>
            <span className="text-xs font-mono text-muted">Pretendard Variable / JetBrains Mono</span>
          </div>

          <div className="space-y-3 divide-y divide-line">
            <div className="pt-2 flex items-baseline justify-between gap-4 flex-wrap">
              <span className="text-xs font-mono text-muted w-24">Heading 1 (28px / 700)</span>
              <span className="text-2xl font-bold text-ink flex-1 truncate">
                당일 생산 빵, 퇴근길 골든타임에 반값 예약
              </span>
            </div>
            <div className="pt-3 flex items-baseline justify-between gap-4 flex-wrap">
              <span className="text-xs font-mono text-muted w-24">Heading 2 (20px / 700)</span>
              <span className="text-xl font-bold text-ink flex-1 truncate">
                동네 빵집 마감 잉여 재고 소진 솔루션
              </span>
            </div>
            <div className="pt-3 flex items-baseline justify-between gap-4 flex-wrap">
              <span className="text-xs font-mono text-muted w-24">Heading 3 (16px / 600)</span>
              <span className="text-base font-semibold text-ink flex-1 truncate">
                반경 1.5km 이내 신규 할인 알림 수신
              </span>
            </div>
            <div className="pt-3 flex items-baseline justify-between gap-4 flex-wrap">
              <span className="text-xs font-mono text-muted w-24">Body Regular (14px / 400)</span>
              <span className="text-sm text-ink-2 flex-1 leading-relaxed">
                매장 방문 20분 전 사전 주문을 완료하면 대기 없이 포장된 신선한 베이커리를 수령할 수 있습니다.
              </span>
            </div>
            <div className="pt-3 flex items-baseline justify-between gap-4 flex-wrap">
              <span className="text-xs font-mono text-muted w-24">Monospace (13px / 500)</span>
              <span className="text-xs font-mono text-accent flex-1">
                GET /v1/stores/:id/inventory?status=DISCOUNT_ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Live Theme Component Preview Board */}
        <div className="p-5 rounded-2xl bg-surface border border-line space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-bold text-ink">다크 / 라이트 테마 프리뷰 보드</h3>
            </div>
            <span className="text-xs text-muted">선택된 모드: {previewTheme.toUpperCase()}</span>
          </div>

          <div
            className={`p-6 rounded-xl border transition-colors ${
              previewTheme === 'dark'
                ? 'dark bg-canvas border-line text-ink'
                : 'bg-paper border-line text-ink'
            }`}
          >
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-accent text-accent-ink flex items-center justify-center text-xs font-bold">
                    G
                  </div>
                  <span className="font-bold text-sm">Groom Bakery Cart</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                  픽업 가능
                </span>
              </div>

              <div
                className={`p-3.5 rounded-lg border ${
                  previewTheme === 'dark' ? 'bg-well border-line' : 'bg-surface border-line shadow-sm'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold">천연발효 통밀 깜파뉴</span>
                  <span className="font-bold text-accent">₩3,500 (50% OFF)</span>
                </div>
                <div className="text-[11px] text-muted mt-1">성수동 르베이커리 · 잔여 3개</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex-1 py-2 rounded-lg bg-accent hover:bg-accent-hover text-accent-ink font-semibold text-xs transition-colors cursor-pointer text-center"
                >
                  선결제 보증금 픽업 예약
                </button>
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg text-xs font-medium border border-line text-muted hover:text-ink cursor-pointer"
                >
                  위치 보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
