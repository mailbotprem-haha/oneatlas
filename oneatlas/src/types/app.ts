export type ComponentField = {
  name: string
  type: "string" | "number" | "boolean" | "date" | "select"
  required?: boolean
}

export type AppComponent = {
  id: string
  name: string
  type: "table" | "form" | "chart" | "card" | "list"
  fields: ComponentField[]
  props?: Record<string, unknown>
  order: number
}

export type AppSchema = {
  components: AppComponent[]
  layout: "single" | "sidebar" | "tabs"
  title: string
}

export type GenerateResponse = {
  appId: string
  schema: AppSchema
  templateUsed: string
  generatedName: string
}

export type MutationType =
  | "add_field"
  | "remove_field"
  | "rename_field"
  | "update_component_prop"
  | "reorder_components"

export type MutationPayload = {
  type: MutationType
  componentId: string
  field?: ComponentField
  fieldName?: string
  newName?: string
  prop?: string
  value?: unknown
  order?: number[]
}