import type { DocumentNode } from 'graphql/language/ast'
import { useCallback } from 'react'
import { useMutation } from '@apollo/client'
import type {
  FetchResult,
  MutationHookOptions,
  MutationResult,
} from '@apollo/client'
import { toast } from '@redwoodjs/web/toast'
import type { Renderable, ValueOrFunction } from '@redwoodjs/web/toast'

// --

export type ToastMessages<D = object> = {
  error: ValueOrFunction<Renderable, Error>
  loading: Renderable
  success: ValueOrFunction<Renderable, { data: D }>
}

// --

const DefaultMessages: ToastMessages<unknown> = {
  error: (e: Error) => e.message || 'Something went wrong',
  loading: 'Loading your request.',
  success: 'Request completed successfully.',
}

// --

/**
 * Combines the [react-hot-toast](https://react-hot-toast.com/docs/toast#promise) and [Apollo](https://www.apollographql.com/docs/react/data/mutations#usemutation-api) libraries, providing a hook which will display an appropriate toast notification in response to the various stages of a mutation.
 *
 * @param mutation The GraphQL `mutation` which will be performed.
 * @param opts Options to configure the mutation.
 *
 * @example
 * import useToastMutation from 'src/hooks/useToastMutation'
 *
 * const MUTATION = gql`
 *  ...
 * `
 *
 * const SomePage = () => {
 *  //
 *  const [mutate] = useToastMutation(MUTATION, { refetchQueries: [...] })
 *
 *  // --
 *
 *  return (
 *    <button
 *      onClick={() =>
 *        mutate(
 *          { id: '42', input: { name: 'Ryan Lockard' } },
 *          {
 *            loading: 'Loading the mutation.',
 *            error: (error) => `Error: ${error.message}`,
 *            success: 'The mutation was a success!',
 *          }
 *        )
 *      }
 *    >
 *      Mutate!
 *    </button>
 *  )
 * }
 */
const useToastMutation = <Data = object, Variables = object>(
  mutation: DocumentNode,
  opts?: MutationHookOptions<Data, Variables>
): [
  (v: Variables, messages?: ToastMessages<Data>) => Promise<FetchResult<Data>>,
  MutationResult<Data>
] => {
  const [m, res] = useMutation<Data, Variables>(mutation, opts)

  const mutate = useCallback(
    (variables: Variables, messages: ToastMessages<Data> = DefaultMessages) =>
      toast.promise(m({ variables }), messages),
    [m]
  )

  return [mutate, res]
}

// --

export default useToastMutation
