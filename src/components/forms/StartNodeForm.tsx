import type { StartConfig } from '../../types/workflow'
import { KeyValueEditor } from './KeyValueEditor'

interface Props {
  config: StartConfig
  onChange: (patch: Partial<StartConfig>) => void
}

export function StartNodeForm({ config, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Title</label>
        <input
          className="form-input"
          value={config.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Workflow start title"
        />
      </div>
      <KeyValueEditor
        label="Metadata"
        values={config.metadata}
        onChange={(metadata) => onChange({ metadata })}
      />
    </div>
  )
}
