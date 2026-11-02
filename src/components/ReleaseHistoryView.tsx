import React, { useState } from 'react';
import {
  Rocket,
  Plus,
  GitCommit,
  RotateCcw,
  Check,
  Clock,
  Copy,
  PanelRightClose,
  Edit3,
  Trash2,
  X
} from 'lucide-react';
import type { DeploymentRecord, StepId } from '../mockData';
import { ExportDropdown } from './ExportDropdown';

interface ReleaseHistoryViewProps {
  deployments: DeploymentRecord[];
  setDeployments: React.Dispatch<React.SetStateAction<DeploymentRecord[]>>;
  onConfirmStep?: (step: StepId) => void;
  onCollapsePane?: () => void;
  isConfirmed?: boolean;
}

export const ReleaseHistoryView: React.FC<ReleaseHistoryViewProps> = ({
  deployments,
  setDeployments,
  onConfirmStep,
  onCollapsePane,
  isConfirmed = false
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddingRelease, setIsAddingRelease] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Deployment State
  const [newVersion, setNewVersion] = useState('v1.6.0');
  const [newEnv, setNewEnv] = useState<'Production' | 'Staging'>('Production');
  const [newChangelog, setNewChangelog] = useState('');
  const [newRollback, setNewRollback] = useState('git checkout v1.5.0 && docker-compose up -d');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleCopyRollback = (guide: string, version: string) => {
    navigator.clipboard?.writeText(guide).catch(() => {});
    showToast(`[${version}] 롤백 명령어가 복사되었습니다.`);
  };

  const handleAddRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersion.trim()) return;

    const changes = newChangelog
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    const created: DeploymentRecord = {
      id: `dep_${Date.now()}`,
      version: newVersion.trim(),
      status: 'Production',
      environment: newEnv,
      deployedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      deployedBy: 'Groom CI/CD Bot (Release Manager)',
      commitHash: Math.random().toString(16).substring(2, 9),
      changelog: changes.length > 0 ? changes : ['버그 수정 및 성능 최적화 패치 배포'],
      rollbackGuide: newRollback.trim() || 'git revert HEAD && git push origin main'
    };

    setDeployments((prev) => [created, ...prev]);
    setIsAddingRelease(false);
    setNewVersion('');
    setNewChangelog('');
    showToast(`"${created.version}" 배포 기록이 추가되었습니다.`);
  };

  const handleDeleteRelease = (id: string, version: string) => {
    setDeployments((prev) => prev.filter((d) => d.id !== id));
    showToast(`"${version}" 배포 기록이 삭제되었습니다.`);
  };

  const handleUpdateReleaseField = <K extends keyof DeploymentRecord>(
    id: string,
    field: K,
    value: DeploymentRecord[K]
  ) => {
    setDeployments((prev) =>
      prev.map((dep) => (dep.id === id ? { ...dep, [field]: value } : dep))
    );
  };

  const latestRelease = deployments[0] || {
    id: 'default_rel',
    version: 'v1.5.0',
    deployedAt: '2026-10-30 18:30:00 (KST)',
    status: 'Production' as const,
    commitHash: 'c4bb501',
    changelog: [],
    rollbackGuide: ''
  };

  const buildMarkdown = () => {
    return `# 16. 배포 이력 & 릴리즈 노트 (Release History & Changelog)

- **현재 프로덕션 버전**: ${latestRelease.version} (Healthy 🟢)
- **최근 배포 시각**: ${latestRelease.deployedAt}
- **총 배포 횟수**: ${deployments.length}회

## 버전별 배포 타임라인 및 변경점
${deployments
  .map(
    (dep) => `### ${dep.version} (${dep.environment || dep.status})
- **배포 일시**: ${dep.deployedAt} | 커밋: \`${dep.commitHash}\` | 배포자: ${dep.deployedBy || 'CI/CD Bot'}
- **주요 변경 사항 (Changelog)**:
${dep.changelog.map((c) => `  - ${c}`).join('\n')}
- **롤백 가이드**:
  \`\`\`bash
  ${dep.rollbackGuide}
  \`\`\``
  )
  .join('\n\n')}
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
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
            <Rocket className="w-4 h-4 text-orange-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">16. Releases</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-well text-muted border border-line">
                총 {deployments.length}회 배포
              </span>
            </div>
            <h2 className="text-sm font-bold text-ink truncate">배포 이력 & 릴리즈 노트</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ExportDropdown
            title="16_배포_이력_및_릴리즈_노트"
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
              onClick={() => onConfirmStep('step16')}
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

      {/* Prod Status Banner */}
      <div className="px-5 py-3 bg-well/60 border-b border-line flex items-center justify-between gap-3 flex-wrap text-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-ink">
            Current Prod: <span className="text-emerald-400 font-mono tabular-nums">{latestRelease.version}</span> - Healthy 🟢
          </span>
          <span className="text-muted hidden sm:inline">| 가동률 99.98% (SLA 정상 충족)</span>
        </div>

        <div className="text-[11px] text-muted flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>최근 배포: <span className="tabular-nums">{latestRelease.deployedAt}</span></span>
        </div>
      </div>

      {/* Timeline List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {isEditMode && (
          <div className="p-3 bg-well/40 border border-dashed border-accent/40 rounded-xl flex items-center justify-between">
            <span className="text-xs text-muted">편집 모드: 새 배포 버전을 추가하거나 이전 기록을 삭제할 수 있습니다.</span>
            <button
              type="button"
              onClick={() => setIsAddingRelease(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ 새 배포 기록 추가</span>
            </button>
          </div>
        )}

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-line">
          {deployments.map((dep, idx) => {
            const isLatest = idx === 0;
            return (
              <div key={dep.id} className="relative space-y-2">
                {/* Timeline Dot */}
                <span
                  className={`absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 bg-canvas ${
                    isLatest
                      ? 'border-emerald-400 bg-emerald-500/20'
                      : 'border-line-strong'
                  }`}
                />

                {/* Release Card */}
                <div className="p-4 rounded-xl bg-surface border border-line hover:border-line-strong transition-colors space-y-3 shadow-sm">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={dep.version}
                          onChange={(e) => handleUpdateReleaseField(dep.id, 'version', e.target.value)}
                          className="font-mono text-sm font-bold text-ink bg-well border border-line rounded px-2 py-0.5 w-24 outline-none focus:border-accent"
                          placeholder="v1.6.0"
                        />
                      ) : (
                        <span className="font-mono tabular-nums text-sm font-bold text-ink">{dep.version}</span>
                      )}

                      {isEditMode ? (
                        <select
                          value={dep.environment || dep.status}
                          onChange={(e) => handleUpdateReleaseField(dep.id, 'environment', e.target.value as any)}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-well border border-line text-ink outline-none"
                        >
                          <option value="Production">Production</option>
                          <option value="Staging">Staging</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            dep.environment === 'Production' || dep.status === 'Production'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}
                        >
                          {dep.environment || dep.status}
                        </span>
                      )}

                      {isLatest && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-accent-soft text-accent border border-accent/20 font-medium">
                          Latest Release
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <GitCommit className="w-3.5 h-3.5" />
                        {dep.commitHash}
                      </span>
                      <span className="hidden sm:inline">| {dep.deployedAt}</span>
                      {isEditMode && (
                        <button
                          type="button"
                          onClick={() => handleDeleteRelease(dep.id, dep.version)}
                          className="p-1 rounded text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                          title="배포 기록 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Changelog Bullets */}
                  <div>
                    <span className="text-[11px] font-semibold text-muted block mb-1">
                      주요 변경 사항 (Changelog)
                    </span>
                    {isEditMode ? (
                      <textarea
                        value={dep.changelog.join('\n')}
                        onChange={(e) => {
                          const lines = e.target.value.split('\n').filter(Boolean);
                          handleUpdateReleaseField(dep.id, 'changelog', lines);
                        }}
                        rows={3}
                        className="w-full p-2.5 rounded-lg bg-well border border-line text-xs text-ink leading-relaxed outline-none focus:border-accent"
                        placeholder="줄바꿈으로 변경 사항 입력"
                      />
                    ) : (
                      <ul className="space-y-1 text-xs text-ink-2">
                        {dep.changelog.map((c, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-1.5">
                            <span className="text-accent mt-0.5">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Rollback Guide */}
                  <div className="pt-2 border-t border-line flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-muted flex-1 min-w-0">
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {isEditMode ? (
                        <input
                          type="text"
                          value={dep.rollbackGuide}
                          onChange={(e) => handleUpdateReleaseField(dep.id, 'rollbackGuide', e.target.value)}
                          className="w-full px-2 py-0.5 bg-well border border-line rounded font-mono text-[11px] text-ink outline-none focus:border-accent"
                          placeholder="롤백 명령어"
                        />
                      ) : (
                        <span className="font-mono text-[11px] text-ink-2 truncate">
                          {dep.rollbackGuide}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyRollback(dep.rollbackGuide, dep.version)}
                      className="flex items-center gap-1 text-[11px] text-accent hover:underline cursor-pointer shrink-0"
                    >
                      <Copy className="w-3 h-3" />
                      <span>복사</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Add Release */}
      {isAddingRelease && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface border border-line-strong rounded-2xl w-full max-w-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-orange-400" />
                </div>
                <h3 className="text-sm font-bold text-ink">새 배포 기록 등록</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingRelease(false)}
                className="p-1 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRelease} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">버전 태그</label>
                  <input
                    type="text"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    placeholder="예: v1.6.0"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink font-mono text-xs focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">배포 환경</label>
                  <select
                    value={newEnv}
                    onChange={(e) => setNewEnv(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  >
                    <option value="Production">Production (운영)</option>
                    <option value="Staging">Staging (검증)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">
                  변경 사항 (Changelog - 줄바꿈으로 구분)
                </label>
                <textarea
                  value={newChangelog}
                  onChange={(e) => setNewChangelog(e.target.value)}
                  rows={4}
                  placeholder={`- 마감 빵 반값 예약 결제 트랜잭션 Redis 분산락 적용\n- SSE 알림 재연결 백오프 정책 추가\n- 장바구니 수량 동시성 초과 방지 패치`}
                  className="w-full p-2.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">롤백 가이드 명령어</label>
                <input
                  type="text"
                  value={newRollback}
                  onChange={(e) => setNewRollback(e.target.value)}
                  placeholder="git checkout v1.5.0 && docker-compose up -d"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink font-mono text-xs focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingRelease(false)}
                  className="px-3 py-1.5 rounded-lg bg-well text-muted hover:text-ink text-xs font-medium cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold cursor-pointer"
                >
                  배포 기록 추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
