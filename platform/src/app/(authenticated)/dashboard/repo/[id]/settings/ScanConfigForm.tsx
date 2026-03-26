'use client';

import {
  SaveIcon,
  RefreshCwIcon,
  ChartIcon,
  AlertTriangleIcon,
  UploadIcon,
  FileIcon,
} from '@/components/Icons';
import { AIReadyConfig, AIReadyConfigSchema } from '@aiready/core/client';
import { toast } from 'sonner';
import { useExecutionEstimator } from './_hooks/useExecutionEstimator';
import { useScanSettings } from './_hooks/useScanSettings';
import { ScopeSection } from './_components/ScopeSection';
import { ToolsSection } from './_components/ToolsSection';
import { ThresholdsSection } from './_components/ThresholdsSection';

export interface ScanConfigFormProps {
  repoId: string;
  initialSettings: AIReadyConfig | null;
  fileCount: number;
  lastExecutionTime: number;
  lastSettings: AIReadyConfig | null;
  onSave: (settings: AIReadyConfig | null) => Promise<void>;
}

export function ScanConfigForm({
  repoId: _repoId,
  initialSettings,
  fileCount,
  lastExecutionTime,
  lastSettings,
  onSave,
}: ScanConfigFormProps) {
  const {
    settings,
    saving,
    success,
    hasChanges,
    handleToggleTool,
    handleSave,
    handleReset,
    updateToolConfig,
    updateScanConfig,
    updateScoringConfig,
    setSettings,
  } = useScanSettings(initialSettings, onSave);

  const handleImportConfig = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const json = JSON.parse(text);

        // Validate with schema
        const result = AIReadyConfigSchema.safeParse(json);
        if (!result.success) {
          toast.error('Invalid configuration format', {
            description: result.error.issues[0].message,
          });
          return;
        }

        setSettings(result.data);
        toast.success('Configuration imported successfully!');
      } catch (_err) {
        toast.error('Failed to parse configuration file');
      }
    };
    input.click();
  };

  const handleExportConfig = () => {
    try {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataUri =
        'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = 'aiready.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      toast.success('Configuration exported as aiready.json');
    } catch (_err) {
      toast.error('Failed to export configuration');
    }
  };

  const estimatedTime = useExecutionEstimator(
    settings,
    fileCount,
    lastExecutionTime,
    lastSettings
  );

  const timeWarning = (estimatedTime || 0) > 900; // 15 mins

  return (
    <div className="flex flex-col gap-12 max-w-6xl">
      <div className="grid grid-cols-1 gap-8">
        <ScopeSection
          settings={settings}
          onUpdate={updateScanConfig}
          onReset={handleReset}
        />

        <ToolsSection settings={settings} onToggleTool={handleToggleTool} />

        <ThresholdsSection
          settings={settings}
          updateToolConfig={updateToolConfig}
          updateScoringConfig={updateScoringConfig}
        />
      </div>

      <div className="flex flex-col gap-6 pb-10">
        {estimatedTime !== null && (
          <div
            className={`p-6 rounded-3xl border transition-all ${
              timeWarning
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-slate-900/50 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl border ${
                    timeWarning
                      ? 'bg-red-500/20 border-red-500/30 text-red-500'
                      : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500'
                  }`}
                >
                  <RefreshCwIcon
                    className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest">
                    Estimated Scan Time
                  </h4>
                  <p className="text-[10px] text-slate-500 uppercase">
                    Based on {fileCount} files and selected strategy
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`text-2xl font-black font-mono ${
                    timeWarning ? 'text-red-500' : 'text-cyan-500'
                  }`}
                >
                  {Math.floor(estimatedTime / 60)}:
                  {(estimatedTime % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] block text-slate-500 font-bold uppercase">
                  Minutes
                </span>
              </div>
            </div>

            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full transition-all duration-500 ${
                  timeWarning ? 'bg-red-500' : 'bg-cyan-500'
                }`}
                style={{
                  width: `${Math.min(100, (estimatedTime / 900) * 100)}%`,
                }}
              />
            </div>

            {timeWarning ? (
              <div className="flex items-start gap-3 p-3 bg-red-500/20 rounded-xl border border-red-500/30 animate-pulse">
                <AlertTriangleIcon className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-xs text-red-200 leading-relaxed">
                  <span className="font-bold block mb-1">TIMEOUT RISK</span>
                  This configuration might exceed the 15-minute system limit.
                  Consider enabling{' '}
                  <span className="font-bold">Approximate Matching</span> or
                  reducing <span className="font-bold">Context Depth</span> to
                  speed up the scan.
                </p>
              </div>
            ) : (
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Scan time is estimated and may vary based on file complexity and
                system load. A 10-minute safe buffer is recommended.
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-slate-500 text-xs">
            <ChartIcon className="w-4 h-4" />
            <p>
              {hasChanges
                ? 'You have unsaved changes to your scan strategy.'
                : 'These settings will be applied to the next scan of this repository.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleImportConfig}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-700 transition-all border border-slate-700"
              title="Import local aiready.json"
            >
              <UploadIcon className="w-4 h-4" />
              Import
            </button>
            <button
              onClick={handleExportConfig}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-700 transition-all border border-slate-700 mr-4"
              title="Export current strategy as aiready.json"
            >
              <FileIcon className="w-4 h-4" />
              Export
            </button>

            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl ${
                success
                  ? 'bg-green-500 text-white shadow-green-500/20'
                  : !hasChanges
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-cyan-500/20 active:scale-95'
              } disabled:opacity-50`}
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : success ? (
                <>
                  <RefreshCwIcon className="w-5 h-5" />
                  Settings Updated
                </>
              ) : (
                <>
                  <SaveIcon className="w-5 h-5" />
                  Save Strategy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
