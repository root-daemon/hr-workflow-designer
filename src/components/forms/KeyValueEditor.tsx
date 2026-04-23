import { nanoid } from './nanoid'
import type { KeyValue } from '../../types/workflow'

interface Props {
  values: KeyValue[]
  onChange: (vals: KeyValue[]) => void
  label?: string
}

export function KeyValueEditor({ values, onChange, label = 'Custom Fields' }: Props) {
  const add = () =>
    onChange([...values, { id: nanoid(), key: '', value: '' }])

  const update = (id: string, field: 'key' | 'value', val: string) =>
    onChange(values.map((kv) => (kv.id === id ? { ...kv, [field]: val } : kv)))

  const remove = (id: string) =>
    onChange(values.filter((kv) => kv.id !== id))

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="form-label">{label}</span>
        <button
          type="button"
          onClick={add}
          className="text-[11px] text-accent hover:text-accent-hover transition-colors"
        >
          + Add
        </button>
      </div>
      {values.length === 0 && (
        <p className="text-[11px] text-muted/50 italic">No fields added</p>
      )}
      <div className="space-y-2">
        {values.map((kv) => (
          <div key={kv.id} className="flex gap-1.5 items-center">
            <input
              className="form-input flex-1 text-xs"
              placeholder="key"
              value={kv.key}
              onChange={(e) => update(kv.id, 'key', e.target.value)}
            />
            <input
              className="form-input flex-1 text-xs"
              placeholder="value"
              value={kv.value}
              onChange={(e) => update(kv.id, 'value', e.target.value)}
            />
            <button
              type="button"
              onClick={() => remove(kv.id)}
              className="text-muted hover:text-error transition-colors text-xs shrink-0 px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
