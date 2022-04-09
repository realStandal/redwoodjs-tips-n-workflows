import { useEffect, useRef } from 'react'
import type { EffectCallback } from 'react'

// --

/**
 * A wrapper around the {@link useEffect} hook which will only trigger the provided `cb` once, when the component is first mounted. Subsequent re-renders will not cause the callback to re-trigger.
 *
 * @param cb A function which will be triggered once, when the component is first mounted.
 */
const useMounted = (cb: EffectCallback) => {
  //
  const mounted = useRef(false)

  // --

  useEffect(() => {
    //
    if (mounted.current) return

    // --

    mounted.current = true

    cb()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

// --

export default useMounted
