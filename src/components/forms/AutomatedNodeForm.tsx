import { useEffect, useState } from 'react'
import type { AutomatedConfig } from '../../types/workflow'
import type { AutomationAction } from '../../types/workflow'
import { getAutomations } from '../../api/mockApi'

interface Props {
  config: AutomatedConfig
  onChange: (patch: Partial<AutomatedConfig>) => void
}

export function AutomatedNodeForm({ config, onChange }: Props) {
  const [actions, setActions] = useState<AutomationAction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAutomations().then((a) => {
      setActions(a)
      setLoading(false)
    })
  }, [])

  const selectedAction = actions.find((a) => a.id === config.actionId)

  const handleActionChange = (actionId: string) => {
    onChange({ actionId, actionParams: {} })
  }

  const handleParamChange = (param: string, value: string) => {
    onChange({ actionParams: { ...config.actionParams, [param]: value } })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Title</label>
        <input
          className="form-input"
          value={config.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Automated step name"
        />
      </div>
      <div>
        <label className="form-label">Action</label>
        {loading ? (
          <div className="text-xs text-muted animate-pulse">Loading actions…</div>
        ) : (
          <select
            className="form-input"
            value={config.actionId}
            onChange={(e) => handleActionChange(e.target.value)}
          >
            <option value="">— Select action —</option>
            {actions.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
        )}
      </div>

      {selectedAction && selectedAction.params.length > 0 && (
        <div className="space-y-3">
          <span className="form-label">Action Parameters</span>
          {selectedAction.params.map((param) => (
            <div key={param}>
              <label className="block text-[11px] text-muted mb-1 capitalize">{param}</label>
              <input
                className="form-input text-xs"
                value={config.actionParams[param] ?? ''}
                onChange={(e) => handleParamChange(param, e.target.value)}
                placeholder={`Enter ${param}…`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
