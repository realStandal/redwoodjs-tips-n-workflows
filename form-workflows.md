# Form Workflows

[RedwoodJS provides](https://redwoodjs.com/docs/forms.html#overview) a number of ready-to-use React-components for building forms.

This document highlights a few re-usable implementations of these components, adding to Redwood's existing layers of opinionations.

## `mode: 'all'` Form component

One default to override is the [`<Form>`](https://redwoodjs.com/docs/forms.html#form) components default configuration for [react-hook-forms "mode" setting](https://react-hook-form.com/ts#ModeRef).

Let's start overriding by generating a new component:

```bash
yarn rw g component Form
```

Then we'll replace the generated component's implementation:

```TSX
import { Form } from '@redwoodjs/forms'

Form.defaultProps = {
  className: 'form',
  config: { mode: 'all' },
}

export default Form
```

We're taking advantage of [React's `defaultProps`](https://reactjs.org/docs/typechecking-with-proptypes.html#default-prop-values) property above to keep our implementation clean and upstream-change resilient.

I'm also providing the class I use to style my forms, this is entirely a personal choice - do or don't depending on your needs.

## "Smart" Submit Button

> This workflow works in conjunction with the "mode: all Form component".

Forms, and their fields, typically have some form of validation - used to ensure what is inputted by a user is what the application expects.
I like to entirely disable submitting my form until such validation is met.

Let's start by generating a new component:

```bash
yarn rw g component Submit
```

And now we can replace the generated implementation with our own.

```TSX
import type { ComponentPropsWithoutRef as ComponentProps } from 'react'
import { useFormState } from '@redwoodjs/forms'
import { Submit } from '@redwoodjs/forms'

interface SubmitButtonProps extends ComponentProps<typeof Submit> {}

export default ({ className, disabled, ...props }: SubmitButtonProps) => {
  const { isSubmitting, isValid } = useFormState()

  return (
    <Submit
      className={className || 'btn btn-primary'}
      disabled={isSubmitting || !isValid || disabled}
      {...props}
    />
  )
}
```

All we're doing is reaching into the context of our wrapping form (`useFormState`), and then toggling the `disabled` state of our Submit button based on that context's current values.

As with the form example above, I'm taking the opportunity to specify my button's styling classes.

## Password Gussability Strength

See the [respective document](./PasswordStrengthField) for instructions and details.
