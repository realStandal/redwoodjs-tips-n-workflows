import { useCallback } from 'react'
import { Form, Submit, TextField } from '@redwoodjs/forms'

const FormTest = ({ onSubmit }) => {
  const _onSubmit = useCallback(
    (data) => {
      if (typeof onSubmit === 'function') {
        onSubmit(data)
      }
    },
    [onSubmit]
  )

  return (
    <Form onSubmit={_onSubmit}>
      <TextField
        name="name"
        placeholder="Name"
        validation={{
          required: true,
        }}
      />
      <TextField
        name="nickname"
        placeholder="Nickname"
        validation={{
          required: false,
        }}
      />
      <Submit>Submit</Submit>
    </Form>
  )
}

export default FormTest
