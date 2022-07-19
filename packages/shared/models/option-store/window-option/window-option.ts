import { Instance, SnapshotOut, types } from 'mobx-state-tree'

export interface Resolution {
  width: number
  height: number
}

/**
 * Model description here for TypeScript hints.
 */
export const WindowOptionModel = types
  .model('WindowOption')
  .props({
    fullScreen: types.optional(types.boolean, false),
    resolution: types.optional(types.frozen<Resolution>(), {
      width: 1280,
      height: 720
    }),
    soundOnFocus: types.optional(types.boolean, true),
    audioMuted: types.optional(types.boolean, false)
  })
  .views((self) => ({
    get humanizeResolution() {
      return `${self.resolution.width}x${self.resolution.height}`
    }
  }))
  .actions((self) => ({
    setFullScreen(value: boolean) {
      self.fullScreen = value
    },
    setResolution(resolution: Resolution) {
      self.resolution = resolution
    },
    setSoundOnFocus(value: boolean) {
      self.soundOnFocus = value
    },
    setAudioMutedd(value: boolean) {
      self.audioMuted = value
    },
    setResolutionFromString(value: string) {
      const [width, height] = value.split('x').map(parseFloat)
      self.resolution = {
        width,
        height
      }
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type WindowOptionType = Instance<typeof WindowOptionModel>

export interface WindowOption extends WindowOptionType {}

type WindowOptionSnapshotType = SnapshotOut<typeof WindowOptionModel>

export interface WindowOptionSnapshot extends WindowOptionSnapshotType {}
