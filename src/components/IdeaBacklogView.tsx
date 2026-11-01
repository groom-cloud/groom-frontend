import React, { useState } from 'react';
import {
  Lightbulb,
  Plus,
  Trash2,
  Check,
  Filter,
  PanelRightClose,
  Edit3
} from 'lucide-react';
import type { BacklogIdeaItem, StepId } from '../mockData';
import { ExportDropdown } from './ExportDropdown';

interface IdeaBacklogViewProps {
  ideas: BacklogIdeaItem[];
  setIdeas: React.Dispatch<React.SetStateAction<BacklogIdeaItem[]>>;
  onSendToWbs: (idea: BacklogIdeaItem) => void;
  onNavigateStep?: (step: StepId) => void;
  onConfirmStep?: (step: StepId) => void;
  onCollapsePane?: () => void;
  isConfirmed?: boolean;
}

export const IdeaBacklogView: React.FC<IdeaBacklogViewProps> = ({
  ideas,
  setIdeas,
  onSendToWbs,
  onConfirmStep,
  onCollapsePane,
  isConfirmed = false
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddingIdea, setIsAddingIdea] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Idea Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('기능 제안');
  const [newPriority, setNewPriority] = useState<'P0' | 'P1' | 'P2'>('P1');
  const [newImpact, setNewImpact] = useState('High');
  const [newEffort, setNewEffort] = useState('Medium');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newIdea: BacklogIdeaItem = {
      id: `idea_${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim() || '추가된 백로그 아이디어 항목입니다.',
      category: newCategory,
      priority: newPriority,
      impact: newImpact,
      effort: newEffort,
      status: 'idea',
      suggestedAt: new Date().toISOString().split('T')[0]
    };

    setIdeas((prev) => [newIdea, ...prev]);
    setIsAddingIdea(false);
    setNewTitle('');
    setNewDescription('');
    showToast(`"${newIdea.title}" 아이디어가 백로그에 등록되었습니다.`);
  };

  const handleDeleteIdea = (id: string, title: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
    showToast(`"${title}" 아이디어가 삭제되었습니다.`);
  };

  const handleTransferToWbs = (idea: BacklogIdeaItem) => {
    // Call parent transfer handler which creates the task in step 13
    onSendToWbs(idea);

    // Update status in backlog
    setIdeas((prev) =>
      prev.map((i) => (i.id === idea.id ? { ...i, status: 'wbs_converted' } : i))
    );

    showToast(`"${idea.title}" 아이디어가 [13. WBS 칸반] 대기 열로 전송되었습니다!`);
  };

  const filteredIdeas = ideas.filter((idea) => {
    if (filterPriority !== 'all' && idea.priority !== filterPriority) return false;
    const isConverted = idea.status === 'wbs_converted' || idea.status === 'transferred_to_wbs';
    if (filterStatus === 'idea' && isConverted) return false;
    if (filterStatus === 'wbs_converted' && !isConverted) return false;
    return true;
  });

  const buildMarkdown = () => {
    return `# 04. 아이디어 백로그 (Idea Backlog)

총 보관 아이디어: ${ideas.length}건

${ideas
  .map(
    (i) => `### [${i.priority}] ${i.title} (${i.category})
- 상태: ${i.status === 'wbs_converted' || i.status === 'transferred_to_wbs' ? '13. WBS 칸반 연동됨' : '미배정 백로그'}
- 우선순위: ${i.priority} | 공수: ${i.effort || 'Medium'} | 영향도: ${i.impact || 'High'}
- 상세 내용: ${i.description}`
  )
  .join('\n\n')}
`;
  };

  const getPriorityBadge = (p: 'P0' | 'P1' | 'P2') => {
    switch (p) {
      case 'P0':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-danger/10 text-danger border border-danger/20">P0 · 최우선</span>;
      case 'P1':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">P1 · 중요</span>;
      case 'P2':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">P2 · 선택</span>;
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
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">04. Idea Backlog</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-well text-muted border border-line">
                총 {ideas.length}개 보관
              </span>
            </div>
            <h2 className="text-sm font-bold text-ink truncate">아이디어 백로그</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ExportDropdown
            title="04_아이디어_백로그"
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
              onClick={() => onConfirmStep('step4')}
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

      {/* Filter Toolbar */}
      <div className="px-5 py-2.5 bg-well/50 border-b border-line flex items-center justify-between gap-3 flex-wrap text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5" />
            우선순위:
          </span>
          <div className="flex items-center gap-1">
            {['all', 'P0', 'P1', 'P2'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setFilterPriority(p)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                  filterPriority === p
                    ? 'bg-ink text-paper font-semibold'
                    : 'bg-surface text-muted hover:text-ink border border-line'
                }`}
              >
                {p === 'all' ? '전체' : p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted font-medium">상태:</span>
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: '전체' },
              { id: 'idea', label: '미배정 아이디어' },
              { id: 'wbs_converted', label: 'WBS 칸반 연동됨' }
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setFilterStatus(s.id)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                  filterStatus === s.id
                    ? 'bg-accent text-accent-ink font-semibold'
                    : 'bg-surface text-muted hover:text-ink border border-line'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Idea Cards List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
        {isEditMode && (
          <div className="p-3 bg-well/40 border border-dashed border-accent/40 rounded-xl flex items-center justify-between">
            <span className="text-xs text-muted">편집 모드: 새 아이디어를 추가하거나 카드를 수정/삭제할 수 있습니다.</span>
            <button
              type="button"
              onClick={() => setIsAddingIdea(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ 새 아이디어 제안</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredIdeas.map((idea) => {
            const isConverted = idea.status === 'wbs_converted';
            return (
              <div
                key={idea.id}
                className={`p-4 rounded-xl border transition-colors flex flex-col justify-between gap-3 ${
                  isConverted
                    ? 'bg-well/40 border-line text-muted'
                    : 'bg-surface border-line hover:border-line-strong shadow-sm'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {getPriorityBadge(idea.priority)}
                      <span className="px-2 py-0.5 rounded text-[10px] bg-well text-ink-2 border border-line font-medium">
                        {idea.category}
                      </span>
                      {isConverted && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          13. WBS 칸반 연동됨
                        </span>
                      )}
                    </div>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => handleDeleteIdea(idea.id, idea.title)}
                        className="p-1 text-muted hover:text-danger rounded transition-colors cursor-pointer"
                        title="아이디어 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div>
                    {isEditMode ? (
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={idea.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setIdeas((prev) => prev.map((i) => (i.id === idea.id ? { ...i, title: val } : i)));
                          }}
                          className="w-full bg-well border border-line rounded px-2 py-1 text-sm font-bold text-ink outline-none"
                        />
                        <textarea
                          rows={2}
                          value={idea.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setIdeas((prev) => prev.map((i) => (i.id === idea.id ? { ...i, description: val } : i)));
                          }}
                          className="w-full bg-well border border-line rounded px-2 py-1 text-xs text-ink-2 outline-none resize-none"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className={`text-sm font-bold ${isConverted ? 'text-ink-2 line-through' : 'text-ink'}`}>
                          {idea.title}
                        </h3>
                        <p className="text-xs text-muted mt-1 leading-relaxed">
                          {idea.description}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-muted pt-1">
                    <span>영향도: <strong className="text-ink-2">{idea.impact}</strong></span>
                    <span>공수: <strong className="text-ink-2">{idea.effort}</strong></span>
                    <span>등록일: {idea.suggestedAt}</span>
                  </div>
                </div>

                {/* Transfer Action Button */}
                <div className="pt-2 border-t border-line/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-muted">
                    {isConverted ? '칸반 작업으로 진행 중' : '스프린트 백로그'}
                  </span>
                  <button
                    type="button"
                    disabled={isConverted}
                    onClick={() => handleTransferToWbs(idea)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isConverted
                        ? 'bg-well text-muted cursor-not-allowed border border-line'
                        : 'bg-accent text-accent-ink hover:bg-accent-hover shadow-sm'
                    }`}
                  >
                    <span>➔ 13. WBS 칸반으로 보내기</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredIdeas.length === 0 && (
          <div className="py-16 text-center text-muted text-xs space-y-2">
            <Lightbulb className="w-8 h-8 text-muted/40 mx-auto" />
            <p>조건에 맞는 아이디어 백로그가 없습니다.</p>
          </div>
        )}
      </div>

      {/* Add Idea Modal */}
      {isAddingIdea && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-surface border border-line-strong rounded-xl max-w-md w-full p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-sm font-bold text-ink">새 아이디어 제안 등록</h3>
              <button
                type="button"
                onClick={() => setIsAddingIdea(false)}
                className="p-1 text-muted hover:text-ink rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddIdea} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-muted font-medium mb-1">아이디어 제목</label>
                <input
                  type="text"
                  required
                  placeholder="예: 마감 할인 빵 패키지 묶음 배송 기능"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-well border border-line rounded-lg text-ink focus:border-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-muted font-medium mb-1">카테고리</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-well border border-line rounded-lg text-ink outline-none"
                  >
                    <option value="기능 제안">기능 제안</option>
                    <option value="UX 개선">UX 개선</option>
                    <option value="수익화">수익화</option>
                    <option value="인프라">인프라</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted font-medium mb-1">우선순위</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as 'P0' | 'P1' | 'P2')}
                    className="w-full px-2.5 py-1.5 bg-well border border-line rounded-lg text-ink outline-none"
                  >
                    <option value="P0">P0 (최우선)</option>
                    <option value="P1">P1 (중요)</option>
                    <option value="P2">P2 (선택)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted font-medium mb-1">예상 공수</label>
                  <select
                    value={newEffort}
                    onChange={(e) => setNewEffort(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-well border border-line rounded-lg text-ink outline-none"
                  >
                    <option value="Low (1~2일)">Low</option>
                    <option value="Medium (1주)">Medium</option>
                    <option value="High (2주+)">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted font-medium mb-1">기대 영향도</label>
                  <select
                    value={newImpact}
                    onChange={(e) => setNewImpact(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-well border border-line rounded-lg text-ink outline-none"
                  >
                    <option value="High (높음)">High</option>
                    <option value="Medium (중간)">Medium</option>
                    <option value="Low (낮음)">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-muted font-medium mb-1">상세 내용 및 기대 효과</label>
                <textarea
                  rows={3}
                  placeholder="아이디어의 구체적인 내용 및 사용자에게 줄 수 있는 가치를 서술하세요."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-well border border-line rounded-lg text-ink outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingIdea(false)}
                  className="px-3 py-1.5 rounded-lg bg-well text-muted hover:text-ink text-xs font-medium cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold cursor-pointer"
                >
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
