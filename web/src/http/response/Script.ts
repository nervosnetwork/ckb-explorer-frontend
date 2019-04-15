export interface Script {
  binary_hash: string
  args: string[]
}

export interface ScriptWrapper {
  id: number
  type: string
  attributes: Script
}
