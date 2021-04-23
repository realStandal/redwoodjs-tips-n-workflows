import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

interface OurFormSubmitData {
  name: string
  nickname?: string
}

interface OurFormProps {
  /**
   * Provide a default `name` value, which the user will then have the ability to edit.
   */
  name?: string
  /**
   * Provide a default `nickname` value, which the user will then have the ability to edit.
   */
  nickname?: string
  /**
   * Callback-handler for invalid-submition attempts.
   */
  onInvalid?: (err: React.BaseSyntheticEvent) => void
  /**
   * Callback-handler for valid-submition attempts.
   */
  onSubmit: (data: OurFormSubmitData) => void
}

/**
 * A simple form component for gathering a user's `name` and `nickname`.
 */
const OurForm: React.FC<OurFormProps> = ({
  name = '',
  nickname = '',
  onInvalid,
  onSubmit,
}) => {
  const { handleSubmit, register } = useForm<OurFormSubmitData>({
    mode: 'all', // Validation will trigger on the blur and change events. See https://react-hook-form.com/api/useform "mode"
    defaultValues: {
      name,
      nickname,
    },
  })

  const _onInvalid = useCallback(
    (err) => {
      if (onInvalid) {
        onInvalid(err)
      }
    },
    [onInvalid]
  )

  const _onSubmit = useCallback(
    (data) => {
      if (onSubmit) {
        onSubmit(data)
      }
    },
    [onSubmit]
  )

  return (
    <form onSubmit={handleSubmit(_onSubmit, _onInvalid)}>
      <input
        name="name"
        placeholder="Name" // Or a localization key: OurForm.name.placeholder
        ref={register({
          required: 'A Name is required for this form',
        })}
      />
      <input name="nickname" placeholder="Nickname" ref={register()} />
      <button>Submit</button>
    </form>
  )
}

export default OurForm
export type { OurFormProps, OurFormSubmitData }
