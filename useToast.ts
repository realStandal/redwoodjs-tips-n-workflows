import { useEffect } from 'react'
import type {
  Renderable,
  Toast,
  ToastOptions,
  ToastType,
  ValueOrFunction,
} from 'react-hot-toast'
import { toast } from '@redwoodjs/web/toast'

// --

type Message = ValueOrFunction<Renderable, Toast>

// --

/**
 * Displays a [toast notification](https://redwoodjs.com/docs/toast-notifications) when the component this hook is used in is mounted to the application. Whenever any of the arguments are updated, a new message will be displayed.
 *
 * @param type The type of toast notification to display.
 * @param message A `string`, or a function which returns a `string`, used as the toast's message.
 * @param opts The toast notification's options.
 */
export const useToast = (
  type: ToastType,
  message: Message,
  opts?: ToastOptions
) => {
  //
  useEffect(
    () => (type === 'custom' ? toast : toast[type as string])(message, opts),
    [message, opts, type]
  )
}

// --

/**
 * Displays a [toast notification](https://redwoodjs.com/docs/toast-notifications) when the component this hook is used in is mounted to the application. This hook **does not** re-trigger a toast notification when its arguments are updated.
 *
 * @param type The type of toast notification to display.
 * @param message A `string`, or a function which returns a `string`, used as the toast's message.
 * @param opts The toast notification's options.
 */
export const useMountedToast = (
  type: ToastType,
  message: Message,
  opts?: ToastOptions
) => {
  //
  useEffect(
    () => (type === 'custom' ? toast : toast[type as string])(message, opts),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
}
