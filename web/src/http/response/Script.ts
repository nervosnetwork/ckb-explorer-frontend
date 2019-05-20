export interface Script {
  code_hash: string
  args: string[]
}

export interface ScriptWrapper {
  id: number
  type: string
  attributes: Script
}
