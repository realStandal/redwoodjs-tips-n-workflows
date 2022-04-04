import { useCallback, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

// --

type StateToggleInitial<T> = T | (() => T)

type StateToggleTuple<T> = [T, Dispatch<SetStateAction<T>>]

// --

/**
 * Combines the {@link useCallback} and {@link useState} hooks, returning a tuple containing a stateful value and a setter which will trigger the passed `callback` whenever called.
 *
 * @param callback A `Function` which is triggered whenever the returned setter is triggered.
 * @param initial The initial value the stateful value should be set to.
 */
const useStateCallback = <T = unknown>(
  callback: (val: T) => void,
  initial?: StateToggleInitial<T>
): StateToggleTuple<T> => {
  //
  const [state, _setState] = useState<T>(initial)

  // --

  const setState = useCallback(
    (val: T) => {
      callback(val)
      _setState(val)
    },
    [callback, _setState]
  )

  // --

  return [state, setState]
}

// --

export default useStateCallback
