// PATH: apps/client/src/composables/EventManager.ts

export interface eventobject {
  call: Function;
  target: any;
}

// This will be shared across all uses of the composable, effectively making it a global event bus.
const baseEventList: { [key: string]: eventobject[] } = {};

export function useEventManager() {
  /**
   * Adds an event listener.
   * @param eventName The name of the event.
   * @param callback The callback function to execute.
   * @param target The context (usually the calling instance, for correct `this` in callback and for removing listeners).
   */
  const on = (eventName: string, callback: Function, target: any) => {
    if (!baseEventList[eventName]) {
      baseEventList[eventName] = [];
    }
    // Avoid adding duplicate listeners for the same target and callback
    if (
      baseEventList[eventName].findIndex(
        (element) => element.target === target && element.call === callback
      ) === -1
    ) {
      const eventObj: eventobject = {
        call: callback,
        target: target,
      };
      baseEventList[eventName].push(eventObj);
    } else {
      console.warn(
        `EventManager: Listener for event "${eventName}" and target already exists.`
      );
    }
  };

  /**
   * Emits an event, calling all registered listeners.
   * @param eventName The name of the event to emit.
   * @param args Arguments to pass to the callback functions.
   */
  const emit = (eventName: string, ...args: any[]) => {
    if (baseEventList[eventName]) {
      // Create a copy of the listeners array to prevent issues if a listener modifies the original array (e.g., by calling off)
      const listeners = [...baseEventList[eventName]];
      listeners.forEach((element) => {
        try {
          element.call.apply(element.target, args);
        } catch (error) {
          console.error(
            `EventManager: Error in event listener for "${eventName}":`,
            error
          );
        }
      });
    }
  };

  /**
   * Removes event listeners for a specific event and target.
   * @param eventName The name of the event.
   * @param target The target whose listeners should be removed.
   */
  const off = (eventName: string, target: any) => {
    if (!baseEventList[eventName]) {
      // console.warn(`EventManager: Event "${eventName}" not found for off().`); // Optional: don't warn if event was never registered
      return;
    }
    const initialLength = baseEventList[eventName].length;
    baseEventList[eventName] = baseEventList[eventName].filter(
      (element) => element.target !== target
    );

    if (baseEventList[eventName].length === initialLength) {
      // console.warn(`EventManager: No listeners found for target on event "${eventName}" to remove.`);
    }

    // If the event list becomes empty, consider deleting the event key
    if (baseEventList[eventName].length === 0) {
      delete baseEventList[eventName];
    }
  };

  /**
   * Removes all event listeners.
   * @param remove Optional. If a string, removes all listeners for that event name.
   *               If an object, removes all listeners associated with that target.
   *               If undefined, removes all listeners for all events (use with caution).
   */
  const removeAllEvent = (remove?: string | any) => {
    if (remove == null) {
      // Clear all events
      // Since baseEventList is a const, we can't reassign it (e.g., baseEventList = {}).
      // We need to mutate it by deleting its keys.
      Object.keys(baseEventList).forEach((key) => delete baseEventList[key]);
    } else if (typeof remove === "string") {
      // Clear all listeners for a specific event name
      delete baseEventList[remove];
    } else if (typeof remove === "object") {
      // Clear all event listeners for a specific target object
      for (const eventName in baseEventList) {
        baseEventList[eventName] = baseEventList[eventName].filter(
          (element) => element.target !== remove
        );
        if (baseEventList[eventName].length === 0) {
          delete baseEventList[eventName];
        }
      }
    }
  };

  return {
    on,
    emit,
    off,
    removeAllEvent,
  };
}

