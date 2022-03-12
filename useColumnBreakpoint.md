
## `useColumnBreakpoint`

A hook for [`react-table`](https://react-table.tanstack.com/) which controls the visibility of a column based on the device's width.

By default, when the device's width is less-than `width`, the column with `id` will be hidden.
This behavior can be swapped, where the column will be hidden when the device's width is greater-than `width`.

```typescript
// web/src/hooks/useColumnBreakpoint.ts

import { useEffect } from 'react'
import type { TableInstance } from 'react-table'

// --

type Behavior = 'hide' | 'show'

// --

const BehaviorToVariant = { hide: 'min', show: 'max' }

// --

/**
 * A React hook for the [`react-table`](https://react-table.tanstack.com/) library which controls the visibility of a column based on the device's width.
 *
 * By default, when the device's width is less-than `width`, the column with `id` will be hidden.
 * This behavior can be swapped, where the column will be hidden when the device's width is greater-than `width`.
 *
 * @param table The `instance` returned by the `useTable` hook
 * @param id The `accessor` used to unique identify the column to hide
 * @param width The device width which should show or hide the column, depending on the configured `behavior`
 * @param behavior Whether being _smaller than_ `width` should cause the column to `hide` or `show`.
 *
 * @example
 * useColumnBreakpoint(table, 'createdAt', '700px')
 */
const useColumnBreakpoint = (
  table: TableInstance,
  id: string,
  width: string,
  behavior: Behavior = 'hide'
) => {
  useEffect(() => {
    const match = () =>
      window.matchMedia(`(${BehaviorToVariant[behavior]}-width: ${width})`)
        .matches

    const onResize = () => {
      const visible = table.visibleColumns.some((c) => c.id === id)
      visible !== match() && table.toggleHideColumn(id)
    }

    table.toggleHideColumn(id, !match())

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [behavior, id, table, width])
}

// --

export default useColumnBreakpoint
```
