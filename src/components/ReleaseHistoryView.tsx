import React, { useState } from 'react';
import {
  Rocket,
  Plus,
  GitCommit,
  RotateCcw,
  Check,
  Clock,
  Copy,
  PanelRightClose
} from 'lucide-react';
import type { DeploymentRecord, StepId } from '../mockData';

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

  const latestRelease = deployments[0] || {
    id: 'default_rel',
    version: 'v1.5.0',
    deployedAt: '2026-10-30 18:30:00 (KST)',
    status: 'Production' as const,
    commitHash: 'c4bb501',
    changelog: [],
    rollbackGuide: ''
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
              <span className="text-xs text-muted">15. Releases</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-well text-muted border border-line">
                총 {deployments.length}회 배포
              </span>
            </div>
            <h2 className="text-sm font-bold text-ink truncate">배포 이력 & 릴리즈 노트</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsAddingRelease(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 배포 기록</span>
          </button>

          {onConfirmStep && (
            <button
              type="button"
              onClick={() => onConfirmStep('step15')}
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
            Current Prod: <span className="text-emerald-400 font-mono">{latestRelease.version}</span> - Healthy 🟢
          </span>
          <span className="text-muted hidden sm:inline">| 가동률 99.98% (SLA 정상 충족)</span>
        </div>

        <div className="text-[11px] text-muted flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>최근 배포: {latestRelease.deployedAt}</span>
        </div>
      </div>

      {/* Timeline List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-line">
          {deployments.map((dep, idx) => {
            const isLatest = idx === 0;
            return (
              <div key={dep.id} className="relative space-y-2">
                {/* Timeline Dot */}
                <span
                  className={`absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 bg-canvas ${
                    isLatest
                      ? 'border-emerald-500 bg-emerald-500/20'
                      : 'border-line-strong'
                  }`}
                />

                <div className="p-4 rounded-xl bg-surface border border-line hover:border-line-strong transition-colors space-y-3.5 shadow-sm">
                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold font-mono text-ink">
                        {dep.version}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          dep.environment === 'Production'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}
                      >
                        {dep.environment}
                      </span>
                      {isLatest && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Active Live
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1 font-mono">
                        <GitCommit className="w-3.5 h-3.5 text-accent" />
                        {dep.commitHash}
                      </span>
                      <span>{dep.deployedAt}</span>
                    </div>
                  </div>

                  {/* Changelog */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-muted block">
                      변경 내역 (Changelog)
                    </span>
                    <ul className="space-y-1 text-xs text-ink-2 pl-2">
                      {dep.changelog.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-accent">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rollback Guide */}
                  <div className="pt-2 border-t border-line/60 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0 font-mono text-[11px] text-muted">
                      <RotateCcw className="w-3.5 h-3.5 text-danger shrink-0" />
                      <span className="truncate">롤백: {dep.rollbackGuide}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyRollback(dep.rollbackGuide, dep.version)}
                      className="flex items-center gap-1 text-[11px] text-muted hover:text-ink shrink-0 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>명령어 복사</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Deployment Modal */}
      {isAddingRelease && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface border border-line-strong rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-sm font-bold text-ink">새 릴리즈 배포 기록 추가</h3>
              <button
                type="button"
                onClick={() => setIsAddingRelease(false)}
                className="p-1 text-muted hover:text-ink rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRelease} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted font-medium mb-1">버전 태그</label>
                  <input
                    type="text"
                    required
                    placeholder="예: v1.6.0"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    className="w-full px-3 py-2 bg-well border border-line rounded-lg text-ink font-mono focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-muted font-medium mb-1">배포 환경</label>
                  <select
                    value={newEnv}
                    onChange={(e) => setNewEnv(e.target.value as any)}
                    className="w-full px-3 py-2 bg-well border border-line rounded-lg text-ink outline-none"
                  >
                    <option value="Production">Production</option>
                    <option value="Staging">Staging</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-muted font-medium mb-1">
                  변경 사항 (줄바꿈으로 구분)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="예: [Feat] 신규 장바구니 실시간 할인 계산기 추가&#10;[Fix] 토큰 만료 시 무한 리프레시 버그 해결"
                  value={newChangelog}
                  onChange={(e) => setNewChangelog(e.target.value)}
                  className="w-full px-3 py-2 bg-well border border-line rounded-lg text-ink outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-muted font-medium mb-1">비상 롤백 명령어</label>
                <input
                  type="text"
                  value={newRollback}
                  onChange={(e) => setNewRollback(e.target.value)}
                  className="w-full px-3 py-2 bg-well border border-line rounded-lg text-ink font-mono outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
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
                  배포 기록 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
