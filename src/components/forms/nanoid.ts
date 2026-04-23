let _counter = 0
export const nanoid = () => `kv_${Date.now()}_${_counter++}`
