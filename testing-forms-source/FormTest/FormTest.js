import { Form, Submit, TextField } from '@redwoodjs/forms'

const FormTest = ({ onSubmit }) => {
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
