import React, { useState } from 'react';
import {
  Activity,
  Trash2,
  Download,
  Edit3,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Copy,
  GitCommit,
  History,
  Layers,
  Plus,
  RotateCcw,
  Wrench,
  X,
  PanelRightClose
} from 'lucide-react';
import type {
  BacklogIdeaItem,
  DeploymentRecord,
  StepId,
  TroubleshootingItem
} from '../mockData';

interface OperationsArchiveViewProps {
  deployments: DeploymentRecord[];
  setDeployments: React.Dispatch<React.SetStateAction<DeploymentRecord[]>>;
  troubleshootings: TroubleshootingItem[];
  setTroubleshootings: React.Dispatch<React.SetStateAction<TroubleshootingItem[]>>;
  backlogIdeas: BacklogIdeaItem[];
  setBacklogIdeas: React.Dispatch<React.SetStateAction<BacklogIdeaItem[]>>;
  onSendBacklogToWbs: (idea: BacklogIdeaItem) => string;
  onNavigateStep: (step: StepId) => void;
  onConfirmStep: (step: StepId) => void;
  onCollapsePane?: () => void;
  isConfirmed?: boolean;
}

export const OperationsArchiveView: React.FC<OperationsArchiveViewProps> = ({
  deployments,
  setDeployments,
  troubleshootings,
  setTroubleshootings,
  backlogIdeas,
  setBacklogIdeas,
  onSendBacklogToWbs,
  onNavigateStep,
  onConfirmStep,
  onCollapsePane,
  isConfirmed = false
}) => {
  // Default active tab is Tab 1: 배포 이력 & 릴리즈 노트
  const [subTab, setSubTab] = useState<'deployments' | 'troubleshooting' | 'backlog'>(
    'deployments'
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Tab 1: Deployment states
  const [isAddingDeploy, setIsAddingDeploy] = useState(false);
  const [openChecklistId, setOpenChecklistId] = useState<string | null>(null);
  const [openRollbackId, setOpenRollbackId] = useState<string | null>(null);
  const [newDepVersion, setNewDepVersion] = useState('v1.5.1 (Hotfix)');
  const [newDepTitle, setNewDepTitle] = useState('SSE 재연결 백오프 정책 및 알림 지연 개선');
  const [newDepCommit, setNewDepCommit] = useState('fix/sse-retry (#9c4e1a)');
  const [newDepNotes, setNewDepNotes] = useState(
    '모바일 네트워크 전환 시 SSE 스트림 자동 재구독 로직 보강\n불필요한 Heartbeat 주기 최적화 (15s -> 30s)'
  );

  // Tab 2: Troubleshooting states
  const [versionFilter, setVersionFilter] = useState<'ALL' | 'v1.0 MVP' | 'v1.5 성능 개선'>('ALL');
  const [isAddingTs, setIsAddingTs] = useState(false);
  const [collapsedTsIds, setCollapsedTsIds] = useState<Record<string, boolean>>({});
  const [newTsTitle, setNewTsTitle] = useState('');
  const [newTsVersionTrack, setNewTsVersionTrack] = useState<'v1.0 MVP' | 'v1.5 성능 개선'>(
    'v1.5 성능 개선'
  );
  const [newTsResolvedVer, setNewTsResolvedVer] = useState('v1.5.0');
  const [newTsCause, setNewTsCause] = useState('');
  const [newTsResolution, setNewTsResolution] = useState('');
  const [newTsBefore, setNewTsBefore] = useState('응답 지연 240ms');
  const [newTsAfter, setNewTsAfter] = useState('응답 지연 28ms');

  // Tab 3: Backlog states
  const [isAddingBacklog, setIsAddingBacklog] = useState(false);
  const [newBgTitle, setNewBgTitle] = useState('');
  const [newBgDesc, setNewBgDesc] = useState('');
  const [newBgRelease, setNewBgRelease] = useState('v2.0 Roadmap');
  const [newBgTag, setNewBgTag] = useState('Feature');
  const [newBgPriority, setNewBgPriority] = useState<'P0' | 'P1' | 'P2'>('P1');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2400);
  };

  // Extract latest semantic version tag for Current Prod badge
  const latestProdVersion =
    deployments[0]?.version.split(' ')[0] || 'v1.5.0';

  const handleCreateDeployment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepVersion.trim()) return;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const created: DeploymentRecord = {
      id: `dep_${Date.now()}`,
      version: newDepVersion.trim(),
      releaseTitle: newDepTitle.trim() || '신규 운영 배포 릴리즈',
      deployedAt: dateStr,
      status: 'DEPLOYED (Success)',
      commitRef: newDepCommit.trim() || 'release/main (#a1b2c3)',
      highlights: newDepNotes
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      rollbackTarget: deployments[0]?.version.split(' ')[0] || 'v1.5.0',
      rollbackCommand: 'kubectl rollout undo deployment/groom-api-server -n prod',
      rollbackNote: '하위 호환성이 유지된 배포로 컨테이너 이미지 즉시 롤백이 가능합니다.',
      checklist: [
        { id: `ck_${Date.now()}_1`, label: 'CI 단위 및 통합 테스트 전수 통과', checked: true },
        { id: `ck_${Date.now()}_2`, label: '무중단 롤링 업데이트 헬스체크 200 OK 확인', checked: true },
        { id: `ck_${Date.now()}_3`, label: '배포 직후 에러 로그 이상 징후 없음 확인', checked: true }
      ]
    };

    setDeployments((prev) => [created, ...prev]);
    setIsAddingDeploy(false);
    showToast(`${created.version} 배포 이력이 등록되었습니다`);
  };

  const handleToggleChecklistItem = (depId: string, ckId: string) => {
    setDeployments((prev) =>
      prev.map((dep) =>
        dep.id === depId
          ? {
              ...dep,
              checklist: dep.checklist.map((c) =>
                c.id === ckId ? { ...c, checked: !c.checked } : c
              )
            }
          : dep
      )
    );
  };

  const handleCreateTroubleshooting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTsTitle.trim()) return;
    const nextNum = troubleshootings.length + 1;
    const created: TroubleshootingItem = {
      id: `ts_${Date.now()}`,
      issueNumber: nextNum,
      title: newTsTitle.trim(),
      versionTrack: newTsVersionTrack,
      resolvedInVersion: newTsResolvedVer.trim() || 'v1.5.0',
      severity: 'High',
      causeAnalysis:
        newTsCause.trim() || '운영 트래픽 집중 구간에서 리소스 경합으로 인한 응답 지연이 관측되었습니다.',
      resolutionProcess:
        newTsResolution.trim() || '인덱스 튜닝 및 비동기 캐시 전략을 적용해 병목 구간을 해소했습니다.',
      beforeMetric: newTsBefore.trim() || '240ms',
      afterMetric: newTsAfter.trim() || '28ms',
      improvementSummary: `${newTsBefore.trim()} -> ${newTsAfter.trim()} 개선 완료`
    };
    setTroubleshootings((prev) => [created, ...prev]);
    setNewTsTitle('');
    setNewTsCause('');
    setNewTsResolution('');
    setIsAddingTs(false);
    showToast(`이슈 #${nextNum} 트러블슈팅 사례가 아카이빙되었습니다`);
  };

  const handleCreateBacklog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBgTitle.trim()) return;
    const created: BacklogIdeaItem = {
      id: `bg_${Date.now()}`,
      title: newBgTitle.trim(),
      targetRelease: newBgRelease,
      domainTag: newBgTag,
      description:
        newBgDesc.trim() || '운영 피드백으로부터 수집된 차기 고도화 백로그 항목입니다.',
      priority: newBgPriority
    };
    setBacklogIdeas((prev) => [created, ...prev]);
    setNewBgTitle('');
    setNewBgDesc('');
    setIsAddingBacklog(false);
    showToast('차기 버전 백로그 항목이 추가되었습니다');
  };

  const handleUpdateDeploy = (id: string, field: keyof DeploymentRecord, val: any) => {
    setDeployments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: val } : d))
    );
  };

  const handleDeleteDeploy = (id: string) => {
    setDeployments((prev) => prev.filter((d) => d.id !== id));
    showToast('배포 이력이 삭제되었습니다');
  };

  const handleUpdateTs = (id: string, field: keyof TroubleshootingItem, val: any) => {
    setTroubleshootings((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: val } : t))
    );
  };

  const handleDeleteTs = (id: string) => {
    setTroubleshootings((prev) => prev.filter((t) => t.id !== id));
    showToast('트러블슈팅 사례가 삭제되었습니다');
  };

  const handleUpdateBacklog = (id: string, field: keyof BacklogIdeaItem, val: any) => {
    setBacklogIdeas((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: val } : b))
    );
  };

  const handleDeleteBacklog = (id: string) => {
    setBacklogIdeas((prev) => prev.filter((b) => b.id !== id));
    showToast('백로그 항목이 삭제되었습니다');
  };

  const handleExportArchive = () => {
    let md = '# 운영 및 트러블슈팅 아카이브 리포트\n\n';
    md += '생성 일시: ' + new Date().toLocaleString('ko-KR') + '\n\n';

    md += '## 1. 릴리즈 및 배포 이력 (' + deployments.length + '건)\n\n';
    deployments.forEach((d) => {
      md += '### ' + d.version + ' (' + d.deployedAt + ') - 상태: ' + d.status + '\n';
      md += '- 릴리즈 요약: ' + d.releaseTitle + '\n';
      md += '- 커밋: ' + d.commitRef + '\n';
      md += '- 롤백 타깃: ' + d.rollbackTarget + '\n\n';
    });

    md += '## 2. 장애 및 트러블슈팅 아카이브 (' + troubleshootings.length + '건)\n\n';
    troubleshootings.forEach((t) => {
      md += '### [' + t.issueNumber + '] ' + t.title + ' (버전: ' + t.resolvedInVersion + ')\n';
      md += '- 근본 원인: ' + t.causeAnalysis + '\n';
      md += '- 조치 내용: ' + t.resolutionProcess + '\n\n';
    });

    md += '## 3. 차기 버전 백로그 아이디어 (' + backlogIdeas.length + '건)\n\n';
    backlogIdeas.forEach((b) => {
      md += '### [' + b.targetRelease + '] ' + b.title + ' (우선순위: ' + b.priority + ')\n';
      md += '- 내용: ' + b.description + '\n\n';
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'OPERATIONS_ARCHIVE_REPORT_' + new Date().toISOString().slice(0, 10) + '.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('운영 아카이브 리포트(.md)가 다운로드되었습니다');
  };

  const filteredTroubleshootings =
    versionFilter === 'ALL'
      ? troubleshootings
      : troubleshootings.filter((t) => t.versionTrack === versionFilter);

  return (
    <div className="@container relative flex-1 flex flex-col h-full bg-paper overflow-hidden">
      {/* Floating Toast */}
      {toastMsg && (
        <div
          role="status"
          className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-paper px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 whitespace-nowrap"
        >
          <Check className="w-3.5 h-3.5 text-ok shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Toolbar with 3 Sub-Tabs (Container-Query Adaptive) */}
      <div className="h-12 px-3 @xl:px-4 bg-surface border-b border-line flex items-center justify-between gap-2 overflow-x-auto shrink-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden @2xl:flex items-center gap-1.5 text-xs">
            <Activity className="w-3.5 h-3.5 text-muted shrink-0" />
            <span className="font-semibold text-ink whitespace-nowrap">
              운영 & 트러블슈팅
            </span>
          </div>

          {/* Required 3 Sub-Tabs */}
          <div className="flex items-center bg-well p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setSubTab('deployments')}
              className={`px-2 @xl:px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                subTab === 'deployments'
                  ? 'bg-surface text-ink font-semibold'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden @xl:inline">배포 이력 & 릴리즈 노트</span>
              <span className="@xl:hidden">배포 이력</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('troubleshooting')}
              className={`px-2 @xl:px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                subTab === 'troubleshooting'
                  ? 'bg-surface text-ink font-semibold'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span className="hidden @xl:inline">트러블슈팅 아카이빙</span>
              <span className="@xl:hidden">트러블슈팅</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('backlog')}
              className={`px-2 @xl:px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                subTab === 'backlog'
                  ? 'bg-surface text-ink font-semibold'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden @xl:inline">차기 버전 백로그 (v2.0+)</span>
              <span className="@xl:hidden">차기 백로그</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleExportArchive}
            className="px-2.5 py-1.5 rounded-lg bg-well hover:bg-control text-ink text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            title="배포 이력, 트러블슈팅, 백로그를 마크다운 리포트로 내보냅니다"
          >
            <Download className="w-3.5 h-3.5 text-muted" />
            <span className="hidden @2xl:inline">보고서 내보내기</span>
            <span className="@2xl:hidden">내보내기</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              isEditMode
                ? 'bg-accent text-accent-ink'
                : 'bg-well hover:bg-control text-ink'
            }`}
            title={isEditMode ? '편집을 완료하고 읽기 모드로 전환' : '운영 데이터 수정 및 신규 등록 모드 전환'}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden @2xl:inline">
              {isEditMode ? '편집 완료' : '아카이브 편집'}
            </span>
            <span className="@2xl:hidden">{isEditMode ? '완료' : '편집'}</span>
          </button>

          

          {isConfirmed ? (
            <button
              type="button"
              onClick={() => onConfirmStep('step8')}
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
              onClick={() => onConfirmStep('step8')}
              className="px-3 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper text-xs font-medium flex items-center gap-1.5 transition-opacity cursor-pointer whitespace-nowrap"
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

      {/* ============================================================== */}
      {/* SUB-TAB 1: 배포 이력 & 릴리즈 노트 (기본 활성 탭) */}
      {/* ============================================================== */}
      {subTab === 'deployments' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-paper">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Top Status & Add Button Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-line">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-base font-bold text-ink">배포 이력 및 릴리즈 노트</h2>
                {/* Current Prod Healthy Badge */}
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ok-soft border border-ok-line text-xs font-semibold text-ok">
                  <span className="w-2 h-2 rounded-full bg-ok" />
                  <span>Current Prod: {latestProdVersion} - Healthy</span>
                </span>
              </div>

              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setIsAddingDeploy(!isAddingDeploy)}
                  className="px-3.5 py-2 rounded-xl bg-ink hover:opacity-90 text-paper text-xs font-medium flex items-center gap-1.5 transition-opacity cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>새 배포 기록 추가</span>
                </button>
              )}
            </div>

            

            {/* Release History Vertical Timeline */}
            <div className="relative pl-6 border-l-2 border-line space-y-6">
              {deployments.map((dep, idx) => {
                const isLatest = idx === 0;
                const isChecklistOpen = openChecklistId === dep.id;
                const isRollbackOpen = openRollbackId === dep.id;

                return (
                  <div key={dep.id} className="relative">
                    {/* Timeline Dot */}
                    <span
                      className={`absolute -left-[31px] top-4 w-3.5 h-3.5 rounded-full border-2 border-paper ${
                        isLatest ? 'bg-ok' : 'bg-muted'
                      }`}
                    />

                    <div className="rounded-xl bg-surface border border-line overflow-hidden">
                      {/* Release Card Header */}
                      <div className="px-5 py-3.5 bg-well border-b border-line flex flex-col @xl:flex-row @xl:items-center justify-between gap-2.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <code className="font-mono text-sm font-bold text-ink">
                            {dep.version}
                          </code>
                          <span className="px-2 py-0.5 rounded bg-ok-soft text-ok text-xs font-semibold">
                            {dep.status}
                          </span>
                          {isLatest && (
                            <span className="px-2 py-0.5 rounded bg-accent-soft text-accent text-xs font-medium">
                              Current Live
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                          <span>배포일: {dep.deployedAt}</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface border border-line font-mono text-ink-2">
                            <GitCommit className="w-3 h-3 text-muted" />
                            <span>{dep.commitRef}</span>
                          </span>
                        </div>
                      </div>

                      {/* Release Notes Body & DevOps Actions */}
                      <div className="p-5 space-y-4 text-xs">
                        {isEditMode ? (
                          <div className="space-y-3 p-3.5 rounded-lg bg-well/60 border border-accent-line">
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                aria-label="릴리즈 요약 제목 편집"
                                value={dep.releaseTitle}
                                onChange={(e) => handleUpdateDeploy(dep.id, 'releaseTitle', e.target.value)}
                                className="flex-1 bg-surface border border-line rounded px-2.5 py-1 text-xs font-semibold text-ink"
                                placeholder="릴리즈 제목 입력"
                              />
                              <button
                                type="button"
                                aria-label="배포 기록 삭제"
                                onClick={() => handleDeleteDeploy(dep.id)}
                                className="p-1.5 text-muted hover:text-danger rounded hover:bg-surface cursor-pointer"
                                title="배포 이력 삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div>
                              <label className="text-muted block text-[11px] mb-1">하이라이트 변경사항 (줄바꿈 구분)</label>
                              <textarea
                                aria-label="릴리즈 하이라이트 편집"
                                rows={3}
                                value={dep.highlights.join('\n')}
                                onChange={(e) => handleUpdateDeploy(dep.id, 'highlights', e.target.value.split('\n'))}
                                className="w-full bg-surface border border-line rounded p-2 text-xs text-ink leading-relaxed font-mono"
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-semibold text-ink mb-2">{dep.releaseTitle}</div>
                            <ul className="space-y-1.5 text-ink-2 leading-relaxed">
                              {dep.highlights.map((hl, hIdx) => (
                                <li key={hIdx} className="flex items-start gap-2">
                                  <span className="text-muted mt-0.5">-</span>
                                  <span>{hl}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Practical DevOps Action Buttons */}
                        <div className="pt-3 border-t border-line flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenChecklistId(isChecklistOpen ? null : dep.id);
                                setOpenRollbackId(null);
                              }}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                                isChecklistOpen
                                  ? 'bg-accent-soft border-accent-line text-accent'
                                  : 'bg-well border-line text-ink hover:bg-control'
                              }`}
                            >
                              <ClipboardCheck className="w-3.5 h-3.5" />
                              <span>배포 체크리스트 확인</span>
                              <span className="font-mono">
                                ({dep.checklist.filter((c) => c.checked).length}/{dep.checklist.length})
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setOpenRollbackId(isRollbackOpen ? null : dep.id);
                                setOpenChecklistId(null);
                              }}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                                isRollbackOpen
                                  ? 'bg-warn-soft border-warn-line text-warn'
                                  : 'bg-well border-line text-ink-2 hover:text-ink hover:bg-control'
                              }`}
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>이전 버전으로 롤백 안내</span>
                            </button>
                          </div>

                          <span className="text-muted">롤백 기준점: {dep.rollbackTarget}</span>
                        </div>

                        {/* Expandable Drawer 1: Deployment Verification Checklist */}
                        {isChecklistOpen && (
                          <div className="p-4 rounded-xl bg-well border border-line space-y-2.5">
                            <div className="font-semibold text-ink">
                              릴리즈 검증 체크리스트 ({dep.version.split(' ')[0]})
                            </div>
                            <div className="space-y-2">
                              {dep.checklist.map((ck) => (
                                <label
                                  key={ck.id}
                                  className="flex items-center gap-2.5 cursor-pointer text-ink-2 hover:text-ink"
                                >
                                  <input
                                    type="checkbox"
                                    checked={ck.checked}
                                    onChange={() => handleToggleChecklistItem(dep.id, ck.id)}
                                    className="rounded cursor-pointer"
                                  />
                                  <span className={ck.checked ? 'text-ink' : 'text-muted'}>
                                    {ck.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Expandable Drawer 2: Rollback Runbook Guide */}
                        {isRollbackOpen && (
                          <div className="p-4 rounded-xl bg-well border border-warn-line space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-ink">
                                긴급 롤백 런북 ({dep.version.split(' ')[0]} -&gt; {dep.rollbackTarget})
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard
                                    ?.writeText(dep.rollbackCommand)
                                    .catch(() => {});
                                  showToast('롤백 CLI 명령어가 클립보드에 복사되었습니다');
                                }}
                                className="px-2.5 py-1 rounded bg-surface hover:bg-control border border-line text-ink flex items-center gap-1 cursor-pointer"
                              >
                                <Copy className="w-3 h-3" />
                                <span>명령어 복사</span>
                              </button>
                            </div>
                            <p className="text-ink-2 leading-relaxed">{dep.rollbackNote}</p>
                            <pre className="p-2.5 rounded-lg bg-surface border border-line font-mono text-xs text-ink overflow-x-auto">
                              {dep.rollbackCommand}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 2: 트러블슈팅 아카이빙 */}
      {/* ============================================================== */}
      {subTab === 'troubleshooting' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-paper">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Top Controls: Version Dropdown + [+ 새 트러블슈팅 등록] */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-line">
              <div>
                <h2 className="text-base font-bold text-ink">
                  엔지니어링 트러블슈팅 및 성능 개선 일지
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  실제 운영 및 부하 테스트에서 발견된 병목 원인과 정량적 개선 지표를 기록합니다.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  aria-label="트러블슈팅 버전 필터 선택"
                  value={versionFilter}
                  onChange={(e) =>
                    setVersionFilter(
                      e.target.value as 'ALL' | 'v1.0 MVP' | 'v1.5 성능 개선'
                    )
                  }
                  className="bg-surface border border-line rounded-xl px-3 py-2 text-xs font-medium text-ink cursor-pointer"
                >
                  <option value="ALL">전체 버전 ({troubleshootings.length})</option>
                  <option value="v1.0 MVP">v1.0 MVP</option>
                  <option value="v1.5 성능 개선">v1.5 성능 개선</option>
                </select>

                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setIsAddingTs(!isAddingTs)}
                    className="px-3.5 py-2 rounded-xl bg-ink hover:opacity-90 text-paper text-xs font-medium flex items-center gap-1.5 transition-opacity cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>새 트러블슈팅 등록</span>
                  </button>
                )}
              </div>
            </div>

            

            {/* Troubleshooting Case Accordion Cards */}
            <div className="space-y-4">
              {filteredTroubleshootings.map((item) => {
                const isCollapsed = Boolean(collapsedTsIds[item.id]);
                return (
                  <div
                    key={item.id}
                    className="rounded-xl bg-surface border border-line overflow-hidden"
                  >
                    {/* Card Header with Resolved Version Badge */}
                    <div
                      onClick={() =>
                        setCollapsedTsIds((prev) => ({
                          ...prev,
                          [item.id]: !prev[item.id]
                        }))
                      }
                      className="px-5 py-3.5 bg-well border-b border-line flex flex-wrap items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                        <span className="px-2 py-0.5 rounded bg-surface border border-line text-xs font-semibold text-ink">
                          이슈 #{item.issueNumber}
                        </span>
                        <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-xs">
                        {/* Linked Deployment Version Badge */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSubTab('deployments');
                            showToast(`${item.resolvedInVersion} 배포 릴리즈 노트로 이동했습니다`);
                          }}
                          className="px-2.5 py-0.5 rounded-full bg-ok-soft border border-ok-line text-ok font-semibold hover:opacity-85 cursor-pointer"
                          title="클릭하여 해당 배포 이력 확인"
                        >
                          Resolved in <code className="font-mono">{item.resolvedInVersion}</code>
                        </button>

                        <span className="px-2 py-0.5 rounded bg-surface border border-line text-muted">
                          {item.versionTrack}
                        </span>

                        {isCollapsed ? (
                          <ChevronDown className="w-4 h-4 text-muted" />
                        ) : (
                          <ChevronUp className="w-4 h-4 text-muted" />
                        )}
                      </div>
                    </div>

                    {/* Structured [원인 분석] - [해결 과정] - [성능 개선 지표(Before/After)] */}
                    {!isCollapsed && (
                      <div className="p-5 space-y-4 text-xs">
                        {isEditMode ? (
                          <div className="space-y-3.5 p-4 rounded-xl bg-well/60 border border-accent-line">
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                aria-label="이슈 제목 편집"
                                value={item.title}
                                onChange={(e) => handleUpdateTs(item.id, 'title', e.target.value)}
                                className="flex-1 bg-surface border border-line rounded px-2.5 py-1 text-xs font-semibold text-ink"
                                placeholder="이슈 제목"
                              />
                              <button
                                type="button"
                                aria-label="트러블슈팅 사례 삭제"
                                onClick={() => handleDeleteTs(item.id)}
                                className="p-1.5 text-muted hover:text-danger rounded hover:bg-surface cursor-pointer"
                                title="이슈 삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 @xl:grid-cols-2 gap-3">
                              <div>
                                <label className="text-danger font-semibold block mb-1">1. 원인 분석</label>
                                <textarea
                                  aria-label="원인 분석 편집"
                                  rows={3}
                                  value={item.causeAnalysis}
                                  onChange={(e) => handleUpdateTs(item.id, 'causeAnalysis', e.target.value)}
                                  className="w-full bg-surface border border-line rounded p-2 text-xs text-ink leading-relaxed"
                                />
                              </div>
                              <div>
                                <label className="text-accent font-semibold block mb-1">2. 해결 과정</label>
                                <textarea
                                  aria-label="해결 과정 편집"
                                  rows={3}
                                  value={item.resolutionProcess}
                                  onChange={(e) => handleUpdateTs(item.id, 'resolutionProcess', e.target.value)}
                                  className="w-full bg-surface border border-line rounded p-2 text-xs text-ink leading-relaxed"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-muted block text-[11px] mb-1">개선 전 (Before)</label>
                                <input
                                  type="text"
                                  aria-label="Before 지표 편집"
                                  value={item.beforeMetric}
                                  onChange={(e) => handleUpdateTs(item.id, 'beforeMetric', e.target.value)}
                                  className="w-full bg-surface border border-line rounded px-2 py-1 font-mono text-xs text-ink"
                                />
                              </div>
                              <div>
                                <label className="text-ok block text-[11px] mb-1">개선 후 (After)</label>
                                <input
                                  type="text"
                                  aria-label="After 지표 편집"
                                  value={item.afterMetric}
                                  onChange={(e) => handleUpdateTs(item.id, 'afterMetric', e.target.value)}
                                  className="w-full bg-surface border border-line rounded px-2 py-1 font-mono text-xs text-ok font-semibold"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 @xl:grid-cols-2 gap-4">
                              <div className="p-3.5 rounded-xl bg-well border border-line space-y-1.5">
                                <span className="font-semibold text-danger block">1. 원인 분석</span>
                                <p className="text-ink-2 leading-relaxed">{item.causeAnalysis}</p>
                              </div>

                              <div className="p-3.5 rounded-xl bg-well border border-line space-y-1.5">
                                <span className="font-semibold text-accent block">2. 해결 과정</span>
                                <p className="text-ink-2 leading-relaxed">{item.resolutionProcess}</p>
                              </div>
                            </div>

                            {/* 3. Before / After Metric Comparison */}
                            <div className="p-4 rounded-xl bg-well border border-line">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                                <span className="font-semibold text-ink">
                                  3. 성능 개선 지표 (Before / After)
                                </span>
                                <span className="text-ok font-semibold">{item.improvementSummary}</span>
                              </div>

                              <div className="grid grid-cols-1 @xl:grid-cols-11 gap-2 items-center">
                                <div className="@xl:col-span-5 p-3 rounded-lg bg-surface border border-line">
                                  <span className="text-muted block mb-0.5">Before (개선 전)</span>
                                  <code className="font-mono text-xs @xl:text-sm font-semibold text-ink-2">
                                    {item.beforeMetric}
                                  </code>
                                </div>

                                <div className="@xl:col-span-1 flex justify-center text-muted">
                                  <ArrowRight className="w-4 h-4 rotate-90 @xl:rotate-0" />
                                </div>

                                <div className="@xl:col-span-5 p-3 rounded-lg bg-ok-soft border border-ok-line">
                                  <span className="text-ok block mb-0.5 font-medium">After (개선 후)</span>
                                  <code className="font-mono text-xs @xl:text-sm font-bold text-ok">
                                    {item.afterMetric}
                                  </code>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 3: 차기 버전 백로그 (v2.0+) */}
      {/* ============================================================== */}
      {subTab === 'backlog' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-paper">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-line">
              <div>
                <h2 className="text-base font-bold text-ink">
                  차기 버전 제품 백로그 (v2.0+ Roadmap)
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  운영 중 수집된 고도화 아이디어를 검토하고 즉시 Step 06 WBS 칸반 보드 티켓으로 이관할 수 있습니다.
                </p>
              </div>

              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setIsAddingBacklog(!isAddingBacklog)}
                  className="px-3.5 py-2 rounded-xl bg-ink hover:opacity-90 text-paper text-xs font-medium flex items-center gap-1.5 transition-opacity cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>백로그 아이디어 추가</span>
                </button>
              )}
            </div>

            

            {/* Backlog Items List */}
            <div className="border border-line rounded-xl divide-y divide-line overflow-hidden bg-surface">
              {backlogIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="p-5 flex flex-col @xl:flex-row @xl:items-center justify-between gap-4 hover:bg-well/40 transition-colors"
                >
                  {isEditMode ? (
                    <div className="space-y-2 flex-1 min-w-0 p-3 rounded-lg bg-well/60 border border-accent-line">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <select
                          aria-label="우선순위 수정"
                          value={idea.priority}
                          onChange={(e) => handleUpdateBacklog(idea.id, 'priority', e.target.value)}
                          className="bg-surface border border-line rounded px-2 py-0.5 font-mono text-xs font-semibold text-ink"
                        >
                          <option value="P0">P0 (필수)</option>
                          <option value="P1">P1 (중요)</option>
                          <option value="P2">P2 (선택)</option>
                        </select>
                        <input
                          type="text"
                          aria-label="목표 릴리즈 수정"
                          value={idea.targetRelease}
                          onChange={(e) => handleUpdateBacklog(idea.id, 'targetRelease', e.target.value)}
                          className="w-28 bg-surface border border-line rounded px-2 py-0.5 text-xs text-accent font-medium"
                        />
                        <input
                          type="text"
                          aria-label="도메인 태그 수정"
                          value={idea.domainTag}
                          onChange={(e) => handleUpdateBacklog(idea.id, 'domainTag', e.target.value)}
                          className="w-24 bg-surface border border-line rounded px-2 py-0.5 text-xs text-muted"
                        />
                        <button
                          type="button"
                          aria-label="백로그 삭제"
                          onClick={() => handleDeleteBacklog(idea.id)}
                          className="ml-auto p-1 text-muted hover:text-danger rounded hover:bg-surface cursor-pointer"
                          title="백로그 항목 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        aria-label="백로그 제목 수정"
                        value={idea.title}
                        onChange={(e) => handleUpdateBacklog(idea.id, 'title', e.target.value)}
                        className="w-full bg-surface border border-line rounded px-2.5 py-1 text-xs font-semibold text-ink"
                        placeholder="백로그 제목"
                      />
                      <textarea
                        aria-label="백로그 설명 수정"
                        rows={2}
                        value={idea.description}
                        onChange={(e) => handleUpdateBacklog(idea.id, 'description', e.target.value)}
                        className="w-full bg-surface border border-line rounded p-2 text-xs text-ink leading-relaxed"
                        placeholder="배경 및 상세 설명"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <code className="px-2 py-0.5 rounded bg-well border border-line font-mono font-semibold text-ink">
                          {idea.priority}
                        </code>
                        <span className="px-2 py-0.5 rounded bg-accent-soft text-accent font-medium">
                          {idea.targetRelease}
                        </span>
                        <span className="text-muted">{idea.domainTag}</span>
                      </div>

                      <h3 className="text-sm font-semibold text-ink">{idea.title}</h3>
                      <p className="text-xs text-ink-2 leading-relaxed">{idea.description}</p>
                    </div>
                  )}

                  {/* Required Action: [WBS 보드로 보내기] */}
                  <div className="shrink-0 flex items-center gap-2">
                    {idea.sentTicketKey ? (
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1.5 rounded-lg bg-ok-soft text-ok text-xs font-semibold flex items-center gap-1 whitespace-nowrap">
                          <Check className="w-3.5 h-3.5" />
                          <span>이관됨 ({idea.sentTicketKey})</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => onNavigateStep('step6')}
                          className="px-3 py-1.5 rounded-lg bg-well hover:bg-control text-ink text-xs font-medium cursor-pointer whitespace-nowrap"
                        >
                          칸반 보기
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const ticketKey = onSendBacklogToWbs(idea);
                          setBacklogIdeas((prev) =>
                            prev.map((item) =>
                              item.id === idea.id ? { ...item, sentTicketKey: ticketKey } : item
                            )
                          );
                          showToast(`[${ticketKey}] 티켓으로 Step 06 WBS 칸반 보드에 추가되었습니다`);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-well hover:bg-control border border-line text-ink text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <span>WBS 보드로 보내기</span>
                        <ArrowRight className="w-3.5 h-3.5 text-muted" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    
      {/* ============================================================== */}
      {/* 1. DEPLOYMENT RECORD MODAL */}
      {/* ============================================================== */}
      {isAddingDeploy && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-overlay flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddingDeploy(false);
          }}
        >
          <div className="bg-surface border border-line rounded-2xl shadow-floating max-w-lg w-full overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-well/70 border-b border-line flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-ink">신규 운영 배포 릴리즈 기록</h3>
                <p className="text-xs text-muted mt-0.5">운영 환경에 배포된 버전과 릴리즈 하이라이트를 기록합니다.</p>
              </div>
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setIsAddingDeploy(false)}
                className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateDeployment} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-ink block">배포 버전명 <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    aria-label="배포 버전명 입력"
                    value={newDepVersion}
                    onChange={(e) => setNewDepVersion(e.target.value)}
                    placeholder="v1.5.1 (Hotfix)"
                    className="w-full bg-well border border-line rounded-lg px-3 py-2 font-mono text-ink focus:outline-none focus:border-ink/40"
                    required
                    autoFocus
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-ink block">커밋 브랜치 및 해시</label>
                  <input
                    type="text"
                    aria-label="커밋 정보 입력"
                    value={newDepCommit}
                    onChange={(e) => setNewDepCommit(e.target.value)}
                    placeholder="fix/sse-retry (#9c4e1a)"
                    className="w-full bg-well border border-line rounded-lg px-3 py-2 font-mono text-ink focus:outline-none focus:border-ink/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink block">릴리즈 요약 제목 <span className="text-danger">*</span></label>
                <input
                  type="text"
                  aria-label="릴리즈 제목 입력"
                  value={newDepTitle}
                  onChange={(e) => setNewDepTitle(e.target.value)}
                  placeholder="예: SSE 재연결 백오프 정책 및 알림 지연 개선"
                  className="w-full bg-well border border-line rounded-lg px-3 py-2 text-ink font-semibold focus:outline-none focus:border-ink/40"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink block">주요 변경사항 (줄바꿈으로 구분)</label>
                <textarea
                  rows={4}
                  aria-label="주요 변경사항 입력"
                  value={newDepNotes}
                  onChange={(e) => setNewDepNotes(e.target.value)}
                  placeholder="모바일 네트워크 전환 시 SSE 스트림 자동 재구독 로직 보강, 불필요한 Heartbeat 주기 최적화 (15s → 30s)"
                  className="w-full bg-well border border-line rounded-lg p-3 text-ink leading-relaxed focus:outline-none focus:border-ink/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingDeploy(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-well hover:bg-control text-muted hover:text-ink transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper font-medium transition-opacity cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>배포 기록 등록</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. TROUBLESHOOTING CASE MODAL */}
      {/* ============================================================== */}
      {isAddingTs && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-overlay flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddingTs(false);
          }}
        >
          <div className="bg-surface border border-line rounded-2xl shadow-floating max-w-lg w-full overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-well/70 border-b border-line flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-ink">신규 트러블슈팅 사례 아카이빙</h3>
                <p className="text-xs text-muted mt-0.5">운영 중 발생한 장애 원인과 해결 과정을 아카이브에 기록합니다.</p>
              </div>
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setIsAddingTs(false)}
                className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateTroubleshooting} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-ink block">이슈 및 장애 제목 <span className="text-danger">*</span></label>
                <input
                  type="text"
                  aria-label="이슈 제목 입력"
                  value={newTsTitle}
                  onChange={(e) => setNewTsTitle(e.target.value)}
                  placeholder="예: 마감 할인 오픈 정각 커넥션 풀 고갈 장애"
                  className="w-full bg-well border border-line rounded-lg px-3 py-2 text-ink font-semibold focus:outline-none focus:border-ink/40"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-ink block">발생 버전 트랙</label>
                  <select
                    aria-label="버전 트랙 선택"
                    value={newTsVersionTrack}
                    onChange={(e) => setNewTsVersionTrack(e.target.value as 'v1.0 MVP' | 'v1.5 성능 개선')}
                    className="w-full bg-well border border-line rounded-lg px-3 py-2 text-ink"
                  >
                    <option value="v1.0 MVP">v1.0 MVP 트랙</option>
                    <option value="v1.5 성능 개선">v1.5 성능 개선 트랙</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-ink block">해결 배포 버전</label>
                  <input
                    type="text"
                    aria-label="해결 버전 입력"
                    value={newTsResolvedVer}
                    onChange={(e) => setNewTsResolvedVer(e.target.value)}
                    placeholder="v1.5.0"
                    className="w-full bg-well border border-line rounded-lg px-3 py-2 font-mono text-ink focus:outline-none focus:border-ink/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-danger block">1. 원인 분석 (Root Cause)</label>
                <textarea
                  rows={3}
                  aria-label="원인 분석 입력"
                  value={newTsCause}
                  onChange={(e) => setNewTsCause(e.target.value)}
                  placeholder="병목 또는 에러가 발생한 근본 원인을 작성하세요..."
                  className="w-full bg-well border border-line rounded-lg p-2.5 text-ink leading-relaxed focus:outline-none focus:border-ink/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ok block">2. 해결 과정 및 조치 내용</label>
                <textarea
                  rows={3}
                  aria-label="해결 과정 입력"
                  value={newTsResolution}
                  onChange={(e) => setNewTsResolution(e.target.value)}
                  placeholder="아키텍처 또는 코드 레벨의 해결 방법과 재발 방지책을 작성하세요..."
                  className="w-full bg-well border border-line rounded-lg p-2.5 text-ink leading-relaxed focus:outline-none focus:border-ink/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-muted block text-[11px]">개선 전 지표 (Before)</label>
                  <input
                    type="text"
                    aria-label="Before 지표 입력"
                    value={newTsBefore}
                    onChange={(e) => setNewTsBefore(e.target.value)}
                    placeholder="응답 지연 240ms"
                    className="w-full bg-well border border-line rounded-lg px-3 py-2 font-mono text-ink"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-ok block text-[11px] font-medium">개선 후 지표 (After)</label>
                  <input
                    type="text"
                    aria-label="After 지표 입력"
                    value={newTsAfter}
                    onChange={(e) => setNewTsAfter(e.target.value)}
                    placeholder="응답 지연 28ms"
                    className="w-full bg-well border border-line rounded-lg px-3 py-2 font-mono text-ok font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingTs(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-well hover:bg-control text-muted hover:text-ink transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper font-medium transition-opacity cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>사례 등록</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. BACKLOG IDEA MODAL */}
      {/* ============================================================== */}
      {isAddingBacklog && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-overlay flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddingBacklog(false);
          }}
        >
          <div className="bg-surface border border-line rounded-2xl shadow-floating max-w-lg w-full overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-well/70 border-b border-line flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-ink">신규 차기 버전 백로그 아이디어 추가</h3>
                <p className="text-xs text-muted mt-0.5">운영 피드백을 기반으로 v2.0+ 로드맵에 반영할 기능/개선안을 등록합니다.</p>
              </div>
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setIsAddingBacklog(false)}
                className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateBacklog} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-4 space-y-1.5">
                  <label className="font-semibold text-ink block">우선순위</label>
                  <select
                    aria-label="우선순위 선택"
                    value={newBgPriority}
                    onChange={(e) => setNewBgPriority(e.target.value as 'P0' | 'P1' | 'P2')}
                    className="w-full bg-well border border-line rounded-lg px-3 py-2 text-ink font-mono focus:outline-none focus:border-ink/40"
                  >
                    <option value="P0">P0 (필수 고도화)</option>
                    <option value="P1">P1 (주요 개선)</option>
                    <option value="P2">P2 (아이디어/선택)</option>
                  </select>
                </div>
                <div className="sm:col-span-5 space-y-1.5">
                  <label className="font-semibold text-ink block">목표 릴리즈</label>
                  <input
                    type="text"
                    aria-label="목표 릴리즈 입력"
                    value={newBgRelease}
                    onChange={(e) => setNewBgRelease(e.target.value)}
                    placeholder="v2.0 Roadmap"
                    className="w-full bg-well border border-line rounded-lg px-3 py-2 text-ink font-mono focus:outline-none focus:border-ink/40"
                  />
                </div>
                <div className="sm:col-span-3 space-y-1.5">
                  <label className="font-semibold text-ink block">분류 태그</label>
                  <input
                    type="text"
                    aria-label="도메인 태그 입력"
                    value={newBgTag}
                    onChange={(e) => setNewBgTag(e.target.value)}
                    placeholder="Feature"
                    className="w-full bg-well border border-line rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-ink/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink block">백로그 제목 <span className="text-danger">*</span></label>
                <input
                  type="text"
                  aria-label="백로그 제목 입력"
                  value={newBgTitle}
                  onChange={(e) => setNewBgTitle(e.target.value)}
                  placeholder="예: 점주용 당일 빵 사진 AI 자동 인식 및 카테고리 태깅"
                  className="w-full bg-well border border-line rounded-lg px-3 py-2 text-ink font-semibold focus:outline-none focus:border-ink/40"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink block">상세 배경 및 기대 효과</label>
                <textarea
                  rows={4}
                  aria-label="백로그 상세 설명 입력"
                  value={newBgDesc}
                  onChange={(e) => setNewBgDesc(e.target.value)}
                  placeholder="기능 도입 배경, 사용자 니즈, 예상 비즈니스 효과를 서술하세요..."
                  className="w-full bg-well border border-line rounded-lg p-3 text-ink leading-relaxed focus:outline-none focus:border-ink/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingBacklog(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-well hover:bg-control text-muted hover:text-ink transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper font-medium transition-opacity cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>백로그 등록</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
</div>
  );
};
