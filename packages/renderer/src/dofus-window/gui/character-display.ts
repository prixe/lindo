import { _EntityLook } from '../dofus'
import { GUICanvas } from './gui'

export type CharacterDisplayClass = new (props: { scale: 'fitin' }) => CharacterDisplay

export interface CharacterDisplay {
  new (props: { scale: 'fitin' }): CharacterDisplay
  canvas: GUICanvas
  canvasInitialized: boolean
  cts: CanvasRenderingContext2D
  entity?: _EntityLook
  horizontalAlign: 'none'
  only4Directions: boolean
  renderingRequired: boolean
  rootElement: HTMLDivElement
  scale: number
  setLook: (
    look: unknown,
    props: {
      riderOnly: boolean
      direction: number
      animation: string
      boneType: string
      skinType: string
    }
  ) => void
  clear: () => void
  resize: () => void
  rotateCharacter: (angle: number) => void
  setScale: (scale: number) => void
}
