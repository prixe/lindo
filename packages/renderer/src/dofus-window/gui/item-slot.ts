import TypedEmitter from 'typed-emitter'

export type ItemSlotEvents = {
  doubletap: () => void
}
export interface ItemSlot extends TypedEmitter<ItemSlotEvents> {}
