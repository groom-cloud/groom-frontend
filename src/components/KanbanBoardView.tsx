import React, { useState } from 'react';
import {
  Kanban,
  Plus,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Edit3,
  Trash2,
  Check,
  GripVertical,
  Download,
  RotateCcw,
  X,
  PanelRightClose
} from 'lucide-react';
import type { KanbanTask, StepId } from '../mockData';

interface KanbanBoardViewProps {
  tasks: KanbanTask[];
  setTasks: React.Dispatch<React.SetStateAction<KanbanTask[]>>;
  onCollapsePane?: () => void;
  onConfirmStep?: (step: StepId) => void;
  isConfirmed?: boolean;
}

export const KanbanBoardView: React.FC<KanbanBoardViewProps> = ({
  tasks,
  setTasks,
  onCollapsePane,
  onConfirmStep,
  isConfirmed = false
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'p0' | 'mine'>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // New Task Form States
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'P0' | 'P1' | 'P2'>('P0');
  const [newTaskAssignee, setNewTaskAssignee] = useState('한정호');
  const [newTaskRole, setNewTaskRole] = useState('Fullstack');
  const [newTaskReqRef, setNewTaskReqRef] = useState('REQ-STORE-02');
  const [newTaskPoints, setNewTaskPoints] = useState<number>(3);
  const [newTaskDeadline, setNewTaskDeadline] = useState('D-2');

  // Inline Task Editing State
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Drag & Drop State
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<'todo' | 'in_progress' | 'done' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const moveTask = (taskId: string, dir: 'prev' | 'next') => {
    const order: ('todo' | 'in_progress' | 'done')[] = ['todo', 'in_progress', 'done'];
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const idx = order.indexOf(t.status);
        const nextIdx = dir === 'next' ? Math.min(2, idx + 1) : Math.max(0, idx - 1);
        return { ...t, status: order[nextIdx] };
      })
    );
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverCol(null);
  };

  const handleDragOverColumn = (
    e: React.DragEvent,
    colKey: 'todo' | 'in_progress' | 'done'
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colKey) {
      setDragOverCol(colKey);
    }
  };

  const handleDropOnColumn = (
    e: React.DragEvent,
    targetCol: 'todo' | 'in_progress' | 'done'
  ) => {
    e.preventDefault();
    const droppedId = draggedTaskId || e.dataTransfer.getData('text/plain');
    setDraggedTaskId(null);
    setDragOverCol(null);

    if (!droppedId) return;

    const targetLabel =
      targetCol === 'todo' ? '대기 중' : targetCol === 'in_progress' ? '진행 중' : '완료됨';

    setTasks((prev) => {
      const movingTask = prev.find((t) => t.id === droppedId);
      if (!movingTask) return prev;
      const updated = { ...movingTask, status: targetCol };
      const others = prev.filter((t) => t.id !== droppedId);
      return [updated, ...others];
    });

    showToast(`태스크 상태가 [${targetLabel}] 열로 변경되었습니다`);
  };

  const handleDropOnCard = (
    e: React.DragEvent,
    targetTask: KanbanTask
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedId = draggedTaskId || e.dataTransfer.getData('text/plain');
    setDraggedTaskId(null);
    setDragOverCol(null);

    if (!droppedId || droppedId === targetTask.id) return;

    setTasks((prev) => {
      const movingTask = prev.find((t) => t.id === droppedId);
      if (!movingTask) return prev;
      const withoutMoving = prev.filter((t) => t.id !== droppedId);
      const targetIndex = withoutMoving.findIndex((t) => t.id === targetTask.id);
      const updatedMoving: KanbanTask = { ...movingTask, status: targetTask.status };
      const nextList = [...withoutMoving];
      nextList.splice(targetIndex, 0, updatedMoving);
      return nextList;
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const nextNum = 101 + tasks.length;
    const assigneeName = newTaskAssignee.trim() || '한정호';
    const created: KanbanTask = {
      id: `k_${Date.now()}`,
      ticketKey: `GRM-${nextNum}`,
      title: newTaskTitle.trim(),
      description:
        newTaskDesc.trim() || 'PRD 및 ERD 변경사항으로부터 도출된 스프린트 구현 작업 단위입니다.',
      priority: newTaskPriority,
      assignee: {
        name: assigneeName,
        initials: assigneeName.slice(0, 2).toUpperCase(),
        color: 'bg-accent',
        role: newTaskRole.trim() || 'Fullstack'
      },
      deadline: newTaskDeadline.trim() || 'D-2',
      storyPoints: Number(newTaskPoints) || 3,
      reqRef: newTaskReqRef.trim() || 'REQ-STORE-02',
      category: 'Backend',
      status: 'todo'
    };
    setTasks((prev) => [created, ...prev]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setIsAddingTask(false);
    showToast(`새 작업(${created.ticketKey})이 등록되었습니다`);
  };

  const handleUpdateTask = (taskId: string, patch: Partial<KanbanTask>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (editingTaskId === taskId) setEditingTaskId(null);
    showToast('작업 티켓이 삭제되었습니다');
  };

  const handleExportCsv = () => {
    const headers = ['티켓번호', '상태', '우선순위', '제목', '상세설명', '요구사항ID', '담당자', '직군', '스토리포인트', '마감일'];
    const rows = tasks.map((t) => [
      t.ticketKey,
      t.status,
      t.priority,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.reqRef,
      t.assignee.name,
      t.assignee.role,
      String(t.storyPoints),
      t.deadline
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff', csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '06_WBS_SPRINT_BACKLOG.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('WBS 백로그 CSV 파일 다운로드가 시작되었습니다');
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterMode === 'p0') return t.priority === 'P0';
    if (filterMode === 'mine') return t.assignee.name === '한정호';
    return true;
  });

  const columns: {
    key: 'todo' | 'in_progress' | 'done';
    label: string;
    icon: React.ElementType;
  }[] = [
    { key: 'todo', label: '대기 중 (To-Do)', icon: Circle },
    { key: 'in_progress', label: '진행 중 (In Progress)', icon: Clock },
    { key: 'done', label: '완료됨', icon: CheckCircle2 }
  ];

  return (
    <div className="@container relative flex-1 flex flex-col h-full bg-paper overflow-hidden select-none">
      {/* Floating Non-Layout-Shifting Toast */}
      {toastMessage && (
        <div
          role="status"
          className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-paper px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 whitespace-nowrap"
        >
          <Check className="w-3.5 h-3.5 text-ok shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Single-Row Kanban Top Header */}
      <div className="h-12 px-3 @xl:px-4 bg-surface border-b border-line flex items-center justify-between gap-2 overflow-x-auto shrink-0">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 text-xs">
            <Kanban className="w-3.5 h-3.5 text-muted" />
            <span className="font-semibold text-ink whitespace-nowrap">WBS 스프린트 보드</span>
            <span className="text-muted hidden @3xl:inline whitespace-nowrap">
              (카드를 드래그하여 상태 변경)
            </span>
          </div>

          {/* Quick Filter Segmented Control */}
          <div className="flex items-center gap-0.5 bg-well p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filterMode === 'all' ? 'bg-surface text-ink font-medium' : 'text-muted hover:text-ink'
              }`}
            >
              전체 ({tasks.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('p0')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filterMode === 'p0' ? 'bg-surface text-ink font-medium' : 'text-muted hover:text-ink'
              }`}
            >
              P0 필수
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('mine')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filterMode === 'mine' ? 'bg-surface text-ink font-medium' : 'text-muted hover:text-ink'
              }`}
            >
              내 작업
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="hidden @2xl:inline text-xs text-muted whitespace-nowrap">
            완료율{' '}
            {tasks.length
              ? Math.round((tasks.filter((t) => t.status === 'done').length / tasks.length) * 100)
              : 0}
            %
          </span>

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-2.5 py-1.5 rounded-lg bg-well hover:bg-control text-ink text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-muted" />
            <span className="hidden @xl:inline">CSV 내보내기</span>
            <span className="@xl:hidden">CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="px-2.5 py-1.5 rounded-lg bg-well hover:bg-control text-ink text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>작업 추가</span>
          </button>

          {onConfirmStep && (
            isConfirmed ? (
              <button
                type="button"
                onClick={() => onConfirmStep('step6')}
                className="group bg-ok-soft text-ok border border-ok/30 hover:bg-danger-soft hover:text-danger hover:border-danger/30 text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5"
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
                onClick={() => onConfirmStep('step6')}
                className="px-3 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper text-xs font-medium flex items-center gap-1.5 transition-opacity cursor-pointer whitespace-nowrap"
                title="현재 단계의 산출물을 확정합니다"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>단계 확정</span>
              </button>
            )
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

      {/* Task Creation Modal */}
      {isAddingTask && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="kanban-modal-title"
          className="fixed inset-0 z-50 bg-overlay flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddingTask(false);
          }}
        >
          <div className="bg-surface border border-line rounded-2xl shadow-floating max-w-lg w-full overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-5 py-4 bg-well/70 border-b border-line flex items-center justify-between gap-3">
              <div>
                <h3 id="kanban-modal-title" className="text-sm sm:text-base font-bold text-ink">
                  새 WBS 작업 티켓 등록
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  칸반 스프린트 보드에 새로운 개발/설계 태스크를 등록합니다.
                </p>
              </div>
              <button
                type="button"
                aria-label="모달 닫기"
                onClick={() => setIsAddingTask(false)}
                className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateTask} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-ink block">
                  작업 제목 <span className="text-danger">*</span>
                </label>
                <input
                  id="kanban-new-task-input"
                  aria-label="작업 제목 입력"
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="예: 마감 할인 품목 낙관적 락 재고 차감 로직 구현"
                  className="w-full bg-well border border-line rounded-lg px-3 py-2 text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink/40"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink block">구현 상세 내용 및 완료 조건</label>
                <textarea
                  aria-label="작업 상세 설명 입력"
                  rows={3}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="구현할 세부 요구사항 또는 완료 조건(DoD)을 작성하세요..."
                  className="w-full bg-well border border-line rounded-lg p-3 text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink/40 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-ink block">우선순위</label>
                  <select
                    aria-label="우선순위 선택"
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as 'P0' | 'P1' | 'P2')}
                    className="w-full bg-well border border-line rounded-lg px-3 py-2 text-xs text-ink font-mono focus:outline-none focus:border-ink/40"
                  >
                    <option value="P0">P0 필수 (핵심 기능)</option>
                    <option value="P1">P1 권장 (주요 개선)</option>
                    <option value="P2">P2 일반 (선택 과업)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-ink block">연결 요구사항 ID</label>
                  <input
                    type="text"
                    aria-label="연결 요구사항 ID 입력"
                    value={newTaskReqRef}
                    onChange={(e) => setNewTaskReqRef(e.target.value)}
                    placeholder="REQ-STORE-02"
                    className="w-full bg-well border border-line rounded-lg px-3 py-2 text-xs font-mono text-ink placeholder:text-muted focus:outline-none focus:border-ink/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] text-muted block">담당자</label>
                  <input
                    type="text"
                    aria-label="담당자 이름"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    placeholder="한정호"
                    className="w-full bg-well border border-line rounded-lg px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-ink/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted block">역할/직군</label>
                  <input
                    type="text"
                    aria-label="담당 직군"
                    value={newTaskRole}
                    onChange={(e) => setNewTaskRole(e.target.value)}
                    placeholder="Fullstack"
                    className="w-full bg-well border border-line rounded-lg px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-ink/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted block">스토리 포인트</label>
                  <input
                    type="number"
                    aria-label="스토리 포인트"
                    min={1}
                    max={21}
                    value={newTaskPoints}
                    onChange={(e) => setNewTaskPoints(Number(e.target.value))}
                    className="w-full bg-well border border-line rounded-lg px-2.5 py-1.5 text-xs font-mono text-ink focus:outline-none focus:border-ink/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted block">목표 기한</label>
                  <input
                    type="text"
                    aria-label="마감 기한"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    placeholder="D-2"
                    className="w-full bg-well border border-line rounded-lg px-2.5 py-1.5 text-xs font-mono text-ink focus:outline-none focus:border-ink/40"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-well hover:bg-control text-muted hover:text-ink transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper font-medium transition-opacity cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>태스크 등록</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Responsive 3-Column Kanban Body with Drag & Drop (Container-Query Adaptive) */}
      <div className="flex-1 overflow-y-auto p-4 @xl:p-6">
        <div className="grid grid-cols-1 @3xl:grid-cols-12 gap-5 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.key);
            const ColIcon = col.icon;
            const isDragOver = dragOverCol === col.key;

            return (
              <div
                key={col.key}
                onDragOver={(e) => handleDragOverColumn(e, col.key)}
                onDragLeave={() => {
                  if (dragOverCol === col.key) setDragOverCol(null);
                }}
                onDrop={(e) => handleDropOnColumn(e, col.key)}
                className={`@3xl:col-span-4 flex flex-col space-y-2.5 min-h-[260px] rounded-xl p-2 transition-colors ${
                  isDragOver ? 'bg-accent-soft border border-dashed border-accent-line' : ''
                }`}
              >
                {/* Clean Column Header */}
                <div className="px-1 py-1.5 border-b border-line flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ColIcon
                      className={`w-3.5 h-3.5 ${
                        col.key === 'done'
                          ? 'text-ok'
                          : col.key === 'in_progress'
                          ? 'text-accent'
                          : 'text-muted'
                      }`}
                    />
                    <span className="font-semibold text-ink">{col.label}</span>
                    <span className="font-mono text-muted">{colTasks.length}</span>
                  </div>
                  <span className="text-muted">
                    {colTasks.reduce((acc, cur) => acc + cur.storyPoints, 0)} pt
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-2.5">
                  {colTasks.map((task) => {
                    const isEditing = editingTaskId === task.id;
                    const isBeingDragged = draggedTaskId === task.id;

                    return (
                      <div
                        key={task.id}
                        draggable={!isEditing}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropOnCard(e, task)}
                        className={`rounded-xl bg-surface border p-4 space-y-2.5 transition-colors ${
                          isBeingDragged
                            ? 'opacity-40 border-accent'
                            : isEditing
                            ? 'border-accent'
                            : 'border-line hover:border-line-strong cursor-grab active:cursor-grabbing'
                        }`}
                      >
                        {isEditing ? (
                          /* ==================================================== */
                          /* FULL INLINE TASK EDITOR */
                          /* ==================================================== */
                          <div className="space-y-2.5 text-xs select-text">
                            <div className="flex items-center justify-between border-b border-line pb-1.5">
                              <span className="font-semibold text-ink">작업 상세 편집</span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="px-2 py-0.5 rounded text-danger hover:bg-danger-soft flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>삭제</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingTaskId(null);
                                    showToast(`${task.ticketKey} 수정사항이 반영되었습니다`);
                                  }}
                                  className="px-2.5 py-0.5 rounded bg-ink text-paper font-medium flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>완료</span>
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-1.5">
                              <div>
                                <label className="text-muted block mb-0.5">티켓 ID</label>
                                <input
                                  type="text"
                                  aria-label="티켓 번호 수정"
                                  value={task.ticketKey}
                                  onChange={(e) =>
                                    handleUpdateTask(task.id, { ticketKey: e.target.value })
                                  }
                                  className="w-full bg-well border border-line rounded px-2 py-1 font-mono text-xs text-ink"
                                />
                              </div>
                              <div>
                                <label className="text-muted block mb-0.5">요구사항 ID</label>
                                <input
                                  type="text"
                                  aria-label="요구사항 ID 수정"
                                  value={task.reqRef}
                                  onChange={(e) =>
                                    handleUpdateTask(task.id, { reqRef: e.target.value })
                                  }
                                  className="w-full bg-well border border-line rounded px-2 py-1 font-mono text-xs text-ink"
                                />
                              </div>
                              <div>
                                <label className="text-muted block mb-0.5">우선순위</label>
                                <select
                                  aria-label="우선순위 수정"
                                  value={task.priority}
                                  onChange={(e) =>
                                    handleUpdateTask(task.id, {
                                      priority: e.target.value as 'P0' | 'P1' | 'P2'
                                    })
                                  }
                                  className="w-full bg-well border border-line rounded px-1.5 py-1 font-mono text-xs text-ink"
                                >
                                  <option value="P0">P0</option>
                                  <option value="P1">P1</option>
                                  <option value="P2">P2</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="text-muted block mb-0.5">작업 제목</label>
                              <input
                                type="text"
                                aria-label="작업 제목 수정"
                                value={task.title}
                                onChange={(e) =>
                                  handleUpdateTask(task.id, { title: e.target.value })
                                }
                                className="w-full bg-well border border-line rounded px-2.5 py-1.5 text-xs font-semibold text-ink"
                              />
                            </div>

                            <div>
                              <label className="text-muted block mb-0.5">상세 설명</label>
                              <textarea
                                aria-label="작업 상세 설명 수정"
                                rows={2}
                                value={task.description}
                                onChange={(e) =>
                                  handleUpdateTask(task.id, { description: e.target.value })
                                }
                                className="w-full bg-well border border-line rounded p-2 text-xs text-ink leading-relaxed"
                              />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                              <div>
                                <label className="text-muted block mb-0.5">담당자</label>
                                <input
                                  type="text"
                                  aria-label="담당자 이름 수정"
                                  value={task.assignee.name}
                                  onChange={(e) =>
                                    handleUpdateTask(task.id, {
                                      assignee: {
                                        ...task.assignee,
                                        name: e.target.value,
                                        initials: e.target.value.slice(0, 2).toUpperCase()
                                      }
                                    })
                                  }
                                  className="w-full bg-well border border-line rounded px-2 py-1 text-xs text-ink"
                                />
                              </div>
                              <div>
                                <label className="text-muted block mb-0.5">직군</label>
                                <input
                                  type="text"
                                  aria-label="담당 직군 수정"
                                  value={task.assignee.role}
                                  onChange={(e) =>
                                    handleUpdateTask(task.id, {
                                      assignee: { ...task.assignee, role: e.target.value }
                                    })
                                  }
                                  className="w-full bg-well border border-line rounded px-2 py-1 text-xs text-ink"
                                />
                              </div>
                              <div>
                                <label className="text-muted block mb-0.5">포인트(SP)</label>
                                <input
                                  type="number"
                                  aria-label="스토리 포인트 수정"
                                  min={1}
                                  max={21}
                                  value={task.storyPoints}
                                  onChange={(e) =>
                                    handleUpdateTask(task.id, {
                                      storyPoints: Number(e.target.value) || 1
                                    })
                                  }
                                  className="w-full bg-well border border-line rounded px-2 py-1 font-mono text-xs text-ink"
                                />
                              </div>
                              <div>
                                <label className="text-muted block mb-0.5">마감일</label>
                                <input
                                  type="text"
                                  aria-label="마감 기한 수정"
                                  value={task.deadline}
                                  onChange={(e) =>
                                    handleUpdateTask(task.id, { deadline: e.target.value })
                                  }
                                  className="w-full bg-well border border-line rounded px-2 py-1 font-mono text-xs text-ink"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* ==================================================== */
                          /* STANDARD DRAGGABLE TASK CARD VIEW */
                          /* ==================================================== */
                          <>
                            {/* Top Meta Row: Drag Handle, Ticket ID, Req Ref, Edit & Priority */}
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-1.5 text-muted font-mono">
                                <GripVertical className="w-3.5 h-3.5 text-subtle shrink-0" />
                                <span className="font-medium text-ink-2">{task.ticketKey}</span>
                                <span>·</span>
                                <span>{task.reqRef}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-mono font-semibold ${
                                    task.priority === 'P0'
                                      ? 'text-danger'
                                      : task.priority === 'P1'
                                      ? 'text-warn'
                                      : 'text-muted'
                                  }`}
                                >
                                  {task.priority}
                                </span>
                                <button
                                  type="button"
                                  title="작업 편집"
                                  onClick={() => setEditingTaskId(task.id)}
                                  className="p-1 rounded hover:bg-well text-muted hover:text-ink cursor-pointer"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Title & Description (Click to edit) */}
                            <div
                              onClick={() => setEditingTaskId(task.id)}
                              className="cursor-pointer group"
                            >
                              <h3
                                className={`text-xs sm:text-sm font-semibold leading-snug group-hover:text-accent transition-colors ${
                                  task.status === 'done' ? 'text-muted line-through' : 'text-ink'
                                }`}
                              >
                                {task.title}
                              </h3>
                              <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">
                                {task.description}
                              </p>
                            </div>

                            {/* Bottom Row: Assignee, Points, Deadline & Status Move Controls */}
                            <div className="pt-2.5 border-t border-line flex items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-1.5 text-muted min-w-0">
                                <span className="text-ink font-medium truncate">
                                  {task.assignee.name}
                                </span>
                                <span>·</span>
                                <span>
                                  <code>{task.storyPoints}</code>pt
                                </span>
                                <span>·</span>
                                <span className="font-mono">
                                  {task.status === 'done' ? '완료' : task.deadline}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {task.status !== 'todo' && (
                                  <button
                                    type="button"
                                    onClick={() => moveTask(task.id, 'prev')}
                                    className="px-2 py-1 rounded-md bg-well hover:bg-control text-ink-2 flex items-center gap-1 transition-colors cursor-pointer"
                                    title="이전 단계로 이동"
                                  >
                                    <ArrowLeft className="w-3 h-3" />
                                  </button>
                                )}
                                {task.status !== 'done' && (
                                  <button
                                    type="button"
                                    onClick={() => moveTask(task.id, 'next')}
                                    className="px-2.5 py-1 rounded-md bg-well hover:bg-control text-ink font-medium flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                                  >
                                    <span>{task.status === 'todo' ? '시작' : '완료'}</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}

                  {colTasks.length === 0 && (
                    <div className="py-8 border border-dashed border-line rounded-xl text-center text-xs text-muted">
                      카드를 이 열로 드래그하여 놓으세요
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
