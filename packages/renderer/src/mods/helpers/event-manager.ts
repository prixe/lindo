import TypedEmitter, { EventMap } from 'typed-emitter'

interface StoredEvent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emitter: TypedEmitter<any>
  event: string | number | symbol
  listener: (...args: unknown[]) => void
}

export class EventManager {
  private _events: Array<StoredEvent> = []

  on<Events extends EventMap, E extends keyof Events>(emitter: TypedEmitter<Events>, event: E, listener: Events[E]) {
    emitter.on(event, listener)
    this._events.push({ emitter, event, listener })
  }

  once<Events extends EventMap, E extends keyof Events>(emitter: TypedEmitter<Events>, event: E, listener: Events[E]) {
    const extendedListener = ((...args: unknown[]) => {
      // removed events from the list after the first call
      this._events = this._events.filter(
        ({ event: event2, listener: listener2 }) => !(event === event2 && listener === listener2)
      )
      listener(...args)
    }) as Events[E]
    emitter.once(event, extendedListener)
    this._events.push({ emitter, event, listener: extendedListener })
  }

  removeListener<Events extends EventMap, E extends keyof Events>(
    emitter: TypedEmitter<Events>,
    event: E,
    listener: Events[E]
  ) {
    emitter.removeListener(event, listener)
    this._events = this._events.filter(
      ({ event: event2, listener: listener2 }) => !(event === event2 && listener === listener2)
    )
  }

  /**
   * Remove all listener
   */
  close() {
    for (const event of this._events) {
      this.removeListener(event.emitter, event.event, event.listener)
    }
    this._events = []
  }
}
