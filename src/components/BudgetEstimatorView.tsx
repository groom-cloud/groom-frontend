import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  Check,
  TrendingUp,
  HardDrive,
  Layers,
  Sparkles,
  PanelRightClose,
  Edit3
} from 'lucide-react';
import type { BudgetItem, StepId } from '../mockData';
import { ExportDropdown } from './ExportDropdown';

interface BudgetEstimatorViewProps {
  items: BudgetItem[];
  setItems: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
  onConfirmStep?: (step: StepId) => void;
  onCollapsePane?: () => void;
  isConfirmed?: boolean;
}

export const BudgetEstimatorView: React.FC<BudgetEstimatorViewProps> = ({
  items,
  setItems,
  onConfirmStep,
  onCollapsePane,
  isConfirmed = false
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [currency, setCurrency] = useState<'KRW' | 'USD'>('KRW');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Item State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<BudgetItem['category']>('인프라/클라우드');
  const [newTierSpec, setNewTierSpec] = useState('t4g.micro (AWS Seoul)');
  const [newCostKrw, setNewCostKrw] = useState<number>(30000);
  const [newBillingCycle, setNewBillingCycle] = useState<BudgetItem['billingCycle']>('월간 결제');
  const [newNotes, setNewNotes] = useState('');

  // Exchange rate assumption (1 USD = 1,380 KRW)
  const USD_RATE = 1380;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const summary = useMemo(() => {
    const totalMonthlyKrw = items.reduce((acc, cur) => {
      const krw = cur.monthlyCostKrw || cur.estimatedCostKrw || 0;
      if (cur.billingCycle === '연간 선납') return acc + Math.round(krw / 12);
      return acc + krw;
    }, 0);

    const categoryBreakdown = items.reduce<Record<string, number>>((acc, cur) => {
      const krw = cur.monthlyCostKrw || cur.estimatedCostKrw || 0;
      const cost = cur.billingCycle === '연간 선납' ? Math.round(krw / 12) : krw;
      acc[cur.category] = (acc[cur.category] || 0) + cost;
      return acc;
    }, {});

    return {
      totalMonthlyKrw,
      totalMonthlyUsd: Math.round(totalMonthlyKrw / USD_RATE),
      yearlyProjectionKrw: totalMonthlyKrw * 12,
      categoryBreakdown
    };
  }, [items]);

  const formatMoney = (krw: number) => {
    if (currency === 'USD') {
      const usd = Math.round(krw / USD_RATE);
      return `$${usd.toLocaleString()}`;
    }
    return `₩${krw.toLocaleString()}`;
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const cost = Number(newCostKrw) || 0;
    const newItem: BudgetItem = {
      id: `budget_${Date.now()}`,
      category: newCategory,
      name: newName.trim(),
      itemName: newName.trim(),
      tierSpec: newTierSpec.trim() || '클라우드 인스턴스',
      provider: newCategory,
      monthlyCostKrw: cost,
      estimatedCostKrw: cost,
      monthlyCostUsd: Number((cost / USD_RATE).toFixed(1)),
      billingCycle: newBillingCycle,
      notes: newNotes.trim() || '사용자 추가 예산 항목',
      description: newNotes.trim() || '사용자 추가 예산 항목'
    };

    setItems((prev) => [...prev, newItem]);
    setIsAddingItem(false);
    setNewName('');
    setNewNotes('');
    setNewCostKrw(30000);
    showToast(`"${newItem.name}" 항목이 예산 산정서에 추가되었습니다.`);
  };

  const handleDeleteItem = (id: string, name: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    showToast(`"${name}" 항목이 삭제되었습니다.`);
  };

  const buildMarkdown = () => {
    return `# 03. 비용 및 예산 산정서

## 월 총 예상 비용 요약
- 월 예상 합계: ${formatMoney(summary.totalMonthlyKrw)} (연간 약 ₩${(summary.yearlyProjectionKrw / 10000).toFixed(0)}만 원)
- 인프라/클라우드: ${formatMoney(summary.categoryBreakdown['인프라/클라우드'] || 0)}
- AI 및 모델 API: ${formatMoney(summary.categoryBreakdown['AI 및 모델 API'] || 0)}
- 서드파티 및 SaaS: ${formatMoney(summary.categoryBreakdown['서드파티 및 SaaS'] || 0)}
- 도메인 및 SSL: ${formatMoney(summary.categoryBreakdown['도메인 및 SSL'] || 0)}

## 세부 산정 항목 목록
| 카테고리 | 항목명 | 인스턴스/스펙 | 과금 주기 | 예상 비용 | 산정 근거 및 비고 |
| --- | --- | --- | --- | --- | --- |
${items
  .map(
    (i) =>
      `| ${i.category} | ${i.name || i.itemName} | ${i.tierSpec || i.provider} | ${i.billingCycle} | ${formatMoney(i.monthlyCostKrw || i.estimatedCostKrw || 0)} | ${i.notes || i.description || '-'} |`
  )
  .join('\n')}
`;
  };

  const getCategoryBadge = (cat: BudgetItem['category']) => {
    switch (cat) {
      case '인프라/클라우드':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">인프라/클라우드</span>;
      case 'AI 및 모델 API':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">AI 및 모델 API</span>;
      case '서드파티 및 SaaS':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">서드파티 및 SaaS</span>;
      case '도메인 및 SSL':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">도메인 및 SSL</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">{cat}</span>;
    }
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
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">03. Financial Plan</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-well text-muted border border-line">실시간 산정</span>
            </div>
            <h2 className="text-sm font-bold text-ink truncate">비용 및 예산 산정서</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Currency Toggle */}
          <div className="flex items-center bg-well border border-line rounded-lg p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setCurrency('KRW')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                currency === 'KRW' ? 'bg-surface text-ink font-semibold shadow-sm' : 'text-muted hover:text-ink'
              }`}
            >
              KRW (₩)
            </button>
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                currency === 'USD' ? 'bg-surface text-ink font-semibold shadow-sm' : 'text-muted hover:text-ink'
              }`}
            >
              USD ($)
            </button>
          </div>

          <ExportDropdown
            title="03_비용_및_예산_산정서"
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
              onClick={() => onConfirmStep('step3')}
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

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Cost Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Total Monthly */}
          <div className="p-4 rounded-xl bg-surface border border-line space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>월간 총 예상 비용</span>
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-ink tracking-tight tabular-nums">
              {formatMoney(summary.totalMonthlyKrw)}
            </div>
            <p className="text-[11px] text-muted tabular-nums">
              연간 예상: ₩{(summary.yearlyProjectionKrw / 10000).toLocaleString()}만원
            </p>
          </div>

          {/* Card 2: Cloud Infra */}
          <div className="p-4 rounded-xl bg-surface border border-line space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>클라우드 인프라 (AWS)</span>
              <HardDrive className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-ink tracking-tight tabular-nums">
              {formatMoney(summary.categoryBreakdown['인프라/클라우드'] || 0)}
            </div>
            <p className="text-[11px] text-muted">전체 지출의 약 {Math.round(((summary.categoryBreakdown['인프라/클라우드'] || 0) / (summary.totalMonthlyKrw || 1)) * 100)}% 차지</p>
          </div>

          {/* Card 3: AI & API */}
          <div className="p-4 rounded-xl bg-surface border border-line space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>AI 및 외부 API (OpenAI)</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-ink tracking-tight tabular-nums">
              {formatMoney(summary.categoryBreakdown['AI 및 모델 API'] || 0)}
            </div>
            <p className="text-[11px] text-muted">사용자 1,000명 기준 토큰 예측치</p>
          </div>

          {/* Card 4: SaaS & DevOps */}
          <div className="p-4 rounded-xl bg-surface border border-line space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>SaaS & 도메인/보안</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-ink tracking-tight tabular-nums">
              {formatMoney((summary.categoryBreakdown['서드파티 및 SaaS'] || 0) + (summary.categoryBreakdown['도메인 및 SSL'] || 0))}
            </div>
            <p className="text-[11px] text-muted">배포 호스팅, CDN, SSL 인증서</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'all', label: `전체 보기 (${items.length})` },
              { id: '인프라/클라우드', label: '클라우드 인프라' },
              { id: 'AI 및 모델 API', label: 'AI 토큰 / API' },
              { id: '서드파티 및 SaaS', label: 'SaaS / 호스팅' },
              { id: '도메인 및 SSL', label: '도메인 & 기타' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-ink text-paper font-semibold'
                    : 'bg-well text-muted hover:text-ink border border-line'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            <span>환율 기준: 1 USD = {USD_RATE.toLocaleString()} KRW</span>
          </div>
        </div>

        {/* Cost Table */}
        <div className="bg-surface border border-line rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-well border-b border-line text-muted font-medium">
                <tr>
                  <th className="px-4 py-3">분류</th>
                  <th className="px-4 py-3">항목명 / 서비스</th>
                  <th className="px-4 py-3">스펙 / 제공사</th>
                  <th className="px-4 py-3">과금 주기</th>
                  <th className="px-4 py-3 text-right">예상 비용 ({currency})</th>
                  <th className="px-4 py-3">설명 및 산정 근거</th>
                  {isEditMode && <th className="px-4 py-3 text-center">삭제</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredItems.map((item) => {
                  const cost = item.monthlyCostKrw || item.estimatedCostKrw || 0;
                  return (
                    <tr key={item.id} className="hover:bg-well/50 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={item.category}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              setItems((prev) =>
                                prev.map((i) => (i.id === item.id ? { ...i, category: val } : i))
                              );
                            }}
                            className="bg-well border border-line rounded px-1.5 py-1 text-xs text-ink outline-none w-28 font-medium"
                          />
                        ) : (
                          getCategoryBadge(item.category)
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-ink whitespace-nowrap">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={item.name || item.itemName}
                            onChange={(e) => {
                              const val = e.target.value;
                              setItems((prev) =>
                                prev.map((i) => (i.id === item.id ? { ...i, name: val, itemName: val } : i))
                              );
                            }}
                            className="bg-well border border-line rounded px-2 py-1 text-xs text-ink font-semibold outline-none"
                          />
                        ) : (
                          item.name || item.itemName
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-ink-2 whitespace-nowrap font-mono">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={item.tierSpec || item.provider || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setItems((prev) =>
                                prev.map((i) => (i.id === item.id ? { ...i, tierSpec: val, provider: val } : i))
                              );
                            }}
                            className="bg-well border border-line rounded px-2 py-1 text-xs text-ink-2 font-mono outline-none w-32"
                          />
                        ) : (
                          item.tierSpec || item.provider
                        )}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {isEditMode ? (
                          <select
                            value={item.billingCycle}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              setItems((prev) =>
                                prev.map((i) => (i.id === item.id ? { ...i, billingCycle: val } : i))
                              );
                            }}
                            className="bg-well border border-line rounded px-1.5 py-1 text-[11px] text-ink outline-none"
                          >
                            <option value="월간">월간</option>
                            <option value="연간">연간</option>
                            <option value="종량제">종량제</option>
                            <option value="일회성">일회성</option>
                          </select>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-well text-muted border border-line">
                            {item.billingCycle}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono tabular-nums font-bold text-ink whitespace-nowrap">
                        {isEditMode ? (
                          <input
                            type="number"
                            value={cost}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 0;
                              setItems((prev) =>
                                prev.map((i) =>
                                  i.id === item.id ? { ...i, monthlyCostKrw: val, estimatedCostKrw: val } : i
                                )
                              );
                            }}
                            className="bg-well border border-line rounded px-2 py-1 text-xs font-mono text-ink text-right w-28 outline-none"
                          />
                        ) : (
                          formatMoney(cost)
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-muted max-w-xs">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={item.notes || item.description || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setItems((prev) =>
                                prev.map((i) => (i.id === item.id ? { ...i, notes: val, description: val } : i))
                              );
                            }}
                            className="w-full bg-well border border-line rounded px-2 py-1 text-xs text-muted outline-none"
                          />
                        ) : (
                          <span className="truncate block" title={item.notes || item.description}>
                            {item.notes || item.description}
                          </span>
                        )}
                      </td>
                      {isEditMode && (
                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id, item.name || item.itemName || '항목')}
                            className="p-1 rounded hover:bg-danger/10 text-muted hover:text-danger transition-colors cursor-pointer"
                            title="항목 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Add Item Trigger - only appears when in Edit Mode */}
          {isEditMode && (
            <div className="p-3 border-t border-line bg-well/30 flex justify-center">
              <button
                type="button"
                onClick={() => setIsAddingItem(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-dashed border-accent/40 hover:border-accent text-accent hover:bg-accent-soft text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ 예산 산정 항목 추가</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {isAddingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-md bg-surface border border-line rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Plus className="w-4 h-4 text-accent" />
                <span>예산 항목 직접 추가</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingItem(false)}
                className="text-muted hover:text-ink text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3.5 text-xs">
              <div>
                <label className="text-muted block mb-1">분류 카테고리</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as BudgetItem['category'])}
                  className="w-full bg-well border border-line rounded-lg px-2.5 py-2 text-ink"
                >
                  <option value="인프라/클라우드">인프라/클라우드 (AWS 등)</option>
                  <option value="AI 및 모델 API">AI 및 모델 API (OpenAI 등)</option>
                  <option value="서드파티 및 SaaS">서드파티 및 SaaS (Vercel 등)</option>
                  <option value="도메인 및 SSL">도메인 및 SSL</option>
                </select>
              </div>

              <div>
                <label className="text-muted block mb-1">항목명 / 서비스명</label>
                <input
                  type="text"
                  placeholder="예: AWS ElastiCache Redis, Sentry"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-well border border-line rounded-lg px-2.5 py-2 text-ink placeholder:text-muted"
                  required
                />
              </div>

              <div>
                <label className="text-muted block mb-1">스펙 / 인스턴스 사양</label>
                <input
                  type="text"
                  placeholder="예: cache.t4g.micro (0.5GB, Seoul)"
                  value={newTierSpec}
                  onChange={(e) => setNewTierSpec(e.target.value)}
                  className="w-full bg-well border border-line rounded-lg px-2.5 py-2 text-ink placeholder:text-muted"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted block mb-1">예상 비용 (KRW ₩)</label>
                  <input
                    type="number"
                    value={newCostKrw}
                    onChange={(e) => setNewCostKrw(Number(e.target.value))}
                    step={1000}
                    className="w-full bg-well border border-line rounded-lg px-2.5 py-2 font-mono text-ink"
                  />
                </div>

                <div>
                  <label className="text-muted block mb-1">과금 주기</label>
                  <select
                    value={newBillingCycle}
                    onChange={(e) => setNewBillingCycle(e.target.value as BudgetItem['billingCycle'])}
                    className="w-full bg-well border border-line rounded-lg px-2.5 py-2 text-ink"
                  >
                    <option value="월간 결제">월간 결제</option>
                    <option value="연간 선납">연간 선납</option>
                    <option value="사용량 비례">사용량 비례</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-muted block mb-1">산정 근거 및 비고</label>
                <textarea
                  rows={2}
                  placeholder="초기 MVP 사용자 500명 동시접속 캐싱용"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-well border border-line rounded-lg px-2.5 py-2 text-ink placeholder:text-muted resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="px-3.5 py-2 rounded-lg bg-well border border-line text-muted hover:text-ink cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover font-semibold cursor-pointer"
                >
                  예산표에 추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
