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
  PanelRightClose
} from 'lucide-react';
import type { BrandingInfo, StepId } from '../mockData';

interface BrandingDesignViewProps {
  branding: BrandingInfo;
  setBranding?: React.Dispatch<React.SetStateAction<BrandingInfo>>;
  onConfirmStep?: (step: StepId) => void;
  onCollapsePane?: () => void;
  isConfirmed?: boolean;
}

export const BrandingDesignView: React.FC<BrandingDesignViewProps> = ({
  branding,
  onConfirmStep,
  onCollapsePane,
  isConfirmed = false
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    navigator.clipboard?.writeText(branding.logoSymbolSvg).catch(() => {});
    showToast('로고 심볼 SVG 코드가 클립보드에 복사되었습니다.');
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
              <span className="text-xs text-muted">06. Branding & Design</span>
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
                dangerouslySetInnerHTML={{ __html: branding.logoSymbolSvg }}
              />
              <div>
                <div className="text-base font-bold text-ink">{branding.brandName}</div>
                <div className="text-xs text-muted font-mono mt-0.5">Vector SVG Glyph</div>
              </div>
            </div>

            {/* Slogan & Core Concept */}
            <div className="md:col-span-2 space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-muted block">브랜드 슬로건</span>
                <p className="text-lg font-bold text-ink mt-0.5">
                  "{branding.slogan}"
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-muted block mb-1">
                  디자인 원칙 (Design Principles)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {branding.designPrinciples?.map((dp, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-well border border-line text-xs text-ink-2 flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      <div>
                        {typeof dp === 'string' ? (
                          <span>{dp}</span>
                        ) : (
                          <>
                            <strong className="text-ink font-semibold">{dp.title}: </strong>
                            <span>{dp.desc}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
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
            <span className="text-xs text-muted">WCAG 2.1 AA 명도 대비 준수</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {branding.colorSwatches.map((color) => {
              const isCopied = copiedHex === color.hex;
              return (
                <div
                  key={color.name}
                  onClick={() => handleCopyHex(color.hex, color.name)}
                  className="group p-3 rounded-xl bg-well border border-line hover:border-line-strong transition-colors cursor-pointer flex flex-col justify-between space-y-2.5"
                >
                  <div
                    className="w-full h-14 rounded-lg shadow-inner flex items-center justify-center relative border border-white/10"
                    style={{ backgroundColor: color.hex }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded px-1.5 py-0.5 text-[10px] text-white flex items-center gap-1 font-mono">
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? '복사됨' : '복사'}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-ink truncate">{color.name}</div>
                    <div className="text-[10px] text-muted truncate">{color.role}</div>
                    <div className="text-xs font-mono font-semibold text-accent mt-1 flex items-center justify-between">
                      <span>{color.hex}</span>
                    </div>
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
    </div>
  );
};
