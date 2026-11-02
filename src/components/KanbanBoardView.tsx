import React, { useState } from 'react';
import {
  Kanban,
  Plus,
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
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

  // Selected task for detailed modal
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);

  // New Task Form States
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'P0' | 'P1' | 'P2'>('P0');
  const [newTaskAssignee, setNewTaskAssignee] = useState('한정호');
  const [newTaskRole, setNewTaskRole] = useState('Fullstack');
  const [newTaskReqRef, setNewTaskReqRef] = useState('REQ-STORE-02');
  const [newTaskPoints, setNewTaskPoints] = useState<number>(3);
  const [newTaskDeadline] = useState('D-2');

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

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const created: KanbanTask = {
      id: `task_${Date.now()}`,
      ticketKey: `GRM-${Math.floor(100 + Math.random() * 900)}`,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || '신규 등록된 개발 태스크입니다.',
      assignee: {
        name: newTaskAssignee,
        initials: newTaskAssignee.slice(0, 2),
        color: 'bg-accent',
        role: newTaskRole
      },
      category: 'Frontend',
      status: 'todo',
      priority: newTaskPriority,
      reqRef: newTaskReqRef,
      storyPoints: newTaskPoints,
      deadline: newTaskDeadline,
      aiPromptSnippet: `// 🤖 Cursor / Copilot AI 개발 지시 프롬프트 (${newTaskTitle.trim()})
// [참조 맥락: ${newTaskReqRef} + 09 ERD + 11 컨벤션]
Implement feature for '${newTaskTitle.trim()}':
1. Ensure full TypeScript strict compliance and RFC 7807 error format.
2. Follow repository Git-flow conventions and branch naming rules.`
    };

    setTasks((prev) => [created, ...prev]);
    setIsAddingTask(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
    showToast(`"${created.title}" 태스크가 WBS 보드에 추가되었습니다.`);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (selectedTask?.id === id) setSelectedTask(null);
    showToast('태스크가 삭제되었습니다.');
  };

  const handleExportCsv = () => {
    const headers = 'ID,Ticket,Title,Assignee,Role,Status,Priority,ReqRef,Points,Deadline\n';
    const rows = tasks
      .map(
        (t) =>
          `"${t.id}","${t.ticketKey}","${t.title}","${t.assignee.name}","${t.assignee.role}","${t.status}","${t.priority}","${t.reqRef}",${t.storyPoints},"${t.deadline}"`
      )
      .join('\n');
    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `groom_wbs_tasks_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('WBS 태스크 CSV 파일이 다운로드되었습니다');
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterMode === 'p0') return t.priority === 'P0';
    if (filterMode === 'mine') return t.assignee.name.includes('한정호') || t.assignee.name.includes('나');
    return true;
  });

  const columns = [
    {
      key: 'todo' as const,
      label: '대기 중 (To-Do)',
      badgeBg: 'bg-muted/15 text-muted',
      tasks: filteredTasks.filter((t) => t.status === 'todo')
    },
    {
      key: 'in_progress' as const,
      label: '진행 중 (In Progress)',
      badgeBg: 'bg-accent/15 text-accent',
      tasks: filteredTasks.filter((t) => t.status === 'in_progress')
    },
    {
      key: 'done' as const,
      label: '완료됨 (Done)',
      badgeBg: 'bg-emerald-500/15 text-emerald-400',
      tasks: filteredTasks.filter((t) => t.status === 'done')
    }
  ];

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
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
            <Kanban className="w-4 h-4 text-violet-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">12. WBS & Kanban</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-well text-muted border border-line">
                총 {tasks.length}개 태스크
              </span>
            </div>
            <h2 className="text-sm font-bold text-ink truncate">WBS 및 일정 칸반 보드</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Filter Pills */}
          <div className="flex items-center bg-well border border-line rounded-lg p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filterMode === 'all' ? 'bg-surface text-ink font-semibold shadow-xs' : 'text-muted'
              }`}
            >
              전체
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('p0')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filterMode === 'p0' ? 'bg-surface text-ink font-semibold shadow-xs' : 'text-muted'
              }`}
            >
              P0 필수
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('mine')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filterMode === 'mine' ? 'bg-surface text-ink font-semibold shadow-xs' : 'text-muted'
              }`}
            >
              내 작업
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="p-1.5 rounded-lg bg-well border border-line text-muted hover:text-ink transition-colors cursor-pointer"
            title="CSV 내보내기"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsAddingTask(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>태스크 추가</span>
          </button>

          {onConfirmStep && (
            <button
              type="button"
              onClick={() => onConfirmStep('step13')}
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

      {/* Main Kanban Columns Area */}
      <div className="flex-1 overflow-x-auto p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 h-full min-w-[760px]">
          {columns.map((col) => {
            const isOver = dragOverCol === col.key;
            return (
              <div
                key={col.key}
                onDragOver={(e) => handleDragOverColumn(e, col.key)}
                onDrop={(e) => handleDropOnColumn(e, col.key)}
                className={`flex flex-col h-full rounded-2xl bg-surface border transition-colors ${
                  isOver ? 'border-accent bg-accent-soft/30' : 'border-line'
                }`}
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-line flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink">{col.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.badgeBg}`}>
                      {col.tasks.length}
                    </span>
                  </div>
                </div>

                {/* Task Cards Column Body */}
                <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                  {col.tasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedTask(task)}
                      className="group p-3.5 rounded-xl bg-well/70 border border-line hover:border-accent hover:shadow-md transition-colors cursor-pointer space-y-2.5 relative"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-accent bg-accent-soft px-1.5 py-0.2 rounded border border-accent/20">
                            {task.ticketKey}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              task.priority === 'P0'
                                ? 'bg-danger/10 text-danger border border-danger/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted font-mono">{task.deadline}</span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-bold text-ink group-hover:text-accent transition-colors leading-snug">
                        {task.title}
                      </h4>

                      {/* Description Preview */}
                      <p className="text-[11px] text-muted line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>

                      {/* Footer Info & AI Prompt Indicator */}
                      <div className="pt-2 border-t border-line/50 flex items-center justify-between text-[11px] text-muted">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-ink-2">{task.assignee.name}</span>
                          <span>·</span>
                          <span className="font-mono">{task.storyPoints}pt</span>
                        </div>

                        <span className="font-mono text-[10px] text-accent font-medium">
                          {task.reqRef}
                        </span>
                      </div>

                      {/* Direction Quick Move Buttons */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2 flex items-center gap-1 bg-surface border border-line rounded-lg p-0.5 shadow-sm">
                        {col.key !== 'todo' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveTask(task.id, 'prev');
                            }}
                            className="p-1 hover:bg-well text-muted hover:text-ink rounded cursor-pointer"
                            title="이전 열로 이동"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        )}
                        {col.key !== 'done' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveTask(task.id, 'next');
                            }}
                            className="p-1 hover:bg-well text-muted hover:text-ink rounded cursor-pointer"
                            title="다음 열로 이동"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {col.tasks.length === 0 && (
                    <div className="py-12 text-center text-muted text-xs border border-dashed border-line rounded-xl">
                      작업이 없습니다
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Detail Modal with AI Coding Instruction Tab */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface border border-line-strong rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-lg overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-line flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-accent bg-accent-soft px-2 py-0.5 rounded border border-accent/20">
                  {selectedTask.ticketKey}
                </span>
                <h3 className="text-sm font-bold text-ink truncate">{selectedTask.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="p-1 text-muted hover:text-ink rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div>
                <label className="text-muted font-medium block mb-1">태스크 제목</label>
                <input
                  type="text"
                  value={selectedTask.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setSelectedTask((prev) => (prev ? { ...prev, title } : null));
                    setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? { ...t, title } : t)));
                  }}
                  className="w-full px-3 py-2 bg-well border border-line rounded-lg text-ink font-semibold focus:border-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-well border border-line">
                  <label className="text-[10px] text-muted block mb-1">진행 상태</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => {
                      const status = e.target.value as 'todo' | 'in_progress' | 'done';
                      setSelectedTask((prev) => (prev ? { ...prev, status } : null));
                      setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? { ...t, status } : t)));
                    }}
                    className="w-full bg-surface border border-line rounded-md px-2 py-1 text-xs text-ink font-semibold outline-none"
                  >
                    <option value="todo">대기 중 (To-Do)</option>
                    <option value="in_progress">진행 중 (In Progress)</option>
                    <option value="done">완료됨 (Done)</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-well border border-line">
                  <label className="text-[10px] text-muted block mb-1">우선순위</label>
                  <select
                    value={selectedTask.priority}
                    onChange={(e) => {
                      const priority = e.target.value as 'P0' | 'P1' | 'P2';
                      setSelectedTask((prev) => (prev ? { ...prev, priority } : null));
                      setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? { ...t, priority } : t)));
                    }}
                    className="w-full bg-surface border border-line rounded-md px-2 py-1 text-xs text-ink font-semibold outline-none"
                  >
                    <option value="P0">P0 (최우선)</option>
                    <option value="P1">P1 (중요)</option>
                    <option value="P2">P2 (선택)</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-well border border-line">
                  <label className="text-[10px] text-muted block mb-1">연결 요구사항 ID</label>
                  <input
                    type="text"
                    value={selectedTask.reqRef}
                    onChange={(e) => {
                      const reqRef = e.target.value;
                      setSelectedTask((prev) => (prev ? { ...prev, reqRef } : null));
                      setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? { ...t, reqRef } : t)));
                    }}
                    className="w-full bg-surface border border-line rounded-md px-2 py-1 font-mono text-xs text-accent font-semibold outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-well border border-line">
                  <label className="text-[10px] text-muted block mb-1">추정 공수 (Story Points)</label>
                  <input
                    type="number"
                    min={1}
                    max={13}
                    value={selectedTask.storyPoints}
                    onChange={(e) => {
                      const storyPoints = Number(e.target.value) || 1;
                      setSelectedTask((prev) => (prev ? { ...prev, storyPoints } : null));
                      setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? { ...t, storyPoints } : t)));
                    }}
                    className="w-full bg-surface border border-line rounded-md px-2 py-1 font-mono text-xs text-ink font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-muted font-medium block mb-1">담당자</label>
                  <input
                    type="text"
                    value={selectedTask.assignee.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setSelectedTask((prev) =>
                        prev
                          ? {
                              ...prev,
                              assignee: { ...prev.assignee, name, initials: name.slice(0, 2).toUpperCase() }
                            }
                          : null
                      );
                      setTasks((prev) =>
                        prev.map((t) =>
                          t.id === selectedTask.id
                            ? { ...t, assignee: { ...t.assignee, name, initials: name.slice(0, 2).toUpperCase() } }
                            : t
                        )
                      );
                    }}
                    className="w-full px-3 py-1.5 bg-well border border-line rounded-lg text-ink outline-none"
                  />
                </div>

                <div>
                  <label className="text-muted font-medium block mb-1">역할 (Role)</label>
                  <input
                    type="text"
                    value={selectedTask.assignee.role}
                    onChange={(e) => {
                      const role = e.target.value;
                      setSelectedTask((prev) =>
                        prev ? { ...prev, assignee: { ...prev.assignee, role } } : null
                      );
                      setTasks((prev) =>
                        prev.map((t) => (t.id === selectedTask.id ? { ...t, assignee: { ...t.assignee, role } } : t))
                      );
                    }}
                    className="w-full px-3 py-1.5 bg-well border border-line rounded-lg text-ink outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-muted font-medium block mb-1">상세 작업 내용 및 인수 조건</label>
                <textarea
                  rows={4}
                  value={selectedTask.description}
                  onChange={(e) => {
                    const description = e.target.value;
                    setSelectedTask((prev) => (prev ? { ...prev, description } : null));
                    setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? { ...t, description } : t)));
                  }}
                  className="w-full p-3.5 rounded-xl bg-well border border-line text-ink-2 leading-relaxed focus:border-accent outline-none resize-y"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-line flex items-center justify-between gap-2 bg-well/40 shrink-0">
              <button
                type="button"
                onClick={() => handleDeleteTask(selectedTask.id)}
                className="text-xs text-danger hover:underline cursor-pointer"
              >
                태스크 삭제
              </button>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="px-4 py-1.5 rounded-lg bg-ink text-paper font-medium text-xs cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-surface border border-line-strong rounded-2xl max-w-md w-full p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-sm font-bold text-ink">새 WBS 개발 태스크 등록</h3>
              <button
                type="button"
                onClick={() => setIsAddingTask(false)}
                className="p-1 text-muted hover:text-ink rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-muted font-medium mb-1">태스크 제목</label>
                <input
                  type="text"
                  required
                  placeholder="예: 실시간 동시 재고 차감 및 낙관적 락 구현"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-well border border-line rounded-lg text-ink focus:border-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted font-medium mb-1">담당자</label>
                  <input
                    type="text"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-well border border-line rounded-lg text-ink outline-none"
                  />
                </div>
                <div>
                  <label className="block text-muted font-medium mb-1">역할 (Role)</label>
                  <input
                    type="text"
                    value={newTaskRole}
                    onChange={(e) => setNewTaskRole(e.target.value)}
                    className="w-full px-3 py-2 bg-well border border-line rounded-lg text-ink outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-muted font-medium mb-1">우선순위</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-well border border-line rounded-lg text-ink outline-none"
                  >
                    <option value="P0">P0 (필수)</option>
                    <option value="P1">P1 (중요)</option>
                    <option value="P2">P2 (선택)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-muted font-medium mb-1">요구사항 ID</label>
                  <input
                    type="text"
                    value={newTaskReqRef}
                    onChange={(e) => setNewTaskReqRef(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-well border border-line rounded-lg text-ink font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-muted font-medium mb-1">추정 공수 (SP)</label>
                  <input
                    type="number"
                    min={1}
                    max={13}
                    value={newTaskPoints}
                    onChange={(e) => setNewTaskPoints(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-well border border-line rounded-lg text-ink outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted font-medium mb-1">설명 및 세부 구현 내용</label>
                <textarea
                  rows={2.5}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-well border border-line rounded-lg text-ink outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="px-3 py-1.5 rounded-lg bg-well text-muted hover:text-ink text-xs font-medium cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold cursor-pointer"
                >
                  태스크 생성
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
