export interface StatedElement {
  elementId: number
  elementState: number
  elementCellId: number
}

export interface InteractiveElementSkill {
  skillId: number
  skillInstanceUid: number
  _cursor?: number
  _name?: string
  _parentJobId?: string
  _parentJobName?: string
}

export interface InteractiveElement {
  elementId: number
  elementTypeId: number
  enabledSkills: InteractiveElementSkill[]
  _name: string
  _type?: string
}
