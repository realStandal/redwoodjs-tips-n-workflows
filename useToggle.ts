import { useCallback, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

// --

type ToggleInitial = boolean | (() => boolean)

type ToggleTuple = [boolean, () => void, Dispatch<SetStateAction<boolean>>]

// --

/**
 * Returns a tuple containing:
 * * A boolean state.
 * * A function to toggle that state.
 * * A function to set the state manually.
 *
 * @param i The value state will be set to on first render.
 *
 * @example
 * import { useToggle } from '@locktech/atomic'
 *
 * export const MyComponent = () => {
 *   const [open, toggleOpen, setOpen] = useToggle(false)
 *
 *   return ...
 * }
 */
const useToggle = (i: ToggleInitial = false): ToggleTuple => {
  const [state, setState] = useState(i)
  const toggle = useCallback(() => setState(!state), [setState, state])
  return [state, toggle, setState]
}

// --

export default useToggle
