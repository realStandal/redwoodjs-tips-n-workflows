# Testing Forms

This workflow will cover the basics of testing your Redwood-powered form-components. I'm going to assume you're building your own form, using [`react-hook-form`](https://github.com/react-hook-form/react-hook-form) (this is the library used by [Redwood's form components](https://redwoodjs.com/docs/form)).

> While this step-by-step builds the form by-hand (my personal preference), Redwood's components **should** work with no modification to the tests.

We'll be making use of the [`@testing-library/user-event`](https://github.com/testing-library/user-event) package:

> `user-event` tries to simulate the real events that would happen in the browser as the user interacts with it. For example `userEvent.click(checkbox)` would change the state of the checkbox.

## Installing `@testing-library/user-event`

It can be installed by `cd`-ing into the `web` directory and running `yarn add -D @testing-library/user-event`

> `@testing-library/dom`, its dependency, is provided by Redwood

## Form Component

We'll need a component to actually perform our tests against. This component will contain the *entire* form: providing an API for consuming `onSubmit` and `onInvalid` callbacks and for providing `defaultValues` for our form's fields. We'll be writing it in TypeScript.

We'll need two dependencies for our component. It's a [functional-component](https://reactjs.org/docs/components-and-props.html#function-and-class-components), so we'll need the [`useCallback` hook](https://reactjs.org/docs/hooks-reference.html#usecallback) for submition and invalid-submition handling. Then, of course, we'll need the [`useForm` hook](https://react-hook-form.com/api/useform) which acts as the entry-point for `react-hook-form`.

```TSX
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
```

Let's get our `interfaces` out of the way. We'll use two:

1) For providing `react-hook-form` a [`generic`](https://www.typescriptlang.org/docs/handbook/2/generics.html); used to type our results and errors.
2) To let consumers of our component know what `props` are expected; and offer a way to extend our component.

```TSX
interface OurFormSubmitData {
  name: string
  nickname?: string
}

interface OurFormProps {
  name?: string
  nickname?: string
  onInvalid?: (err: React.BaseSyntheticEvent) => void
  onSubmit: (data: OurFormSubmitData) => void
}
```

This implementation is identical to what you'd expect when building a Redwood form (or a `react-hook-form`, to be specific).

```TSX
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

  // Our callback-handlers have "internal" variants to allow mutation before passing values back up to the parent.
  // As shown, it can act as a way to ensure consumer's provide the (required) props, we expect.
  const _onInvalid = useCallback(
    (err) => {
      if (typeof onInvalid === 'function') {
        onInvalid(err)
      }
    },
    [onInvalid]
  )

  const _onSubmit = useCallback(
    (data) => {
      if (typeof onSubmit === 'function') {
        onSubmit(data)
      }
    },
    [onSubmit]
  )

  return (
    <form onSubmit={handleSubmit(_onSubmit, _onInvalid)}>
      <input
        name="name"
        placeholder="Name"
        ref={register({
          required: 'A Name is required for this form',
        })}
      />
      <input
        name="nickname"
        placeholder="Nickname"
        ref={register()}
      />
      <button>Submit</button>
    </form>
  )
}
```

Let's finish off our component by exporting all of our declarations, and the component itself as the file's `default`.

```TSX
export default OurForm
export type { OurFormProps, OurFormSubmitData }
```

## `OurForm`'s Test

Now, our tests:

The top of our test resembles what Redwood `generates` using its CLI. All that's changed is what we're importing from `@redwoodjs/testing`, an import to `@testing-library/user-event` for its `default`, and we provide our `required` props for our "renders successfully" test.

```TSX
import user from '@testing-library/user-event'
import { render, screen, waitFor } from '@redwoodjs/testing'

import OurForm from './OurForm'

describe('OurForm', () => {
  it('renders successfully', () => {
    const onSubmit = jest.fn()
    const onInvalid = jest.fn()

    expect(() =>
      render(<OurForm onInvalid={onInvalid} onSubmit={onSubmit} />)
    ).not.toThrow()
  })
```

Now we'll create three, painfully complex tests. They will cover:

1) Does our component **NOT** submit when `required` fields are empty?
2) Does our component submit when `required` fields are populated?
3) Does our component submit, passing our handler the expected data?

And some noteworthy takeaways are:

* We use `await` because `react-hook-form` will cause our component's state to change multiple times; otherwise, our `exepect`-ation will trigger prematurely.
* We use `waitFor` because `user.*` is a synchronous function, which would make our `await` useless.
  * `waitFor` also acts as our declaration of [`act`](https://reactjs.org/docs/test-utils.html#act), required when updating the state of a React component.

> Why don't we wrap `render()` in an `act()`, as [suggested by the React documentation](https://reactjs.org/docs/test-utils.html#act:~:text=To%20prepare%20a%20component%20for%20assertions%2C%20wrap%20the%20code%20rendering%20it)?
>
> Because the `render()` method already provides the call; *nudge nudge, wink wink*.

```TSX
  it('triggers invalid when required fields are empty', async () => {
    const onSubmit = jest.fn()
    const onInvalid = jest.fn()

    render(<OurForm onInvalid={onInvalid} onSubmit={onSubmit} />)

    const submitButton = screen.getByText('Submit')

    await waitFor(() => user.click(submitButton))

    expect(onInvalid.mock.calls.length).toBe(1)
    expect(onSubmit.mock.calls.length).toBe(0)
  })

  it('triggers submit when required fields are populated', async () => {
    const name = 'Malcolm McCormick'
    const nickname = ''

    const onSubmit = jest.fn()
    const onInvalid = jest.fn()

    render(<OurForm onInvalid={onInvalid} onSubmit={onSubmit} />)

    const nameField = screen.getByPlaceholderText('Name')
    const submitButton = screen.getByText('Submit')

    await waitFor(() => user.type(nameField, name))
    await waitFor(() => user.click(submitButton))

    expect(onInvalid).toHaveBeenCalledTimes(0)
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({ name, nickname })
  })

  it('triggers submit with full results', async () => {
    const name = 'Malcolm McCormick'
    const nickname = 'Mac Miller'

    const onSubmit = jest.fn()
    const onInvalid = jest.fn()

    render(<OurForm onInvalid={onInvalid} onSubmit={onSubmit} />)

    const nameField = screen.getByPlaceholderText('Name')
    const nicknameField = screen.getByPlaceholderText('Nickname')
    const submitButton = screen.getByText('Submit')

    await waitFor(() => user.type(nameField, name))
    await waitFor(() => user.type(nicknameField, nickname))
    await waitFor(() => user.click(submitButton))

    expect(onInvalid).toHaveBeenCalledTimes(0)
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({ name, nickname })
  })
}) // Closes `describe(...)`
```

## 🎉🎉🎉

That's all there is to it; the way in which you `get` the different elements can be improved, and obviously these test don't include *everything*; I didn't show how we'd test our `defaultValues` API, among many things.

### Bonus Points: A Form with a Story

"But, wait!", I hear you shout.

"[Storybook is included in Redwood testing.](https://redwoodjs.com/docs/testing#storybook) WHERE is my storybook?"

Ok, ok. Calm down. Let's do that:

We'll start with creating (or using a generated) `*.stories.tsx` file. `OurForm.stories.tsx` seems befitting.

First, we'll import some `types` from `@storybook/react`. Then our form component and its `props` interface.

```TSX
import type { Meta, Story } from '@storybook/react'

import OurForm from './OurForm'
import type { OurFormProps } from './OurForm'
```

We need to provide Storybook with some metadata about our stories. We do so by exporting a `default` object, which has the shape of the `Meta` type we just imported.

With it, we are doing the following:

* Giving our stories a `title`
* Declaring that our stories are for the `OurForm` component.
  * Storybook uses this field to extract metadata about the component, used, most notably, to power: documentation and a source-code preview.
* Define `argTypes` for our component; we need to explicitly define [actions](https://storybook.js.org/docs/react/essentials/actions#gatsby-focus-wrapper), which will let us view the data passed back by our components callback-handlers.

```TSX
export default {
  title: 'Components/OurForm',
  component: OurForm,
  argTypes: {
    onInvalid: {
      action: 'onInvalid',
    },
    onSubmit: {
      action: 'onSubmit',
    },
  },
} as Meta
```

Finally, we create a `Template` to act as our stories primary implementation. We then have a named-export, which will act as the story viewed by those making use of it.

```TSX
const Template: Story<OurFormProps> = (args) => <OurForm {...args} />

export const Default = Template.bind({})
```

### Bonus: Bonus: Documentation

With our Story setup, we can take full advantage of it by providing a JSDoc to our component and its `props`. These will be displayed on Storybook's "Docs" tab.

To do so, we'll edit our component (`OurForm.tsx`):

```TSX
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
const OurForm: React.FC<OurFormProps> = (...) => {...}
```