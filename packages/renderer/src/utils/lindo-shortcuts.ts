import { Shortcuts } from 'shortcuts'
import { Disposer, ShortcutDescriptor } from 'shortcuts/dist/types'

const shortcutFixes: Record<string, string> = {
  '§': '`',
  '²': "'"
}

export class LindoShortcuts extends Shortcuts {
  private _fixShortcut(shortcut: string): string {
    let fixedShortcut = shortcut
    Object.keys(shortcutFixes).forEach((key) => {
      fixedShortcut = fixedShortcut.replaceAll(key, shortcutFixes[key])
    })
    return fixedShortcut
  }

  private _fixDescriptors(
    descriptors: ShortcutDescriptor | ShortcutDescriptor[]
  ): ShortcutDescriptor | ShortcutDescriptor[] {
    let fixedDescriptors: ShortcutDescriptor | ShortcutDescriptor[]
    if (Array.isArray(descriptors)) {
      fixedDescriptors = descriptors.map((descriptor) => ({
        ...descriptor,
        shortcut: this._fixShortcut(descriptor.shortcut)
      }))
    } else {
      fixedDescriptors = {
        ...descriptors,
        shortcut: this._fixShortcut(descriptors.shortcut)
      }
    }
    return fixedDescriptors
  }

  add(descriptors: ShortcutDescriptor | ShortcutDescriptor[]): void {
    return super.add(this._fixDescriptors(descriptors))
  }

  remove(descriptors: ShortcutDescriptor | ShortcutDescriptor[]): void {
    return super.remove(this._fixDescriptors(descriptors))
  }

  register(descriptors: ShortcutDescriptor | ShortcutDescriptor[]): Disposer {
    return super.register(this._fixDescriptors(descriptors))
  }
}
