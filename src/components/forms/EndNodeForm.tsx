import type { EndConfig } from '../../types/workflow'

interface Props {
  config: EndConfig
  onChange: (patch: Partial<EndConfig>) => void
}

export function EndNodeForm({ config, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">End Message</label>
        <textarea
          className="form-input resize-none h-20"
          value={config.endMessage}
          onChange={(e) => onChange({ endMessage: e.target.value })}
          placeholder="Message shown on workflow completion"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={config.summaryFlag}
          onClick={() => onChange({ summaryFlag: !config.summaryFlag })}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
            config.summaryFlag ? 'bg-accent' : 'bg-border'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
              config.summaryFlag ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
        <div>
          <p className="text-sm text-white">Generate Summary</p>
          <p className="text-[11px] text-muted">Compile workflow results into a summary report</p>
        </div>
      </div>
    </div>
  )
}
